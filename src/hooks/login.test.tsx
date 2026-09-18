import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { renderHook, waitFor } from '@testing-library/react'
import type { ReactNode } from 'react'
import { expect, test, vi } from 'vitest'
import * as authApi from '../api/auth.ts'
import { useLoginMutation } from './login.ts'

test('delegates login to the API layer', async () => {
  const loginSpy = vi.spyOn(authApi, 'login')
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false } },
  })
  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
  const { result } = renderHook(() => useLoginMutation(), { wrapper })
  const credentials = {
    username: 'andre.silva',
    password: 'senha-segura-123',
  }

  result.current.mutate(credentials)

  await waitFor(() => expect(result.current.isSuccess).toBe(true))
  expect(loginSpy).toHaveBeenCalledWith(credentials, expect.anything())
  expect(result.current.data).toEqual({ accessToken: 'mock-access-token' })

  queryClient.clear()
})
