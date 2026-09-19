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

it.each([1, 2])('shows the restaurant switch only with multiple units (%s)', async count => {
  const dashboard = await api.getManagementDashboard('tatuape');
  vi.spyOn(api, 'getManagementDashboard').mockResolvedValue({ ...dashboard, units: dashboard.units.slice(0, count) });
  const { navigate } = renderView(routes.management.dashboard);
  expect(screen.queryByRole('button', { name: 'TROCAR' })).not.toBeInTheDocument();
  await screen.findByText('Boa noite, André');
  if (count === 1) expect(screen.queryByRole('button', { name: 'TROCAR' })).not.toBeInTheDocument();
  else {
    await userEvent.setup().click(screen.getByRole('button', { name: 'TROCAR' }));
    expect(navigate).toHaveBeenCalledWith(routes.management.unitSelection);
  }
});

it.each(['attention-1', 'pending-1', 'pending-2'])('opens the selected Today task history (%s) and returns to Today', async id => {
  const task = await api.getCurrentDayTask(id);
  const user = userEvent.setup();
  const { navigate, unmount } = renderView(routes.management.currentDaySummary);
  await user.click(await screen.findByRole('button', { name: new RegExp(task!.title) }));
  expect(navigate).toHaveBeenCalledWith(routes.management.currentDayTaskDetails);
  expect(useManagementStore.getState().selectedTaskId).toBe(id);
  unmount();
  const detail = renderView(routes.management.currentDayTaskDetails);
  expect(await screen.findByRole('heading', { name: task!.title })).toBeVisible();
  expect(screen.getByRole('heading', { name: 'Histórico da ocorrência' })).toBeVisible();
  expect(screen.getByText(task!.timeline[0].title)).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Voltar' }));
  expect(detail.navigate).toHaveBeenCalledWith(routes.management.currentDaySummary);
});

it('shows the asynchronously loaded timezone as visibly read-only', async () => {
  renderView(routes.management.unitSettings);
  const timezone = screen.getByLabelText('Fuso horário (somente leitura)');
  await waitFor(() => expect(timezone).toHaveValue('America/Sao_Paulo'));
  expect(timezone).toHaveAttribute('readonly');
  expect(screen.getByText(/O fuso horário da unidade é fixo/)).toBeVisible();
  await userEvent.setup().type(timezone, 'UTC');
  expect(timezone).toHaveValue('America/Sao_Paulo');
});

it('uses configured closing time for new tasks and preserves manual changes on review', async () => {
  vi.spyOn(api, 'getUnitSettings').mockResolvedValue({ name: 'Unidade', timezone: 'America/Sao_Paulo', closingTime: '04:30' });
  const user = userEvent.setup();
  const { unmount } = renderView(routes.management.taskCreateRules);
  const time = screen.getByLabelText('Horário limite');
  await waitFor(() => expect(time).toHaveValue('04:30'));
  fireEvent.change(time, { target: { value: '23:15' } });
  await user.click(screen.getByRole('button', { name: /REVISAR TAREFA/ }));
  expect(useManagementStore.getState().taskDraft.dueTime).toBe('23:15');
  unmount();
  renderView(routes.management.taskCreateRules);
  expect(screen.getByLabelText('Horário limite')).toHaveValue('23:15');
});

it('creates a new task with the configured closing time', async () => {
  vi.spyOn(api, 'getUnitSettings').mockResolvedValue({ name: 'Unidade', timezone: 'America/Sao_Paulo', closingTime: '04:45' });
  const create = vi.spyOn(api, 'createTask');
  useManagementStore.getState().updateTaskDraft({ title: 'Teste de fechamento' });
  const { navigate } = renderView(routes.management.taskCreateReview);
  await screen.findByText('04:45');
  await userEvent.setup().click(screen.getByRole('button', { name: /CADASTRAR TAREFA/ }));
  await waitFor(() => expect(navigate).toHaveBeenCalledWith(routes.management.taskCreated));
  expect(create).toHaveBeenCalledWith(expect.objectContaining({ dueTime: '04:45' }));
});

it('copies the original deadline even when unit closing time differs', async () => {
  const source = await api.getTask('management-task-2');
  await api.updateUnitSettings({ name: 'Unidade', timezone: 'America/Sao_Paulo', closingTime: '05:00' });
  const { navigate } = renderView(routes.management.taskCopy);
  const time = screen.getByLabelText('Horário limite da tarefa original');
  await waitFor(() => expect(time).toHaveValue(source!.dueTime!));
  expect(time).toHaveAttribute('readonly');
  await userEvent.setup().click(screen.getByRole('button', { name: 'CRIAR CÓPIA' }));
  await waitFor(() => expect(navigate).toHaveBeenCalledWith(routes.management.taskCopyCreated));
  const copied = await api.getTask(useManagementStore.getState().selectedTaskId);
  expect(copied?.dueTime).toBe(source?.dueTime);
});

