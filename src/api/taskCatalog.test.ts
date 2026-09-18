import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { createTask, getTaskCatalog } from './management';

beforeEach(() => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 10, 15, 23, 30));
});
afterEach(() => vi.useRealTimers());

it('limits all results to the requested month and sorts newest execution dates first', async () => {
  for (const executionDate of ['2026-11-03', '2026-12-01', '2026-11-28', '2026-11-15']) {
    await createTask({ title: 'Catalog ordering', assignmentType: 'general', executionDate, dueTime: '12:00', isEvidenceRequired: false, isCommentEnabled: true });
  }
  const tasks = await getTaskCatalog({ month: '2026-11', period: 'all', search: 'Catalog ordering' });
  expect(tasks.map(task => task.executionDate)).toEqual(['2026-11-28', '2026-11-15', '2026-11-03']);
});

it('uses the current local day when filtering new tasks', async () => {
  const created = await createTask({ title: 'Local today', assignmentType: 'general', executionDate: '2026-11-15', dueTime: '12:00', isEvidenceRequired: false, isCommentEnabled: true });
  expect(await getTaskCatalog({ month: '2026-11', period: 'today', search: 'Local today' })).toEqual([created]);
  vi.setSystemTime(new Date(2026, 10, 16, 0, 1));
  expect(await getTaskCatalog({ month: '2026-11', period: 'today', search: 'Local today' })).toEqual([]);
  expect(await getTaskCatalog({ month: '2026-11', period: 'past', search: 'Local today' })).toEqual([created]);
});

it.each(['', '2026', '2026-00', '2026-13'])('rejects an invalid month (%s) instead of returning an unbounded list', async month => {
  await expect(getTaskCatalog({ month, period: 'all' })).rejects.toThrow('Selecione um mês válido');
});
