import { create } from 'zustand';

interface AppState {
  currentClerkId: string;
  currentEmail: string;
  activeOrgId: string | null;
  setMockUser: (clerkId: string, email: string) => void;
  setActiveOrgId: (orgId: string | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentClerkId: typeof window !== 'undefined' ? localStorage.getItem('mock-clerk-id') || 'mock-user-123' : 'mock-user-123',
  currentEmail: typeof window !== 'undefined' ? localStorage.getItem('mock-email') || 'developer@leadflow.ai' : 'developer@leadflow.ai',
  activeOrgId: null,
  setMockUser: (clerkId, email) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('mock-clerk-id', clerkId);
      localStorage.setItem('mock-email', email);
    }
    set({ currentClerkId: clerkId, currentEmail: email });
  },
  setActiveOrgId: (orgId) => set({ activeOrgId: orgId }),
}));
