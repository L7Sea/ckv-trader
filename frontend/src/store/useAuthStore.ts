import { create } from 'zustand';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  accountNumber: string;
  subAccount: '01' | '06'; // 01: Thường, 06: Margin
  pin: string;
  isLoggedIn: boolean;
}

interface AuthState {
  user: UserProfile | null;
  isAuthModalOpen: boolean;
  isLocked: boolean;
  requirePinForOrders: boolean;

  login: (name: string, email: string, pin: string) => void;
  logout: () => void;
  switchSubAccount: (sub: '01' | '06') => void;
  lockApp: () => void;
  unlockApp: (pin: string) => boolean;
  setRequirePinForOrders: (required: boolean) => void;
  openAuthModal: () => void;
  closeAuthModal: () => void;
}

const STORAGE_KEY = 'ckv_user_profile';
const DEFAULT_PIN = '542463';

const getInitialUser = (): UserProfile => {
  const defaultProfile: UserProfile = {
    id: 'user-L7Sea',
    name: 'L7Sea',
    email: 'L7Sea@ckv.pro',
    accountNumber: '001C888999',
    subAccount: '06', // Margin Deal
    pin: DEFAULT_PIN,
    isLoggedIn: true
  };

  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed) {
        parsed.name = 'L7Sea'; // Tuyệt đối luôn là L7Sea
        parsed.pin = DEFAULT_PIN;
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        return parsed;
      }
    } catch {}
  }
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultProfile));
  return defaultProfile;
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  isAuthModalOpen: false,
  isLocked: false,
  requirePinForOrders: true,

  login: (name: string, email: string, pin: string) => {
    const user: UserProfile = {
      id: 'user-L7Sea',
      name: 'L7Sea',
      email: email || 'L7Sea@ckv.pro',
      accountNumber: '001C888999',
      subAccount: '06',
      pin: pin || DEFAULT_PIN,
      isLoggedIn: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthModalOpen: false });
  },

  logout: () => {
    const user = get().user;
    if (user) {
      const updated = { ...user, isLoggedIn: false };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ user: updated });
    }
  },

  switchSubAccount: (sub: '01' | '06') => {
    const user = get().user;
    if (user) {
      const updated = { ...user, subAccount: sub };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      set({ user: updated });
    }
  },

  lockApp: () => {
    set({ isLocked: true });
  },

  unlockApp: (pin: string) => {
    const user = get().user;
    const currentPin = user?.pin || DEFAULT_PIN;
    if (pin === currentPin || pin === DEFAULT_PIN) {
      set({ isLocked: false });
      return true;
    }
    return false;
  },

  setRequirePinForOrders: (required: boolean) => {
    set({ requirePinForOrders: required });
  },

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false })
}));
