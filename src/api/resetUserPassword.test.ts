import { afterEach, expect, it } from 'vitest';
import { changeOwnPassword, endMockSession, login } from './auth';
import { createUser, getUser, resetUserPassword, updateUser } from './management';

afterEach(endMockSession);

it.each(['Dono', 'Gerente'] as const)('%s can replace a forgotten password without reading it', async role => {
  const admin = await createUser({ name: role, username: `reset.admin.${role.toLowerCase()}`, password: 'admin-senha-123', role });
  const target = await createUser({ name: 'Pessoa', username: `reset.target.${role.toLowerCase()}`, password: 'anterior-1234', role: 'Funcionário' });
  await login({ username: admin.username, password: 'admin-senha-123' });
  await expect(resetUserPassword({ userId: target.id, newPassword: 'temporaria-1234' })).resolves.toBeUndefined();
  expect(await getUser(target.id)).toEqual(target);
  expect(await getUser(target.id)).not.toHaveProperty('password');
  endMockSession();
  await expect(login({ username: target.username, password: 'anterior-1234' })).rejects.toThrow('INVALID_CREDENTIALS');
  await expect(login({ username: target.username, password: 'temporaria-1234' })).resolves.toMatchObject({ role: 'employee' });
  await changeOwnPassword({ currentPassword: 'temporaria-1234', newPassword: 'senha-pessoal-1234' });
});

it('rejects employees, expired sessions, invalid passwords and missing users', async () => {
  const target = await createUser({ name: 'Pessoa', username: 'reset.validation', password: 'anterior-1234', role: 'Funcionário' });
  const input = { userId: target.id, newPassword: 'temporaria-1234' };
  await expect(resetUserPassword(input)).rejects.toThrow('Sessão expirada');
  await login({ username: target.username, password: 'anterior-1234' });
  await expect(resetUserPassword(input)).rejects.toThrow('Apenas o dono ou gerente');
  await login({ username: 'demo', password: 'demonstracao123' });
  await expect(resetUserPassword({ ...input, newPassword: 'curta' })).rejects.toThrow('12 caracteres');
  await expect(resetUserPassword({ ...input, userId: 'inexistente' })).rejects.toThrow('Usuário não encontrado');
  await expect(login({ username: target.username, password: 'anterior-1234' })).resolves.toBeDefined();
});

it('keeps inactive users inactive and rejects inactive administrators', async () => {
  const admin = await createUser({ name: 'Gerente', username: 'reset.inactive.admin', password: 'admin-senha-123', role: 'Gerente' });
  const target = await createUser({ name: 'Pessoa', username: 'reset.inactive.target', password: 'anterior-1234', role: 'Funcionário' });
  await updateUser({ userId: target.id, role: target.role, isActive: false });
  await login({ username: admin.username, password: 'admin-senha-123' });
  await resetUserPassword({ userId: target.id, newPassword: 'temporaria-1234' });
  expect(await getUser(target.id)).toMatchObject({ isActive: false });
  await expect(login({ username: target.username, password: 'temporaria-1234' })).rejects.toThrow('INVALID_CREDENTIALS');
  await updateUser({ userId: admin.id, role: admin.role, isActive: false });
  await expect(resetUserPassword({ userId: target.id, newPassword: 'outra-senha-123' })).rejects.toThrow('Sessão expirada');
});

it('updates demo credentials by user id and supports seeded users without an account', async () => {
  await login({ username: 'demo', password: 'demonstracao123' });
  await resetUserPassword({ userId: 'user-rafael', newPassword: 'rafael-nova-123' });
  await resetUserPassword({ userId: 'user-carla', newPassword: 'carla-nova-1234' });
  endMockSession();
  await expect(login({ username: 'demo.funcionario', password: 'demonstracao123' })).rejects.toThrow('INVALID_CREDENTIALS');
  await expect(login({ username: 'demo.funcionario', password: 'rafael-nova-123' })).resolves.toMatchObject({ role: 'employee' });
  await expect(login({ username: 'carla', password: 'carla-nova-1234' })).resolves.toMatchObject({ role: 'management' });
});
