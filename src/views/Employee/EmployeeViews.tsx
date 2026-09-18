import { useState } from 'react';
import type { HistoryEventCategory, TaskScope, TaskStatus } from '../../api';
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
  MediaPlaceholder,
  MenuCard,
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
import {
  useClosedDayHistoryQuery,
  useCompleteTaskMutation,
  useCorrectTaskExecutionMutation,
  useDailyHistoryQuery,
  useEmployeeTaskQuery,
  useMarkTaskNotDoneMutation,
  useTakeOverTaskMutation,
  useTodayTasksQuery,
  useCurrentUserContextQuery,
} from '../../hooks';
import { routes, type AppRoute, type Navigate, type NavigationMode } from '../../navigation';
import { useTaskStore } from '../../stores';

const scopeByTab: Record<string, TaskScope> = { Minhas: 'mine', Gerais: 'general', Todas: 'all' };
const tabByScope: Record<TaskScope, string> = { mine: 'Minhas', general: 'Gerais', all: 'Todas' };

const taskStatusPresentation: Record<TaskStatus, { label: string; tone: 'pending' | 'done' | 'danger' }> = {
  pending: { label: 'Pendente', tone: 'pending' },
  done: { label: 'Feita', tone: 'done' },
  notDone: { label: 'Não feita', tone: 'danger' },
};

function TodayTasksView({ navigate, initialScope = 'mine' }: { navigate: Navigate; initialScope?: TaskScope }) {
  const [scope, setScope] = useState<TaskScope>(initialScope);
  const [search, setSearch] = useState('');
  const setSelectedTaskId = useTaskStore((state) => state.setSelectedTaskId);
  const { data, isLoading } = useTodayTasksQuery({ scope, search });
  const tasks = data?.tasks ?? [];

  const handleTabChange = (tab: string) => {
    setScope(scopeByTab[tab] ?? 'mine');
    setSearch('');
  };

  return (
    <Frame title="Tarefas de hoje" action="31 AGO" navigate={navigate} bottomNav="today">
      <Stack gap="lg">
        <Text size="sm">{data?.dateLabel ?? 'Carregando data…'}</Text>

        {scope !== 'all' && data && (
          <SummaryMetrics values={[
            { value: data.summary.done, label: 'feitas' },
            { value: data.summary.pending, label: 'pendentes' },
            { value: data.summary.notDone, label: 'não feita' },
          ]} />
        )}

        <Tabs items={['Minhas', 'Gerais', 'Todas']} active={tabByScope[scope]} onChange={handleTabChange} />

        {scope === 'all' && <SearchField placeholder="Buscar tarefa ou responsável" value={search} onChange={setSearch} />}

        <Stack>
          <Text size="xs" tone="muted">{isLoading ? 'Carregando tarefas…' : `${tasks.length} ${tasks.length === 1 ? 'tarefa' : 'tarefas'} neste filtro`}</Text>
          {!isLoading && tasks.length === 0 ? (
            <EmptyState title="Nenhuma tarefa encontrada" description={search ? 'Tente outro termo de busca.' : 'Não há tarefas para este filtro.'} />
          ) : tasks.map((task) => {
            const presentation = taskStatusPresentation[task.status];
            return (
              <TaskCard
                key={task.id}
                title={task.title}
                status={presentation.label}
                tone={presentation.tone}
                due={task.dueLabel}
                assignee={task.assigneeLabel}
                evidence={task.evidenceLabel}
                onClick={() => {
                  setSelectedTaskId(task.id);
                  if (task.canTakeOver) navigate(routes.tasks.takeover);
                  else if (task.status === 'done') navigate(routes.tasks.completedDetails);
                  else navigate(routes.tasks.pendingDetails);
                }}
              />
            );
          })}
        </Stack>
      </Stack>
    </Frame>
  );
}

