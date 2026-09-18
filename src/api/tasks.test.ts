import { describe, expect, it } from 'vitest';
import { completeTask, getClosedDayHistory, getDailyHistory, getTask, getTodayTasks, takeOverTask } from './tasks';

describe('tasks api mock', () => {
  it('filters today tasks by scope and search', async () => {
    const mine = await getTodayTasks({ scope: 'mine' });
    const general = await getTodayTasks({ scope: 'general' });
    const freezer = await getTodayTasks({ scope: 'all', search: 'freezer' });

    expect(mine.tasks.every((task) => task.isAssignedToCurrentUser)).toBe(true);
    expect(general.tasks.every((task) => task.assignmentType === 'general')).toBe(true);
    expect(freezer.tasks).toHaveLength(1);
  });

  it('updates task ownership and exposes the event through history', async () => {
    await takeOverTask({ taskId: 'task-sauce-expiration', reason: 'Cobertura do turno' });
    const history = await getDailyHistory({ category: 'assignment' });

    expect(history.events[0].title).toContain('Assumida');
    expect(history.events[0].meta).toContain('Cobertura do turno');
  });

  it('keeps task details behind the api contract after a completion', async () => {
    await completeTask({ taskId: 'task-bench-cleaning', comment: 'Finalizado', evidenceName: 'bancada.jpg' });
    const task = await getTask('task-bench-cleaning');

    expect(task?.status).toBe('done');
    expect(task?.comment).toBe('Finalizado');
    expect(task?.evidenceName).toBe('bancada.jpg');
    expect(task?.timeline?.[0].title).toContain('concluída');
  });

  it('returns closed-day data through the api instead of view constants', async () => {
    const result = await getClosedDayHistory();

    expect(result.closedAtLabel).toBeTruthy();
    expect(result.task.reason).toBeTruthy();
  });
});
