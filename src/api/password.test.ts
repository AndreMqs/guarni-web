import { afterEach, expect, it } from 'vitest';
import { changeOwnPassword, endMockSession, getCurrentUserContext, login } from './auth';
import { createUser, updateUser } from './management';

afterEach(endMockSession);

it('allows a newly registered employee to replace the temporary password', async () => {
  const user = await createUser({ name: 'Ana Teste', username: 'ana.senha', password: 'temporaria-123', role: 'Funcionária' });
  expect(await login({ username: user.username, password: 'temporaria-123' })).toMatchObject({ role: 'employee' });
  expect(await getCurrentUserContext()).toMatchObject({ id: user.id, name: 'Ana Teste' });
  await changeOwnPassword({ currentPassword: 'temporaria-123', newPassword: 'minha-nova-senha-123' });
  endMockSession();
  await expect(login({ username: user.username, password: 'temporaria-123' })).rejects.toThrow('INVALID_CREDENTIALS');
  expect(await login({ username: user.username, password: 'minha-nova-senha-123' })).toMatchObject({ role: 'employee' });
  await updateUser({ userId: user.id, role: user.role, isActive: false });
  await expect(changeOwnPassword({ currentPassword: 'minha-nova-senha-123', newPassword: 'outra-senha-1234' })).rejects.toThrow('Sessão expirada');
  await expect(login({ username: user.username, password: 'minha-nova-senha-123' })).rejects.toThrow('INVALID_CREDENTIALS');
});

it('rejects incorrect current passwords and invalid new passwords without changing credentials', async () => {
  await login({ username: 'senha.validacao', password: 'temporaria-123' });
  await expect(changeOwnPassword({ currentPassword: 'incorreta-123', newPassword: 'nova-senha-valida' })).rejects.toThrow('senha atual');
  await expect(changeOwnPassword({ currentPassword: 'temporaria-123', newPassword: 'curta' })).rejects.toThrow('12 caracteres');
  await expect(changeOwnPassword({ currentPassword: 'temporaria-123', newPassword: 'temporaria-123' })).rejects.toThrow('diferente');
  endMockSession();
  await expect(changeOwnPassword({ currentPassword: 'temporaria-123', newPassword: 'nova-senha-valida' })).rejects.toThrow('Sessão expirada');
  await expect(login({ username: 'senha.validacao', password: 'temporaria-123' })).resolves.toMatchObject({ accessToken: 'mock-access-token' });
});
