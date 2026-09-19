import { getTodayDate } from '../utils/date';

export type AuditCategory = 'all' | 'tasks' | 'users' | 'media';
export type MediaFilter = 'all' | 'active' | 'expiring';

export type AuditEventsParams = {
  category: AuditCategory;
  startDate?: string;
  endDate?: string;
};

export type AuditEventDetailRow = { label: string; value: string };

export type AuditEvent = {
  id: string;
  title: string;
  meta: string;
  label: string;
  tone: 'done' | 'warning' | 'danger' | 'neutral';
  category: Exclude<AuditCategory, 'all'>;
  target: 'event' | 'expiredEvidence';
  occurredOn: string;
  occurredAt: string;
  subject: string;
  details?: AuditEventDetailRow[];
  media?: { name: string; meta: string };
};

export type AuditMedia = {
  id: string;
  name: string;
  meta: string;
  expiryLabel: string;
  daysUntilExpiry: number;
};

export type AuditCorrectionReceipt = {
  original: { title: string; authorLabel: string; statusLabel: string; reason: string };
  correction: { title: string; authorLabel: string; newReason: string; correctionReason: string; evidenceName?: string };
};

export type CorrectExecutionInput = {
  taskTitle?: string;
  newReason: string;
  correctionReason: string;
  evidenceName?: string;
};

let eventSequence = 7;
let mediaSequence = 4;
let mockAuditEvents: AuditEvent[] = [
  { id: 'audit-1', title: 'Tarefa concluída', meta: '10:18 · André · Higienizar bancada', label: 'Feita', tone: 'done', category: 'tasks', target: 'event', occurredOn: '2026-08-31', occurredAt: '2026-08-31T10:18:00-03:00', subject: 'Higienizar bancada da cozinha', details: [{ label: 'Evento', value: 'Conclusão da ocorrência' }, { label: 'Executor', value: 'André Câmara' }, { label: 'Data e hora', value: '31/08/2026 · 10:18:42' }, { label: 'Status final', value: 'Feita' }, { label: 'Comentário', value: 'Bancada finalizada e produtos guardados.' }], media: { name: 'bancada.jpg', meta: 'Foto · 2,4 MB' } },
  { id: 'audit-2', subject: 'Conferir validade dos molhos', title: 'Responsável alterado', meta: '11:42 · Rafael assumiu de Marina', label: 'Reatribuição', tone: 'neutral', category: 'users', target: 'event', occurredOn: '2026-09-01', occurredAt: '2026-09-01T11:42:00-03:00' },
  { id: 'audit-3', subject: 'Organizar estoque seco', title: 'Correção registrada pelo dono', meta: '12:08 · André · motivo atualizado', label: 'Correção', tone: 'neutral', category: 'tasks', target: 'event', occurredOn: '2026-08-31', occurredAt: '2026-08-31T12:08:00-03:00' },
  { id: 'audit-4', title: 'Foto expirada', meta: '14:30 · Carla · fechamento-caixa.jpg', label: 'Mídia', tone: 'neutral', category: 'media', target: 'expiredEvidence', occurredOn: '2026-08-31', occurredAt: '2026-08-31T14:30:00-03:00', subject: 'Fotografar fechamento do caixa', details: [{ label: 'Executor', value: 'Carla Mendes' }, { label: 'Data da execução', value: '31/08/2026 · 14:30' }, { label: 'Evidência', value: 'fechamento-caixa.jpg · expirada após 60 dias' }] },
  { id: 'audit-5', subject: 'João Vieira', title: 'Usuário desativado', meta: '16:15 · Carla · usuário João', label: 'Usuário', tone: 'neutral', category: 'users', target: 'event', occurredOn: '2026-09-01', occurredAt: '2026-09-01T16:15:00-03:00' },
  { id: 'audit-6', subject: 'Higienizar bancada da cozinha', title: 'Foto substituída em correção', meta: '17:22 · Marina · bancada.jpg', label: 'Mídia', tone: 'neutral', category: 'media', target: 'event', occurredOn: '2026-09-01', occurredAt: '2026-09-01T17:22:00-03:00' },
];

let mockMedia: AuditMedia[] = [
  { id: 'media-1', name: 'bancada.jpg', meta: 'André · 31 ago · 10:18', expiryLabel: 'Expira em 59 dias', daysUntilExpiry: 59 },
  { id: 'media-2', name: 'fechamento.jpg', meta: 'Marina · 30 ago · 23:42', expiryLabel: 'Expira em 58 dias', daysUntilExpiry: 58 },
  { id: 'media-3', name: 'estoque.jpg', meta: 'Rafael · 5 jul · 14:12', expiryLabel: 'Expira em 5 dias', daysUntilExpiry: 5 },
];

