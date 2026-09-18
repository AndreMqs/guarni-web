import type { LoginCredentials } from '../schemas/auth.ts'
import { mockLoginAccessToken } from '../constants/login.ts'

export type LoginResponse = {
  accessToken: string
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
