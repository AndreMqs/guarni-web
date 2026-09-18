import { useState } from 'react';
import type { AuditCategory, MediaFilter } from '../../api';
import {
  Avatar,
  BottomSheet,
  Button,
  Card,
  DetailRows,
  EmptyState,
  FormField,
  Frame,
  Group,
  MediaPlaceholder,
  MenuCard,
  Notice,
  Select,
  Stack,
  StatusBadge,
  Tabs,
  Text,
  TextArea,
  TextButton,
  TextInput,
  Title,
  UploadArea,
} from '../../components';
import { useAuditEventQuery, useAuditEventsQuery, useAuditMediaQuery, useCorrectExecutionMutation, useCurrentUserContextQuery, useHistoryTaskQuery, useLatestAuditCorrectionQuery, useReplaceEvidenceMutation } from '../../hooks';
import { routes, type AppRoute, type Navigate } from '../../navigation';
import { useAuditStore, useManagementStore } from '../../stores';

const auditCategoryByTab: Record<string, AuditCategory> = {
  Todos: 'all',
  Tarefas: 'tasks',
  Usuários: 'users',
  Mídias: 'media',
};

const auditTabByCategory: Record<AuditCategory, string> = {
  all: 'Todos',
  tasks: 'Tarefas',
  users: 'Usuários',
  media: 'Mídias',
};


function formatAuditDateRange(startDate: string, endDate: string) {
  const labels: Record<string, string> = {
    '2026-08-31': '31 ago',
    '2026-09-01': '1 set 2026',
  };
  return `${labels[startDate] ?? startDate} — ${labels[endDate] ?? endDate}`;
}

function exportAuditEvents(events: Array<{ title: string; meta: string; label: string; category: string }>) {
  const escapeCsv = (value: string) => `"${value.replaceAll('"', '""')}"`;
  const rows = [
    ['Evento', 'Detalhes', 'Status', 'Categoria'],
    ...events.map((event) => [event.title, event.meta, event.label, event.category]),
  ];
  const csv = rows.map((row) => row.map(escapeCsv).join(',')).join('\n');
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }));
  const link = document.createElement('a');
  link.href = url;
  link.download = 'auditoria-guarni.csv';
  link.click();
  URL.revokeObjectURL(url);
}


function OwnerMenuView({ navigate, onLogout }: { navigate: Navigate; onLogout: () => void }) {
  const { data: user } = useCurrentUserContextQuery();
  return (
    <Frame title="Mais" navigate={navigate} bottomNav="more" navMode="owner">
      <Stack gap="lg">
        <MenuCard icon="✓" title="Executar tarefas" subtitle="Assumir e concluir tarefas da unidade" onClick={() => navigate(routes.tasks.today)} />
        <Card>
          <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap"><Avatar initials={user?.initials ?? '--'} /><Stack gap={0}><Text weight={700}>{user?.name ?? 'Carregando…'}</Text><Text size="xs" tone="muted">{user ? `${user.roleLabel} · ${user.unitName}` : ''}</Text></Stack></Group>
            <Text>⌄</Text>
          </Group>
        </Card>
        <Stack><Text size="xs" tone="muted" weight={700}>GESTÃO</Text><MenuCard icon="✓" title="Atividades" subtitle="Criar e editar tarefas" onClick={() => navigate(routes.management.taskCatalog)} /><MenuCard icon="●" title="Usuários" subtitle="Gerenciar papéis e acessos" onClick={() => navigate(routes.management.users)} /><MenuCard icon="⚙" title="Configurações" subtitle="Regras da unidade" onClick={() => navigate(routes.management.unitSettings)} /></Stack>
        <Stack><Text size="xs" tone="muted" weight={700}>HISTÓRICO IMUTÁVEL</Text><MenuCard icon="◎" title="Auditoria de negócio" subtitle="Consultar eventos e correções" onClick={() => navigate(routes.audit.events)} /><MenuCard icon="▧" title="Mídias e retenção" subtitle="Evidências e remoções auditadas" onClick={() => navigate(routes.audit.mediaRetention)} /></Stack>
        <Stack><Text size="xs" tone="muted" weight={700}>CONTA</Text><MenuCard icon="↪" title="Sair" subtitle="Encerrar esta sessão" onClick={onLogout} /></Stack>
      </Stack>
    </Frame>
  );
}