function PendingTaskDetailsView({ navigate }: { navigate: Navigate }) {
  const taskId = useTaskStore((state) => state.selectedTaskId);
  const { data: task } = useEmployeeTaskQuery(taskId);
  return (
    <Frame title="Detalhe da tarefa" action="⋯" backTo={routes.tasks.today} navigate={navigate}>
      <Stack gap="lg">
        <Group gap="xs"><StatusBadge tone="pending">Pendente</StatusBadge>{task?.isOverdue && <StatusBadge tone="danger">Atrasada</StatusBadge>}</Group>
        <Stack gap="xs"><Title order={2}>{task?.title ?? 'Tarefa'}</Title><Text tone="muted">{task?.description ?? 'Consulte as instruções e conclua a atividade dentro do dia operacional.'}</Text></Stack>
        <Card><DetailRows rows={[
          { label: 'Prazo', value: task?.dueLabel ?? 'Sem horário' },
          { label: 'Responsável', value: task?.assigneeLabel ?? 'Você' },
          { label: 'Data de execução', value: task?.executionDateLabel ?? 'Hoje' },
          { label: 'Evidência', value: task?.evidenceLabel ?? 'Sem evidência obrigatória' },
        ]} /></Card>
        {task?.isOverdue && <Notice tone="warning"><Stack gap={2}><Text weight={700}>A tarefa está atrasada.</Text><Text size="sm">Ainda é possível concluí-la até o fechamento do dia.</Text></Stack></Notice>}
        <Stack gap="sm">
          <Button isFullWidth onClick={() => navigate(routes.tasks.complete)}>✓ &nbsp; CONCLUIR TAREFA</Button>
          <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.markNotDone)}>× &nbsp; MARCAR COMO NÃO FEITA</Button>
        </Stack>
      </Stack>
    </Frame>
  );
}

function TakeOverTaskView({ navigate }: { navigate: Navigate }) {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [reason, setReason] = useState('');
  const taskId = useTaskStore((state) => state.selectedTaskId);
  const { data: task } = useEmployeeTaskQuery(taskId);
  const mutation = useTakeOverTaskMutation();

  const confirm = async () => {
    await mutation.mutateAsync({ taskId, reason });
    setIsSheetOpen(false);
    navigate(routes.tasks.pendingDetails);
  };

  return (
    <Frame title="Detalhe da tarefa" action="⋯" backTo={routes.tasks.all} navigate={navigate}>
      <Stack gap="lg">
        <StatusBadge tone="pending">Pendente</StatusBadge>
        <Stack gap="xs"><Title order={2}>{task?.title ?? 'Tarefa'}</Title><Text tone="muted">Responsável atual: {task?.assigneeLabel ?? 'Outro funcionário'}</Text></Stack>
        <Button variant="secondary" isFullWidth onClick={() => setIsSheetOpen(true)}>ASSUMIR ESTA TAREFA</Button>
      </Stack>
      <BottomSheet opened={isSheetOpen} onClose={() => setIsSheetOpen(false)}>
        <Stack gap="lg">
          <Stack gap="xs"><Title order={2}>Assumir tarefa</Title><Text tone="muted">Explique por que você irá executar esta tarefa.</Text></Stack>
          <FormField label="Justificativa *"><TextArea value={reason} onChange={setReason} placeholder="Ex.: o responsável precisou atender uma entrega" /></FormField>
          <Text size="xs" tone="muted">A troca ficará registrada no histórico.</Text>
          {mutation.isError && <Notice tone="danger">Não foi possível assumir a tarefa. Tente novamente.</Notice>}
          <Button isFullWidth isLoading={mutation.isPending} disabled={!reason.trim()} onClick={() => void confirm()}>CONFIRMAR E ASSUMIR</Button>
          <Button variant="secondary" isFullWidth onClick={() => setIsSheetOpen(false)}>CANCELAR</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

type CompletionState = 'form' | 'saving' | 'error';

function CompleteTaskView({ navigate, state = 'form' }: { navigate: Navigate; state?: CompletionState }) {
  const taskId = useTaskStore((store) => store.selectedTaskId);
  const executionDraft = useTaskStore((store) => store.executionDraft);
  const updateExecutionDraft = useTaskStore((store) => store.updateExecutionDraft);
  const resetExecutionDraft = useTaskStore((store) => store.resetExecutionDraft);
  const { data: task } = useEmployeeTaskQuery(taskId);
  const mutation = useCompleteTaskMutation();
  const [file, setFile] = useState<File | null>(executionDraft.evidenceName ? new File([], executionDraft.evidenceName) : null);

  const requiresEvidence = task?.evidenceLabel?.toLocaleLowerCase('pt-BR').includes('obrigatória') ?? false;
  const canSubmit = !requiresEvidence || Boolean(file);
  const displayState: CompletionState = mutation.isPending ? 'saving' : mutation.isError ? 'error' : state;

  const handleFile = (nextFile: File | null) => {
    setFile(nextFile);
    updateExecutionDraft({ evidenceName: nextFile?.name });
  };

  const submit = async () => {
    await mutation.mutateAsync({ taskId, comment: executionDraft.comment, evidenceName: file?.name });
    resetExecutionDraft();
    navigate(routes.tasks.completedDetails);
  };

  return (
    <Frame title="Concluir tarefa" backTo={routes.tasks.pendingDetails} navigate={navigate}>
      <Stack gap="lg">
        <Stack gap="xs"><Title order={2}>{task?.title ?? 'Tarefa'}</Title>{displayState === 'form' && <Text tone="muted">Adicione a evidência antes de confirmar.</Text>}</Stack>

        <UploadArea title="Tirar foto" description="ou escolher da galeria" icon="▣" fileName={file?.name} onFileSelect={handleFile} disabled={displayState === 'saving'} />

        {displayState === 'form' && (
          <>
            <Text size="xs" tone="muted">Uma foto por execução · disponível por 60 dias</Text>
            <FormField label="Comentário"><TextArea value={executionDraft.comment} onChange={(comment) => updateExecutionDraft({ comment })} placeholder="Inclua uma observação, se necessário" /></FormField>
            <Notice>Executor, horário, comentário e mídia serão registrados juntos.</Notice>
            <Button isFullWidth disabled={!canSubmit} onClick={() => void submit()}>✓ &nbsp; CONFIRMAR CONCLUSÃO</Button>
            {!canSubmit && <Text size="xs" tone="muted">O botão será liberado após adicionar a foto.</Text>}
          </>
        )}

        {displayState === 'error' && (
          <>
            <Notice tone="info">A evidência continua nesta tela e não será duplicada ao tentar novamente.</Notice>
            <Notice tone="danger"><Stack gap={2}><Text weight={700}>Não foi possível enviar agora</Text><Text size="sm">Nada foi salvo. Conecte-se e tente novamente.</Text></Stack></Notice>
            <Button isFullWidth onClick={() => void submit()}>↻ &nbsp; TENTAR NOVAMENTE</Button>
            <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.pendingDetails)}>CANCELAR E VOLTAR</Button>
          </>
        )}

        {displayState === 'saving' && <Button isFullWidth disabled>✓ &nbsp; CONFIRMAR CONCLUSÃO</Button>}
      </Stack>
      {displayState === 'saving' && <Dialog title="Salvando conclusão…">Estamos enviando a evidência. Não feche esta tela.</Dialog>}
    </Frame>
  );
}

