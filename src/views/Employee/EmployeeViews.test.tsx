import { QueryClientProvider } from '@tanstack/react-query'
import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import * as api from '../../api/tasks'
import { routes } from '../../navigation'
import { useTaskStore } from '../../stores/tasks'
import { createQueryTestContext } from '../../test/query'
import { render } from '../../test/render'
import { EmployeeView } from './EmployeeViews'

let context: ReturnType<typeof createQueryTestContext>
beforeEach(() => {
  context = createQueryTestContext()
  useTaskStore.setState(useTaskStore.getInitialState(), true)
})
afterEach(() => {
  context.queryClient.clear()
  useTaskStore.setState(useTaskStore.getInitialState(), true)
})

it.each([
  ['pending', false, routes.tasks.pendingDetails],
  ['done', false, routes.tasks.completedDetails],
  ['pending', true, routes.tasks.takeover],
] as const)('opens the correct action for a %s task with takeover=%s', async (status, canTakeOver, destination) => {
  const task: api.TodayTask = { id: 'selected-task', title: 'Conferir estoque', dueLabel: '12:00', assigneeLabel: 'André', assignmentType: 'personal', isAssignedToCurrentUser: true, canTakeOver, status }
  vi.spyOn(api, 'getTodayTasks').mockResolvedValue({ tasks: [task], dateLabel: 'Hoje', summary: { done: 0, pending: 1, notDone: 0 } })
  const navigate = vi.fn()
  const user = userEvent.setup()
  render(<QueryClientProvider client={context.queryClient}><EmployeeView route={routes.tasks.today} navigate={navigate} /></QueryClientProvider>)
  await user.click(await screen.findByText('Conferir estoque'))
  expect(useTaskStore.getState().selectedTaskId).toBe('selected-task')
  expect(navigate).toHaveBeenCalledWith(destination)
})

it('requires evidence, sends the draft, and clears it after successful completion', async () => {
  const task = await api.getTask('task-bench-cleaning')
  vi.spyOn(api, 'getTask').mockResolvedValue({ ...task!, evidenceLabel: 'Foto obrigatória' })
  const complete = vi.spyOn(api, 'completeTask')
  useTaskStore.getState().updateExecutionDraft({ comment: 'Bancada limpa' })
  const navigate = vi.fn()
  const user = userEvent.setup()
  const { container } = render(<QueryClientProvider client={context.queryClient}><EmployeeView route={routes.tasks.complete} navigate={navigate} /></QueryClientProvider>)
  const confirm = screen.getByRole('button', { name: /CONFIRMAR CONCLUSÃO/ })
  await waitFor(() => expect(confirm).toBeDisabled())
  // Mantine FileButton renders a hidden native input without an accessible label.
  const input = container.querySelector<HTMLInputElement>('input[type="file"]')!
  await user.upload(input, new File(['photo'], 'bancada.jpg', { type: 'image/jpeg' }))
  expect(confirm).toBeEnabled()
  await user.click(confirm)
  await waitFor(() => expect(navigate).toHaveBeenCalledWith(routes.tasks.completedDetails))
  expect(complete).toHaveBeenCalledWith({ taskId: 'task-bench-cleaning', comment: 'Bancada limpa', evidenceName: 'bancada.jpg' }, expect.anything())
  expect(useTaskStore.getState().executionDraft).toEqual({ comment: '' })
})

it('requires a nonblank reason before marking a task as not done', async () => {
  const mark = vi.spyOn(api, 'markTaskNotDone')
  const navigate = vi.fn()
  const user = userEvent.setup()
  render(<QueryClientProvider client={context.queryClient}><EmployeeView route={routes.tasks.markNotDone} navigate={navigate} /></QueryClientProvider>)
  const confirm = screen.getByRole('button', { name: /CONFIRMAR COMO NÃO FEITA/ })
  expect(confirm).toBeDisabled()
  const reason = screen.getByPlaceholderText('Descreva o que impediu a execução')
  await user.type(reason, '   ')
  expect(confirm).toBeDisabled()
  await user.clear(reason)
  await user.type(reason, 'Falta de insumo')
  await user.click(confirm)
  await waitFor(() => expect(navigate).toHaveBeenCalledWith(routes.history.daily))
  expect(mark).toHaveBeenCalledWith({ taskId: 'task-bench-cleaning', reason: 'Falta de insumo' }, expect.anything())
})
