import { describe, expect, it } from 'vitest';
import {
  createTask,
  createUser,
  getHistoryDay,
  getHistoryTask,
  getManagementDashboard,
  getTaskCatalog,
  getUsers,
  updateUnitSettings,
} from './management';

describe('management api mock', () => {
  it('filters catalog by period and search after creating a task', async () => {
    const created = await createTask({
      title: 'Conferir teste de integração',
      assignmentType: 'general',
      executionDate: '2026-09-03',
      dueTime: '12:00',
      isEvidenceRequired: true,
      isCommentEnabled: true,
    });

    const future = await getTaskCatalog({ period: 'future', search: 'integração' });
    expect(future.some((task) => task.id === created.id)).toBe(true);
  });

  it('creates and searches users and persists unit settings in the mock api', async () => {
    const createdUser = await createUser({ name: 'Teste Usuário', username: 'teste.usuario', password: 'senha-segura', role: 'Funcionário' });
    expect((await getUsers('teste.usuario')).some((user) => user.id === createdUser.id)).toBe(true);

    const users = await getUsers('rafael');
    expect(users).toHaveLength(1);

    const settings = await updateUnitSettings({
      name: 'Unidade Teste',
      timezone: 'America/Sao_Paulo',
      closingTime: '02:30',
    });
    expect(settings.closingTime).toBe('02:30');
  });

  it('filters historical tasks by status and assignee through the api', async () => {
    const result = await getHistoryDay({ statuses: ['notDone'], assigneeId: 'user-rafael' });

    expect(result.tasks).toHaveLength(1);
    expect(result.tasks[0].status).toBe('notDone');
    expect(result.tasks[0].assignee).toBe('Rafael Lima');
  });

  it('returns dashboard and historical detail data through dedicated contracts', async () => {
    const dashboard = await getManagementDashboard('liberdade');
    const historyTask = await getHistoryTask('history-task-2');

    expect(dashboard.activeUnit.id).toBe('liberdade');
    expect(historyTask?.reason).toBeTruthy();
    expect(historyTask?.timeline.length).toBeGreaterThan(0);
  });
});