function MarkTaskNotDoneView({ navigate }: { navigate: Navigate }) {
  const [reason, setReason] = useState('');
  const taskId = useTaskStore((state) => state.selectedTaskId);
  const { data: task } = useEmployeeTaskQuery(taskId);
  const mutation = useMarkTaskNotDoneMutation();
  const submit = async () => {
    await mutation.mutateAsync({ taskId, reason });
    navigate(routes.history.daily);
  };

  return (
    <Frame title="Não foi possível concluir" backTo={routes.tasks.pendingDetails} navigate={navigate}>
      <Stack gap="lg">
        <Title order={2}>{task?.title ?? 'Tarefa'}</Title>
        <Notice tone="danger"><Stack gap={2}><Text weight={700}>A tarefa será encerrada como não feita.</Text><Text size="sm">Essa ação e a justificativa ficarão no histórico do dia.</Text></Stack></Notice>
        <FormField label="Motivo *"><TextArea value={reason} onChange={setReason} placeholder="Descreva o que impediu a execução" /></FormField>
        <Text size="xs" tone="muted">Exemplos: equipamento indisponível, falta de insumo ou acesso bloqueado.</Text>
        {mutation.isError && <Notice tone="danger">Não foi possível salvar. Tente novamente.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!reason.trim()} onClick={() => void submit()}>× &nbsp; CONFIRMAR COMO NÃO FEITA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.pendingDetails)}>VOLTAR PARA A TAREFA</Button>
      </Stack>
    </Frame>
  );
}

