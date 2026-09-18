import { getTodayDate, isValidMonth } from '../utils/date';

export type TaskCatalogPeriod = 'all' | 'today' | 'future' | 'past';
export type ManagementTaskStatus = 'pending' | 'done' | 'notDone';
export type HistoryTaskStatus = 'done' | 'notDone' | 'autoClosed';
export type ManagementRole = 'Dono' | 'Gerente' | 'Funcionário' | 'Funcionária';

export type ManagementTask = {
  id: string;
  title: string;
  description?: string;
  executionDate: string;
  dateLabel: string;
  assignee: string;
  assigneeId?: string;
  status: ManagementTaskStatus;
  evidenceLabel?: string;
  dueTime?: string;
  isEvidenceRequired?: boolean;
  isCommentEnabled?: boolean;
};

export type TaskCatalogParams = {
  month: string;
  period: TaskCatalogPeriod;
  search?: string;
};

export type ManagementUser = {
  id: string;
  initials: string;
  name: string;
  username: string;
  role: ManagementRole;
  isActive: boolean;
};

export type CreateTaskInput = {
  title: string;
  description?: string;
  assignmentType: 'general' | 'personal';
  assigneeId?: string;
  assigneeName?: string;
  executionDate: string;
  dueTime: string;
  isEvidenceRequired: boolean;
  isCommentEnabled: boolean;
};

export type UpdateTaskInput = Partial<Omit<CreateTaskInput, 'assignmentType'>> & {
  assignmentType?: 'general' | 'personal';
};

export type CopyTaskInput = {
  sourceTaskId: string;
  title: string;
  description?: string;
  executionDate: string;
  assignmentType: 'general' | 'personal';
  assigneeId?: string;
  assigneeName?: string;
  isEvidenceRequired: boolean;
};

export type CreateUserInput = {
  name: string;
  username: string;
  password: string;
  role: ManagementRole;
};

export type UpdateUserInput = {
  userId: string;
  role: ManagementRole;
  isActive: boolean;
};

export type UserReassignmentSummary = {
  pendingTasks: number;
  futurePersonalTasks: number;
  totalTasks: number;
};

export type ReassignUserTasksInput = {
  fromUserId: string;
  toUserId: string;
};

export type UnitSettings = {
  name: string;
  timezone: string;
  closingTime: string;
};

export type ManagementDashboardResponse = {
  userName: string;
  roleLabel: string;
  activeUnit: { id: string; name: string };
  units: Array<{ id: string; name: string; initials: string; todayLabel: string; previousDayLabel: string }>;
  closingLabel: string;
  updatedAtLabel: string;
  previousDay: { dateLabel: string; done: number; total: number; completionRate: number; notDone: number };
  currentDay: { dateLabel: string; done: number; total: number; completionRate: number; pending: number; overdue: number };
};

export type CurrentDaySummaryResponse = {
  dateLabel: string;
  updatedAtLabel: string;
  closingLabel: string;
  remainingTimeLabel: string;
  summary: { done: number; pending: number; overdue: number; completionRate: number };
  attentionTask: { id: string; title: string; dueLabel: string; assignee: string };
  pendingTasks: Array<{ id: string; title: string; dueLabel: string; assignee: string; evidenceLabel?: string }>;
};

export type HistoryDay = {
  id: string;
  dateLabel: string;
  completed: number;
  total: number;
  rate: number;
  notDone: number;
};

export type HistoryDayTask = {
  id: string;
  title: string;
  status: HistoryTaskStatus;
  timeLabel: string;
  assignee: string;
};

export type HistoryDayFilters = {
  statuses: HistoryTaskStatus[];
  assigneeId: string;
};

export type HistoryDayResponse = {
  dateLabel: string;
  closedAtLabel: string;
  summary: { done: number; notDone: number; total: number };
  tasks: HistoryDayTask[];
  users: ManagementUser[];
};

export type HistoryTaskDetails = HistoryDayTask & {
  reason?: string;
  evidenceLabel: string;
  timeline: Array<{ title: string; meta: string }>;
};

