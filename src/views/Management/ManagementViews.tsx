import { useEffect, useState } from 'react';
import type { HistoryTaskStatus, ManagementRole, TaskCatalogPeriod } from '../../api';
import {
  Avatar,
  BottomSheet,
  Button,
  Card,
  Checkbox,
  DetailRows,
  EmptyState,
  FormField,
  Frame,
  Group,
  MenuCard,
  Notice,
  PasswordField,
  ProgressBar,
  SearchField,
  Select,
  SelectionCard,
  Stack,
  StatusBadge,
  SuccessState,
  SummaryMetrics,
  Tabs,
  TaskCard,
  Text,
  TextArea,
  TextButton,
  TextInput,
  Timeline,
  Title,
  ToggleRow,
} from '../../components';
import {
  useAssignableUsersQuery,
  useCopyTaskMutation,
  useCreateTaskMutation,
  useCreateUserMutation,
  useCurrentDaySummaryQuery,
  useCurrentDayTaskQuery,
  useHistoryDayQuery,
  useHistoryTaskQuery,
  useManagementDashboardQuery,
  useManagementHistoryQuery,
  useTaskCatalogQuery,
  useTaskQuery,
  useTasksByDateQuery,
  useUnitSettingsQuery,
  useUpdateTaskMutation,
  useUpdateUnitSettingsMutation,
  useUpdateUserMutation,
  useUsersQuery,
  useUserQuery,
  useUserReassignmentQuery,
  useReassignUserTasksMutation,
} from '../../hooks';
import { routes, type AppRoute, type Navigate } from '../../navigation';
import { useManagementStore } from '../../stores';
import { getTodayDate, isValidMonth } from '../../utils/date';
import type { NavigationMode } from '../../navigation/types';

const periodByTab: Record<string, TaskCatalogPeriod> = {
  Todas: 'all',
  Hoje: 'today',
  Futuras: 'future',
  Passadas: 'past',
};

const tabByPeriod: Record<TaskCatalogPeriod, string> = {
  all: 'Todas',
  today: 'Hoje',
  future: 'Futuras',
  past: 'Passadas',
};

const managementTaskStatusPresentation = {
  pending: { label: 'Pendente', tone: 'pending' as const },
  done: { label: 'Feita', tone: 'done' as const },
  notDone: { label: 'Não feita', tone: 'danger' as const },
};

function ManagerDashboardView({ navigate, isUnitSelectionOpen = false, navMode }: { navigate: Navigate; isUnitSelectionOpen?: boolean; navMode: NavigationMode }) {
  const activeUnitId = useManagementStore((state) => state.activeUnitId);
  const setActiveUnit = useManagementStore((state) => state.setActiveUnit);
  const [draftUnitId, setDraftUnitId] = useState(activeUnitId);
  const { data, isLoading } = useManagementDashboardQuery(activeUnitId);

  useEffect(() => {
    setDraftUnitId(activeUnitId);
  }, [activeUnitId]);

  return (
    <Frame title={data?.activeUnit.name ?? 'Unidade'} action={data && data.units.length > 1 ? 'TROCAR' : undefined} onAction={() => navigate(routes.management.unitSelection)} navigate={navigate} bottomNav="today" navMode={navMode}>
      <Stack gap="lg">
        <MenuCard icon="✓" title="Executar tarefas" subtitle="Minhas tarefas, tarefas gerais e assumir atividades" onClick={() => navigate(routes.tasks.today)} />
        {isLoading ? <Text tone="muted">Carregando painel…</Text> : data && (
          <>
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Stack gap={2}><Title order={2}>Boa noite, {data.userName.split(' ')[0]}</Title><Text size="xs" tone="muted">{data.closingLabel}</Text></Stack>
              <Text size="xs" tone="success">{data.updatedAtLabel}</Text>
            </Group>

            <Card onClick={() => navigate(routes.management.previousDaySummary)}>
              <Stack><Group justify="space-between"><Text weight={700}>{data.previousDay.dateLabel}</Text><StatusBadge tone="neutral">Encerrado</StatusBadge></Group><Group justify="space-between"><Text size="sm">{data.previousDay.done} de {data.previousDay.total} tarefas feitas</Text><Text weight={700}>{data.previousDay.completionRate}%</Text></Group><ProgressBar value={data.previousDay.completionRate} /><Text size="xs" tone={data.previousDay.notDone ? 'danger' : 'success'}>{data.previousDay.notDone ? `${data.previousDay.notDone} tarefas precisam de revisão` : 'Sem pendências'}</Text><TextButton onClick={() => navigate(routes.management.previousDaySummary)}>Revisar dia anterior ›</TextButton></Stack>
            </Card>

            <Card onClick={() => navigate(routes.management.currentDaySummary)}>
              <Stack><Group justify="space-between"><Text weight={700}>{data.currentDay.dateLabel}</Text><StatusBadge tone="pending">Em andamento</StatusBadge></Group><Group justify="space-between"><Text size="sm">{data.currentDay.done} de {data.currentDay.total} tarefas feitas</Text><Text weight={700}>{data.currentDay.completionRate}%</Text></Group><ProgressBar value={data.currentDay.completionRate} /><Text size="xs" tone={data.currentDay.overdue ? 'warning' : 'muted'}>{data.currentDay.pending} pendentes · {data.currentDay.overdue} atrasada{data.currentDay.overdue === 1 ? '' : 's'}</Text><TextButton onClick={() => navigate(routes.management.currentDaySummary)}>Ver tarefas pendentes ›</TextButton></Stack>
            </Card>

            <MenuCard icon="◷" title="Outros dias" subtitle="Consultar o histórico completo" onClick={() => navigate(routes.management.history)} />
          </>
        )}
      </Stack>

      {isUnitSelectionOpen && data && (
        <BottomSheet opened onClose={() => navigate(routes.management.dashboard)}>
          <Stack gap="lg">
            <Stack gap="xs"><Title order={2}>Trocar restaurante</Title><Text tone="muted">Veja rapidamente a situação de cada unidade.</Text></Stack>
            {data.units.map((unit) => (
              <SelectionCard key={unit.id} initials={unit.initials} title={unit.name} subtitle={`${unit.todayLabel} · ${unit.previousDayLabel}`} isSelected={draftUnitId === unit.id} onClick={() => setDraftUnitId(unit.id as 'tatuape' | 'liberdade')} />
            ))}
            <Button isFullWidth onClick={() => { setActiveUnit(draftUnitId); navigate(routes.management.dashboard); }}>ABRIR UNIDADE SELECIONADA</Button>
            <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.dashboard)}>CANCELAR</Button>
          </Stack>
        </BottomSheet>
      )}
    </Frame>
  );
}

