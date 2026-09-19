import { QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, expect, it, vi } from 'vitest';
import * as api from '../../api/audit';
import { routes } from '../../navigation';
import { render } from '../../test/render';
import { createQueryTestContext } from '../../test/query';
import { AuditView } from './AuditViews';

const context = createQueryTestContext();
afterEach(() => context.queryClient.clear());

it('shows the task as the card heading and the event as its subtitle', async () => {
  render(<QueryClientProvider client={context.queryClient}><AuditView route={routes.audit.events} navigate={vi.fn()} onLogout={vi.fn()} /></QueryClientProvider>);
  const headings = await screen.findAllByRole('heading', { name: 'Higienizar bancada da cozinha' });
  const card = headings[0].closest('[role="button"]')! as HTMLElement;
  expect(within(card).getByText('Foto substituída em correção')).toBeVisible();
  expect(within(card).getByText('Mídia')).toBeVisible();
});

it('applies audit category and dates together using the shared filter panel', async () => {
  const fetch = vi.spyOn(api, 'getAuditEvents');
  const user = userEvent.setup();
  render(<QueryClientProvider client={context.queryClient}><AuditView route={routes.audit.events} navigate={vi.fn()} onLogout={vi.fn()} /></QueryClientProvider>);
  await waitFor(() => expect(fetch).toHaveBeenCalled());
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  const before = fetch.mock.calls.length;
  await user.selectOptions(await screen.findByRole('combobox', { name: 'Categoria' }), 'media');
  expect(fetch).toHaveBeenCalledTimes(before);
  await user.click(screen.getByRole('button', { name: 'APLICAR FILTROS' }));
  await waitFor(() => expect(fetch).toHaveBeenLastCalledWith(expect.objectContaining({ category: 'media' })));
});
