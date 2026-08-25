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
  isLocked: boolean; // Trạng thái khóa màn hình bảo mật
  requirePinForOrders: boolean; // Bắt buộc xác thực PIN khi đặt lệnh/rút tiền

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
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      // Cập nhật mã PIN thành 542463 nếu chưa có hoặc là mã cũ
      if (parsed) {
        parsed.pin = DEFAULT_PIN;
        return parsed;
      }
    } catch {
      // ignore
    }
  }
  return {
    id: 'user-default',
    name: 'L7Sea',
    email: 'investor@ckv.vn',
    accountNumber: '001C888999',
    subAccount: '01',
    pin: DEFAULT_PIN,
    isLoggedIn: true
  };
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: getInitialUser(),
  isAuthModalOpen: false,
  isLocked: false,
  requirePinForOrders: true,

  login: (name: string, email: string, pin: string) => {
    const user: UserProfile = {
      id: 'user-' + Date.now(),
      name: name || 'Nhà Đầu Tư CKV',
      email: email || 'investor@ckv.vn',
      accountNumber: '001C' + Math.floor(100000 + Math.random() * 900000),
      subAccount: '01',
      pin: pin || DEFAULT_PIN,
      isLoggedIn: true
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    set({ user, isAuthModalOpen: false, isLocked: false });
  },

  logout: () => {
    const guestUser: UserProfile = {
      id: 'guest',
      name: 'Khách',
      email: '',
      accountNumber: 'GUEST',
      subAccount: '01',
      pin: DEFAULT_PIN,
      isLoggedIn: false
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(guestUser));
    set({ user: guestUser, isLocked: false });
  },

  switchSubAccount: (sub: '01' | '06') => {
    set((state) => {
      if (!state.user) return state;
      const updated = { ...state.user, subAccount: sub };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return { user: updated };
    });
  },

  lockApp: () => set({ isLocked: true }),

  unlockApp: (inputPin: string) => {
    const currentPin = get().user?.pin || DEFAULT_PIN;
    if (inputPin === currentPin) {
      set({ isLocked: false });
      return true;
    }
    return false;
  },

  setRequirePinForOrders: (required: boolean) => set({ requirePinForOrders: required }),

  openAuthModal: () => set({ isAuthModalOpen: true }),
  closeAuthModal: () => set({ isAuthModalOpen: false })
}));
