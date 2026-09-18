import { QueryClientProvider } from '@tanstack/react-query';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import App from './App';
import * as tasks from './api/tasks';
import { queryClient } from './queryClient';
import { routes, useNavigationStore } from './navigation';
import { useTaskStore } from './stores/tasks';
import { render } from './test/render';

beforeEach(() => {
  queryClient.clear();
  window.history.replaceState(null, '', '/');
  useTaskStore.setState(useTaskStore.getInitialState(), true);
  useNavigationStore.setState(useNavigationStore.getInitialState(), true);
});
afterEach(() => {
  queryClient.clear();
  window.history.replaceState(null, '', '/');
  useTaskStore.setState(useTaskStore.getInitialState(), true);
  useNavigationStore.setState(useNavigationStore.getInitialState(), true);
});

async function signIn(username: string) {
  const user = userEvent.setup();
  render(<QueryClientProvider client={queryClient}><App /></QueryClientProvider>);
  await user.type(screen.getByLabelText(/Usuário/), username);
  await user.type(screen.getByLabelText(/Senha/), 'demonstracao123');
  await user.click(screen.getByRole('button', { name: 'Entrar' }));
  return user;
}

it.each(['demo', 'gerente', 'demo.funcionario'])('%s can take over and complete a task', async username => {
  let task: tasks.TodayTask = { id: 'shared-task', title: 'Tarefa da equipe', dueLabel: '18:00', assigneeLabel: 'Outra pessoa', assignmentType: 'personal', isAssignedToCurrentUser: false, canTakeOver: true, status: 'pending' };
  vi.spyOn(tasks, 'getTodayTasks').mockImplementation(async () => ({ dateLabel: 'Hoje', tasks: [task], summary: { pending: 1, done: 0, notDone: 0 } }));
  vi.spyOn(tasks, 'getTask').mockImplementation(async () => ({ ...task }));
  const takeOver = vi.spyOn(tasks, 'takeOverTask').mockImplementation(async () => {
    task = { ...task, canTakeOver: false, isAssignedToCurrentUser: true, assigneeLabel: 'Você' };
    return task;
  });
  const complete = vi.spyOn(tasks, 'completeTask').mockImplementation(async () => {
    task = { ...task, status: 'done', completedByLabel: 'Você' };
    return task;
  });
  const user = await signIn(username);
  if (username !== 'demo.funcionario') await user.click(await screen.findByRole('button', { name: /Executar tarefas/ }));
  await user.click(await screen.findByRole('button', { name: /Tarefa da equipe/ }));
  await user.click(await screen.findByRole('button', { name: 'ASSUMIR ESTA TAREFA' }));
  await user.type(await screen.findByPlaceholderText('Ex.: o responsável precisou atender uma entrega'), 'Cobertura de turno');
  await user.click(screen.getByRole('button', { name: 'CONFIRMAR E ASSUMIR' }));
  await user.click(await screen.findByRole('button', { name: /CONCLUIR TAREFA/ }));
  await user.click(await screen.findByRole('button', { name: /CONFIRMAR CONCLUSÃO/ }));
  expect(await screen.findByText('Concluída por Você')).toBeVisible();
  expect(takeOver).toHaveBeenCalledWith({ taskId: 'shared-task', reason: 'Cobertura de turno' }, expect.anything());
  expect(complete).toHaveBeenCalledWith(expect.objectContaining({ taskId: 'shared-task' }), expect.anything());
  await user.click(screen.getByRole('button', { name: 'Voltar' }));
  await user.click(await screen.findByRole('button', { name: 'Mais' }));
  if (username === 'demo.funcionario') expect(screen.queryByRole('button', { name: /Voltar à gestão/ })).not.toBeInTheDocument();
  else expect(await screen.findByRole('button', { name: /Voltar à gestão/ })).toBeVisible();
  await user.click(screen.getByRole('button', { name: /Sair/ }));
  expect(await screen.findByRole('button', { name: 'Entrar' })).toBeEnabled();
});

it('keeps the employee demo in the execution flow even with a management deep link', async () => {
  window.history.replaceState(null, '', `#/${routes.management.users}`);
  await signIn('demo.funcionario');
  expect(await screen.findByRole('heading', { name: 'Tarefas de hoje' })).toBeVisible();
  await waitFor(() => expect(screen.queryByRole('heading', { name: 'Usuários' })).not.toBeInTheDocument());
});
