export const routes = {
  tasks: {
    today: 'tasks/today',
    all: 'tasks/all',
    pendingDetails: 'tasks/details/pending',
    takeover: 'tasks/takeover',
    complete: 'tasks/complete',
    markNotDone: 'tasks/mark-not-done',
    completedDetails: 'tasks/details/completed',
    completionSaving: 'tasks/complete/saving',
    completionError: 'tasks/complete/error',
    correction: 'tasks/correction',
    updateConflict: 'tasks/update-conflict',
    correctionRestricted: 'tasks/correction/restricted',
    empty: 'tasks/empty',
  },
  history: {
    daily: 'history/daily',
    closedDay: 'history/closed-day',
  },
  management: {
    dashboard: 'management/dashboard',
    menu: 'management/menu',
    taskCatalog: 'management/tasks',
    taskCreateDetails: 'management/tasks/create/details',
    assigneeSelection: 'management/tasks/create/assignee',
    taskCreateDate: 'management/tasks/create/date',
    taskCreateRules: 'management/tasks/create/rules',
    taskEditConfirmation: 'management/tasks/edit/confirmation',
    users: 'management/users',
    userEdit: 'management/users/edit',
    userReassignment: 'management/users/reassignment',
    tasksByDate: 'management/tasks/by-date',
    unitSettings: 'management/unit/settings',
    taskCreateReview: 'management/tasks/create/review',
    taskCreated: 'management/tasks/created',
    history: 'management/history',
    previousDayDetails: 'management/history/previous-day',
    previousDayTaskDetails: 'management/history/previous-day/task',
    historyFilters: 'management/history/filters',
    previousDaySummary: 'management/dashboard/previous-day',
    currentDaySummary: 'management/dashboard/current-day',
    unitSelection: 'management/unit/select',
    taskCopy: 'management/tasks/copy',
    taskCopyCreated: 'management/tasks/copy/created',
  },
  owner: {
    menu: 'owner/menu',
  },
  audit: {
    events: 'audit/events',
    eventDetails: 'audit/events/details',
    executionCorrection: 'audit/corrections/execution',
    correctionRegistered: 'audit/corrections/registered',
    mediaRetention: 'audit/media',
    evidenceReplacement: 'audit/media/replace',
    expiredEvidence: 'audit/media/expired',
  },
} as const;

type Values<T> = T[keyof T];

export type AppRoute =
  | Values<typeof routes.tasks>
  | Values<typeof routes.history>
  | Values<typeof routes.management>
  | Values<typeof routes.owner>
  | Values<typeof routes.audit>;

export const validRoutes = new Set<AppRoute>([
  ...Object.values(routes.tasks),
  ...Object.values(routes.history),
  ...Object.values(routes.management),
  ...Object.values(routes.owner),
  ...Object.values(routes.audit),
]);

export const employeeRoutes = new Set<AppRoute>([
  ...Object.values(routes.tasks),
  ...Object.values(routes.history),
]);

export const managementRoutes = new Set<AppRoute>(Object.values(routes.management));
