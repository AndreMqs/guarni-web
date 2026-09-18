import type { LoginCredentials } from '../schemas/auth.ts'

const mockLoginAccessToken = 'mock-access-token'

export type LoginResponse = {
  accessToken: string
}

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
 * O contrato já corresponde ao `POST /v1/auth/login`. Enquanto a integração
 * HTTP não estiver habilitada, apenas o corpo desta função permanece mockado.
 */
export async function login(
  credentials: LoginCredentials,
): Promise<LoginResponse> {
  void credentials
  return Promise.resolve({ accessToken: mockLoginAccessToken })
}

/** Mock do contexto que futuramente será composto por /auth/me + membership/unidade. */
export async function getCurrentUserContext(): Promise<CurrentUserContext> {
  return Promise.resolve({
    id: 'user-andre',
    name: 'André Câmara',
    username: 'andre',
    roleLabel: 'Dono',
    unitName: 'Restaurante Tatuapé',
    initials: 'AC',
  })
}
