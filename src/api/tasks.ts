export type TaskScope = 'mine' | 'general' | 'all';
export type TaskStatus = 'pending' | 'done' | 'notDone';
export type HistoryEventCategory = 'all' | 'execution' | 'assignment' | 'correction';

export type TodayTask = {
  id: string;
  title: string;
  dueLabel: string;
  evidenceLabel?: string;
  assigneeLabel: string;
  assignmentType: 'general' | 'personal';
  isAssignedToCurrentUser: boolean;
  canTakeOver: boolean;
  status: TaskStatus;
  isOverdue?: boolean;
  description?: string;
  executionDateLabel?: string;
  comment?: string;
  evidenceName?: string;
  completedByLabel?: string;
  timeline?: Array<{ title: string; meta: string }>;
};

export type TodayTasksParams = {
  scope: TaskScope;
  search?: string;
};

export type TodayTasksResponse = {
  dateLabel: string;
  summary: { done: number; pending: number; notDone: number };
  tasks: TodayTask[];
};

export type DailyHistoryEvent = {
  id: string;
  title: string;
  meta: string;
  category: Exclude<HistoryEventCategory, 'all'>;
};

export type DailyHistoryParams = {
  category?: HistoryEventCategory;
};

export type DailyHistoryResponse = {
  dateLabel: string;
  summary: { done: number; pending: number; notDone: number };
  events: DailyHistoryEvent[];
};

export type TakeOverTaskInput = { taskId: string; reason: string };
export type CompleteTaskInput = { taskId: string; comment?: string; evidenceName?: string };
export type MarkTaskNotDoneInput = { taskId: string; reason: string };
export type ClosedDayHistoryResponse = {
  dateLabel: string;
  closedAtLabel: string;
  task: {
    title: string;
    reason: string;
    recordedAtLabel: string;
  };
};

export type CorrectTaskExecutionInput = {
  taskId: string;
  status: Extract<TaskStatus, 'done' | 'notDone'>;
  comment?: string;
  reason: string;
  evidenceName?: string;
};

