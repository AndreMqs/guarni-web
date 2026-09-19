import { useMutation, useQuery } from '@tanstack/react-query'
import { changeOwnPassword, getCurrentUserContext, login } from '../api/auth.ts'

/** Queries e mutations relacionadas ao fluxo de login. */
export function useLoginMutation() {
  return useMutation({ mutationFn: login })
}

export function useChangePasswordMutation() {
  return useMutation({ mutationFn: changeOwnPassword })
}

export function useCurrentUserContextQuery() {
  return useQuery({ queryKey: ['auth', 'current-user-context'], queryFn: getCurrentUserContext })
}
