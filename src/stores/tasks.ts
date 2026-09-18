import { create } from 'zustand';

export type TaskExecutionDraft = {
  comment: string;
  evidenceName?: string;
};

type TaskStore = {
  selectedTaskId: string;
  executionDraft: TaskExecutionDraft;
  setSelectedTaskId: (taskId: string) => void;
  updateExecutionDraft: (patch: Partial<TaskExecutionDraft>) => void;
  resetExecutionDraft: () => void;
};

const initialExecutionDraft: TaskExecutionDraft = { comment: '' };

export const useTaskStore = create<TaskStore>((set) => ({
  selectedTaskId: 'task-bench-cleaning',
  executionDraft: initialExecutionDraft,
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  updateExecutionDraft: (patch) => set((state) => ({ executionDraft: { ...state.executionDraft, ...patch } })),
  resetExecutionDraft: () => set({ executionDraft: initialExecutionDraft }),
}));
