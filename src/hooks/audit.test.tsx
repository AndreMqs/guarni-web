import { act, renderHook, waitFor } from '@testing-library/react'
import { afterEach, beforeEach, expect, it, vi } from 'vitest'
import * as api from '../api/audit'
import { createQueryTestContext } from '../test/query'
import { auditQueryKeys, useAuditEventQuery, useAuditMediaQuery, useLatestAuditCorrectionQuery, useReplaceEvidenceMutation, useCorrectExecutionMutation } from './audit'

let context: ReturnType<typeof createQueryTestContext>
beforeEach(() => { context = createQueryTestContext() })
afterEach(() => { context.queryClient.clear() })

it('does not request an event before selection', () => {
  const fetch = vi.spyOn(api, 'getAuditEvent')
  const { result } = renderHook(() => useAuditEventQuery(''), { wrapper: context.wrapper })
  expect(result.current.fetchStatus).toBe('idle')
  expect(fetch).not.toHaveBeenCalled()
})

it('refreshes media and correction receipt after evidence replacement', async () => {
  const { result } = renderHook(() => ({ media: useAuditMediaQuery('all'), receipt: useLatestAuditCorrectionQuery(), replace: useReplaceEvidenceMutation() }), { wrapper: context.wrapper })
  await waitFor(() => {
    expect(result.current.media.isSuccess).toBe(true)
    expect(result.current.receipt.isSuccess).toBe(true)
  })
  await act(async () => { await result.current.replace.mutateAsync({ evidenceName: 'nova-evidencia.jpg', correctionReason: 'Foto corrigida' }) })
  await waitFor(() => {
    expect(result.current.media.data).toEqual(expect.arrayContaining([expect.objectContaining({ name: 'nova-evidencia.jpg' })]))
    expect(result.current.receipt.data?.correction).toMatchObject({ evidenceName: 'nova-evidencia.jpg', correctionReason: 'Foto corrigida' })
  })
})

it('invalidates audit events after execution correction', async () => {
  const key = auditQueryKeys.events({ category: 'all' })
  context.queryClient.setQueryData(key, [])
  const { result } = renderHook(() => useCorrectExecutionMutation(), { wrapper: context.wrapper })
  await act(async () => { await result.current.mutateAsync({ newReason: 'Manutenção', correctionReason: 'Confirmado' }) })
  expect(context.queryClient.getQueryState(key)?.isInvalidated).toBe(true)
})

it('retains the receipt and exposes errors when evidence replacement fails', async () => {
  const key = auditQueryKeys.latestCorrection()
  context.queryClient.setQueryData(key, { original: 'preserved' })
  vi.spyOn(api, 'replaceEvidence').mockRejectedValue(new Error('offline'))
  const { result } = renderHook(() => useReplaceEvidenceMutation(), { wrapper: context.wrapper })
  await act(async () => { await expect(result.current.mutateAsync({ evidenceName: 'foto.jpg', correctionReason: 'Correção' })).rejects.toThrow('offline') })
  await waitFor(() => expect(result.current.isError).toBe(true))
  expect(context.queryClient.getQueryData(key)).toEqual({ original: 'preserved' })
  expect(context.queryClient.getQueryState(key)?.isInvalidated).toBe(false)
})
