import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { isValidMonth } from '../utils/date';
import {
  copyTask,
  createTask,
  createUser,
  getAssignableUsers,
  getCurrentDaySummary,
  getCurrentDayTask,
  getHistoryDay,
  getHistoryTask,
  getManagementDashboard,
  getManagementHistory,
  getTask,
  getTaskCatalog,
  getTasksByDate,
  getUnitSettings,
  getUsers,
  getUser,
  getUserReassignmentSummary,
  reassignUserTasks,
  resetUserPassword,
  updateTask,
  updateUnitSettings,
  updateUser,
} from '../api/management';
import type {
  CopyTaskInput,
  CreateTaskInput,
  CreateUserInput,
  HistoryDayFilters,
  TaskCatalogParams,
  UnitSettings,
  UpdateTaskInput,
  UpdateUserInput,
  ReassignUserTasksInput,
} from '../api/management';

export const managementQueryKeys = {
  all: ['management'] as const,
  taskCatalog: (params: TaskCatalogParams) => [...managementQueryKeys.all, 'task-catalog', params] as const,
  task: (taskId: string) => [...managementQueryKeys.all, 'task', taskId] as const,
  assignableUsers: (search: string) => [...managementQueryKeys.all, 'assignable-users', search] as const,
  users: (search: string) => [...managementQueryKeys.all, 'users', search] as const,
  user: (userId: string) => [...managementQueryKeys.all, 'user', userId] as const,
  userReassignment: (userId: string) => [...managementQueryKeys.all, 'user-reassignment', userId] as const,
  tasksByDate: (date: string) => [...managementQueryKeys.all, 'tasks-by-date', date] as const,
  history: (month: string) => [...managementQueryKeys.all, 'history', month] as const,
  historyDay: (filters: HistoryDayFilters) => [...managementQueryKeys.all, 'history-day', filters] as const,
  dashboard: (unitId: string) => [...managementQueryKeys.all, 'dashboard', unitId] as const,
  currentDaySummary: () => [...managementQueryKeys.all, 'current-day-summary'] as const,
  currentDayTask: (taskId: string) => [...managementQueryKeys.all, 'current-day-task', taskId] as const,
  historyTask: (taskId: string) => [...managementQueryKeys.all, 'history-task', taskId] as const,
  unitSettings: () => [...managementQueryKeys.all, 'unit-settings'] as const,
};

export function useManagementDashboardQuery(unitId: string) {
  return useQuery({ queryKey: managementQueryKeys.dashboard(unitId), queryFn: () => getManagementDashboard(unitId) });
}

export function useTaskCatalogQuery(params: TaskCatalogParams) {
  return useQuery({ queryKey: managementQueryKeys.taskCatalog(params), queryFn: () => getTaskCatalog(params), enabled: isValidMonth(params.month) });
}

export function useTaskQuery(taskId: string) {
  return useQuery({ queryKey: managementQueryKeys.task(taskId), queryFn: () => getTask(taskId), enabled: Boolean(taskId) });
}

export function useAssignableUsersQuery(search: string) {
  return useQuery({ queryKey: managementQueryKeys.assignableUsers(search), queryFn: () => getAssignableUsers(search) });
}

export function useUsersQuery(search: string) {
  return useQuery({ queryKey: managementQueryKeys.users(search), queryFn: () => getUsers(search) });
}

export function useUserQuery(userId: string) {
  return useQuery({ queryKey: managementQueryKeys.user(userId), queryFn: () => getUser(userId), enabled: Boolean(userId) });
}

export function useUserReassignmentQuery(userId: string) {
  return useQuery({ queryKey: managementQueryKeys.userReassignment(userId), queryFn: () => getUserReassignmentSummary(userId), enabled: Boolean(userId) });
}

export function useTasksByDateQuery(date: string) {
  return useQuery({ queryKey: managementQueryKeys.tasksByDate(date), queryFn: () => getTasksByDate(date) });
}

export function useManagementHistoryQuery(month: string) {
  return useQuery({ queryKey: managementQueryKeys.history(month), queryFn: () => getManagementHistory(month) });
}

export function useCurrentDaySummaryQuery() {
  return useQuery({ queryKey: managementQueryKeys.currentDaySummary(), queryFn: getCurrentDaySummary });
}

export function useCurrentDayTaskQuery(taskId: string) {
  return useQuery({ queryKey: managementQueryKeys.currentDayTask(taskId), queryFn: () => getCurrentDayTask(taskId), enabled: Boolean(taskId) });
}

export function useHistoryDayQuery(filters: HistoryDayFilters) {
  return useQuery({ queryKey: managementQueryKeys.historyDay(filters), queryFn: () => getHistoryDay(filters) });
}

export function useHistoryTaskQuery(taskId: string) {
  return useQuery({ queryKey: managementQueryKeys.historyTask(taskId), queryFn: () => getHistoryTask(taskId), enabled: Boolean(taskId) });
}

export function useUnitSettingsQuery() {
  return useQuery({ queryKey: managementQueryKeys.unitSettings(), queryFn: getUnitSettings });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => createTask(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: managementQueryKeys.all }),
  });
}

export function useUpdateTaskMutation(taskId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateTaskInput) => updateTask(taskId, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: managementQueryKeys.all }),
  });
}

export function useCopyTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CopyTaskInput) => copyTask(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: managementQueryKeys.all }),
  });
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateUserInput) => createUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: managementQueryKeys.all }),
  });
}

export function useUpdateUserMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateUserInput) => updateUser(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: managementQueryKeys.all }),
  });
}

export function useResetUserPasswordMutation() {
  return useMutation({ mutationFn: resetUserPassword });
}

export function useUpdateUnitSettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UnitSettings) => updateUnitSettings(input),
    onSuccess: (settings) => queryClient.setQueryData(managementQueryKeys.unitSettings(), settings),
  });
}

export function useReassignUserTasksMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: ReassignUserTasksInput) => reassignUserTasks(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: managementQueryKeys.all }),
  });
}
