export type TodayTask = {
  id: string
  title: string
  dueLabel: string
  evidenceLabel: string
}

export type TodayTasksResponse = {
  dateLabel: string
  summary: { done: number; pending: number; notDone: number }
  tasks: TodayTask[]
}

/** Mock temporário do futuro endpoint de tarefas do dia. */
export async function getTodayTasks(): Promise<TodayTasksResponse> {
  return Promise.resolve({
    ...mockTodayTasks,
    tasks: mockTodayTasks.tasks.map((task) => ({ ...task })),
  })
}
import { mockTodayTasks } from '../constants/today.ts'
