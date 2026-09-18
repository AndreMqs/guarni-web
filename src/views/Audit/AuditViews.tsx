import {
  Avatar,
  Button,
  Card,
  DetailRows,
  FormField,
  Frame,
  Group,
  MediaPlaceholder,
  MenuCard,
  Notice,
  Stack,
  StatusBadge,
  Tabs,
  Text,
  TextArea,
  TextButton,
  Title,
  UploadArea,
} from '../../components';
import { routes, type AppRoute, type Navigate } from '../../navigation';

function OwnerMenuView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Mais" navigate={navigate} bottomNav="more" navMode="owner">
      <Stack gap="lg">
        <Card>
          <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap"><Avatar initials="AC" /><Stack gap={0}><Text weight={700}>André Câmara</Text><Text size="xs" tone="muted">Dono · Unidade Tatuapé</Text></Stack></Group>
            <Text>⌄</Text>
          </Group>
        </Card>
        <Stack><Text size="xs" tone="muted" weight={700}>GESTÃO</Text><MenuCard icon="✓" title="Atividades" subtitle="Criar e editar tarefas" onClick={() => navigate(routes.management.taskCatalog)} /><MenuCard icon="●" title="Usuários" subtitle="Gerenciar papéis e acessos" onClick={() => navigate(routes.management.users)} /><MenuCard icon="⚙" title="Configurações" subtitle="Regras da unidade" onClick={() => navigate(routes.management.unitSettings)} /></Stack>
        <Stack><Text size="xs" tone="muted" weight={700}>HISTÓRICO IMUTÁVEL</Text><MenuCard icon="◎" title="Auditoria de negócio" subtitle="Consultar eventos e correções" onClick={() => navigate(routes.audit.events)} /><MenuCard icon="▧" title="Mídias e retenção" subtitle="Evidências e remoções auditadas" onClick={() => navigate(routes.audit.mediaRetention)} /></Stack>
      </Stack>
    </Frame>
  );
}

function AuditEventsView({ navigate }: { navigate: Navigate }) {
  const events = [
    { title: 'Tarefa concluída', meta: '10:18 · André · Higienizar bancada', label: 'Feita', tone: 'done' as const, route: routes.audit.eventDetails },
    { title: 'Responsável alterado', meta: '11:42 · Rafael assumiu de Marina', label: 'Reatribuição', tone: 'warning' as const, route: routes.audit.eventDetails },
    { title: 'Correção registrada pelo dono', meta: '12:08 · André · motivo atualizado', label: 'Correção', tone: 'danger' as const, route: routes.audit.eventDetails },
    { title: 'Foto expirada', meta: '14:30 · Carla · fechamento-caixa.jpg', label: 'Mídia', tone: 'neutral' as const, route: routes.audit.expiredEvidence },
  ];

  return (
    <Frame title="Auditoria" action="EXPORTAR" backTo={routes.owner.menu} navigate={navigate}>
      <Stack gap="lg">
        <Card><Group justify="space-between"><Text>31 ago — 1 set 2026</Text><Text>▦</Text></Group></Card>
        <Tabs items={['Todos', 'Tarefas', 'Usuários', 'Mídias']} active="Todos" />
        <Text size="xs" tone="muted">24 eventos</Text>
        <Stack>
          {events.map((event) => (
            <Card key={event.title} onClick={() => navigate(event.route)}>
              <Group wrap="nowrap">
                <Text size="xl" tone="primary">•</Text>
                <Stack gap={4} style={{ flex: 1 }}><Text weight={700}>{event.title}</Text><Text size="xs" tone="muted">{event.meta}</Text><StatusBadge tone={event.tone}>{event.label}</StatusBadge></Stack>
                <Text>›</Text>
              </Group>
            </Card>
          ))}
        </Stack>
        <Text size="xs" tone="muted">O histórico não pode ser editado ou excluído, nem pelo dono.</Text>
      </Stack>
    </Frame>
  );
}

function AuditEventDetailsView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Evento de auditoria" action="⋯" backTo={routes.audit.events} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone="done">Tarefa feita</StatusBadge>
        <Title order={2}>Higienizar bancada da cozinha</Title>
        <DetailRows rows={[
          { label: 'Evento', value: 'Conclusão da ocorrência' },
          { label: 'Executor', value: 'André Câmara' },
          { label: 'Data e hora', value: '31/08/2026 · 10:18:42' },
          { label: 'Status final', value: 'Feita' },
          { label: 'Comentário', value: 'Bancada finalizada e produtos guardados.' },
        ]} />
        <Card>
          <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap"><MediaPlaceholder title="bancada.jpg" compact style={{ width: 54 }} /><Stack gap={2}><Text weight={700}>bancada.jpg</Text><Text size="xs" tone="muted">Foto · 2,4 MB</Text></Stack></Group>
            <TextButton>ABRIR</TextButton>
          </Group>
        </Card>
        <Text size="xs" tone="muted">ID do evento: evt_01J8K7M2</Text>
      </Stack>
    </Frame>
  );
}

