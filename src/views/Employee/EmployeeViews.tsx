import {
  BottomSheet,
  Button,
  Card,
  DetailRows,
  Dialog,
  EmptyState,
  FormField,
  Frame,
  Group,
  IconButton,
  MediaPlaceholder,
  Notice,
  SearchField,
  Select,
  Stack,
  StatusBadge,
  SummaryMetrics,
  Tabs,
  TaskCard,
  Text,
  TextArea,
  Timeline,
  Title,
  UploadArea,
} from '../../components';
import { routes, type AppRoute, type Navigate } from '../../navigation';

const myTasks = [
  { title: 'Higienizar bancada da cozinha', due: 'até 10:00', evidence: 'Foto obrigatória', next: routes.tasks.pendingDetails },
  { title: 'Conferir temperatura dos freezers', due: 'até 15:00', evidence: 'Evidência opcional', next: routes.tasks.updateConflict },
  { title: 'Organizar estoque seco', due: 'sem horário', evidence: 'Foto opcional', next: routes.tasks.pendingDetails },
];

const unitTasks = [
  { title: 'Limpar salão antes da abertura', due: 'até 11:00', assignee: 'Geral', next: routes.tasks.pendingDetails },
  { title: 'Conferir validade dos molhos', due: 'até 14:00', assignee: 'Marina Souza', next: routes.tasks.takeover },
  { title: 'Fotografar fechamento do caixa', due: 'até 23:30', assignee: 'Rafael Lima', next: routes.tasks.pendingDetails },
];

function TodayTasksView({ navigate, showAll = false }: { navigate: Navigate; showAll?: boolean }) {
  return (
    <Frame title="Tarefas de hoje" action="31 AGO" navigate={navigate} bottomNav="today">
      <Stack gap="lg">
        <Group justify="space-between" wrap="nowrap">
          <Text size="sm">Hoje, segunda-feira · 31 ago</Text>
          <IconButton ariaLabel="Selecionar data">⌄</IconButton>
        </Group>

        {!showAll && (
          <SummaryMetrics values={[
            { value: 4, label: 'feitas' },
            { value: 3, label: 'pendentes' },
            { value: 1, label: 'não feita' },
          ]} />
        )}

        <Tabs
          items={['Minhas', 'Gerais', 'Todas']}
          active={showAll ? 'Todas' : 'Minhas'}
          onChange={(value) => navigate(value === 'Todas' ? routes.tasks.all : routes.tasks.today)}
        />

        {showAll && <SearchField placeholder="Buscar tarefa ou responsável" />}

        <Stack>
          <Text size="xs" tone="muted">{showAll ? '8 tarefas da unidade' : '3 tarefas pendentes'}</Text>
          {(showAll ? unitTasks : myTasks).map((task) => (
            <TaskCard
              key={task.title}
              title={task.title}
              due={task.due}
              assignee={'assignee' in task ? task.assignee : 'Você'}
              evidence={'evidence' in task ? task.evidence : undefined}
              onClick={() => navigate(task.next)}
            />
          ))}
        </Stack>
      </Stack>
    </Frame>
  );
}

function PendingTaskDetailsView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Detalhe da tarefa" action="⋯" backTo={routes.tasks.today} navigate={navigate}>
      <Stack gap="lg">
        <Group gap="xs"><StatusBadge tone="pending">Pendente</StatusBadge><StatusBadge tone="danger">Atrasada</StatusBadge></Group>
        <Stack gap="xs">
          <Title order={2}>Higienizar bancada da cozinha</Title>
          <Text tone="muted">Limpar toda a superfície, os cantos e a área próxima à pia antes do início do atendimento.</Text>
        </Stack>
        <Card>
          <DetailRows rows={[
            { label: 'Prazo', value: 'Hoje, até 10:00' },
            { label: 'Responsável', value: 'Você' },
            { label: 'Data de execução', value: 'Hoje, 31 ago' },
            { label: 'Evidência', value: '1 foto obrigatória' },
          ]} />
        </Card>
        <Notice tone="warning">
          <Stack gap={2}><Text weight={700}>A tarefa está atrasada.</Text><Text size="sm">Ainda é possível concluí-la até o fechamento do dia.</Text></Stack>
        </Notice>
        <Stack gap="sm">
          <Button isFullWidth onClick={() => navigate(routes.tasks.complete)}>✓ &nbsp; CONCLUIR TAREFA</Button>
          <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.markNotDone)}>× &nbsp; MARCAR COMO NÃO FEITA</Button>
        </Stack>
      </Stack>
    </Frame>
  );
}

