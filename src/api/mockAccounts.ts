import type { NavigationMode } from '../navigation/types';
import type { ManagementUser } from './management';
import { loginPageText } from '../constants/login';

export type MockAccount = { id: string; name: string; username: string; initials: string; roleLabel: string; role: NavigationMode; isActive: boolean; password: string };
// In-memory demo only. Real authentication and password hashing belong on the backend.
export const mockAccounts = new Map<string, MockAccount>([
  ['demo', { id: 'user-andre', name: 'André Câmara', username: 'demo', initials: 'AC', roleLabel: 'Dono', role: 'owner', isActive: true, password: loginPageText.demoPassword }],
  ['demo.funcionario', { id: 'user-rafael', name: 'Rafael Lima', username: 'demo.funcionario', initials: 'RL', roleLabel: 'Funcionário', role: 'employee', isActive: true, password: loginPageText.demoPassword }],
]);
const navigationRole = (role: ManagementUser['role']): NavigationMode => role === 'Dono' ? 'owner' : role === 'Gerente' ? 'management' : 'employee';

export function registerMockUser(user: ManagementUser, password: string) {
  if (mockAccounts.has(user.username)) throw new Error('USERNAME_ALREADY_EXISTS');
  mockAccounts.set(user.username, { ...user, password, role: navigationRole(user.role), roleLabel: user.role });
}

export function updateMockUser(user: ManagementUser) {
  for (const account of mockAccounts.values()) {
    if (account.id === user.id) Object.assign(account, { role: navigationRole(user.role), roleLabel: user.role, isActive: user.isActive });
  }
}

export function resetMockUserPassword(user: ManagementUser, password: string) {
  const accounts = [...mockAccounts.values()].filter(account => account.id === user.id);
  if (accounts.length === 0) registerMockUser(user, password);
  else for (const account of accounts) account.password = password;
}