function ExecutionCorrectionView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Corrigir execução" backTo={routes.management.previousDayTaskDetails} navigate={navigate}>
      <Stack gap="lg">
        <Notice tone="warning"><Stack gap={2}><Text weight={700}>Justificativa obrigatória</Text><Text size="sm">A correção cria um novo evento. O registro original permanece.</Text></Stack></Notice>
        <FormField label="Motivo original"><TextArea value="Equipamento quebrado" readOnly /></FormField>
        <FormField label="Novo motivo *"><TextArea value="Equipamento em manutenção preventiva" /></FormField>
        <FormField label="Justificativa da correção *"><TextArea placeholder="Explique por que o registro precisa ser ajustado" /></FormField>
        <Button isFullWidth onClick={() => navigate(routes.audit.correctionRegistered)}>SALVAR CORREÇÃO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.previousDayTaskDetails)}>CANCELAR</Button>
        <Text size="xs" tone="muted">Gestão: correções na própria unidade, inclusive após o fechamento.</Text>
      </Stack>
    </Frame>
  );
}

function CorrectionRegisteredView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Correção registrada" action="⋯" backTo={routes.audit.events} navigate={navigate}>
      <Stack gap="lg">
        <Notice tone="success"><Text weight={700}>Histórico preservado</Text></Notice>
        <Stack><Title order={2}>Registro original · 31 ago, 14:05</Title><Text>Rafael Lima · Não feita</Text><Text>Motivo: equipamento quebrado</Text></Stack>
        <Stack><Title order={2}>Correção · 31 ago, 14:20</Title><Text>Marina Souza · Gerente</Text><Text>Novo motivo: manutenção preventiva</Text><Text>Justificativa: confirmação com a equipe.</Text></Stack>
        <Notice>O registro original e a correção continuam visíveis no histórico.</Notice>
        <Button isFullWidth onClick={() => navigate(routes.audit.events)}>VOLTAR AO HISTÓRICO</Button>
      </Stack>
    </Frame>
  );
}

function MediaRetentionView({ navigate }: { navigate: Navigate }) {
  const media = [
    { name: 'bancada.jpg', meta: 'André · 31 ago · 10:18', expiry: 'Expira em 59 dias' },
    { name: 'fechamento.jpg', meta: 'Marina · 30 ago · 23:42', expiry: 'Expira em 58 dias' },
  ];
  return (
    <Frame title="Mídias" action="FILTRAR" backTo={routes.owner.menu} navigate={navigate}>
      <Stack gap="lg">
        <Notice><Stack gap={2}><Text weight={700}>Retenção de 60 dias</Text><Text size="sm">Fotos expiram 60 dias após o upload. O histórico permanece disponível.</Text></Stack></Notice>
        <Stack><Title order={2}>Evidências recentes</Title>{media.map((item) => <Card key={item.name}><Group wrap="nowrap"><MediaPlaceholder title={item.name} compact style={{ width: 62 }} /><Stack gap={4}><Text weight={700}>{item.name}</Text><Text size="xs" tone="muted">{item.meta}</Text><StatusBadge>{item.expiry}</StatusBadge></Stack></Group></Card>)}</Stack>
        <Stack><Title order={2}>Substituição durante uma correção</Title><Card><Group justify="space-between"><Text>Autor da execução</Text><Text tone="success">No dia aberto</Text></Group></Card><Card><Group justify="space-between"><Text>Gerente ou dono</Text><Text tone="success">Dia aberto ou fechado</Text></Group></Card></Stack>
        <Text size="xs" tone="muted">A foto anterior fica registrada até sua expiração.</Text>
      </Stack>
    </Frame>
  );
}

function ReplaceEvidenceView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Corrigir execução" backTo={routes.management.previousDayTaskDetails} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone="neutral">Dia encerrado</StatusBadge>
        <Title order={2}>Fotografar fechamento do caixa</Title>
        <FormField label="Justificativa da correção *"><TextArea placeholder="Explique o motivo da correção" /></FormField>
        <FormField label="Substituir foto (opcional)"><UploadArea title="Selecionar nova foto" /></FormField>
        <Notice>A correção cria um novo evento. Histórico preservado. Após fechar o dia, somente a gestão pode corrigir.</Notice>
        <Button isFullWidth onClick={() => navigate(routes.audit.correctionRegistered)}>SALVAR CORREÇÃO</Button>
      </Stack>
    </Frame>
  );
}

function ExpiredEvidenceView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Evidência expirada" action="FILTRAR" backTo={routes.audit.events} navigate={navigate}>
      <Stack gap="lg">
        <Title order={2}>Higienizar bancada da cozinha</Title>
        <MediaPlaceholder title="Foto indisponível" description="O prazo de 60 dias após o envio terminou." />
        <Stack><Title order={3}>Registro de execução preservado</Title><Text>Concluída por André Câmara</Text><Text>Data, comentário e alterações continuam no histórico.</Text></Stack>
        <Button isFullWidth onClick={() => navigate(routes.audit.events)}>VOLTAR</Button>
      </Stack>
    </Frame>
  );
}

export function AuditView({ route, navigate }: { route: AppRoute; navigate: Navigate }) {
  switch (route) {
    case routes.owner.menu: return <OwnerMenuView navigate={navigate} />;
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
