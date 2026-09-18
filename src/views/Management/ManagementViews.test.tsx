import { QueryClientProvider } from '@tanstack/react-query';
import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import * as api from '../../api/management';
import { routes, type AppRoute } from '../../navigation';
import { useManagementStore } from '../../stores';
import { createQueryTestContext } from '../../test/query';
import { render } from '../../test/render';
import { ManagementView } from './ManagementViews';

let context: ReturnType<typeof createQueryTestContext>;
beforeEach(() => {
  context = createQueryTestContext();
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 15, 12));
  useManagementStore.getState().resetTaskDraft();
});
afterEach(() => {
  context.queryClient.clear();
  vi.useRealTimers();
  useManagementStore.setState(useManagementStore.getInitialState(), true);
});

function renderView(route: AppRoute) {
  const navigate = vi.fn();
  const result = render(<QueryClientProvider client={context.queryClient}><ManagementView route={route} navigate={navigate} onLogout={vi.fn()} /></QueryClientProvider>);
  return { ...result, navigate };
}

it('opens on Today and requires a month for every catalog query', async () => {
  const fetch = vi.spyOn(api, 'getTaskCatalog');
  const user = userEvent.setup();
  renderView(routes.management.taskCatalog);
  expect(screen.getByRole('radio', { name: 'Hoje' })).toBeChecked();
  const month = screen.getByLabelText(/Mês de execução/);
  expect(month).toHaveValue('2026-11');
  await waitFor(() => expect(fetch).toHaveBeenCalledWith({ month: '2026-11', period: 'today', search: '' }));
  await user.click(screen.getByRole('radio', { name: 'Todas' }));
  await waitFor(() => expect(fetch).toHaveBeenLastCalledWith({ month: '2026-11', period: 'all', search: '' }));
  fireEvent.change(month, { target: { value: '2026-08' } });
  await waitFor(() => expect(fetch).toHaveBeenLastCalledWith({ month: '2026-08', period: 'all', search: '' }));
  const calls = fetch.mock.calls.length;
  fireEvent.change(month, { target: { value: '' } });
  expect(await screen.findByText('Selecione um mês')).toBeVisible();
  expect(fetch).toHaveBeenCalledTimes(calls);
  await user.click(screen.getByRole('radio', { name: 'Hoje' }));
  expect(month).toHaveValue('2026-11');
});

it('uses filter controls instead of tabs and applies and clears history filters', async () => {
  const user = userEvent.setup();
  renderView(routes.management.previousDayDetails);
  await screen.findByText(/Dia encerrado às/);
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  await user.click(screen.getByRole('checkbox', { name: 'Feitas' }));
  await user.click(screen.getByRole('checkbox', { name: 'Pendentes encerradas automaticamente' }));
  await user.click(screen.getByRole('button', { name: 'APLICAR FILTROS' }));
  expect(await screen.findByText('Status: Não feitas · Responsável: todos')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Filtros (1)' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  expect(screen.getByText('Status: todos · Responsável: todos')).toBeVisible();
});

it.each([routes.management.taskCreateDate, routes.management.taskCopy])('defaults execution date to today on %s', async route => {
  const { container } = renderView(route);
  await waitFor(() => expect(container.querySelector('input[type="date"]')).toHaveValue('2026-11-15'));
});

it('preserves owner navigation on the Today dashboard', async () => {
  const navigate = vi.fn();
  const user = userEvent.setup();
  render(<QueryClientProvider client={context.queryClient}><ManagementView route={routes.management.dashboard} navMode="owner" navigate={navigate} onLogout={vi.fn()} /></QueryClientProvider>);
  expect(screen.getByRole('button', { name: 'Hoje' })).toHaveAttribute('aria-current', 'page');
  await user.click(screen.getByRole('button', { name: 'Mais' }));
  expect(navigate).toHaveBeenCalledWith(routes.owner.menu);
});
