import { create } from 'zustand';

type AuditStore = {
  selectedEventId: string;
  setSelectedEventId: (eventId: string) => void;
};

export const useAuditStore = create<AuditStore>((set) => ({
  selectedEventId: 'audit-1',
  setSelectedEventId: (selectedEventId) => set({ selectedEventId }),
}));