function ManagementMenuView({ navigate, onLogout }: { navigate: Navigate; onLogout: () => void }) {
  const activeUnitId = useManagementStore((state) => state.activeUnitId);
  const { data } = useManagementDashboardQuery(activeUnitId);
  const initials = data?.userName.split(/\s+/).slice(0, 2).map((part) => part[0] ?? '').join('').toUpperCase() || '--';
  return (
    <Frame title="Mais" navigate={navigate} bottomNav="more" navMode="management">
      <Stack gap="lg">
        <MenuCard icon="✓" title="Executar tarefas" subtitle="Assumir e concluir tarefas da unidade" onClick={() => navigate(routes.tasks.today)} />
        <Card>
          <Group justify="space-between" wrap="nowrap">
            <Group wrap="nowrap"><Avatar initials={initials} /><Stack gap={0}><Text weight={700}>{data?.userName ?? 'Carregando…'}</Text><Text size="xs" tone="muted">{data ? `${data.roleLabel} · ${data.activeUnit.name}` : ''}</Text></Stack></Group>
            <Text>⌄</Text>
          </Group>
        </Card>
        <Stack><Text size="xs" tone="muted" weight={700}>GESTÃO</Text><MenuCard icon="✓" title="Cadastro de tarefas" subtitle="Criar, editar e copiar tarefas" onClick={() => navigate(routes.management.taskCatalog)} /><MenuCard icon="▦" title="Tarefas por data" subtitle="Consultar tarefas por data" onClick={() => navigate(routes.management.tasksByDate)} /><MenuCard icon="●" title="Usuários" subtitle="Papéis, acessos e responsáveis" onClick={() => navigate(routes.management.users)} /><MenuCard icon="⚙" title="Configurações" subtitle="Visão operacional da unidade" onClick={() => navigate(routes.management.unitSettings)} /></Stack>
        <Stack><Text size="xs" tone="muted" weight={700}>CONTA</Text><MenuCard icon="↪" title="Sair" subtitle="Encerrar esta sessão" onClick={onLogout} /></Stack>
      </Stack>
    </Frame>
  );
}

function TaskCatalogView({ navigate }: { navigate: Navigate }) {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState<TaskCatalogPeriod>('today');
  const [month, setMonth] = useState(() => getTodayDate().slice(0, 7));
  const setSelectedTaskId = useManagementStore((state) => state.setSelectedTaskId);
  const resetTaskDraft = useManagementStore((state) => state.resetTaskDraft);
  const { data: tasks = [], isLoading } = useTaskCatalogQuery({ period, search, month });

  return (
    <Frame title="Cadastro de tarefas" action="+ NOVA" onAction={() => { resetTaskDraft(); navigate(routes.management.taskCreateDetails); }} backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <SearchField placeholder="Buscar atividade" value={search} onChange={setSearch} />
        <TextInput label="Mês de execução" type="month" required value={month} onChange={(value) => {
          setMonth(value);
          if (period === 'today' && value !== getTodayDate().slice(0, 7)) setPeriod('all');
        }} />
        <Text size="xs" tone="muted">Os filtros e a busca consideram apenas o mês selecionado. Mais recentes primeiro.</Text>
        <Tabs items={['Todas', 'Hoje', 'Futuras', 'Passadas']} active={tabByPeriod[period]} onChange={(tab) => {
          const nextPeriod = periodByTab[tab] ?? 'today';
          setPeriod(nextPeriod);
          if (nextPeriod === 'today') setMonth(getTodayDate().slice(0, 7));
        }} />
        <Text size="xs" tone="muted">{isLoading ? 'Carregando tarefas…' : `${tasks.length} tarefas encontradas`}</Text>
        <Stack>
          {!isValidMonth(month) ? <EmptyState title="Selecione um mês" description="Escolha o mês de execução para consultar as tarefas." /> : !isLoading && tasks.length === 0 ? <EmptyState title="Nenhuma tarefa encontrada" description="Altere a busca ou o período selecionado." /> : tasks.map((task) => {
            const presentation = managementTaskStatusPresentation[task.status];
            return (
              <TaskCard key={task.id} title={task.title} status={presentation.label} tone={presentation.tone} due={task.dateLabel} assignee={task.assignee}
                action={<Group justify="space-between" style={{ marginTop: 10 }}><Text size="xs" tone="muted">Criada manualmente</Text><TextButton onClick={(event) => { event.stopPropagation(); setSelectedTaskId(task.id); navigate(routes.management.taskCopy); }}>COPIAR</TextButton></Group>}
                onClick={() => { setSelectedTaskId(task.id); navigate(routes.management.taskEditConfirmation); }} />
            );
          })}
        </Stack>
        <Text size="xs" tone="muted">Copiar cria outra tarefa independente na data escolhida.</Text>
      </Stack>
    </Frame>
  );
}

function TaskDetailsFormView({ navigate }: { navigate: Navigate }) {
  const taskDraft = useManagementStore((state) => state.taskDraft);
  const updateTaskDraft = useManagementStore((state) => state.updateTaskDraft);

  return (
    <Frame title="Cadastrar tarefa" backTo={routes.management.taskCatalog} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs">Etapa 1 de 3</Text><ProgressBar value={33} /><Title order={2}>Informações principais</Title>
        <FormField label="Título *"><TextInput value={taskDraft.title} onChange={(title) => updateTaskDraft({ title })} placeholder="Ex.: Higienizar bancada" /></FormField>
        <FormField label="Descrição (opcional)"><TextArea value={taskDraft.description} onChange={(description) => updateTaskDraft({ description })} placeholder="Explique o que deve ser feito" /></FormField>
        <Stack><Text size="sm" weight={600}>Tipo de atribuição</Text>
          <SelectionCard icon="✓" title="Geral" subtitle="Qualquer funcionário pode executar" isSelected={taskDraft.assignmentType === 'general'} onClick={() => updateTaskDraft({ assignmentType: 'general', assigneeId: undefined, assigneeName: undefined })} />
          <SelectionCard icon="○" title="Pessoal" subtitle="Exige um responsável específico" isSelected={taskDraft.assignmentType === 'personal'} onClick={() => { updateTaskDraft({ assignmentType: 'personal' }); navigate(routes.management.assigneeSelection); }} />
        </Stack>
        <Text size="xs" tone="muted">No MVP não há categoria, prioridade ou subtarefas.</Text>
        <Button isFullWidth disabled={!taskDraft.title.trim()} onClick={() => navigate(taskDraft.assignmentType === 'personal' ? routes.management.assigneeSelection : routes.management.taskCreateDate)}>CONTINUAR</Button>
      </Stack>
    </Frame>
  );
}

function AssigneeSelectionView({ navigate }: { navigate: Navigate }) {
  const [search, setSearch] = useState('');
  const taskDraft = useManagementStore((state) => state.taskDraft);
  const updateTaskDraft = useManagementStore((state) => state.updateTaskDraft);
  const { data: users = [], isLoading } = useAssignableUsersQuery(search);

  return (
    <Frame title="Responsável" action="CONFIRMAR" onAction={() => taskDraft.assigneeId && navigate(routes.management.taskCreateDate)} backTo={routes.management.taskCreateDetails} navigate={navigate}>
      <Stack gap="lg">
        <Stack gap="xs"><Text size="xs" tone="muted" weight={700}>ATIVIDADE PESSOAL</Text><Title order={2}>Escolha um usuário ativo</Title></Stack>
        <SearchField placeholder="Buscar por nome ou usuário" value={search} onChange={setSearch} />
        <Stack>{isLoading ? <Text size="sm" tone="muted">Carregando usuários…</Text> : users.length === 0 ? <EmptyState title="Nenhum usuário encontrado" description="Tente outro nome ou username." /> : users.map((user) => (
          <SelectionCard key={user.id} initials={user.initials} title={user.name} subtitle={`${user.role} · ${user.isActive ? 'Ativo' : 'Inativo'}`} isSelected={taskDraft.assigneeId === user.id} onClick={() => updateTaskDraft({ assignmentType: 'personal', assigneeId: user.id, assigneeName: user.name })} />
        ))}</Stack>
        <Button isFullWidth disabled={!taskDraft.assigneeId} onClick={() => navigate(routes.management.taskCreateDate)}>CONFIRMAR RESPONSÁVEL</Button>
        <Text size="xs" tone="muted">A lista exibe somente usuários ativos da unidade.</Text>
      </Stack>
    </Frame>
  );
}