export type CurrentDayTaskDetails = {
  id: string;
  title: string;
  assignee: string;
  dueLabel: string;
  isOverdue: boolean;
  evidenceLabel: string;
  timeline: Array<{ title: string; meta: string }>;
};

const mockCurrentDayTasks: CurrentDayTaskDetails[] = [
  { id: 'attention-1', title: 'Higienizar área de atendimento', dueLabel: '22:00', assignee: 'Marina Souza', isOverdue: true, evidenceLabel: 'Nenhuma evidência enviada', timeline: [{ title: 'Prazo de execução ultrapassado', meta: '22:00 · Tarefa ainda pendente' }, { title: 'Tarefa atribuída', meta: '18:00 · Marina Souza' }, { title: 'Tarefa cadastrada', meta: '17:30 · Gerente' }] },
  { id: 'pending-1', title: 'Conferir fechamento dos freezers', dueLabel: 'até 01:30', assignee: 'Rafael Lima', isOverdue: false, evidenceLabel: 'Nenhuma evidência enviada', timeline: [{ title: 'Tarefa atribuída', meta: '18:00 · Rafael Lima' }, { title: 'Tarefa cadastrada', meta: '17:30 · Gerente' }] },
  { id: 'pending-2', title: 'Organizar estoque seco', dueLabel: 'até 02:00', assignee: 'Geral', isOverdue: false, evidenceLabel: 'Nenhuma evidência enviada', timeline: [{ title: 'Tarefa disponibilizada para a equipe', meta: '17:30 · Gerente' }] },
];

export async function getCurrentDayTask(taskId: string): Promise<CurrentDayTaskDetails | undefined> {
  const task = mockCurrentDayTasks.find(item => item.id === taskId);
  return task ? { ...task, timeline: task.timeline.map(event => ({ ...event })) } : undefined;
}

let taskSequence = 7;
let userSequence = 9;
let mockTasks: ManagementTask[] = [
  { id: 'management-task-1', title: 'Higienizar bancada da cozinha', description: 'Limpar superfície e cantos antes da abertura.', executionDate: '2026-09-01', dateLabel: '1 set', assignee: 'Geral', status: 'pending', dueTime: '10:00', isEvidenceRequired: true, isCommentEnabled: true },
  { id: 'management-task-2', title: 'Conferir validade dos molhos', executionDate: '2026-09-01', dateLabel: '1 set', assignee: 'Marina Souza', assigneeId: 'user-marina', status: 'pending', dueTime: '15:00', isEvidenceRequired: true, isCommentEnabled: true },
  { id: 'management-task-3', title: 'Fotografar fechamento do caixa', executionDate: '2026-09-01', dateLabel: '1 set', assignee: 'Rafael Lima', assigneeId: 'user-rafael', status: 'pending', evidenceLabel: 'Foto obrigatória', dueTime: '23:30', isEvidenceRequired: true, isCommentEnabled: true },
  { id: 'management-task-4', title: 'Limpeza profunda do estoque', executionDate: '2026-08-30', dateLabel: '30 ago', assignee: 'Geral', status: 'done' },
  { id: 'management-task-5', title: 'Revisar temperatura da câmara fria', executionDate: '2026-09-02', dateLabel: '2 set', assignee: 'Carla Mendes', assigneeId: 'user-carla', status: 'pending' },
  { id: 'management-task-6', title: 'Conferir entrega de hortifruti', executionDate: '2026-08-29', dateLabel: '29 ago', assignee: 'João Vieira', assigneeId: 'user-joao', status: 'notDone' },
];

