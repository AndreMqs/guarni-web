import { useMutation } from '@tanstack/react-query'
import { login } from '../api/auth.ts'

/** Queries e mutations relacionadas ao fluxo de login. */
export function useLoginMutation() {
  return useMutation({ mutationFn: login })
}
