import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import * as api from '../api/management'
import { createQueryTestContext } from '../test/query'
import { managementQueryKeys, useCreateTaskMutation, useHistoryTaskQuery, useTaskQuery, useUnitSettingsQuery, useUpdateUnitSettingsMutation, useUserQuery, useUserReassignmentQuery } from './management'

let context: ReturnType<typeof createQueryTestContext>
beforeEach(() => { context = createQueryTestContext() })
afterEach(() => { context.queryClient.clear() })

it.each([
  ['task', useTaskQuery, 'getTask'],
  ['user', useUserQuery, 'getUser'],
  ['reassignment', useUserReassignmentQuery, 'getUserReassignmentSummary'],
  ['historical task', useHistoryTaskQuery, 'getHistoryTask'],
] as const)('does not fetch %s without an ID', (_name, useQueryHook, method) => {
  const fetch = vi.spyOn(api, method)
  const { result } = renderHook(() => useQueryHook(''), { wrapper: context.wrapper })
  expect(result.current.fetchStatus).toBe('idle')
  expect(fetch).not.toHaveBeenCalled()
})

it('invalidates management lists and dashboard after task creation', async () => {
  const keys = [managementQueryKeys.taskCatalog({ period: 'all' }), managementQueryKeys.dashboard('tatuape')]
  keys.forEach(key => context.queryClient.setQueryData(key, []))
  context.queryClient.setQueryData(['unrelated'], 'preserved')
  const { result } = renderHook(() => useCreateTaskMutation(), { wrapper: context.wrapper })
  await act(async () => {
    await result.current.mutateAsync({ title: 'Nova tarefa', assignmentType: 'general', executionDate: '2026-09-03', dueTime: '12:00', isEvidenceRequired: false, isCommentEnabled: true })
  })
  keys.forEach(key => expect(context.queryClient.getQueryState(key)?.isInvalidated).toBe(true))
  expect(context.queryClient.getQueryState(['unrelated'])?.isInvalidated).toBe(false)
})

it('updates settings shown by an active query without an extra fetch', async () => {
  const fetch = vi.spyOn(api, 'getUnitSettings')
  const { result } = renderHook(() => ({ query: useUnitSettingsQuery(), mutation: useUpdateUnitSettingsMutation() }), { wrapper: context.wrapper })
  await waitFor(() => expect(result.current.query.isSuccess).toBe(true))
  const settings = { name: 'Unidade Centro', timezone: 'America/Sao_Paulo', closingTime: '03:00' }
  await act(async () => { await result.current.mutation.mutateAsync(settings) })
  await waitFor(() => expect(result.current.query.data).toEqual(settings))
  expect(fetch).toHaveBeenCalledTimes(1)
})

it('preserves saved settings when an update fails', async () => {
  const saved = { name: 'Unidade Centro', timezone: 'America/Sao_Paulo', closingTime: '03:00' }
  context.queryClient.setQueryData(managementQueryKeys.unitSettings(), saved)
  vi.spyOn(api, 'updateUnitSettings').mockRejectedValue(new Error('offline'))
  const { result } = renderHook(() => useUpdateUnitSettingsMutation(), { wrapper: context.wrapper })
  await act(async () => { await expect(result.current.mutateAsync({ ...saved, name: 'Alterado' })).rejects.toThrow('offline') })
  expect(context.queryClient.getQueryData(managementQueryKeys.unitSettings())).toEqual(saved)
})
