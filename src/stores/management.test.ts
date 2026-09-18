import { afterEach, expect, it, vi } from 'vitest';
import { useManagementStore } from './management';

afterEach(() => {
  vi.useRealTimers();
  useManagementStore.setState(useManagementStore.getInitialState(), true);
});

it('starts each new draft on the current local date, including after midnight', () => {
  vi.useFakeTimers({ toFake: ['Date'] });
  vi.setSystemTime(new Date(2026, 11, 31, 23, 59));
  useManagementStore.getState().resetTaskDraft();
  expect(useManagementStore.getState().taskDraft.executionDate).toBe('2026-12-31');
  useManagementStore.getState().updateTaskDraft({ title: 'Old draft', executionDate: '2026-09-01', assigneeId: 'old-user' });
  vi.setSystemTime(new Date(2027, 0, 1, 0, 1));
  useManagementStore.getState().resetTaskDraft();
  expect(useManagementStore.getState().taskDraft).toMatchObject({ title: '', executionDate: '2027-01-01', assignmentType: 'general' });
  expect(useManagementStore.getState().taskDraft.assigneeId).toBeUndefined();
});