let mockUsers: ManagementUser[] = [
  { id: 'user-andre', initials: 'AC', name: 'André Câmara', username: 'andre', role: 'Dono', isActive: true },
  { id: 'user-carla', initials: 'CM', name: 'Carla Mendes', username: 'carla', role: 'Gerente', isActive: true },
  { id: 'user-marina', initials: 'MS', name: 'Marina Souza', username: 'marina', role: 'Funcionária', isActive: true },
  { id: 'user-rafael', initials: 'RL', name: 'Rafael Lima', username: 'rafael', role: 'Funcionário', isActive: true },
  { id: 'user-joao', initials: 'JV', name: 'João Vieira', username: 'joao', role: 'Funcionário', isActive: true },
  { id: 'user-bruno', initials: 'BS', name: 'Bruno Santos', username: 'bruno', role: 'Funcionário', isActive: true },
  { id: 'user-paula', initials: 'PF', name: 'Paula Freitas', username: 'paula', role: 'Funcionária', isActive: true },
  { id: 'user-lucas', initials: 'LM', name: 'Lucas Martins', username: 'lucas', role: 'Funcionário', isActive: true },
];

let mockUnitSettings: UnitSettings = {
  name: 'Restaurante Tatuapé',
  timezone: 'America/Sao_Paulo',
  closingTime: '03:00',
};

const mockManagementDashboards: Record<string, ManagementDashboardResponse> = {
  tatuape: {
    userName: 'André Câmara', roleLabel: 'Gerente', activeUnit: { id: 'tatuape', name: 'Restaurante Tatuapé' }, closingLabel: 'Fechamento operacional às 03:00', updatedAtLabel: 'Atualizado agora',
    units: [
      { id: 'tatuape', name: 'Restaurante Tatuapé', initials: 'RT', todayLabel: 'Hoje: 14 de 18 feitas', previousDayLabel: 'Ontem: 2 não feitas' },
      { id: 'liberdade', name: 'Restaurante Liberdade', initials: 'RL', todayLabel: 'Hoje: 17 de 20 feitas', previousDayLabel: 'Ontem: sem pendências' },
    ],
    previousDay: { dateLabel: 'Ontem · 31 ago', done: 16, total: 18, completionRate: 89, notDone: 2 },
    currentDay: { dateLabel: 'Hoje · 1 set', done: 14, total: 18, completionRate: 78, pending: 3, overdue: 1 },
  },
  liberdade: {
    userName: 'André Câmara', roleLabel: 'Gerente', activeUnit: { id: 'liberdade', name: 'Restaurante Liberdade' }, closingLabel: 'Fechamento operacional às 03:00', updatedAtLabel: 'Atualizado agora',
    units: [
      { id: 'tatuape', name: 'Restaurante Tatuapé', initials: 'RT', todayLabel: 'Hoje: 14 de 18 feitas', previousDayLabel: 'Ontem: 2 não feitas' },
      { id: 'liberdade', name: 'Restaurante Liberdade', initials: 'RL', todayLabel: 'Hoje: 17 de 20 feitas', previousDayLabel: 'Ontem: sem pendências' },
    ],
    previousDay: { dateLabel: 'Ontem · 31 ago', done: 20, total: 20, completionRate: 100, notDone: 0 },
    currentDay: { dateLabel: 'Hoje · 1 set', done: 17, total: 20, completionRate: 85, pending: 3, overdue: 0 },
  },
};

const mockHistoryDays: HistoryDay[] = [
  { id: '2026-08-30', dateLabel: 'Ontem · 30 ago', completed: 16, total: 18, rate: 89, notDone: 2 },
  { id: '2026-08-29', dateLabel: 'Sábado · 29 ago', completed: 14, total: 14, rate: 100, notDone: 0 },
  { id: '2026-08-28', dateLabel: 'Sexta-feira · 28 ago', completed: 19, total: 22, rate: 86, notDone: 3 },
];

const mockHistoryTasks: HistoryDayTask[] = [
  { id: 'history-task-1', title: 'Higienizar bancada da cozinha', status: 'done', timeLabel: '10:18', assignee: 'André Câmara' },
  { id: 'history-task-2', title: 'Organizar estoque seco', status: 'notDone', timeLabel: '14:05', assignee: 'Rafael Lima' },
  { id: 'history-task-3', title: 'Fotografar fechamento do caixa', status: 'done', timeLabel: '23:42', assignee: 'Marina Souza' },
  { id: 'history-task-4', title: 'Conferir lixeiras externas', status: 'autoClosed', timeLabel: '03:00', assignee: 'Geral' },
];

