import { useQuery } from '@tanstack/react-query'
import { getTodayTasks } from '../api/tasks.ts'

export const taskQueryKeys = {
  today: ['tasks', 'today'] as const,
}

export function useTodayTasksQuery(enabled = true) {
  return useQuery({
    queryKey: taskQueryKeys.today,
    queryFn: getTodayTasks,
    enabled,
  })
}