let historySequence = 6;
let mockTodayTasks: TodayTask[] = [
  { id: 'task-bench-cleaning', title: 'Higienizar bancada da cozinha', description: 'Limpe a superfície, os cantos e guarde os produtos após finalizar.', dueLabel: 'até 10:00', executionDateLabel: 'Hoje, 31 ago', evidenceLabel: 'Foto obrigatória', assigneeLabel: 'Você', assignmentType: 'personal', isAssignedToCurrentUser: true, canTakeOver: false, status: 'pending', isOverdue: true, timeline: [{ title: 'Tarefa atribuída', meta: '08:00 · Gerente' }] },
  { id: 'task-freezer-temperature', title: 'Conferir temperatura dos freezers', description: 'Registre a temperatura exibida no painel principal.', dueLabel: 'até 15:00', executionDateLabel: 'Hoje, 31 ago', evidenceLabel: 'Evidência opcional', assigneeLabel: 'Você', assignmentType: 'personal', isAssignedToCurrentUser: true, canTakeOver: false, status: 'done', comment: 'Temperatura registrada: -18°C', evidenceName: 'freezer.jpg', completedByLabel: 'Você', timeline: [{ title: 'Tarefa concluída', meta: '15:02 · Você' }, { title: 'Tarefa atribuída', meta: '08:00 · Gerente' }] },
  { id: 'task-dry-storage', title: 'Organizar estoque seco', description: 'Organize os insumos por validade e mantenha corredores livres.', dueLabel: 'sem horário', executionDateLabel: 'Hoje, 31 ago', evidenceLabel: 'Foto opcional', assigneeLabel: 'Você', assignmentType: 'personal', isAssignedToCurrentUser: true, canTakeOver: false, status: 'pending' },
  { id: 'task-dining-room', title: 'Limpar salão antes da abertura', dueLabel: 'até 11:00', executionDateLabel: 'Hoje, 31 ago', assigneeLabel: 'Geral', assignmentType: 'general', isAssignedToCurrentUser: false, canTakeOver: false, status: 'pending' },
  { id: 'task-opening-checklist', title: 'Conferir checklist de abertura', dueLabel: 'até 09:00', executionDateLabel: 'Hoje, 31 ago', assigneeLabel: 'Geral', assignmentType: 'general', isAssignedToCurrentUser: false, canTakeOver: false, status: 'done', completedByLabel: 'Marina Souza', comment: 'Abertura conferida sem divergências.', timeline: [{ title: 'Tarefa concluída', meta: '08:55 · Marina Souza' }] },
  { id: 'task-trash-area', title: 'Higienizar área de descarte', dueLabel: 'até 18:00', executionDateLabel: 'Hoje, 31 ago', assigneeLabel: 'Geral', assignmentType: 'general', isAssignedToCurrentUser: false, canTakeOver: false, status: 'notDone', comment: 'Área bloqueada para manutenção.' },
  { id: 'task-sauce-expiration', title: 'Conferir validade dos molhos', dueLabel: 'até 14:00', executionDateLabel: 'Hoje, 31 ago', assigneeLabel: 'Marina Souza', assignmentType: 'personal', isAssignedToCurrentUser: false, canTakeOver: true, status: 'done', completedByLabel: 'Marina Souza', timeline: [{ title: 'Tarefa concluída', meta: '13:40 · Marina Souza' }] },
  { id: 'task-cash-closing', title: 'Fotografar fechamento do caixa', dueLabel: 'até 23:30', executionDateLabel: 'Hoje, 31 ago', evidenceLabel: 'Foto obrigatória', assigneeLabel: 'Rafael Lima', assignmentType: 'personal', isAssignedToCurrentUser: false, canTakeOver: true, status: 'done', evidenceName: 'fechamento-caixa.jpg', completedByLabel: 'Rafael Lima', timeline: [{ title: 'Tarefa concluída', meta: '23:24 · Rafael Lima' }] },
];


const mockClosedDayHistory: ClosedDayHistoryResponse = {
  dateLabel: '31 ago',
  closedAtLabel: '03:00',
  task: {
    title: 'Fotografar fechamento do caixa',
    reason: 'Não concluída até o fechamento do dia',
    recordedAtLabel: '03:00 · Sistema · sem evidência',
  },
};

let mockDailyHistoryEvents: DailyHistoryEvent[] = [
  { id: 'history-1', title: 'Higienizar bancada — Feita', meta: '10:18 · André · 1 foto', category: 'execution' },
  { id: 'history-2', title: 'Conferir validade — Assumida', meta: '11:42 · Rafael assumiu de Marina', category: 'assignment' },
  { id: 'history-3', title: 'Organizar estoque — Não feita', meta: '14:05 · Motivo informado', category: 'execution' },
  { id: 'history-4', title: 'Limpar salão — Feita', meta: '15:20 · Marina · sem mídia', category: 'execution' },
  { id: 'history-5', title: 'Comentário adicionado', meta: '16:08 · Gerente · correção registrada', category: 'correction' },
];

function normalizeSearch(value = '') {
  return value.trim().toLocaleLowerCase('pt-BR');
}

function findTask(taskId: string) {
  const task = mockTodayTasks.find((item) => item.id === taskId);
  if (!task) throw new Error('TASK_NOT_FOUND');
  return task;
}

function addHistory(title: string, meta: string, category: DailyHistoryEvent['category']) {
  mockDailyHistoryEvents = [{ id: `history-${historySequence++}`, title, meta, category }, ...mockDailyHistoryEvents];
}

