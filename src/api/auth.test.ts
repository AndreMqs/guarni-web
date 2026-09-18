import { expect, test } from 'vitest'
import { login } from './auth.ts'

test('returns the temporary response using the confirmed login contract', async () => {
  await expect(
    login({ username: 'andre.silva', password: 'senha-segura-123' }),
  ).resolves.toEqual({ accessToken: 'mock-access-token' })
})
