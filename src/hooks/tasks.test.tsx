import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import * as api from '../api/tasks'
import { createQueryTestContext } from '../test/query'
import { taskQueryKeys, useCompleteTaskMutation, useDailyHistoryQuery, useTaskQuery, useTodayTasksQuery } from './tasks'

let context: ReturnType<typeof createQueryTestContext>
beforeEach(() => { context = createQueryTestContext() })
afterEach(() => { context.queryClient.clear() })

describe('task queries', () => {
  it('keeps results for different filters in separate cache entries', async () => {
    const fetch = vi.spyOn(api, 'getTodayTasks')
    const { result, rerender } = renderHook(({ scope }: { scope: api.TaskScope }) => useTodayTasksQuery({ scope }), {
      wrapper: context.wrapper, initialProps: { scope: 'mine' },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    const mine = result.current.data
    rerender({ scope: 'general' })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(fetch).toHaveBeenCalledWith({ scope: 'general' })
    expect(result.current.data?.tasks.length).toBeGreaterThan(0)
    expect(result.current.data?.tasks.every(task => task.assignmentType === 'general')).toBe(true)
    expect(context.queryClient.getQueryData(taskQueryKeys.today({ scope: 'mine' }))).toEqual(mine)
  })

  it('does not request details without a selected task', () => {
    const fetch = vi.spyOn(api, 'getTask')
    const { result } = renderHook(() => useTaskQuery(''), { wrapper: context.wrapper })
    expect(result.current.fetchStatus).toBe('idle')
    expect(fetch).not.toHaveBeenCalled()
  })

  it('respects disabled list and history queries', () => {
    const today = vi.spyOn(api, 'getTodayTasks')
    const history = vi.spyOn(api, 'getDailyHistory')
    renderHook(() => {
      useTodayTasksQuery({ scope: 'all' }, false)
      useDailyHistoryQuery({}, false)
    }, { wrapper: context.wrapper })
    expect(today).not.toHaveBeenCalled()
    expect(history).not.toHaveBeenCalled()
  })

  it('exposes a request failure without retrying', async () => {
    const error = new Error('offline')
    const fetch = vi.spyOn(api, 'getTask').mockRejectedValue(error)
    const { result } = renderHook(() => useTaskQuery('task-1'), { wrapper: context.wrapper })
    await waitFor(() => expect(result.current.error).toBe(error))
    expect(fetch).toHaveBeenCalledTimes(1)
  })
})

describe('task completion', () => {
  it('refreshes mounted task details after completing a task', async () => {
    const taskId = 'task-bench-cleaning'
    const { result } = renderHook(() => ({ task: useTaskQuery(taskId), complete: useCompleteTaskMutation() }), { wrapper: context.wrapper })
    await waitFor(() => expect(result.current.task.isSuccess).toBe(true))
    await act(async () => { await result.current.complete.mutateAsync({ taskId, comment: 'Concluído', evidenceName: 'foto.jpg' }) })
    await waitFor(() => expect(result.current.task.data).toMatchObject({ status: 'done', comment: 'Concluído', evidenceName: 'foto.jpg' }))
  })

  it('preserves cached data when saving fails', async () => {
    const key = taskQueryKeys.details('task-1')
    const previous = { id: 'task-1', status: 'pending' }
    context.queryClient.setQueryData(key, previous)
    const error = new Error('offline')
    vi.spyOn(api, 'completeTask').mockRejectedValue(error)
    const { result } = renderHook(() => useCompleteTaskMutation(), { wrapper: context.wrapper })
    await act(async () => { await expect(result.current.mutateAsync({ taskId: 'task-1' })).rejects.toBe(error) })
    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(context.queryClient.getQueryData(key)).toEqual(previous)
    expect(context.queryClient.getQueryState(key)?.isInvalidated).toBe(false)
  })
})
