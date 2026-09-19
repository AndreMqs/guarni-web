import { QueryClientProvider } from '@tanstack/react-query';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import * as auth from '../../api/auth';
import { routes } from '../../navigation';
import { render } from '../../test/render';
import { createQueryTestContext } from '../../test/query';
import { ChangePasswordView } from './ChangePasswordView';

const context = createQueryTestContext();
afterEach(() => { context.queryClient.clear(); auth.endMockSession(); });

it('validates confirmation, reports current-password errors, and confirms success', async () => {
  await auth.login({ username: 'senha.tela', password: 'temporaria-123' });
  const change = vi.spyOn(auth, 'changeOwnPassword');
  const user = userEvent.setup();
  render(<QueryClientProvider client={context.queryClient}><ChangePasswordView navigate={vi.fn()} backTo={routes.tasks.menu} /></QueryClientProvider>);
  await user.type(screen.getByLabelText(/Senha atual/), 'incorreta-123');
  await user.type(screen.getByLabelText(/^Nova senha/), 'nova-senha-1234');
  const confirmation = screen.getByLabelText(/Confirmar nova senha/);
  await user.type(confirmation, 'diferente-1234');
  await user.click(screen.getByRole('button', { name: 'SALVAR NOVA SENHA' }));
  expect(await screen.findByText('As senhas não coincidem.')).toBeVisible();
  expect(change).not.toHaveBeenCalled();
  await user.clear(confirmation);
  await user.type(confirmation, 'nova-senha-1234');
  await user.click(screen.getByRole('button', { name: 'SALVAR NOVA SENHA' }));
  expect(await screen.findByText('A senha atual está incorreta.')).toBeVisible();
  await user.clear(screen.getByLabelText(/Senha atual/));
  await user.type(screen.getByLabelText(/Senha atual/), 'temporaria-123');
  await user.click(screen.getByRole('button', { name: 'SALVAR NOVA SENHA' }));
  expect(await screen.findByRole('heading', { name: 'Senha alterada' })).toBeVisible();
  expect(screen.queryByLabelText(/Senha atual/)).not.toBeInTheDocument();
});