function AuditEventsView({ navigate }: { navigate: Navigate }) {
  const [category, setCategory] = useState<AuditCategory>('all');
  const [dateRange, setDateRange] = useState({ startDate: '2026-08-31', endDate: '2026-09-01' });
  const [draftDateRange, setDraftDateRange] = useState(dateRange);
  const [isDateFilterOpen, setIsDateFilterOpen] = useState(false);
  const setSelectedEventId = useAuditStore((state) => state.setSelectedEventId);
  const { data: events = [], isLoading } = useAuditEventsQuery({ category, ...dateRange });

  const openDateFilter = () => {
    setDraftDateRange(dateRange);
    setIsDateFilterOpen(true);
  };

  return (
    <Frame title="Auditoria" action="EXPORTAR" onAction={() => exportAuditEvents(events)} backTo={routes.owner.menu} navigate={navigate}>
      <Stack gap="lg">
        <Card onClick={openDateFilter}><Group justify="space-between"><Text>{formatAuditDateRange(dateRange.startDate, dateRange.endDate)}</Text><Text>▦</Text></Group></Card>
        <Tabs items={['Todos', 'Tarefas', 'Usuários', 'Mídias']} active={auditTabByCategory[category]} onChange={(tab) => setCategory(auditCategoryByTab[tab] ?? 'all')} />
        <Text size="xs" tone="muted">{isLoading ? 'Carregando eventos…' : `${events.length} eventos neste filtro`}</Text>
        <Stack>
          {!isLoading && events.length === 0 ? <EmptyState title="Nenhum evento encontrado" description="Selecione outra categoria para consultar o histórico." /> : events.map((event) => (
            <Card key={event.id} onClick={() => { setSelectedEventId(event.id); navigate(event.target === 'expiredEvidence' ? routes.audit.expiredEvidence : routes.audit.eventDetails); }}>
              <Group wrap="nowrap"><Text size="xl" tone="primary">•</Text><Stack gap={4} style={{ flex: 1 }}><Text weight={700}>{event.title}</Text><Text size="xs" tone="muted">{event.meta}</Text><StatusBadge tone={event.tone}>{event.label}</StatusBadge></Stack><Text>›</Text></Group>
            </Card>
          ))}
        </Stack>
        <Text size="xs" tone="muted">O histórico não pode ser editado ou excluído, nem pelo dono.</Text>
      </Stack>
      <BottomSheet opened={isDateFilterOpen} onClose={() => setIsDateFilterOpen(false)}>
        <Stack gap="lg">
          <Title order={2}>Filtrar período</Title>
          <FormField label="Data inicial"><TextInput type="date" value={draftDateRange.startDate} onChange={(startDate) => setDraftDateRange((current) => ({ ...current, startDate }))} /></FormField>
          <FormField label="Data final"><TextInput type="date" value={draftDateRange.endDate} onChange={(endDate) => setDraftDateRange((current) => ({ ...current, endDate }))} /></FormField>
          {draftDateRange.startDate > draftDateRange.endDate && <Notice tone="warning">A data inicial deve ser anterior ou igual à data final.</Notice>}
          <Button isFullWidth disabled={draftDateRange.startDate > draftDateRange.endDate} onClick={() => { setDateRange(draftDateRange); setIsDateFilterOpen(false); }}>APLICAR PERÍODO</Button>
          <Button variant="secondary" isFullWidth onClick={() => { const initialRange = { startDate: '2026-08-31', endDate: '2026-09-01' }; setDraftDateRange(initialRange); setDateRange(initialRange); setIsDateFilterOpen(false); }}>LIMPAR FILTRO</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

function AuditEventDetailsView({ navigate }: { navigate: Navigate }) {
  const eventId = useAuditStore((state) => state.selectedEventId);
  const { data: event } = useAuditEventQuery(eventId);
  const [isMediaOpen, setIsMediaOpen] = useState(false);
  const details = event?.details ?? [
    { label: 'Evento', value: event?.title ?? 'Evento de auditoria' },
    { label: 'Detalhes', value: event?.meta ?? 'Carregando…' },
  ];

  return (
    <Frame title="Evento de auditoria" action="⋯" backTo={routes.audit.events} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone={event?.tone ?? 'neutral'}>{event?.label ?? 'Evento'}</StatusBadge>
        <Title order={2}>{event?.subject ?? event?.title ?? 'Carregando evento…'}</Title>
        <DetailRows rows={details} />
        {event?.media && <Card><Group justify="space-between" wrap="nowrap"><Group wrap="nowrap"><MediaPlaceholder title={event.media.name} compact style={{ width: 54 }} /><Stack gap={2}><Text weight={700}>{event.media.name}</Text><Text size="xs" tone="muted">{event.media.meta}</Text></Stack></Group><TextButton onClick={() => setIsMediaOpen(true)}>ABRIR</TextButton></Group></Card>}
        <Text size="xs" tone="muted">ID do evento: {event?.id ?? eventId}</Text>
      </Stack>
      <BottomSheet opened={isMediaOpen} onClose={() => setIsMediaOpen(false)}>
        <Stack gap="lg"><Title order={2}>{event?.media?.name ?? 'Evidência'}</Title><MediaPlaceholder title={event?.media?.name ?? 'Evidência'} description={event?.media?.meta} /><Button isFullWidth onClick={() => setIsMediaOpen(false)}>FECHAR</Button></Stack>
      </BottomSheet>
    </Frame>
  );
}

function ExecutionCorrectionView({ navigate }: { navigate: Navigate }) {
  const historyTaskId = useManagementStore((state) => state.selectedHistoryTaskId);
  const { data: task } = useHistoryTaskQuery(historyTaskId);
  const [newReason, setNewReason] = useState('');
  const [correctionReason, setCorrectionReason] = useState('');
  const mutation = useCorrectExecutionMutation();

  const save = async () => {
    await mutation.mutateAsync({ newReason, correctionReason });
    navigate(routes.audit.correctionRegistered);
  };

  return (
    <Frame title="Corrigir execução" backTo={routes.management.previousDayTaskDetails} navigate={navigate}>
      <Stack gap="lg">
        <Notice tone="warning"><Stack gap={2}><Text weight={700}>Justificativa obrigatória</Text><Text size="sm">A correção cria um novo evento. O registro original permanece.</Text></Stack></Notice>
        <FormField label="Motivo original"><TextArea value={task?.reason ?? ''} readOnly /></FormField>
        <FormField label="Novo motivo *"><TextArea value={newReason} onChange={setNewReason} placeholder="Informe o motivo correto" /></FormField>
        <FormField label="Justificativa da correção *"><TextArea value={correctionReason} onChange={setCorrectionReason} placeholder="Explique por que o registro precisa ser ajustado" /></FormField>
        {mutation.isError && <Notice tone="danger">Não foi possível registrar a correção.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!newReason.trim() || !correctionReason.trim()} onClick={() => void save()}>SALVAR CORREÇÃO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.previousDayTaskDetails)}>CANCELAR</Button>
        <Text size="xs" tone="muted">Gestão: correções na própria unidade, inclusive após o fechamento.</Text>
      </Stack>
    </Frame>
  );
}

