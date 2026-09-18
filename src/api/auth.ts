import type { LoginCredentials } from '../schemas/auth.ts'
import type { NavigationMode } from '../navigation/types'
import { loginPageText } from '../constants/login'

const mockLoginAccessToken = 'mock-access-token'

export type LoginResponse = {
  accessToken: string
  role: NavigationMode
}

let currentRole: NavigationMode = 'owner'

export type CurrentUserContext = {
  id: string
  name: string
  username: string
  roleLabel: string
  unitName: string
  initials: string
}

/**
 * Autentica o usuário.
 *
 * Mock de autenticação: inclui o perfil para selecionar a navegação da demo.
 * Na integração HTTP, o perfil deve vir da sessão/membership autenticada.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  const username = credentials.username.trim().toLowerCase()
  const isDemo = username === loginPageText.demoUsername || username === loginPageText.employeeDemoUsername
  if (isDemo && credentials.password !== loginPageText.demoPassword) throw new Error('INVALID_CREDENTIALS')
  currentRole = username === loginPageText.employeeDemoUsername || username.includes('func')
    ? 'employee' : username.includes('ger') ? 'management' : 'owner'
  return Promise.resolve({ accessToken: mockLoginAccessToken, role: currentRole })
}

/** Mock do contexto que futuramente será composto por /auth/me + membership/unidade. */
export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  if (currentRole === 'employee') return { id: 'user-rafael', name: 'Rafael Lima', username: loginPageText.employeeDemoUsername, roleLabel: 'Funcionário', unitName: 'Restaurante Tatuapé', initials: 'RL' }
  if (currentRole === 'management') return { id: 'user-carla', name: 'Carla Mendes', username: 'gerente', roleLabel: 'Gerente', unitName: 'Restaurante Tatuapé', initials: 'CM' }
  return Promise.resolve({
    id: 'user-andre',
    name: 'André Câmara',
    username: 'andre',
    roleLabel: 'Dono',
    unitName: 'Restaurante Tatuapé',
    initials: 'AC',
  })
}