function TakeOverTaskView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Detalhe da tarefa" action="⋯" backTo={routes.tasks.all} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone="pending">Pendente</StatusBadge>
        <Stack gap="xs"><Title order={2}>Conferir validade dos molhos</Title><Text tone="muted">Responsável atual: Marina Souza</Text></Stack>
        <Button variant="secondary" isFullWidth>ASSUMIR ESTA TAREFA</Button>
      </Stack>
      <BottomSheet>
        <Stack gap="lg">
          <Stack gap="xs"><Title order={2}>Assumir tarefa</Title><Text tone="muted">Esta tarefa está atribuída a Marina Souza. Explique por que você irá executá-la.</Text></Stack>
          <FormField label="Justificativa *"><TextArea placeholder="Ex.: Marina precisou atender uma entrega" /></FormField>
          <Text size="xs" tone="muted">A troca ficará registrada no histórico.</Text>
          <Button isFullWidth onClick={() => navigate(routes.tasks.pendingDetails)}>CONFIRMAR E ASSUMIR</Button>
          <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.all)}>CANCELAR</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

type CompletionState = 'form' | 'saving' | 'error';

function CompleteTaskView({ navigate, state = 'form' }: { navigate: Navigate; state?: CompletionState }) {
  return (
    <Frame title="Concluir tarefa" backTo={routes.tasks.pendingDetails} navigate={navigate}>
      <Stack gap="lg">
        <Stack gap="xs">
          <Title order={2}>Higienizar bancada da cozinha</Title>
          {state === 'form' && <Text tone="muted">Adicione a evidência antes de confirmar.</Text>}
        </Stack>

        {state === 'error' ? (
          <Card>
            <Group wrap="nowrap">
              <MediaPlaceholder title="bancada.jpg" compact style={{ width: 80 }} />
              <Stack gap={4}>
                <Text weight={700}>bancada.jpg</Text>
                <Text size="xs" tone="muted">2,4 MB</Text>
                <StatusBadge tone="danger">Falha no envio</StatusBadge>
              </Stack>
            </Group>
          </Card>
        ) : (
          <UploadArea title="Tirar foto" description="ou escolher da galeria" icon="▣" />
        )}

        {state === 'form' && (
          <>
            <Text size="xs" tone="muted">Uma foto por execução · disponível por 60 dias</Text>
            <FormField label="Comentário"><TextArea placeholder="Inclua uma observação, se necessário" /></FormField>
            <Notice>Executor, horário, comentário e mídia serão registrados juntos.</Notice>
            <Button isFullWidth onClick={() => navigate(routes.tasks.completionSaving)}>✓ &nbsp; CONFIRMAR CONCLUSÃO</Button>
            <Text size="xs" tone="muted">O botão será liberado após adicionar a foto.</Text>
          </>
        )}

        {state === 'error' && (
          <>
            <Notice tone="info">A evidência continua nesta tela e não será duplicada ao tentar novamente.</Notice>
            <Notice tone="danger"><Stack gap={2}><Text weight={700}>Não foi possível enviar agora</Text><Text size="sm">Nada foi salvo. Conecte-se e tente novamente.</Text></Stack></Notice>
            <Button isFullWidth onClick={() => navigate(routes.tasks.completionSaving)}>↻ &nbsp; TENTAR NOVAMENTE</Button>
            <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.pendingDetails)}>CANCELAR E VOLTAR</Button>
          </>
        )}

        {state === 'saving' && <Button isFullWidth disabled>✓ &nbsp; CONFIRMAR CONCLUSÃO</Button>}
      </Stack>

      {state === 'saving' && (
        <Dialog title="Salvando conclusão…">Estamos enviando a evidência. Não feche esta tela.</Dialog>
      )}
    </Frame>
  );
}

