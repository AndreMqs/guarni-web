import { expect, test } from 'vitest'
import { getCurrentUserContext, login } from './auth.ts'

test('returns the temporary response using the confirmed login contract', async () => {
  await expect(
    login({ username: 'andre.silva', password: 'senha-segura-123' }),
  ).resolves.toEqual({ accessToken: 'mock-access-token', role: 'owner' })
})

test('provides distinct owner and employee demo profiles', async () => {
  expect(await login({ username: 'demo.funcionario', password: 'demonstracao123' })).toMatchObject({ role: 'employee' })
  expect(await getCurrentUserContext()).toMatchObject({ roleLabel: 'Funcionário', username: 'demo.funcionario' })
  expect(await login({ username: 'demo', password: 'demonstracao123' })).toMatchObject({ role: 'owner' })
  expect(await getCurrentUserContext()).toMatchObject({ roleLabel: 'Dono' })
})

test('rejects an incorrect password for the employee demo', async () => {
  await expect(login({ username: 'demo.funcionario', password: 'senha-incorreta' })).rejects.toThrow('INVALID_CREDENTIALS')
})