function TaskDateFormView({ navigate }: { navigate: Navigate }) {
  const taskDraft = useManagementStore((state) => state.taskDraft);
  const updateTaskDraft = useManagementStore((state) => state.updateTaskDraft);
  return (
    <Frame title="Cadastrar tarefa" backTo={taskDraft.assignmentType === 'personal' ? routes.management.assigneeSelection : routes.management.taskCreateDetails} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs">Etapa 2 de 3</Text><ProgressBar value={66} /><Title order={2}>Quando executar?</Title>
        <FormField label="Data de execução *"><TextInput type="date" value={taskDraft.executionDate} onChange={(executionDate) => updateTaskDraft({ executionDate })} /></FormField>
        <Text size="xs" tone="muted">Escolha hoje ou outra data para esta tarefa.</Text>
        <Notice tone="warning">Para repetir uma tarefa depois, use Copiar tarefa.</Notice>
        <Button isFullWidth disabled={!taskDraft.executionDate} onClick={() => navigate(routes.management.taskCreateRules)}>CONTINUAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskRulesFormView({ navigate }: { navigate: Navigate }) {
  const taskDraft = useManagementStore((state) => state.taskDraft);
  const updateTaskDraft = useManagementStore((state) => state.updateTaskDraft);
  const { data: settings, isError } = useUnitSettingsQuery();
  const dueTime = taskDraft.dueTime || settings?.closingTime || '';
  return (
    <Frame title="Cadastrar tarefa" backTo={routes.management.taskCreateDate} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs">Etapa 3 de 3</Text><ProgressBar value={100} /><Title order={2}>Regras de execução</Title>
        <TextInput label="Horário limite" type="time" value={dueTime} onChange={(dueTime) => updateTaskDraft({ dueTime })} />
        <Text size="xs" tone="muted">Por padrão, usamos o horário de fechamento da unidade.</Text>
        {isError && <Notice tone="danger">Não foi possível carregar o horário de fechamento.</Notice>}
        <ToggleRow title="Evidência obrigatória" subtitle="Exigir uma foto para concluir" enabled={taskDraft.isEvidenceRequired} onChange={(isEvidenceRequired) => updateTaskDraft({ isEvidenceRequired })} />
        <ToggleRow title="Comentário do executor" subtitle="Campo opcional na conclusão" enabled={taskDraft.isCommentEnabled} onChange={(isCommentEnabled) => updateTaskDraft({ isCommentEnabled })} />
        <Text size="xs" tone="muted">Se a evidência não for obrigatória, a tarefa poderá ser concluída sem mídia. “Não feita” sempre exige justificativa.</Text>
        <Button isFullWidth disabled={!dueTime} onClick={() => { updateTaskDraft({ dueTime }); navigate(routes.management.taskCreateReview); }}>✓ &nbsp; REVISAR TAREFA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCreateDate)}>VOLTAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskEditView({ navigate }: { navigate: Navigate }) {
  const taskId = useManagementStore((state) => state.selectedTaskId);
  const { data: task } = useTaskQuery(taskId);
  const [dueTime, setDueTime] = useState('15:00');
  const [isEvidenceRequired, setIsEvidenceRequired] = useState(true);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const mutation = useUpdateTaskMutation(taskId);

  useEffect(() => {
    if (!task) return;
    setDueTime(task.dueTime ?? '15:00');
    setIsEvidenceRequired(task.isEvidenceRequired ?? false);
  }, [task]);

  const save = async () => {
    await mutation.mutateAsync({ dueTime, isEvidenceRequired });
    setIsConfirmationOpen(false);
    navigate(routes.management.taskCatalog);
  };

  return (
    <Frame title="Editar tarefa" backTo={routes.management.taskCatalog} navigate={navigate}>
      <Stack gap="lg">
        <Title order={2}>{task?.title ?? 'Tarefa'}</Title>
        <FormField label="Horário limite"><TextInput type="time" value={dueTime} onChange={setDueTime} /></FormField>
        <ToggleRow title="Evidência obrigatória" subtitle="Exigir uma foto para concluir" enabled={isEvidenceRequired} onChange={setIsEvidenceRequired} />
        <Button isFullWidth disabled={!task} onClick={() => setIsConfirmationOpen(true)}>SALVAR ALTERAÇÕES</Button>
      </Stack>
      <BottomSheet opened={isConfirmationOpen} onClose={() => setIsConfirmationOpen(false)}>
        <Stack gap="lg"><Stack gap="xs"><Title order={2}>Aplicar alterações?</Title><Text tone="muted">As mudanças serão aplicadas somente a esta tarefa pendente.</Text></Stack><Notice tone="success"><Stack gap={2}><Text weight={700}>Histórico preservado</Text><Text size="sm">Outras tarefas e registros de execução não serão modificados.</Text></Stack></Notice>{mutation.isError && <Notice tone="danger">Não foi possível salvar as alterações.</Notice>}<Button isFullWidth isLoading={mutation.isPending} onClick={() => void save()}>CONFIRMAR ALTERAÇÕES</Button><Button variant="secondary" isFullWidth onClick={() => setIsConfirmationOpen(false)}>CANCELAR</Button></Stack>
      </BottomSheet>
    </Frame>
  );
}

function UsersView({ navigate }: { navigate: Navigate }) {
  const [search, setSearch] = useState('');
  const setSelectedUserId = useManagementStore((state) => state.setSelectedUserId);
  const { data: users = [], isLoading } = useUsersQuery(search);

  return (
    <Frame title="Usuários" action="+ NOVO" onAction={() => navigate(routes.management.userCreate)} backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <SearchField placeholder="Buscar usuário" value={search} onChange={setSearch} />
        <Text size="xs" tone="muted">{isLoading ? 'Carregando usuários…' : `${users.filter((user) => user.isActive).length} usuários ativos`}</Text>
        <Stack>
          {!isLoading && users.length === 0 ? (
            <EmptyState title="Nenhum usuário encontrado" description="Tente outro nome, username ou papel." />
          ) : users.map((user) => (
            <SelectionCard
              key={user.id}
              initials={user.initials}
              title={user.name}
              subtitle={`${user.role} · ${user.isActive ? 'Ativo' : 'Inativo'}`}
              onClick={() => { setSelectedUserId(user.id); navigate(routes.management.userEdit); }}
            />
          ))}
        </Stack>
        <Notice tone="warning">A unidade deve manter pelo menos um dono ativo.</Notice>
      </Stack>
    </Frame>
  );
}

function CreateUserView({ navigate }: { navigate: Navigate }) {
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<ManagementRole>('Funcionário');
  const mutation = useCreateUserMutation();
  const roles: Array<{ title: ManagementRole; subtitle: string }> = [
    { title: 'Funcionário', subtitle: 'Executa e consulta tarefas' },
    { title: 'Gerente', subtitle: 'Gerencia atividades, usuários e configurações' },
    { title: 'Dono', subtitle: 'Inclui permissões de auditoria de negócio' },
  ];

  const save = async () => {
    await mutation.mutateAsync({ name, username, password, role });
    navigate(routes.management.users);
  };

  return (
    <Frame title="Novo usuário" backTo={routes.management.users} navigate={navigate}>
      <Stack gap="lg">
        <FormField label="Nome *"><TextInput value={name} onChange={setName} placeholder="Nome completo" /></FormField>
        <FormField label="Usuário *"><TextInput value={username} onChange={setUsername} placeholder="Nome de acesso" /></FormField>
        <PasswordField label="Senha *" value={password} onChange={(event) => setPassword(event.currentTarget.value)} isRequired autoComplete="new-password" />
        <Stack>
          <Text size="sm" weight={600}>Papel na unidade</Text>
          {roles.map((item) => <SelectionCard key={item.title} icon={role === item.title ? '✓' : '○'} title={item.title} subtitle={item.subtitle} isSelected={role === item.title} onClick={() => setRole(item.title)} />)}
        </Stack>
        {mutation.isError && <Notice tone="danger">Não foi possível cadastrar o usuário. Verifique se o username já está em uso.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!name.trim() || !username.trim() || !password.trim()} onClick={() => void save()}>CADASTRAR USUÁRIO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.users)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function EditUserView({ navigate }: { navigate: Navigate }) {
  const userId = useManagementStore((state) => state.selectedUserId);
  const { data: user } = useUserQuery(userId);
  const [draftRole, setRole] = useState<ManagementRole>();
  const role = draftRole ?? (user?.role === 'Funcionária' ? 'Funcionário' : user?.role) ?? 'Funcionário';
  const mutation = useUpdateUserMutation();
  const roles: Array<{ title: ManagementRole; subtitle: string }> = [
    { title: 'Funcionário', subtitle: 'Executa e consulta tarefas' },
    { title: 'Gerente', subtitle: 'Gerencia atividades, usuários e configurações' },
    { title: 'Dono', subtitle: 'Inclui permissões de auditoria de negócio' },
  ];

  const save = () => {
    if (!user) return;
    mutation.mutate({ userId: user.id, role, isActive: user.isActive }, { onSuccess: () => navigate(routes.management.users) });
  };

  return (
    <Frame title="Editar usuário" backTo={routes.management.users} navigate={navigate}>
      <Stack gap="lg">
        <Group wrap="nowrap"><Avatar initials={user?.initials ?? '--'} /><Stack gap={0}><Title order={2}>{user?.name ?? 'Carregando usuário…'}</Title><Text size="xs" tone="muted">{user?.username ?? ''}</Text></Stack></Group>
        <Stack>
          <Text size="sm" weight={600}>Papel na unidade</Text>
          {roles.map((item) => <SelectionCard key={item.title} icon={role === item.title ? '✓' : '○'} title={item.title} subtitle={item.subtitle} isSelected={role === item.title} onClick={() => setRole(item.title)} />)}
        </Stack>
        {user && <StatusBadge tone={user.isActive ? 'done' : 'neutral'}>{user.isActive ? 'Usuário ativo' : 'Usuário inativo'}</StatusBadge>}
        <Text size="xs" tone="muted">Papéis não são cumulativos. A interface e as permissões seguem o papel selecionado.</Text>
        {mutation.isError && <Notice tone="danger">Não foi possível salvar o usuário.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!user} onClick={() => void save()}>SALVAR USUÁRIO</Button>
        {user && <Button variant="secondary" isFullWidth disabled={mutation.isPending} onClick={() => navigate(user.isActive ? routes.management.userReassignment : routes.management.userReactivation)}>{user.isActive ? 'DESATIVAR ACESSO' : 'REATIVAR ACESSO'}</Button>}
      </Stack>
    </Frame>
  );
}

function UserReassignmentView({ navigate }: { navigate: Navigate }) {
  const userId = useManagementStore((state) => state.selectedUserId);
  const { data: user } = useUserQuery(userId);
  const { data: summary } = useUserReassignmentQuery(userId);
  const { data: users = [] } = useAssignableUsersQuery('');
  const [replacementUserId, setReplacementUserId] = useState('');
  const reassignMutation = useReassignUserTasksMutation();
  const updateUserMutation = useUpdateUserMutation();
  const candidates = users.filter((candidate) => candidate.id !== userId);
  const needsReassignment = (summary?.totalTasks ?? 0) > 0;

  const deactivate = async () => {
    if (!user || !summary) return;
    try {
      if (needsReassignment) {
        if (!replacementUserId) return;
        await reassignMutation.mutateAsync({ fromUserId: user.id, toUserId: replacementUserId });
      }
      await updateUserMutation.mutateAsync({ userId: user.id, role: user.role, isActive: false });
      navigate(routes.management.users);
    } catch {
      // Mutation state renders the error and keeps the review open for retry.
    }
  };

  return (
    <Frame title="Desativar usuário" backTo={routes.management.userEdit} navigate={navigate}>
      <Stack gap="lg">
        <Notice tone="warning"><Stack gap={2}><Text weight={700}>Antes de desativar {user?.name ?? 'o usuário'}</Text><Text size="sm">Reatribua as tarefas pendentes vinculadas a esta pessoa.</Text></Stack></Notice>
        <Title order={2}>Itens que exigem ação</Title>
        <Card><Group justify="space-between"><Stack gap={2}><Text weight={700}>{summary?.pendingTasks ?? 0} tarefas pendentes</Text><Text size="xs" tone="muted">Hoje e próximos dias</Text></Stack><StatusBadge tone={needsReassignment ? 'warning' : 'done'}>{needsReassignment ? 'Reatribuir' : 'Tudo certo'}</StatusBadge></Group></Card>
        <Card><Group justify="space-between"><Stack gap={2}><Text weight={700}>{summary?.futurePersonalTasks ?? 0} atividades pessoais futuras</Text><Text size="xs" tone="muted">Vinculadas diretamente ao usuário</Text></Stack></Group></Card>
        {needsReassignment && <FormField label="Novo responsável *"><Select value={replacementUserId} onChange={setReplacementUserId} options={[{ value: '', label: 'Selecione um usuário' }, ...candidates.map((candidate) => ({ value: candidate.id, label: candidate.name }))]} /></FormField>}
        {(reassignMutation.isError || updateUserMutation.isError) && <Notice tone="danger">Não foi possível concluir a desativação.</Notice>}
        <Button isFullWidth isLoading={reassignMutation.isPending || updateUserMutation.isPending} disabled={!user || !summary || (needsReassignment && !replacementUserId)} onClick={() => void deactivate()}>DESATIVAR ACESSO</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.userEdit)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function UserReactivationView({ navigate }: { navigate: Navigate }) {
  const userId = useManagementStore((state) => state.selectedUserId);
  const { data: user } = useUserQuery(userId);
  const mutation = useUpdateUserMutation();
  return (
    <Frame title="Reativar usuário" backTo={routes.management.userEdit} navigate={navigate}>
      <Stack gap="lg">
        <Notice tone="warning"><Stack gap={2}><Text weight={700}>Reativar acesso de {user?.name ?? 'usuário'}</Text><Text size="sm">Esta pessoa poderá acessar novamente a unidade com o papel abaixo. As tarefas reatribuídas permanecem com os responsáveis atuais.</Text></Stack></Notice>
        {user && <DetailRows rows={[{ label: 'Usuário', value: user.username }, { label: 'Papel na unidade', value: user.role }]} />}
        {mutation.isError && <Notice tone="danger">Não foi possível reativar o usuário. Tente novamente.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!user || user.isActive} onClick={() => {
          if (user) mutation.mutate({ userId: user.id, role: user.role, isActive: true }, { onSuccess: () => navigate(routes.management.users) });
        }}>CONFIRMAR REATIVAÇÃO</Button>
        <Button variant="secondary" isFullWidth disabled={mutation.isPending} onClick={() => navigate(routes.management.userEdit)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function TasksByDateView({ navigate }: { navigate: Navigate }) {
  const [date, setDate] = useState(getTodayDate);
  const setSelectedTaskId = useManagementStore((state) => state.setSelectedTaskId);
  const { data: tasks = [], isLoading } = useTasksByDateQuery(date);
  return (
    <Frame title="Tarefas por data" action="▦" backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <FormField label="Data"><TextInput type="date" value={date} onChange={setDate} /></FormField>
        <Text size="xs" tone="muted">{isLoading ? 'Carregando tarefas…' : `${tasks.length} tarefas cadastradas`}</Text>
        <Stack>{!isLoading && tasks.length === 0 ? <EmptyState title="Nenhuma tarefa nesta data" description="Escolha outra data ou cadastre uma nova tarefa." /> : tasks.map((task) => <TaskCard key={task.id} title={task.title} due={task.dateLabel} assignee={task.assignee} evidence={task.evidenceLabel ?? 'Criada manualmente'} onClick={() => { setSelectedTaskId(task.id); navigate(routes.management.taskEditConfirmation); }} />)}</Stack>
        <Notice>Datas futuras são permitidas. Alterações ficam sempre vinculadas à tarefa concreta.</Notice>
      </Stack>
    </Frame>
  );
}

function UnitSettingsView({ navigate }: { navigate: Navigate }) {
  const { data: settings } = useUnitSettingsQuery();
  const [name, setName] = useState('');
  const [timezone, setTimezone] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const mutation = useUpdateUnitSettingsMutation();

  useEffect(() => {
    if (!settings) return;
    setName(settings.name);
    setTimezone(settings.timezone);
    setClosingTime(settings.closingTime);
  }, [settings]);

  const save = async () => {
    await mutation.mutateAsync({ name, timezone, closingTime });
    navigate(routes.management.menu);
  };

  return (
    <Frame title="Configurações" backTo={routes.management.menu} navigate={navigate}>
      <Stack gap="lg">
        <Text size="xs" tone="muted" weight={700}>UNIDADE</Text>
        <FormField label="Nome"><TextInput value={name} onChange={setName} /></FormField>
        <Stack gap="xs"><TextInput label="Fuso horário (somente leitura)" value={timezone} readOnly /><Text size="xs" tone="muted">O fuso horário da unidade é fixo e não pode ser alterado nesta tela.</Text></Stack>
        <Text size="xs" tone="muted" weight={700}>DIA OPERACIONAL</Text>
        <FormField label="Horário de fechamento *"><TextInput type="time" value={closingTime} onChange={setClosingTime} /></FormField>
        <Notice tone="warning"><Stack gap={2}><Text weight={700}>O que acontece no fechamento</Text><Text size="sm">Pendências viram “Não feita” automaticamente com o motivo padrão, preservando o histórico.</Text></Stack></Notice>
        <Text size="xs" tone="muted">Uma foto por execução. Disponível por 60 dias após o envio.</Text>
        {mutation.isError && <Notice tone="danger">Não foi possível salvar as configurações.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!settings || !name.trim() || !closingTime} onClick={() => void save()}>SALVAR CONFIGURAÇÕES</Button>
      </Stack>
    </Frame>
  );
}

function TaskReviewView({ navigate }: { navigate: Navigate }) {
  const taskDraft = useManagementStore((state) => state.taskDraft);
  const setSelectedTaskId = useManagementStore((state) => state.setSelectedTaskId);
  const mutation = useCreateTaskMutation();
  const { data: settings } = useUnitSettingsQuery();
  const dueTime = taskDraft.dueTime || settings?.closingTime || '';

  const create = async () => {
    if (!dueTime) return;
    const created = await mutation.mutateAsync({ ...taskDraft, dueTime });
    setSelectedTaskId(created.id);
    navigate(routes.management.taskCreated);
  };

  const assignmentLabel = taskDraft.assignmentType === 'general' ? 'Geral' : (taskDraft.assigneeName ?? 'Sem responsável');

  return (
    <Frame title="Revisar tarefa" action="EDITAR" onAction={() => navigate(routes.management.taskCreateDetails)} backTo={routes.management.taskCreateRules} navigate={navigate}>
      <Stack gap="lg">
        <Text tone="muted">Confira os dados antes de cadastrar.</Text>
        <Card><Stack><StatusBadge tone="pending">{taskDraft.assignmentType === 'general' ? 'Tarefa geral' : 'Tarefa pessoal'}</StatusBadge><Title order={2}>{taskDraft.title}</Title>{taskDraft.description && <Text size="sm">{taskDraft.description}</Text>}</Stack></Card>
        <Card><Stack><Title order={3}>Configuração</Title><DetailRows rows={[{ label: 'Atribuição', value: assignmentLabel }, { label: 'Data de execução', value: taskDraft.executionDate }, { label: 'Horário', value: dueTime || 'Carregando…' }, { label: 'Evidência', value: taskDraft.isEvidenceRequired ? 'Foto obrigatória' : 'Foto opcional' }]} /></Stack></Card>
        <Notice tone="success"><Stack gap={2}><Text weight={700}>Pronta para cadastrar</Text><Text size="sm">Uma nova tarefa será criada para a data escolhida, com status pendente.</Text></Stack></Notice>
        {mutation.isError && <Notice tone="danger">Não foi possível cadastrar a tarefa.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!taskDraft.title.trim() || !taskDraft.executionDate || !dueTime} onClick={() => void create()}>✓ &nbsp; CADASTRAR TAREFA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCreateRules)}>VOLTAR E AJUSTAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskCreatedView({ navigate }: { navigate: Navigate }) {
  const taskId = useManagementStore((state) => state.selectedTaskId);
  const resetTaskDraft = useManagementStore((state) => state.resetTaskDraft);
  const { data: task } = useTaskQuery(taskId);

  return (
    <Frame title="Cadastro concluído" navigate={navigate}>
      <SuccessState title="Tarefa cadastrada" description={task ? `“${task.title}” foi criada para ${task.dateLabel}.` : 'Tarefa cadastrada com sucesso.'}>
        <Stack style={{ width: '100%' }}>
          {task && <Card><DetailRows rows={[{ label: 'Data de execução', value: `${task.dateLabel}${task.dueTime ? ` · até ${task.dueTime}` : ''}` }, { label: 'Responsável', value: task.assignee }]} /></Card>}
          <Button isFullWidth onClick={() => navigate(routes.management.tasksByDate)}>VER TAREFA CADASTRADA</Button>
          <Button variant="secondary" isFullWidth onClick={() => { resetTaskDraft(); navigate(routes.management.taskCreateDetails); }}>CADASTRAR OUTRA TAREFA</Button>
          <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.menu)}>VOLTAR PARA GESTÃO</Button>
        </Stack>
      </SuccessState>
    </Frame>
  );
}

function ManagementHistoryView({ navigate, navMode }: { navigate: Navigate; navMode: NavigationMode }) {
  const [month, setMonth] = useState('2026-08');
  const [draftMonth, setDraftMonth] = useState('2026-08');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const { data, isLoading } = useManagementHistoryQuery(month);

  return (
    <Frame title="Histórico" action="FILTRAR" onAction={() => { setDraftMonth(month); setIsFilterOpen(true); }} navigate={navigate} bottomNav="history" navMode={navMode}>
      <Stack gap="lg">
        <Select
          value={month}
          onChange={setMonth}
          options={[
            { value: '2026-09', label: 'Setembro de 2026' },
            { value: '2026-08', label: 'Agosto de 2026' },
          ]}
          ariaLabel="Mês do histórico"
        />
        {data && <Stack><Title order={2}>Resumo dos dias anteriores</Title><SummaryMetrics values={[{ value: `${data.summary.completionRate}%`, label: 'concluídas', tone: 'success' }, { value: data.summary.notDone, label: 'não feitas', tone: 'danger' }, { value: data.summary.total, label: 'total' }]} /></Stack>}
        <Stack>
          <Title order={2}>Dias recentes</Title>
          {isLoading ? <Text size="sm" tone="muted">Carregando histórico…</Text> : data?.days.length ? data.days.map((day) => (
            <Card key={day.id} onClick={() => navigate(routes.management.previousDayDetails)}>
              <Stack gap="sm">
                <Group justify="space-between"><Text weight={700}>{day.dateLabel}</Text><Text weight={700}>{day.rate}%</Text></Group>
                <Group justify="space-between"><Text size="xs" tone="muted">{day.completed} de {day.total}</Text><Text size="xs" tone={day.notDone ? 'danger' : 'success'}>{day.notDone ? `${day.notDone} não feitas` : 'Sem pendências'}</Text></Group>
                <ProgressBar value={day.rate} />
              </Stack>
            </Card>
          )) : <EmptyState title="Sem histórico neste mês" description="Selecione outro período para consultar dias anteriores." />}
        </Stack>
      </Stack>
      <BottomSheet opened={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <Stack gap="lg">
          <Title order={2}>Filtrar histórico</Title>
          <FormField label="Mês">
            <Select
              value={draftMonth}
              onChange={setDraftMonth}
              options={[
                { value: '2026-09', label: 'Setembro de 2026' },
                { value: '2026-08', label: 'Agosto de 2026' },
              ]}
            />
          </FormField>
          <Button isFullWidth onClick={() => { setMonth(draftMonth); setIsFilterOpen(false); }}>APLICAR FILTRO</Button>
          <Button variant="secondary" isFullWidth onClick={() => { setDraftMonth('2026-08'); setMonth('2026-08'); setIsFilterOpen(false); }}>LIMPAR FILTRO</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

function PreviousDayDetailsView({ navigate, showFilters = false }: { navigate: Navigate; showFilters?: boolean }) {
  const allStatuses: HistoryTaskStatus[] = ['done', 'notDone', 'autoClosed'];
  const [filters, setFilters] = useState({ statuses: allStatuses, assigneeId: 'all' });
  const [draftStatuses, setDraftStatuses] = useState<HistoryTaskStatus[]>(allStatuses);
  const [draftAssigneeId, setDraftAssigneeId] = useState('all');
  const [isFilterOpen, setIsFilterOpen] = useState(showFilters);
  const setSelectedHistoryTaskId = useManagementStore((state) => state.setSelectedHistoryTaskId);
  const { data, isLoading } = useHistoryDayQuery(filters);

  const toggleStatus = (status: HistoryTaskStatus, checked: boolean) => {
    setDraftStatuses((current) => checked ? [...new Set([...current, status])] : current.filter((item) => item !== status));
  };

  const openFilters = () => {
    setDraftStatuses(filters.statuses);
    setDraftAssigneeId(filters.assigneeId);
    setIsFilterOpen(true);
  };

  const hasStatusFilter = filters.statuses.length !== allStatuses.length;
  const hasAssigneeFilter = filters.assigneeId !== 'all';
  const users = data?.users ?? [];

  return (
    <Frame title={data?.dateLabel ?? 'Histórico do dia'} action="FILTRAR" onAction={openFilters} backTo={routes.management.history} navigate={navigate}>
      <Stack gap="lg">
        <Group justify="space-between"><Text size="xs" tone="muted">{data ? `Dia encerrado às ${data.closedAtLabel}` : 'Carregando dia…'}</Text><StatusBadge tone="neutral">Encerrado</StatusBadge></Group>
        {data && <SummaryMetrics values={[{ value: data.summary.done, label: 'feitas', tone: 'success' }, { value: data.summary.notDone, label: 'não feitas', tone: 'danger' }, { value: data.summary.total, label: 'total' }]} />}
        <Stack gap="xs">
          <Group justify="space-between">
            <Button variant="secondary" size="sm" onClick={openFilters} aria-haspopup="dialog" aria-expanded={isFilterOpen}>
              Filtros{hasStatusFilter || hasAssigneeFilter ? ` (${Number(hasStatusFilter) + Number(hasAssigneeFilter)})` : ''}
            </Button>
            {(hasStatusFilter || hasAssigneeFilter) && <TextButton onClick={() => setFilters({ statuses: allStatuses, assigneeId: 'all' })}>Limpar filtros</TextButton>}
          </Group>
          <Text size="sm" tone="muted">
            Status: {hasStatusFilter ? filters.statuses.map((status) => ({ done: 'Feitas', notDone: 'Não feitas', autoClosed: 'Encerradas automaticamente' })[status]).join(', ') : 'todos'}
            {' · '}Responsável: {hasAssigneeFilter ? users.find((user) => user.id === filters.assigneeId)?.name ?? 'selecionado' : 'todos'}
          </Text>
        </Stack>
        <Stack>
          {isLoading ? <Text size="sm" tone="muted">Carregando tarefas…</Text> : data?.tasks.length ? data.tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              status={task.status === 'done' ? 'Feita' : task.status === 'notDone' ? 'Não feita' : 'Encerrada automaticamente'}
              tone={task.status === 'done' ? 'done' : 'danger'}
              due={task.timeLabel}
              assignee={task.assignee}
              onClick={() => { setSelectedHistoryTaskId(task.id); navigate(routes.management.previousDayTaskDetails); }}
            />
          )) : <EmptyState title="Nenhuma tarefa encontrada" description="Altere os filtros para consultar outras ocorrências." />}
        </Stack>
      </Stack>
      <BottomSheet opened={isFilterOpen} onClose={() => setIsFilterOpen(false)}>
        <Stack gap="lg">
          <Title order={2}>Filtrar histórico</Title>
          <Stack>
            <Text size="sm" weight={600}>Status</Text>
            <Checkbox label="Feitas" checked={draftStatuses.includes('done')} onChange={(checked) => toggleStatus('done', checked)} />
            <Checkbox label="Não feitas" checked={draftStatuses.includes('notDone')} onChange={(checked) => toggleStatus('notDone', checked)} />
            <Checkbox label="Pendentes encerradas automaticamente" checked={draftStatuses.includes('autoClosed')} onChange={(checked) => toggleStatus('autoClosed', checked)} />
          </Stack>
          <FormField label="Responsável">
            <Select value={draftAssigneeId} onChange={setDraftAssigneeId} options={[{ value: 'all', label: 'Todos os usuários' }, ...users.map((user) => ({ value: user.id, label: user.name }))]} />
          </FormField>
          <Button isFullWidth disabled={draftStatuses.length === 0} onClick={() => { setFilters({ statuses: draftStatuses, assigneeId: draftAssigneeId }); setIsFilterOpen(false); if (showFilters) navigate(routes.management.previousDayDetails); }}>APLICAR FILTROS</Button>
          <Button variant="secondary" isFullWidth onClick={() => { setDraftStatuses(allStatuses); setDraftAssigneeId('all'); setFilters({ statuses: allStatuses, assigneeId: 'all' }); setIsFilterOpen(false); if (showFilters) navigate(routes.management.previousDayDetails); }}>LIMPAR FILTROS</Button>
        </Stack>
      </BottomSheet>
    </Frame>
  );
}

function PreviousDayTaskDetailsView({ navigate }: { navigate: Navigate }) {
  const taskId = useManagementStore((state) => state.selectedHistoryTaskId);
  const { data: task, isLoading } = useHistoryTaskQuery(taskId);
  const statusLabel = task?.status === 'done' ? 'Feita' : task?.status === 'autoClosed' ? 'Encerrada automaticamente' : 'Não feita';
  const statusTone = task?.status === 'done' ? 'done' : 'danger';

  return (
    <Frame title="Detalhe da tarefa" action="⋯" backTo={routes.management.previousDayDetails} navigate={navigate}>
      <Stack gap="lg">
        {isLoading ? <Text tone="muted">Carregando tarefa…</Text> : task && (
          <>
            <StatusBadge tone={statusTone}>{statusLabel}</StatusBadge><Title order={2}>{task.title}</Title><Text size="xs" tone="muted">Encerrada às {task.timeLabel}</Text>
            {task.reason && <Notice tone="danger"><Stack gap={2}><Text weight={700}>Motivo informado</Text><Text size="sm">{task.reason}</Text></Stack></Notice>}
            <DetailRows rows={[{ label: 'Responsável', value: task.assignee }, { label: 'Evidência', value: task.evidenceLabel }]} />
            <Stack><Title order={3}>Histórico da ocorrência</Title><Timeline events={task.timeline} /></Stack>
            <Button variant="secondary" isFullWidth onClick={() => navigate(routes.audit.executionCorrection)}>CORRIGIR EXECUÇÃO</Button>
          </>
        )}
      </Stack>
    </Frame>
  );
}

function PreviousDaySummaryView({ navigate }: { navigate: Navigate }) {
  const activeUnitId = useManagementStore((state) => state.activeUnitId);
  const setSelectedHistoryTaskId = useManagementStore((state) => state.setSelectedHistoryTaskId);
  const { data: dashboard } = useManagementDashboardQuery(activeUnitId);
  const { data } = useHistoryDayQuery({ statuses: ['done', 'notDone', 'autoClosed'], assigneeId: 'all' });
  const attentionTasks = data?.tasks.filter((task) => task.status !== 'done') ?? [];
  return (
    <Frame title={dashboard?.previousDay.dateLabel ?? 'Dia anterior'} action="FILTRAR" onAction={() => navigate(routes.management.historyFilters)} backTo={routes.management.dashboard} navigate={navigate}>
      <Stack gap="lg">
        <Group justify="space-between"><Text size="xs">{dashboard?.activeUnit.name ?? 'Unidade'}</Text><Text size="xs" tone="muted">{data ? `Encerrado ${data.closedAtLabel}` : 'Carregando…'}</Text></Group>
        {data && <SummaryMetrics values={[{ value: data.summary.done, label: 'feitas', tone: 'success' }, { value: data.summary.notDone, label: 'não feitas', tone: 'danger' }, { value: data.summary.total, label: 'total' }]} />}
        {data && data.summary.notDone > 0 && <Notice tone="danger"><Stack gap={2}><Text weight={700}>O dia fechou com {data.summary.notDone} tarefas não feitas</Text><Text size="sm">Revise os motivos informados pela equipe.</Text></Stack></Notice>}
        <Title order={2}>Requer atenção</Title>
        {attentionTasks.length ? attentionTasks.map((task) => (
          <TaskCard key={task.id} title={task.title} status={task.status === 'autoClosed' ? 'Encerrada automaticamente' : 'Não feita'} tone="danger" due={task.timeLabel} assignee={task.assignee} onClick={() => { setSelectedHistoryTaskId(task.id); navigate(routes.management.previousDayTaskDetails); }} />
        )) : <Notice tone="success">Sem tarefas que exigem revisão</Notice>}
        {data && <Notice tone="success">{data.summary.done} tarefas concluídas</Notice>}
      </Stack>
    </Frame>
  );
}

function CurrentDaySummaryView({ navigate }: { navigate: Navigate }) {
  const { data, isLoading, isFetching, refetch } = useCurrentDaySummaryQuery();
  const selectTask = useManagementStore((state) => state.setSelectedTaskId);
  const openTask = (taskId: string) => { selectTask(taskId); navigate(routes.management.currentDayTaskDetails); };

  return (
    <Frame title={data?.dateLabel ?? "Hoje"} action="ATUALIZAR" onAction={() => void refetch()} backTo={routes.management.dashboard} navigate={navigate}>
      <Stack gap="lg">
        <Group justify="space-between"><Text tone="primary">Acompanhamento ao vivo</Text><Text tone="success">●</Text></Group>
        <Text size="xs" tone="muted">{data ? `${data.closingLabel} · atualizado ${data.updatedAtLabel}` : 'Carregando acompanhamento…'}{isFetching && !isLoading ? ' · atualizando…' : ''}</Text>
        {data && <SummaryMetrics values={[{ value: data.summary.done, label: 'feitas', tone: 'success' }, { value: data.summary.pending, label: 'pendentes' }, { value: data.summary.overdue, label: 'atrasada', tone: 'danger' }]} />}
        {data && <Stack gap="xs"><Group justify="space-between"><Text size="xs">{data.summary.completionRate}% concluído</Text><Text size="xs">{data.remainingTimeLabel}</Text></Group><ProgressBar value={data.summary.completionRate} /></Stack>}
        {data && <><Title order={2}>Precisa de atenção</Title><TaskCard title={data.attentionTask.title} status="Atrasada" tone="danger" due={data.attentionTask.dueLabel} assignee={data.attentionTask.assignee} onClick={() => openTask(data.attentionTask.id)} /></>}
        {data && <><Title order={2}>Ainda pendentes</Title>{data.pendingTasks.map((task) => <TaskCard key={task.id} title={task.title} due={task.dueLabel} assignee={task.assignee} evidence={task.evidenceLabel} onClick={() => openTask(task.id)} />)}</>}
      </Stack>
    </Frame>
  );
}

function CurrentDayTaskDetailsView({ navigate }: { navigate: Navigate }) {
  const taskId = useManagementStore((state) => state.selectedTaskId);
  const { data: task, isLoading, isError } = useCurrentDayTaskQuery(taskId);
  return (
    <Frame title="Detalhe da tarefa" backTo={routes.management.currentDaySummary} navigate={navigate}>
      <Stack gap="lg">
        {isLoading ? <Text tone="muted">Carregando tarefa…</Text> : isError ? <Notice tone="danger">Não foi possível carregar a tarefa.</Notice> : !task ? <EmptyState title="Tarefa não encontrada" description="Volte para Hoje e selecione uma tarefa." /> : <>
          <StatusBadge tone={task.isOverdue ? 'danger' : 'pending'}>{task.isOverdue ? 'Atrasada' : 'Pendente'}</StatusBadge>
          <Title order={2}>{task.title}</Title>
          <DetailRows rows={[{ label: 'Responsável', value: task.assignee }, { label: 'Horário limite', value: task.dueLabel }, { label: 'Evidência', value: task.evidenceLabel }]} />
          <Stack><Title order={3}>Histórico da ocorrência</Title><Timeline events={task.timeline} /></Stack>
        </>}
      </Stack>
    </Frame>
  );
}

function CopyTaskView({ navigate }: { navigate: Navigate }) {
  const sourceTaskId = useManagementStore((state) => state.selectedTaskId);
  const setSelectedTaskId = useManagementStore((state) => state.setSelectedTaskId);
  const { data: source } = useTaskQuery(sourceTaskId);
  const mutation = useCopyTaskMutation();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [executionDate, setExecutionDate] = useState(getTodayDate);
  const [isEvidenceRequired, setIsEvidenceRequired] = useState(true);

  useEffect(() => {
    if (!source) return;
    setTitle(source.title);
    setDescription(source.description ?? '');
    setIsEvidenceRequired(source.isEvidenceRequired ?? false);
  }, [source]);

  const copy = async () => {
    if (!source) return;
    const created = await mutation.mutateAsync({
      sourceTaskId: source.id,
      title,
      description,
      executionDate,
      assignmentType: source.assignee === 'Geral' ? 'general' : 'personal',
      assigneeId: source.assigneeId,
      assigneeName: source.assignee,
      isEvidenceRequired,
    });
    setSelectedTaskId(created.id);
    navigate(routes.management.taskCopyCreated);
  };

  return (
    <Frame title="Copiar tarefa" backTo={routes.management.taskCatalog} navigate={navigate}>
      <Stack gap="lg">
        <Text tone="muted">Revise os dados antes de criar a cópia.</Text>
        <TextInput label="Horário limite da tarefa original" type="time" value={source?.dueTime ?? ''} readOnly />
        <Text size="xs" tone="muted">A cópia mantém o horário limite da tarefa original.</Text>
        <FormField label="Título *"><TextInput value={title} onChange={setTitle} /></FormField>
        <FormField label="Descrição (opcional)"><TextArea value={description} onChange={setDescription} /></FormField>
        <FormField label="Data de execução *"><TextInput type="date" value={executionDate} onChange={setExecutionDate} /></FormField>
        <FormField label="Atribuição"><TextInput value={source?.assignee ?? ''} readOnly /></FormField>
        <Checkbox label="Exigir uma foto para concluir" checked={isEvidenceRequired} onChange={setIsEvidenceRequired} />
        <Text size="xs" tone="muted">A cópia começa pendente. Fotos, justificativas e histórico não são copiados.</Text>
        {mutation.isError && <Notice tone="danger">Não foi possível criar a cópia.</Notice>}
        <Button isFullWidth isLoading={mutation.isPending} disabled={!source || !title.trim() || !executionDate} onClick={() => void copy()}>CRIAR CÓPIA</Button>
        <Button variant="secondary" isFullWidth onClick={() => navigate(routes.management.taskCatalog)}>CANCELAR</Button>
      </Stack>
    </Frame>
  );
}

function TaskCopyCreatedView({ navigate }: { navigate: Navigate }) {
  const taskId = useManagementStore((state) => state.selectedTaskId);
  const { data: task } = useTaskQuery(taskId);
  return (
    <Frame title="Cópia criada" backTo={routes.management.taskCatalog} navigate={navigate}>
      <SuccessState title="Tarefa copiada" description={task ? `${task.title} · ${task.dateLabel} · ${task.assignee} · Status: Pendente` : 'A cópia foi criada com status pendente.'}>
        <Stack style={{ width: '100%' }}><Text size="xs" tone="muted" align="center">A tarefa original e seu histórico permanecem intactos.</Text><Button isFullWidth onClick={() => navigate(routes.management.taskCatalog)}>VER TAREFAS</Button></Stack>
      </SuccessState>
    </Frame>
  );
}

export function ManagementView({ route, navigate, onLogout, navMode = 'management' }: { route: AppRoute; navigate: Navigate; onLogout: () => void; navMode?: NavigationMode }) {
  switch (route) {
    case routes.management.dashboard: return <ManagerDashboardView navigate={navigate} navMode={navMode} />;
    case routes.management.menu: return <ManagementMenuView navigate={navigate} onLogout={onLogout} />;
    case routes.management.taskCatalog: return <TaskCatalogView navigate={navigate} />;
    case routes.management.taskCreateDetails: return <TaskDetailsFormView navigate={navigate} />;
    case routes.management.assigneeSelection: return <AssigneeSelectionView navigate={navigate} />;
    case routes.management.taskCreateDate: return <TaskDateFormView navigate={navigate} />;
    case routes.management.taskCreateRules: return <TaskRulesFormView navigate={navigate} />;
    case routes.management.taskEditConfirmation: return <TaskEditView navigate={navigate} />;
    case routes.management.users: return <UsersView navigate={navigate} />;
    case routes.management.userCreate: return <CreateUserView navigate={navigate} />;
    case routes.management.userEdit: return <EditUserView navigate={navigate} />;
    case routes.management.userReassignment: return <UserReassignmentView navigate={navigate} />;
    case routes.management.userReactivation: return <UserReactivationView navigate={navigate} />;
    case routes.management.tasksByDate: return <TasksByDateView navigate={navigate} />;
    case routes.management.unitSettings: return <UnitSettingsView navigate={navigate} />;
    case routes.management.taskCreateReview: return <TaskReviewView navigate={navigate} />;
    case routes.management.taskCreated: return <TaskCreatedView navigate={navigate} />;
    case routes.management.history: return <ManagementHistoryView navigate={navigate} navMode={navMode} />;
    case routes.management.previousDayDetails: return <PreviousDayDetailsView navigate={navigate} />;
    case routes.management.previousDayTaskDetails: return <PreviousDayTaskDetailsView navigate={navigate} />;
    case routes.management.historyFilters: return <PreviousDayDetailsView navigate={navigate} showFilters />;
    case routes.management.previousDaySummary: return <PreviousDaySummaryView navigate={navigate} />;
    case routes.management.currentDaySummary: return <CurrentDaySummaryView navigate={navigate} />;
    case routes.management.currentDayTaskDetails: return <CurrentDayTaskDetailsView navigate={navigate} />;
    case routes.management.unitSelection: return <ManagerDashboardView navigate={navigate} navMode={navMode} isUnitSelectionOpen />;
    case routes.management.taskCopy: return <CopyTaskView navigate={navigate} />;
    case routes.management.taskCopyCreated: return <TaskCopyCreatedView navigate={navigate} />;
    default: return null;
  }
}