function MarkTaskNotDoneView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Não foi possível concluir" backTo={routes.tasks.pendingDetails} navigate={navigate}>
      <Stack gap="lg">
        <Title order={2}>Higienizar bancada da cozinha</Title>
        <Notice tone="danger"><Stack gap={2}><Text weight={700}>A tarefa será encerrada como não feita.</Text><Text size="sm">Essa ação e a justificativa ficarão no histórico do dia.</Text></Stack></Notice>
        <FormField label="Motivo *"><TextArea placeholder="Descreva o que impediu a execução" /></FormField>
        <Text size="xs" tone="muted">Exemplos: equipamento indisponível, falta de insumo ou acesso bloqueado.</Text>
        <Button isFullWidth onClick={() => navigate(routes.history.closedDay)}>× &nbsp; CONFIRMAR COMO NÃO FEITA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.pendingDetails)}>VOLTAR PARA A TAREFA</Button>
      </Stack>
    </Frame>
  );
}

function CompletedTaskDetailsView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Detalhe da tarefa" action="CORRIGIR" onAction={() => navigate(routes.tasks.correction)} backTo={routes.tasks.today} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone="done">Feita</StatusBadge>
        <Stack gap="xs"><Title order={2}>Higienizar bancada da cozinha</Title><Text tone="muted">Concluída por André Câmara · 10:18</Text></Stack>
        <Stack><Title order={3}>Evidência</Title><MediaPlaceholder title="Foto da bancada higienizada" /></Stack>
        <Stack gap="xs"><Title order={3}>Comentário</Title><Text>Bancada finalizada e produtos guardados.</Text></Stack>
        <Stack><Title order={3}>Histórico</Title><Timeline events={[{ title: 'Tarefa concluída', meta: '10:18 · André Câmara' }, { title: 'Tarefa atribuída', meta: '08:00 · Gerente' }]} /></Stack>
        <Text size="xs" tone="muted">Você pode corrigir sua execução enquanto o dia estiver aberto.</Text>
      </Stack>
    </Frame>
  );
}

function DailyHistoryView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Histórico" action="FILTRAR" navigate={navigate} bottomNav="history">
      <Stack gap="lg">
        <Group justify="space-between"><Text>Segunda-feira · 31 ago</Text><IconButton ariaLabel="Selecionar data">⌄</IconButton></Group>
        <SummaryMetrics values={[{ value: 12, label: 'feitas' }, { value: 0, label: 'pendentes' }, { value: 2, label: 'não feitas' }]} />
        <Stack><Title order={2}>Atividade do dia</Title><Timeline events={[
          { title: 'Higienizar bancada — Feita', meta: '10:18 · André · 1 foto' },
          { title: 'Conferir validade — Assumida', meta: '11:42 · Rafael assumiu de Marina' },
          { title: 'Organizar estoque — Não feita', meta: '14:05 · Motivo informado' },
          { title: 'Limpar salão — Feita', meta: '15:20 · Marina · sem mídia' },
          { title: 'Comentário adicionado', meta: '16:08 · Gerente · correção registrada' },
        ]} /></Stack>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.history.closedDay)}>VER DIA ENCERRADO</Button>
      </Stack>
    </Frame>
  );
}

function ClosedDayHistoryView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Histórico" action="31 AGO" navigate={navigate} bottomNav="history">
      <Stack gap="lg">
        <Notice><Stack gap={2}><Text weight={700}>Dia operacional encerrado às 03:00</Text><Text size="sm">Pendências foram encerradas automaticamente como não feitas.</Text></Stack></Notice>
        <StatusBadge tone="danger">Não feita</StatusBadge>
        <Title order={2}>Fotografar fechamento do caixa</Title>
        <Stack gap={2}><Text size="xs" tone="muted">MOTIVO</Text><Text tone="danger">Não concluída até o fechamento do dia</Text></Stack>
        <Stack gap={2}><Text size="xs" tone="muted">REGISTRADO AUTOMATICAMENTE</Text><Text>03:00 · Sistema · sem evidência</Text></Stack>
        <Notice><Stack gap={2}><Text weight={700}>Após o fechamento</Text><Text size="sm">Funcionários somente consultam. Gerente ou dono podem corrigir, com justificativa.</Text></Stack></Notice>
      </Stack>
    </Frame>
  );
}