function CompletedTaskDetailsView({ navigate }: { navigate: Navigate }) {
  const taskId = useTaskStore((state) => state.selectedTaskId);
  const { data: task, isLoading } = useEmployeeTaskQuery(taskId);
  return (
    <Frame title="Detalhe da tarefa" action="CORRIGIR" onAction={() => navigate(routes.tasks.correction)} backTo={routes.tasks.today} navigate={navigate}>
      <Stack gap="lg">
        {isLoading ? <Text tone="muted">Carregando tarefa…</Text> : (
          <>
            <StatusBadge tone="done">Feita</StatusBadge>
            <Stack gap="xs"><Title order={2}>{task?.title ?? 'Tarefa concluída'}</Title><Text tone="muted">Concluída por {task?.completedByLabel ?? task?.assigneeLabel ?? 'executor'}</Text></Stack>
            <Stack><Title order={3}>Evidência</Title>{task?.evidenceName ? <MediaPlaceholder title={task.evidenceName} /> : <Text size="sm" tone="muted">Nenhuma evidência anexada.</Text>}</Stack>
            <Stack gap="xs"><Title order={3}>Comentário</Title><Text>{task?.comment || 'Nenhum comentário informado.'}</Text></Stack>
            <Stack><Title order={3}>Histórico</Title>{task?.timeline?.length ? <Timeline events={task.timeline} /> : <Text size="sm" tone="muted">Sem eventos adicionais.</Text>}</Stack>
            <Text size="xs" tone="muted">Você pode corrigir sua execução enquanto o dia estiver aberto.</Text>
          </>
        )}
      </Stack>
    </Frame>
  );
}