function CorrectionRegisteredView({ navigate }: { navigate: Navigate }) {
  const { data, isLoading } = useLatestAuditCorrectionQuery();
  return (
    <Frame title="Correção registrada" action="⋯" backTo={routes.audit.events} navigate={navigate}>
      <Stack gap="lg">
        <Notice tone="success"><Text weight={700}>Histórico preservado</Text></Notice>
        {isLoading ? <Text tone="muted">Carregando correção…</Text> : data && (
          <>
            <Stack><Title order={2}>{data.original.title}</Title><Text>{data.original.authorLabel} · {data.original.statusLabel}</Text><Text>Motivo: {data.original.reason}</Text></Stack>
            <Stack><Title order={2}>{data.correction.title}</Title><Text>{data.correction.authorLabel}</Text><Text>Novo motivo: {data.correction.newReason}</Text><Text>Justificativa: {data.correction.correctionReason}</Text>{data.correction.evidenceName && <Text>Evidência: {data.correction.evidenceName}</Text>}</Stack>
          </>
        )}
        <Notice>O registro original e a correção continuam visíveis no histórico.</Notice>
        <Button isFullWidth onClick={() => navigate(routes.audit.events)}>VOLTAR AO HISTÓRICO</Button>
      </Stack>
    </Frame>
  );
}