const mockHistoryTaskDetails: Record<string, HistoryTaskDetails> = {
  'history-task-1': { ...mockHistoryTasks[0], evidenceLabel: '1 foto', timeline: [{ title: 'Tarefa concluída', meta: '10:18 · André Câmara' }, { title: 'Tarefa atribuída', meta: '08:00 · Gerente' }] },
  'history-task-2': { ...mockHistoryTasks[1], reason: 'Faltou o produto de limpeza específico para finalizar a organização.', evidenceLabel: 'Nenhuma', timeline: [{ title: 'Marcada como não feita', meta: '14:05 · Rafael Lima · motivo informado' }, { title: 'Atribuída ao responsável', meta: '08:00 · Gerente' }] },
  'history-task-3': { ...mockHistoryTasks[2], evidenceLabel: 'fechamento.jpg', timeline: [{ title: 'Tarefa concluída', meta: '23:42 · Marina Souza' }] },
  'history-task-4': { ...mockHistoryTasks[3], reason: 'Não concluída até o fechamento do dia', evidenceLabel: 'Nenhuma', timeline: [{ title: 'Encerrada automaticamente', meta: '03:00 · Sistema' }] },
};

function normalizeSearch(value = '') {
  return value.trim().toLocaleLowerCase('pt-BR');
}

function formatDateLabel(date: string) {
  const [year, month, day] = date.split('-').map(Number);
  return new Intl.DateTimeFormat('pt-BR', { day: 'numeric', month: 'short' }).format(new Date(year, month - 1, day));
}

export async function getManagementDashboard(unitId: string): Promise<ManagementDashboardResponse> {
  const dashboard = mockManagementDashboards[unitId] ?? mockManagementDashboards.tatuape;
  return Promise.resolve({ ...dashboard, activeUnit: { ...dashboard.activeUnit }, units: dashboard.units.map((unit) => ({ ...unit })), previousDay: { ...dashboard.previousDay }, currentDay: { ...dashboard.currentDay } });
}

export async function getTaskCatalog(params: TaskCatalogParams): Promise<ManagementTask[]> {
  if (!isValidMonth(params.month)) throw new Error('Selecione um mês válido para consultar as tarefas.');
  const today = getTodayDate();
  const search = normalizeSearch(params.search);
  const tasks = mockTasks.filter((task) => {
    const matchesPeriod =
      params.period === 'all'
      || (params.period === 'today' && task.executionDate === today)
      || (params.period === 'future' && task.executionDate > today)
      || (params.period === 'past' && task.executionDate < today);
    const matchesSearch = !search || `${task.title} ${task.assignee}`.toLocaleLowerCase('pt-BR').includes(search);
    return task.executionDate.startsWith(`${params.month}-`) && matchesPeriod && matchesSearch;
  });
  return Promise.resolve(tasks.sort((a, b) => b.executionDate.localeCompare(a.executionDate)).map((task) => ({ ...task })));
}