let mockLatestCorrection: AuditCorrectionReceipt = {
  original: { title: 'Registro original · 31 ago, 14:05', authorLabel: 'Rafael Lima', statusLabel: 'Não feita', reason: 'Equipamento quebrado' },
  correction: { title: 'Correção · 31 ago, 14:20', authorLabel: 'Marina Souza · Gerente', newReason: 'Equipamento em manutenção preventiva', correctionReason: 'Confirmação com a equipe.' },
};

export async function getAuditEvents(params: AuditEventsParams): Promise<AuditEvent[]> {
  const events = mockAuditEvents.filter((event) => {
    const matchesCategory = params.category === 'all' || event.category === params.category;
    const matchesStartDate = !params.startDate || event.occurredOn >= params.startDate;
    const matchesEndDate = !params.endDate || event.occurredOn <= params.endDate;
    return matchesCategory && matchesStartDate && matchesEndDate;
  });
  return Promise.resolve(events.sort((a, b) => Date.parse(b.occurredAt) - Date.parse(a.occurredAt) || Number(b.id.split('-').at(-1)) - Number(a.id.split('-').at(-1))).map((event) => ({ ...event })));
}


export async function getAuditEvent(eventId: string): Promise<AuditEvent | undefined> {
  const event = mockAuditEvents.find((item) => item.id === eventId);
  return Promise.resolve(event ? { ...event, details: event.details?.map((row) => ({ ...row })), media: event.media ? { ...event.media } : undefined } : undefined);
}

export async function getAuditMedia(filter: MediaFilter): Promise<AuditMedia[]> {
  const media = mockMedia.filter((item) => {
    if (filter === 'active') return item.daysUntilExpiry > 7;
    if (filter === 'expiring') return item.daysUntilExpiry <= 7;
    return true;
  });
  return Promise.resolve(media.map((item) => ({ ...item })));
}

export async function getLatestAuditCorrection(): Promise<AuditCorrectionReceipt> {
  return Promise.resolve({ original: { ...mockLatestCorrection.original }, correction: { ...mockLatestCorrection.correction } });
}

export async function correctExecution(input: CorrectExecutionInput): Promise<AuditEvent> {
  const event: AuditEvent = {
    id: `audit-${eventSequence++}`,
    title: 'Correção registrada pela gestão',
    meta: `agora · Motivo: ${input.newReason.trim()} · ${input.correctionReason.trim()}`,
    label: 'Correção',
    tone: 'neutral',
    category: 'tasks',
    target: 'event',
    occurredOn: getTodayDate(),
    occurredAt: new Date().toISOString(),
    subject: input.taskTitle ?? 'Organizar estoque seco',
  };
  mockAuditEvents = [event, ...mockAuditEvents];
  mockLatestCorrection = {
    original: { ...mockLatestCorrection.original },
    correction: { title: 'Correção · agora', authorLabel: 'Gestão', newReason: input.newReason.trim(), correctionReason: input.correctionReason.trim(), evidenceName: input.evidenceName },
  };
  if (input.evidenceName) {
    const media: AuditMedia = { id: `media-${mediaSequence++}`, name: input.evidenceName, meta: 'Gestão · agora · correção', expiryLabel: 'Expira em 60 dias', daysUntilExpiry: 60 };
    mockMedia = [media, ...mockMedia];
    mockAuditEvents = [{ id: `audit-${eventSequence++}`, title: 'Foto substituída em correção', meta: `agora · ${input.evidenceName}`, label: 'Mídia', tone: 'neutral', category: 'media', target: 'event', occurredOn: getTodayDate(), occurredAt: new Date().toISOString(), subject: event.subject }, ...mockAuditEvents];
  }
  return Promise.resolve({ ...event });
}

export async function replaceEvidence(evidenceName: string, correctionReason: string, eventId = 'audit-1'): Promise<AuditMedia> {
  const event = mockAuditEvents.find(item => item.id === eventId);
  if (!event) throw new Error('AUDIT_EVENT_NOT_FOUND');
  const media: AuditMedia = { id: `media-${mediaSequence++}`, name: evidenceName, meta: 'Gestão · agora · correção', expiryLabel: 'Expira em 60 dias', daysUntilExpiry: 60 };
  mockMedia = [media, ...mockMedia];
  mockAuditEvents = [{ id: `audit-${eventSequence++}`, title: 'Foto substituída em correção', meta: `agora · ${evidenceName} · ${correctionReason.trim()}`, label: 'Mídia', tone: 'neutral', category: 'media', target: 'event', occurredOn: getTodayDate(), occurredAt: new Date().toISOString(), subject: event.subject }, ...mockAuditEvents];
  mockLatestCorrection = {
    original: { ...mockLatestCorrection.original },
    correction: { title: 'Correção de evidência · agora', authorLabel: 'Gestão', newReason: 'Evidência substituída', correctionReason: correctionReason.trim(), evidenceName },
  };
  return Promise.resolve({ ...media });
}