function MediaRetentionView({ navigate }: { navigate: Navigate }) {
  const [filter, setFilter] = useState<MediaFilter>('all');
  const [draftFilter, setDraftFilter] = useState<MediaFilter>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data: media = [], isLoading } = useAuditMediaQuery(filter);

  return (
    <Frame title="Mídias" action="FILTRAR" onAction={() => { setDraftFilter(filter); setIsFilterOpen(true); }} backTo={routes.owner.menu} navigate={navigate}>
      <Stack gap="lg">
        <Notice><Stack gap={2}><Text weight={700}>Retenção de 60 dias</Text><Text size="sm">Fotos expiram 60 dias após o upload. O histórico permanece disponível.</Text></Stack></Notice>
        <Stack>
          <Title order={2}>Evidências recentes</Title>
          {isLoading ? <Text size="sm" tone="muted">Carregando mídias…</Text> : media.length ? media.map((item) => (
            <Card key={item.id}>
              <Group wrap="nowrap">
                <MediaPlaceholder title={item.name} compact style={{ width: 62 }} />
                <Stack gap={4}><Text weight={700}>{item.name}</Text><Text size="xs" tone="muted">{item.meta}</Text><StatusBadge>{item.expiryLabel}</StatusBadge></Stack>
              </Group>
            </Card>
          )) : <EmptyState title="Nenhuma mídia neste filtro" description="Altere o filtro para consultar outras evidências." />}
        </Stack>
        <Stack><Title order={2}>Substituição durante uma correção</Title><Card><Group justify="space-between"><Text>Autor da execução</Text><Text tone="success">No dia aberto</Text></Group></Card><Card><Group justify="space-between"><Text>Gerente ou dono</Text><Text tone="success">Dia aberto ou fechado</Text></Group></Card></Stack>
        <Text size="xs" tone="muted">A foto anterior fica registrada até sua expiração.</Text>
      </Stack>
      <BottomSheet opened={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <Stack gap="lg">
          <Title order={2}>Filtrar mídias</Title>
          <FormField label="Expiração">
            <Select
              value={draftFilter}
              onChange={(value) => setDraftFilter(value as MediaFilter)}
              options={[
                { value: 'all', label: 'Todas as evidências' },
                { value: 'active', label: 'Ativas por mais de 7 dias' },
                { value: 'expiring', label: 'Expiram em até 7 dias' },
              ]}
            />
          </FormField>
          <Button isFullWidth onClick={() => { setFilter(draftFilter); setIsFilterOpen(false); }}>APLICAR FILTRO</Button>
          <Button variant="secondary" isFullWidth onClick={() => { setDraftFilter('all'); setFilter('all'); setIsFilterOpen(false); }}>LIMPAR FILTRO</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

function ReplaceEvidenceView({ navigate }: { navigate: Navigate }) {
  const eventId = useAuditStore((state) => state.selectedEventId);
  const { data: event } = useAuditEventQuery(eventId);
  const [correctionReason, setCorrectionReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const mutation = useReplaceEvidenceMutation();

  const save = async () => {
    if (!file) return;
    await mutation.mutateAsync({ evidenceName: file.name, correctionReason });
    navigate(routes.audit.correctionRegistered);
  };

  return (
    <Frame title="Corrigir execução" backTo={routes.audit.eventDetails} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone="neutral">Dia encerrado</StatusBadge>
        <Title order={2}>{event?.subject ?? event?.title ?? 'Execução'}</Title>
        <FormField label="Justificativa da correção *"><TextArea value={correctionReason} onChange={setCorrectionReason} placeholder="Explique o motivo da correção" /></FormField>
        <FormField label="Substituir foto"><UploadArea title="Selecionar nova foto" fileName={file?.name} onFileSelect={setFile} /></FormField>
        <Notice>A correção cria um novo evento. Histórico preservado. Após fechar o dia, somente a gestão pode corrigir.</Notice>
        {mutation.isError && <Notice tone="danger">Não foi possível substituir a evidência.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!file || !correctionReason.trim()} onClick={() => void save()}>SALVAR CORREÇÃO</Button>
      </Stack>
    </Frame>
  );
}

function ExpiredEvidenceView({ navigate }: { navigate: Navigate }) {
  const eventId = useAuditStore((state) => state.selectedEventId);
  const { data: event, isLoading } = useAuditEventQuery(eventId);
  return (
    <Frame title="Evidência expirada" action="VER MÍDIAS" onAction={() => navigate(routes.audit.mediaRetention)} backTo={routes.audit.events} navigate={navigate}>
      <Stack gap="lg">
        {isLoading ? <Text tone="muted">Carregando evidência…</Text> : event && (
          <>
            <Title order={2}>{event.subject ?? event.title}</Title>
            <MediaPlaceholder title="Foto indisponível" description="O prazo de retenção após o envio terminou." />
            <Stack><Title order={3}>Registro de execução preservado</Title>{event.details?.map((row) => <Text key={row.label}>{row.label}: {row.value}</Text>)}<Text>Data, comentário e alterações continuam no histórico.</Text></Stack>
          </>
        )}
        <Button isFullWidth onClick={() => navigate(routes.audit.events)}>VOLTAR</Button>
      </Stack>
    </Frame>
  );
}

export function AuditView({ route, navigate, onLogout }: { route: AppRoute; navigate: Navigate; onLogout: () => void }) {
  switch (route) {
    case routes.owner.menu: return <OwnerMenuView navigate={navigate} onLogout={onLogout} />;
    case routes.audit.events: return <AuditEventsView navigate={navigate} />;
    case routes.audit.eventDetails: return <AuditEventDetailsView navigate={navigate} />;
    case routes.audit.executionCorrection: return <ExecutionCorrectionView navigate={navigate} />;
    case routes.audit.correctionRegistered: return <CorrectionRegisteredView navigate={navigate} />;
    case routes.audit.mediaRetention: return <MediaRetentionView navigate={navigate} />;
    case routes.audit.evidenceReplacement: return <ReplaceEvidenceView navigate={navigate} />;
    case routes.audit.expiredEvidence: return <ExpiredEvidenceView navigate={navigate} />;
    default: return null;
  }
}