function CorrectOwnExecutionView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Corrigir execução" backTo={routes.tasks.completedDetails} navigate={navigate}>
      <Stack gap="lg">
        <Stack gap="xs"><Title order={2}>Higienizar bancada da cozinha</Title><Text tone="muted">Sua execução · Dia aberto</Text></Stack>
        <FormField label="Status"><Select value="done" options={[{ value: 'done', label: 'Feita' }, { value: 'not-done', label: 'Não feita' }]} /></FormField>
        <FormField label="Comentário atualizado"><TextArea value="Bancada finalizada e produtos guardados." /></FormField>
        <FormField label="Justificativa da correção *"><TextArea placeholder="Explique por que precisa corrigir" /></FormField>
        <Button variant="secondary" isFullWidth>SUBSTITUIR FOTO</Button>
        <Text size="xs" tone="muted">Uma foto vigente. A foto anterior e a correção ficam registradas no histórico.</Text>
        <Button isFullWidth onClick={() => navigate(routes.tasks.completedDetails)}>SALVAR CORREÇÃO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.completedDetails)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskUpdateConflictView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Concluir tarefa" backTo={routes.tasks.pendingDetails} navigate={navigate}>
      <Stack gap="lg"><Title order={2}>Conferir temperatura dos freezers</Title><FormField label="Comentário"><TextArea value="Temperatura registrada: -18°C" /></FormField><Button isFullWidth disabled>CONFIRMAR CONCLUSÃO</Button></Stack>
      <Dialog title="A tarefa já foi atualizada" action="VER VERSÃO ATUAL" onAction={() => navigate(routes.tasks.completedDetails)}>Outra pessoa concluiu esta tarefa enquanto você preenchia. Nenhuma conclusão duplicada foi criada.</Dialog>
    </Frame>
  );
}

function CorrectionRestrictedView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Auditoria" backTo={routes.tasks.completedDetails} navigate={navigate}>
      <EmptyState icon="×" title="Correção não permitida" description="Você só pode corrigir sua execução no dia aberto. Para outros casos, procure a gestão.">
        <Stack style={{ width: '100%' }}><Button isFullWidth onClick={() => navigate(routes.tasks.completedDetails)}>VOLTAR</Button><Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.today)}>IR PARA TAREFAS</Button></Stack>
      </EmptyState>
    </Frame>
  );
}

function EmptyTasksView({ navigate }: { navigate: Navigate }) {
  return (
    <Frame title="Tarefas de hoje" action="31 AGO" navigate={navigate} bottomNav="today">
      <Tabs items={['Minhas', 'Gerais', 'Todas']} active="Minhas" />
      <EmptyState title="Tudo certo por aqui" description="Você não tem tarefas pendentes neste filtro. Consulte as tarefas gerais ou todas da unidade.">
        <Button variant="secondary" onClick={() => navigate(routes.tasks.all)}>VER TAREFAS GERAIS</Button>
      </EmptyState>
    </Frame>
  );
}

export function EmployeeView({ route, navigate }: { route: AppRoute; navigate: Navigate }) {
  switch (route) {
    case routes.tasks.today: return <TodayTasksView navigate={navigate} />;
    case routes.tasks.all: return <TodayTasksView navigate={navigate} showAll />;
    case routes.tasks.pendingDetails: return <PendingTaskDetailsView navigate={navigate} />;
    case routes.tasks.takeover: return <TakeOverTaskView navigate={navigate} />;
    case routes.tasks.complete: return <CompleteTaskView navigate={navigate} />;
    case routes.tasks.markNotDone: return <MarkTaskNotDoneView navigate={navigate} />;
    case routes.tasks.completedDetails: return <CompletedTaskDetailsView navigate={navigate} />;
    case routes.history.daily: return <DailyHistoryView navigate={navigate} />;
    case routes.history.closedDay: return <ClosedDayHistoryView navigate={navigate} />;
    case routes.tasks.completionSaving: return <CompleteTaskView navigate={navigate} state="saving" />;
    case routes.tasks.completionError: return <CompleteTaskView navigate={navigate} state="error" />;
    case routes.tasks.correction: return <CorrectOwnExecutionView navigate={navigate} />;
    case routes.tasks.updateConflict: return <TaskUpdateConflictView navigate={navigate} />;
    case routes.tasks.correctionRestricted: return <CorrectionRestrictedView navigate={navigate} />;
    case routes.tasks.empty: return <EmptyTasksView navigate={navigate} />;
    default: return null;
  }
}
