import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  completeTask,
  correctTaskExecution,
  getClosedDayHistory,
  getDailyHistory,
  getTask,
  getTodayTasks,
  markTaskNotDone,
  takeOverTask,
} from '../api/tasks';
import type {
  CompleteTaskInput,
  CorrectTaskExecutionInput,
  DailyHistoryParams,
  MarkTaskNotDoneInput,
  TakeOverTaskInput,
  TodayTasksParams,
} from '../api/tasks';

export const taskQueryKeys = {
  all: ['tasks'] as const,
  today: (params: TodayTasksParams) => [...taskQueryKeys.all, 'today', params] as const,
  history: (params: DailyHistoryParams) => [...taskQueryKeys.all, 'history', params] as const,
  closedDayHistory: () => [...taskQueryKeys.all, 'closed-day-history'] as const,
  details: (taskId: string) => [...taskQueryKeys.all, 'details', taskId] as const,
};

export function useTodayTasksQuery(params: TodayTasksParams, enabled = true) {
  return useQuery({ queryKey: taskQueryKeys.today(params), queryFn: () => getTodayTasks(params), enabled });
}

export function useTaskQuery(taskId: string) {
  return useQuery({ queryKey: taskQueryKeys.details(taskId), queryFn: () => getTask(taskId), enabled: Boolean(taskId) });
}

export function useDailyHistoryQuery(params: DailyHistoryParams = {}, enabled = true) {
  return useQuery({ queryKey: taskQueryKeys.history(params), queryFn: () => getDailyHistory(params), enabled });
}

export function useClosedDayHistoryQuery() {
  return useQuery({ queryKey: taskQueryKeys.closedDayHistory(), queryFn: getClosedDayHistory });
}

function useTaskMutation<TInput>(mutationFn: (input: TInput) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: taskQueryKeys.all }),
  });
}

export function useTakeOverTaskMutation() {
  return useTaskMutation<TakeOverTaskInput>(takeOverTask);
}

export function useCompleteTaskMutation() {
  return useTaskMutation<CompleteTaskInput>(completeTask);
}

export function useMarkTaskNotDoneMutation() {
  return useTaskMutation<MarkTaskNotDoneInput>(markTaskNotDone);
}

export function useCorrectTaskExecutionMutation() {
  return useTaskMutation<CorrectTaskExecutionInput>(correctTaskExecution);
}
