import { expect, it } from 'vitest';
import { getTodayTasks } from './tasks';

it('sorts by status first and deadline second, with completed tasks last', async () => {
  const { tasks } = await getTodayTasks({ scope: 'all' });
  expect(tasks.map(task => task.id)).toEqual([
    'task-bench-cleaning',
    'task-dining-room',
    'task-produce-sanitizing',
    'task-dry-storage', // No deadline: last among pending tasks.
    'task-trash-area',
    'task-opening-checklist',
    'task-sauce-expiration',
    'task-freezer-temperature',
    'task-cash-closing',
  ]);
});

it.each([
  ['mine', 'pending', ['task-bench-cleaning', 'task-dry-storage']],
  ['general', 'pending', ['task-dining-room']],
  ['general', 'notDone', ['task-trash-area']],
  ['mine', 'done', ['task-freezer-temperature']],
] as const)('combines scope %s with status %s', async (scope, status, expected) => {
  const { tasks } = await getTodayTasks({ scope, status });
  expect(tasks.map(task => task.id)).toEqual(expected);
});

it('combines status and search and can restore the unfiltered list', async () => {
  const matching = await getTodayTasks({ scope: 'all', status: 'done', search: 'freezer' });
  expect(matching.tasks.map(task => task.id)).toEqual(['task-freezer-temperature']);
  expect((await getTodayTasks({ scope: 'all', status: 'pending', search: 'freezer' })).tasks).toEqual([]);
  expect((await getTodayTasks({ scope: 'all', status: 'all' })).tasks).toEqual((await getTodayTasks({ scope: 'all' })).tasks);
});

it('keeps completed tasks sorted by deadline when filtering only completed', async () => {
  const { tasks } = await getTodayTasks({ scope: 'all', status: 'done' });
  expect(tasks.map(task => task.dueTime)).toEqual(['09:00', '14:00', '15:00', '23:30']);
});
