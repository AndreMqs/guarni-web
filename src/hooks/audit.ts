import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { correctExecution, getAuditEvent, getAuditEvents, getAuditMedia, getLatestAuditCorrection, replaceEvidence } from '../api/audit';
import type { AuditEventsParams, CorrectExecutionInput, MediaFilter } from '../api/audit';

export const auditQueryKeys = {
  all: ['audit'] as const,
  events: (params: AuditEventsParams) => [...auditQueryKeys.all, 'events', params] as const,
  media: (filter: MediaFilter) => [...auditQueryKeys.all, 'media', filter] as const,
  event: (eventId: string) => [...auditQueryKeys.all, 'event', eventId] as const,
  latestCorrection: () => [...auditQueryKeys.all, 'latest-correction'] as const,
};

export function useAuditEventsQuery(params: AuditEventsParams) {
  return useQuery({ queryKey: auditQueryKeys.events(params), queryFn: () => getAuditEvents(params) });
}

export function useAuditEventQuery(eventId: string) {
  return useQuery({ queryKey: auditQueryKeys.event(eventId), queryFn: () => getAuditEvent(eventId), enabled: Boolean(eventId) });
}

export function useAuditMediaQuery(filter: MediaFilter) {
  return useQuery({ queryKey: auditQueryKeys.media(filter), queryFn: () => getAuditMedia(filter) });
}

export function useLatestAuditCorrectionQuery() {
  return useQuery({ queryKey: auditQueryKeys.latestCorrection(), queryFn: getLatestAuditCorrection });
}

export function useCorrectExecutionMutation() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: (input: CorrectExecutionInput) => correctExecution(input), onSuccess: () => queryClient.invalidateQueries({ queryKey: auditQueryKeys.all }) });
}

export function useReplaceEvidenceMutation() {
  const queryClient = useQueryClient();
  return useMutation({ mutationFn: ({ evidenceName, correctionReason, eventId }: { evidenceName: string; correctionReason: string; eventId?: string }) => replaceEvidence(evidenceName, correctionReason, eventId), onSuccess: () => queryClient.invalidateQueries({ queryKey: auditQueryKeys.all }) });
}