export async function getAssignableUsers(search = ''): Promise<ManagementUser[]> {
  const normalizedSearch = normalizeSearch(search);
  return Promise.resolve(
    mockUsers
      .filter((user) => user.isActive)
      .filter((user) => !normalizedSearch || `${user.name} ${user.username}`.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
      .map((user) => ({ ...user })),
  );
}

export async function getUsers(search = ''): Promise<ManagementUser[]> {
  const normalizedSearch = normalizeSearch(search);
  return Promise.resolve(
    mockUsers
      .filter((user) => !normalizedSearch || `${user.name} ${user.username} ${user.role}`.toLocaleLowerCase('pt-BR').includes(normalizedSearch))
      .map((user) => ({ ...user })),
  );
}

export async function getTasksByDate(date: string): Promise<ManagementTask[]> {
  return Promise.resolve(mockTasks.filter((task) => task.executionDate === date).map((task) => ({ ...task })));
}

export async function getTask(taskId: string): Promise<ManagementTask | undefined> {
  const task = mockTasks.find((item) => item.id === taskId);
  return Promise.resolve(task ? { ...task } : undefined);
}

export async function createTask(input: CreateTaskInput): Promise<ManagementTask> {
  const task: ManagementTask = {
    id: `management-task-${taskSequence++}`,
    title: input.title.trim(),
    description: input.description?.trim() || undefined,
    executionDate: input.executionDate,
    dateLabel: formatDateLabel(input.executionDate),
    assignee: input.assignmentType === 'general' ? 'Geral' : (input.assigneeName ?? 'Sem responsável'),
    assigneeId: input.assignmentType === 'personal' ? input.assigneeId : undefined,
    status: 'pending',
    dueTime: input.dueTime,
    isEvidenceRequired: input.isEvidenceRequired,
    isCommentEnabled: input.isCommentEnabled,
    evidenceLabel: input.isEvidenceRequired ? 'Foto obrigatória' : 'Foto opcional',
  };
  mockTasks = [task, ...mockTasks];
  return Promise.resolve({ ...task });
}

export async function updateTask(taskId: string, input: UpdateTaskInput): Promise<ManagementTask> {
  const index = mockTasks.findIndex((task) => task.id === taskId);
  if (index < 0) throw new Error('TASK_NOT_FOUND');
  const current = mockTasks[index];
  const assignmentType = input.assignmentType ?? (current.assignee === 'Geral' ? 'general' : 'personal');
  const next: ManagementTask = {
    ...current,
    ...input,
    title: input.title?.trim() || current.title,
    description: input.description?.trim() || current.description,
    executionDate: input.executionDate ?? current.executionDate,
    dateLabel: input.executionDate ? formatDateLabel(input.executionDate) : current.dateLabel,
    assignee: assignmentType === 'general' ? 'Geral' : (input.assigneeName ?? current.assignee),
    assigneeId: assignmentType === 'general' ? undefined : (input.assigneeId ?? current.assigneeId),
    evidenceLabel: input.isEvidenceRequired === undefined ? current.evidenceLabel : input.isEvidenceRequired ? 'Foto obrigatória' : 'Foto opcional',
  };
  mockTasks[index] = next;
  return Promise.resolve({ ...next });
}

export async function copyTask(input: CopyTaskInput): Promise<ManagementTask> {
  const source = mockTasks.find((task) => task.id === input.sourceTaskId);
  if (!source) throw new Error('TASK_NOT_FOUND');
  return createTask({
    title: input.title,
    description: input.description,
    assignmentType: input.assignmentType,
    assigneeId: input.assigneeId,
    assigneeName: input.assigneeName,
    executionDate: input.executionDate,
    dueTime: source.dueTime ?? '',
    isEvidenceRequired: input.isEvidenceRequired,
    isCommentEnabled: source.isCommentEnabled ?? true,
  });
}


export async function createUser(input: CreateUserInput): Promise<ManagementUser> {
  const username = input.username.trim().toLocaleLowerCase('pt-BR');
  if (!input.name.trim() || !username || !input.password.trim()) throw new Error('INVALID_USER');
  if (mockUsers.some((user) => user.username.toLocaleLowerCase('pt-BR') === username)) throw new Error('USERNAME_ALREADY_EXISTS');

  const initials = input.name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('');
  const user: ManagementUser = {
    id: `user-${userSequence++}`,
    initials,
    name: input.name.trim(),
    username,
    role: input.role,
    isActive: true,
  };
  mockUsers = [...mockUsers, user];
  return Promise.resolve({ ...user });
}

export async function getUser(userId: string): Promise<ManagementUser | undefined> {
  const user = mockUsers.find((item) => item.id === userId);
  return Promise.resolve(user ? { ...user } : undefined);
}

export async function getUserReassignmentSummary(userId: string): Promise<UserReassignmentSummary> {
  const assignedTasks = mockTasks.filter((task) => task.assigneeId === userId && task.status === 'pending');
  const futurePersonalTasks = assignedTasks.filter((task) => task.executionDate > getTodayDate()).length;
  return Promise.resolve({
    pendingTasks: assignedTasks.length,
    futurePersonalTasks,
    totalTasks: assignedTasks.length,
  });
}

export async function reassignUserTasks(input: ReassignUserTasksInput): Promise<{ reassigned: number }> {
  const replacement = mockUsers.find((user) => user.id === input.toUserId && user.isActive);
  if (!replacement) throw new Error('REPLACEMENT_USER_NOT_FOUND');

  let reassigned = 0;
  mockTasks = mockTasks.map((task) => {
    if (task.assigneeId !== input.fromUserId || task.status !== 'pending') return task;
    reassigned += 1;
    return { ...task, assigneeId: replacement.id, assignee: replacement.name };
  });

  return Promise.resolve({ reassigned });
}

export async function updateUser(input: UpdateUserInput): Promise<ManagementUser> {
  const index = mockUsers.findIndex((user) => user.id === input.userId);
  if (index < 0) throw new Error('USER_NOT_FOUND');
  const next = { ...mockUsers[index], role: input.role, isActive: input.isActive };
  mockUsers[index] = next;
  return Promise.resolve({ ...next });
}

export async function getUnitSettings(): Promise<UnitSettings> {
  return Promise.resolve({ ...mockUnitSettings });
}

export async function updateUnitSettings(input: UnitSettings): Promise<UnitSettings> {
  mockUnitSettings = { ...input };
  return Promise.resolve({ ...mockUnitSettings });
}

export async function getManagementHistory(month: string): Promise<{ summary: { completionRate: number; notDone: number; total: number }; days: HistoryDay[] }> {
  if (month !== '2026-08') {
    return Promise.resolve({ summary: { completionRate: 0, notDone: 0, total: 0 }, days: [] });
  }
  return Promise.resolve({
    summary: { completionRate: 84, notDone: 11, total: 142 },
    days: mockHistoryDays.map((day) => ({ ...day })),
  });
}

export async function getHistoryDay(filters: HistoryDayFilters): Promise<HistoryDayResponse> {
  const tasks = mockHistoryTasks.filter((task) => {
    const matchesStatus = filters.statuses.includes(task.status);
    const assignee = mockUsers.find((user) => user.id === filters.assigneeId)?.name;
    const matchesAssignee = filters.assigneeId === 'all' || task.assignee === assignee;
    return matchesStatus && matchesAssignee;
  });
  const notDone = mockHistoryTasks.filter((task) => task.status !== 'done').length;
  return Promise.resolve({
    dateLabel: 'Domingo, 30 ago',
    closedAtLabel: '03:00',
    summary: { done: mockHistoryTasks.length - notDone, notDone, total: mockHistoryTasks.length },
    tasks: tasks.map((task) => ({ ...task })),
    users: mockUsers.map((user) => ({ ...user })),
  });
}

export async function getHistoryTask(taskId: string): Promise<HistoryTaskDetails | undefined> {
  const task = mockHistoryTaskDetails[taskId];
  return Promise.resolve(task ? { ...task, timeline: task.timeline.map((event) => ({ ...event })) } : undefined);
}

export async function getCurrentDaySummary(): Promise<CurrentDaySummaryResponse> {
  return Promise.resolve({
    dateLabel: 'Hoje · 1 set',
    updatedAtLabel: 'agora',
    closingLabel: 'Fecha às 03:00',
    remainingTimeLabel: 'faltam 2h 18m',
    summary: { done: 14, pending: 3, overdue: 1, completionRate: 78 },
    attentionTask: { ...mockCurrentDayTasks[0] },
    pendingTasks: mockCurrentDayTasks.slice(1).map(task => ({ ...task })),
  });
}