function DailyHistoryView({ navigate }: { navigate: Navigate }) {
  const [category, setCategory] = useState<HistoryEventCategory>('all');
  const [draftCategory, setDraftCategory] = useState<HistoryEventCategory>('all');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data, isLoading } = useDailyHistoryQuery({ category });

  return (
    <Frame title="Histórico" action="FILTRAR" onAction={() => { setDraftCategory(category); setIsFilterOpen(true); }} navigate={navigate} bottomNav="history">
      <Stack gap="lg">
        <Text>{data?.dateLabel ?? 'Carregando data…'}</Text>
        {data && <SummaryMetrics values={[{ value: data.summary.done, label: 'feitas' }, { value: data.summary.pending, label: 'pendentes' }, { value: data.summary.notDone, label: 'não feitas' }]} />}
        <Stack>
          <Title order={2}>Atividade do dia</Title>
          {isLoading ? <Text size="sm" tone="muted">Carregando histórico…</Text> : data?.events.length ? <Timeline events={data.events.map((event) => ({ title: event.title, meta: event.meta }))} /> : <EmptyState title="Nenhum evento neste filtro" description="Altere o filtro para consultar outras atividades do dia." />}
        </Stack>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.history.closedDay)}>VER DIA ENCERRADO</Button>
      </Stack>
      <BottomSheet opened={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <Stack gap="lg">
          <Title order={2}>Filtrar histórico</Title>
          <FormField label="Tipo de evento"><Select value={draftCategory} onChange={(value) => setDraftCategory(value as HistoryEventCategory)} options={[
            { value: 'all', label: 'Todos os eventos' },
            { value: 'execution', label: 'Execuções' },
            { value: 'assignment', label: 'Reatribuições' },
            { value: 'correction', label: 'Correções' },
          ]} /></FormField>
          <Button isFullWidth onClick={() => { setCategory(draftCategory); setIsFilterOpen(false); }}>APLICAR FILTRO</Button>
          <Button variant="secondary" isFullWidth onClick={() => { setDraftCategory('all'); setCategory('all'); setIsFilterOpen(false); }}>LIMPAR FILTRO</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

function ClosedDayHistoryView({ navigate }: { navigate: Navigate }) {
  const { data, isLoading } = useClosedDayHistoryQuery();
  return (
    <Frame title="Histórico" action={data?.dateLabel?.toLocaleUpperCase('pt-BR') ?? 'DIA ENCERRADO'} navigate={navigate} bottomNav="history">
      <Stack gap="lg">
        {isLoading ? <Text tone="muted">Carregando histórico…</Text> : data && (
          <>
            <Notice><Stack gap={2}><Text weight={700}>Dia operacional encerrado às {data.closedAtLabel}</Text><Text size="sm">Pendências foram encerradas automaticamente como não feitas.</Text></Stack></Notice>
            <StatusBadge tone="danger">Não feita</StatusBadge>
            <Title order={2}>{data.task.title}</Title>
            <Stack gap={2}><Text size="xs" tone="muted">MOTIVO</Text><Text tone="danger">{data.task.reason}</Text></Stack>
            <Stack gap={2}><Text size="xs" tone="muted">REGISTRADO AUTOMATICAMENTE</Text><Text>{data.task.recordedAtLabel}</Text></Stack>
            <Notice><Stack gap={2}><Text weight={700}>Após o fechamento</Text><Text size="sm">Funcionários somente consultam. Gerente ou dono podem corrigir, com justificativa.</Text></Stack></Notice>
          </>
        )}
      </Stack>
    </Frame>
  );
}

function CorrectOwnExecutionView({ navigate }: { navigate: Navigate }) {
  const taskId = useTaskStore((state) => state.selectedTaskId);
  const { data: task } = useEmployeeTaskQuery(taskId);
  const [status, setStatus] = useState<'done' | 'notDone'>('done');
  const [comment, setComment] = useState('');
  const [reason, setReason] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const mutation = useCorrectTaskExecutionMutation();

  const save = async () => {
    await mutation.mutateAsync({ taskId, status, comment, reason, evidenceName: file?.name });
    navigate(routes.tasks.completedDetails);
  };

  return (
    <Frame title="Corrigir execução" backTo={routes.tasks.completedDetails} navigate={navigate}>
      <Stack gap="lg">
        <Stack gap="xs"><Title order={2}>{task?.title ?? 'Tarefa'}</Title><Text tone="muted">Sua execução · Dia aberto</Text></Stack>
        <FormField label="Status"><Select value={status} onChange={(value) => setStatus(value as 'done' | 'notDone')} options={[{ value: 'done', label: 'Feita' }, { value: 'notDone', label: 'Não feita' }]} /></FormField>
        <FormField label="Comentário atualizado"><TextArea value={comment} onChange={setComment} /></FormField>
        <FormField label="Justificativa da correção *"><TextArea value={reason} onChange={setReason} placeholder="Explique por que precisa corrigir" /></FormField>
        <UploadArea title="Substituir foto" description="Opcional" fileName={file?.name} onFileSelect={setFile} />
        <Text size="xs" tone="muted">Uma foto vigente. A foto anterior e a correção ficam registradas no histórico.</Text>
        <Button isFullWidth isLoading={mutation.isPending} disabled={!reason.trim()} onClick={() => void save()}>SALVAR CORREÇÃO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.tasks.completedDetails)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskUpdateConflictView({ navigate }: { navigate: Navigate }) {
  const taskId = useTaskStore((state) => state.selectedTaskId);
  const executionDraft = useTaskStore((state) => state.executionDraft);
  const { data: task } = useEmployeeTaskQuery(taskId);
  return (
    <Frame title="Concluir tarefa" backTo={routes.tasks.pendingDetails} navigate={navigate}>
      <Stack gap="lg"><Title order={2}>{task?.title ?? 'Tarefa'}</Title><FormField label="Comentário"><TextArea value={executionDraft.comment || task?.comment || ''} readOnly /></FormField><Button isFullWidth disabled>CONFIRMAR CONCLUSÃO</Button></Stack>
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
  const [scope, setScope] = useState<TaskScope>('mine');
  return (
    <Frame title="Tarefas de hoje" action="31 AGO" navigate={navigate} bottomNav="today">
      <Tabs items={['Minhas', 'Gerais', 'Todas']} active={tabByScope[scope]} onChange={(tab) => setScope(scopeByTab[tab] ?? 'mine')} />
      <EmptyState title="Tudo certo por aqui" description="Você não tem tarefas pendentes neste filtro. Consulte as tarefas gerais ou todas da unidade.">
        <Button variant="secondary" onClick={() => navigate(routes.tasks.all)}>VER TAREFAS GERAIS</Button>
      </EmptyState>
    </Frame>
  );
}

function TaskMenuView({ navigate, navMode, onLogout }: { navigate: Navigate; navMode: NavigationMode; onLogout?: () => void }) {
  const { data: user } = useCurrentUserContextQuery();
  return <Frame title="Mais" navigate={navigate} bottomNav="more">
    <Stack>
      <Title order={2}>{user?.name ?? 'Minha conta'}</Title>
      <Text tone="muted">{user?.roleLabel}</Text>
      {navMode !== 'employee' && <MenuCard icon="‹" title="Voltar à gestão" subtitle="Painel e configurações da unidade" onClick={() => navigate(routes.management.dashboard)} />}
      <MenuCard icon="↪" title="Sair" subtitle="Encerrar esta sessão" onClick={onLogout} />
    </Stack>
  </Frame>;
}

export function EmployeeView({ route, navigate, navMode = 'employee', onLogout }: { route: AppRoute; navigate: Navigate; navMode?: NavigationMode; onLogout?: () => void }) {
  switch (route) {
    case routes.tasks.menu: return <TaskMenuView navigate={navigate} navMode={navMode} onLogout={onLogout} />;
    case routes.tasks.today: return <TodayTasksView navigate={navigate} />;
    case routes.tasks.all: return <TodayTasksView navigate={navigate} initialScope="all" />;
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
