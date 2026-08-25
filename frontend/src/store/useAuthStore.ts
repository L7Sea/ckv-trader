import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountNumber: string; // VD: 001C123456
  subAccount: '01' | '06'; // 01: Thường, 06: Margin
  pin: string;
  isLoggedIn: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  login: (name: string, email: string, pin: string) => void;
  logout: () => void;
  switchSubAccount: (sub: '01' | '06') => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const STORAGE_KEY = 'ckv_user_profile';

const getInitialUser = (): UserProfile => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // ignore
    }
  }
  return {
    id: 'user-default',
    name: 'Dương L.K',
    email: 'trader@ckv.vn',
    accountNumber: '001C888999',
    subAccount: '01',
    pin: '123456',
    isLoggedIn: true
  };
};

export const useAuthStore = create<AuthState>((set) => ({
  user: getInitialUser(),
  isAuthModalOpen: false,

  login: (name: string, email: string, pin: string) => {
    const user: UserProfile = {
      id: 'user-' + Date.now(),
      name: name || 'Nhà Đầu Tư CKV',
      email: email || 'investor@ckv.vn',
      accountNumber: '001C' + Math.floor(100000 + Math.random() * 900000),
      subAccount: '01',
      pin: pin || '123456',
      isLoggedIn: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthModalOpen: false });
  },

  logout: () => {
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Khách',
      email: '',
      accountNumber: 'GUEST',
      subAccount: '01',
      pin: '',
      isLoggedIn: false
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));
    set({ user: guestUser });
  },

  switchSubAccount: (sub: '01' | '06') => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, subAccount: sub };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { user: updated };
    });
  },

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false })
}));