it.each([true, false])('uses a review button without an active toggle (isActive=%s)', async isActive => {
  const savedUser = (await api.getUser('user-carla'))!;
  vi.spyOn(api, 'getUser').mockResolvedValue({ ...savedUser, isActive });
  const update = vi.spyOn(api, 'updateUser');
  const { navigate } = renderView(routes.management.userEdit);
  await screen.findByRole('heading', { name: savedUser.name });
  expect(screen.queryByRole('switch')).not.toBeInTheDocument();
  await userEvent.setup().click(screen.getByRole('button', { name: isActive ? 'DESATIVAR ACESSO' : 'REATIVAR ACESSO' }));
  expect(navigate).toHaveBeenCalledWith(isActive ? routes.management.userReassignment : routes.management.userReactivation);
  expect(update).not.toHaveBeenCalled();
});

it('reactivates only after confirmation and does not reassign tasks', async () => {
  const savedUser = (await api.getUser('user-carla'))!;
  vi.spyOn(api, 'getUser').mockResolvedValue({ ...savedUser, isActive: false });
  const update = vi.spyOn(api, 'updateUser');
  const reassign = vi.spyOn(api, 'reassignUserTasks');
  const { navigate } = renderView(routes.management.userReactivation);
  const confirm = screen.getByRole('button', { name: 'CONFIRMAR REATIVAÇÃO' });
  await waitFor(() => expect(confirm).toBeEnabled());
  expect(update).not.toHaveBeenCalled();
  await userEvent.setup().click(confirm);
  await waitFor(() => expect(navigate).toHaveBeenCalledWith(routes.management.users));
  expect(update).toHaveBeenCalledWith({ userId: savedUser.id, role: savedUser.role, isActive: true });
  expect(reassign).not.toHaveBeenCalled();
});

it('cancels reactivation without saving', async () => {
  const update = vi.spyOn(api, 'updateUser');
  const { navigate } = renderView(routes.management.userReactivation);
  await userEvent.setup().click(screen.getByRole('button', { name: 'CANCELAR' }));
  expect(navigate).toHaveBeenCalledWith(routes.management.userEdit);
  expect(update).not.toHaveBeenCalled();
});

it('requires a replacement and reassigns tasks before deactivating', async () => {
  useManagementStore.getState().setSelectedUserId('user-marina');
  const reassign = vi.spyOn(api, 'reassignUserTasks');
  const update = vi.spyOn(api, 'updateUser');
  const { navigate } = renderView(routes.management.userReassignment);
  const confirm = screen.getByRole('button', { name: 'DESATIVAR ACESSO' });
  expect(confirm).toBeDisabled();
  const select = await screen.findByRole('combobox');
  expect(confirm).toBeDisabled();
  await userEvent.setup().selectOptions(select, 'user-rafael');
  await userEvent.setup().click(confirm);
  await waitFor(() => expect(navigate).toHaveBeenCalledWith(routes.management.users));
  expect(reassign).toHaveBeenCalledWith({ fromUserId: 'user-marina', toUserId: 'user-rafael' });
  expect(update).toHaveBeenCalledWith(expect.objectContaining({ userId: 'user-marina', isActive: false }));
  expect(reassign.mock.invocationCallOrder[0]).toBeLessThan(update.mock.invocationCallOrder[0]);
});

it('requires a valid month and applies catalog filters only after confirmation', async () => {
  const fetch = vi.spyOn(api, 'getTaskCatalog');
  const user = userEvent.setup();
  renderView(routes.management.taskCatalog);
  await waitFor(() => expect(fetch).toHaveBeenCalledWith({ month: '2026-11', period: 'today', search: '' }));
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  const month = await screen.findByLabelText(/Mês de execução/);
  expect(month).toHaveValue('2026-11');
  expect(screen.getByRole('combobox', { name: 'Período' })).toHaveValue('today');
  const calls = fetch.mock.calls.length;
  fireEvent.change(month, { target: { value: '2026-08' } });
  expect(fetch).toHaveBeenCalledTimes(calls);
  fireEvent.change(month, { target: { value: '' } });
  expect(screen.getByRole('button', { name: 'APLICAR FILTROS' })).toBeDisabled();
  fireEvent.change(month, { target: { value: '2026-08' } });
  await user.click(screen.getByRole('button', { name: 'APLICAR FILTROS' }));
  await waitFor(() => expect(fetch).toHaveBeenLastCalledWith({ month: '2026-08', period: 'all', search: '' }));
});

it('uses filter controls instead of tabs and applies and clears history filters', async () => {
  const user = userEvent.setup();
  renderView(routes.management.previousDayDetails);
  await screen.findByText(/Dia encerrado às/);
  expect(screen.queryByRole('radio')).not.toBeInTheDocument();
  expect(screen.queryByRole('tab')).not.toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Filtros' }));
  await user.click(await screen.findByRole('checkbox', { name: 'Feitas' }));
  await user.click(screen.getByRole('checkbox', { name: 'Pendentes encerradas automaticamente' }));
  await user.click(screen.getByRole('button', { name: 'APLICAR FILTROS' }));
  expect(await screen.findByText('Status: Não feitas · Responsável: todos')).toBeVisible();
  expect(screen.getByRole('button', { name: 'Filtros (1)' })).toBeVisible();
  await user.click(screen.getByRole('button', { name: 'Filtros (1)' }));
  await user.click(await screen.findByRole('button', { name: 'LIMPAR FILTROS' }));
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
