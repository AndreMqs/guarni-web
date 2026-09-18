import { create } from 'zustand';
import { getTodayDate } from '../utils/date';

export type ManagementUnitId = 'tatuape' | 'liberdade';
export type TaskAssignmentType = 'general' | 'personal';

export type TaskDraft = {
  title: string;
  description: string;
  assignmentType: TaskAssignmentType;
  assigneeId?: string;
  assigneeName?: string;
  executionDate: string;
  dueTime: string;
  isEvidenceRequired: boolean;
  isCommentEnabled: boolean;
};

const createInitialTaskDraft = (): TaskDraft => ({
  title: '',
  description: '',
  assignmentType: 'general',
  executionDate: getTodayDate(),
  dueTime: '10:00',
  isEvidenceRequired: true,
  isCommentEnabled: true,
});

type ManagementStore = {
  activeUnitId: ManagementUnitId;
  selectedTaskId: string;
  selectedUserId: string;
  selectedHistoryTaskId: string;
  taskDraft: TaskDraft;
  setActiveUnit: (unitId: ManagementUnitId) => void;
  setSelectedTaskId: (taskId: string) => void;
  setSelectedUserId: (userId: string) => void;
  setSelectedHistoryTaskId: (taskId: string) => void;
  updateTaskDraft: (patch: Partial<TaskDraft>) => void;
  resetTaskDraft: () => void;
};

export const useManagementStore = create<ManagementStore>((set) => ({
  activeUnitId: 'tatuape',
  selectedTaskId: 'management-task-2',
  selectedUserId: 'user-carla',
  selectedHistoryTaskId: 'history-task-2',
  taskDraft: createInitialTaskDraft(),
  setActiveUnit: (activeUnitId) => set({ activeUnitId }),
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  setSelectedUserId: (selectedUserId) => set({ selectedUserId }),
  setSelectedHistoryTaskId: (selectedHistoryTaskId) => set({ selectedHistoryTaskId }),
  updateTaskDraft: (patch) => set((state) => ({ taskDraft: { ...state.taskDraft, ...patch } })),
  resetTaskDraft: () => set({ taskDraft: createInitialTaskDraft() }),
}));
