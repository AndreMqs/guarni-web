import { passwordSchema, type LoginCredentials } from '../schemas/auth'
import type { NavigationMode } from '../navigation/types'
import { mockAccounts } from './mockAccounts'

export type LoginResponse = { accessToken: string; role: NavigationMode }
export type CurrentUserContext = { id: string; name: string; username: string; roleLabel: string; unitName: string; initials: string }
export type ChangePasswordInput = { currentPassword: string; newPassword: string }
let currentUsername: string | undefined

/** Mock authentication, with existing development aliases preserved. */
export async function login(credentials: LoginCredentials): Promise<LoginResponse> {
  const username = credentials.username.trim().toLowerCase()
  let account = mockAccounts.get(username)
  if (!account) {
    const role = username.includes('func') ? 'employee' : username.includes('ger') ? 'management' : 'owner'
    account = { id: `alias-${username}`, username, name: username, initials: username.slice(0, 2).toUpperCase(), role, roleLabel: role === 'owner' ? 'Dono' : role === 'management' ? 'Gerente' : 'Funcionário', isActive: true, password: credentials.password }
    mockAccounts.set(username, account)
  }
  if (!account.isActive || account.password !== credentials.password) throw new Error('INVALID_CREDENTIALS')
  currentUsername = username
  return { accessToken: 'mock-access-token', role: account.role }
}

export function endMockSession() { currentUsername = undefined }

export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  const account = mockAccounts.get(currentUsername ?? 'demo')!
  return { id: account.id, name: account.name, username: account.username, roleLabel: account.roleLabel, unitName: 'Restaurante Tatuapé', initials: account.initials }
}

export async function changeOwnPassword(input: ChangePasswordInput): Promise<void> {
  const account = currentUsername ? mockAccounts.get(currentUsername) : undefined
  if (!account || !account.isActive) throw new Error('Sessão expirada. Entre novamente.')
  if (input.currentPassword !== account.password) throw new Error('A senha atual está incorreta.')
  const result = passwordSchema.safeParse(input.newPassword)
  if (!result.success) throw new Error(result.error.issues[0].message)
  if (input.currentPassword === input.newPassword) throw new Error('Escolha uma senha diferente da atual.')
  account.password = input.newPassword
}