/** Mock do futuro endpoint de tarefas do dia. */
export async function getTodayTasks(params: TodayTasksParams): Promise<TodayTasksResponse> {
  const search = normalizeSearch(params.search);
  const tasks = mockTodayTasks.filter((task) => {
    const matchesScope = params.scope === 'all' || (params.scope === 'mine' && task.isAssignedToCurrentUser) || (params.scope === 'general' && task.assignmentType === 'general');
    const matchesSearch = !search || `${task.title} ${task.assigneeLabel}`.toLocaleLowerCase('pt-BR').includes(search);
    return matchesScope && matchesSearch;
  });

  const summary = mockTodayTasks.reduce(
    (acc, task) => ({ ...acc, [task.status]: acc[task.status] + 1 }),
    { done: 0, pending: 0, notDone: 0 },
  );

  return Promise.resolve({ dateLabel: 'Hoje, segunda-feira · 31 ago', summary, tasks: tasks.map((task) => ({ ...task })) });
}


export async function getTask(taskId: string): Promise<TodayTask | undefined> {
  const task = mockTodayTasks.find((item) => item.id === taskId);
  return Promise.resolve(task ? { ...task } : undefined);
}

export async function getDailyHistory(params: DailyHistoryParams = {}): Promise<DailyHistoryResponse> {
  const category = params.category ?? 'all';
  const events = category === 'all' ? mockDailyHistoryEvents : mockDailyHistoryEvents.filter((event) => event.category === category);
  const summary = mockTodayTasks.reduce(
    (acc, task) => ({ ...acc, [task.status]: acc[task.status] + 1 }),
    { done: 0, pending: 0, notDone: 0 },
  );
  return Promise.resolve({ dateLabel: 'Segunda-feira · 31 ago', summary, events: events.map((event) => ({ ...event })) });
}

export async function getClosedDayHistory(): Promise<ClosedDayHistoryResponse> {
  return Promise.resolve({ ...mockClosedDayHistory, task: { ...mockClosedDayHistory.task } });
}

export async function takeOverTask(input: TakeOverTaskInput): Promise<TodayTask> {
  const task = findTask(input.taskId);
  task.assigneeLabel = 'Você';
  task.isAssignedToCurrentUser = true;
  task.canTakeOver = false;
  addHistory(`${task.title} — Assumida`, `agora · Você · ${input.reason.trim()}`, 'assignment');
  return Promise.resolve({ ...task });
}

export async function completeTask(input: CompleteTaskInput): Promise<TodayTask> {
  const task = findTask(input.taskId);
  task.status = 'done';
  task.isOverdue = false;
  task.completedByLabel = 'Você';
  task.comment = input.comment?.trim() || undefined;
  task.evidenceName = input.evidenceName;
  task.timeline = [{ title: 'Tarefa concluída', meta: 'agora · Você' }, ...(task.timeline ?? [])];
  const evidenceMeta = input.evidenceName ? ` · ${input.evidenceName}` : '';
  const commentMeta = input.comment?.trim() ? ` · ${input.comment.trim()}` : '';
  addHistory(`${task.title} — Feita`, `agora · Você${evidenceMeta}${commentMeta}`, 'execution');
  return Promise.resolve({ ...task });
}

export async function markTaskNotDone(input: MarkTaskNotDoneInput): Promise<TodayTask> {
  const task = findTask(input.taskId);
  task.status = 'notDone';
  task.isOverdue = false;
  task.comment = input.reason.trim();
  task.timeline = [{ title: 'Marcada como não feita', meta: 'agora · Você · motivo informado' }, ...(task.timeline ?? [])];
  addHistory(`${task.title} — Não feita`, `agora · Você · ${input.reason.trim()}`, 'execution');
  return Promise.resolve({ ...task });
}

export async function correctTaskExecution(input: CorrectTaskExecutionInput): Promise<TodayTask> {
  const task = findTask(input.taskId);
  task.status = input.status;
  task.comment = input.comment?.trim() || task.comment;
  task.evidenceName = input.evidenceName ?? task.evidenceName;
  task.timeline = [{ title: 'Correção registrada', meta: `agora · Você · ${input.reason.trim()}` }, ...(task.timeline ?? [])];
  addHistory(`${task.title} — Correção registrada`, `agora · Você · ${input.reason.trim()}`, 'correction');
  return Promise.resolve({ ...task });
}
