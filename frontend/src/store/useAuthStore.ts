import { create } from 'zustand';
import { localTradingEngine } from '../services/localTradingEngine';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  accountNumber: string;
  subAccount: '01' | '06'; // 01: Thường, 06: Margin
  pin: string;
  theme: 'CYBERPUNK' | 'DARK_NAVY' | 'BLACK_AMOLED';
  backgroundUrl?: string;
  hasCompletedOnboarding: boolean;
  isLoggedIn: boolean;
  createdAt: string;
}

interface AuthState {
  user: UserProfile | null;
  allUsers: UserProfile[];
  isAuthModalOpen: boolean;
  isAdminPanelOpen: boolean;
  isSupportChatOpen: boolean;
  isShareModalOpen: boolean;
  isOnboardingOpen: boolean;
  isLocked: boolean;
  requirePinForOrders: boolean;

  // Actions
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  loginAsAdmin: () => void;
  logout: () => void;
  switchUserAccount: (userId: string) => void;
  switchSubAccount: (sub: '01' | '06') => void;
  updateUserProfile: (updates: Partial<UserProfile>) => void;
  completeOnboarding: () => void;
  
  lockApp: () => void;
  unlockApp: (pin: string) => boolean;
  setRequirePinForOrders: (required: boolean) => void;
  
  openAuthModal: () => void;
  closeAuthModal: () => void;
  openAdminPanel: () => void;
  closeAdminPanel: () => void;
  openSupportChat: () => void;
  closeSupportChat: () => void;
  openShareModal: () => void;
  closeShareModal: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
}

const USERS_STORAGE_KEY = 'ckv_registered_users_v3';
const ACTIVE_USER_KEY = 'ckv_active_user_id_v3';
const DEFAULT_PIN = '542463';

// Tài khoản Master VIP của Chủ nhân
const ADMIN_MASTER_PROFILE: UserProfile = {
  id: 'user-vip',
  name: 'Hải Đẹp Trai (VIP Master)',
  email: 'admin@ckv.pro',
  role: 'ADMIN',
  accountNumber: '001C888999',
  subAccount: '06', // Margin Deal
  pin: DEFAULT_PIN,
  theme: 'CYBERPUNK',
  hasCompletedOnboarding: true,
  isLoggedIn: true,
  createdAt: '2026-08-01T00:00:00.000Z'
};

const getStoredUsers = (): UserProfile[] => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch {}
  const initial = [ADMIN_MASTER_PROFILE];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const getActiveUser = (users: UserProfile[]): UserProfile => {
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  if (activeId) {
    const found = users.find((u) => u.id === activeId);
    if (found) return found;
  }
  return users[0] || ADMIN_MASTER_PROFILE;
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUsers = getStoredUsers();
  const initialActiveUser = getActiveUser(initialUsers);

  // Thiết lập user scope cho local trading engine
  localTradingEngine.setActiveUserId(initialActiveUser.id, initialActiveUser.role === 'ADMIN');

  return {
    user: initialActiveUser,
    allUsers: initialUsers,
    isAuthModalOpen: false,
    isAdminPanelOpen: false,
    isSupportChatOpen: false,
    isShareModalOpen: false,
    isOnboardingOpen: !initialActiveUser.hasCompletedOnboarding,
    isLocked: false,
    requirePinForOrders: true,

    loginWithGoogle: async () => {
      const googleName = window.prompt('Nhập Tên Google của bạn (Ví dụ: Hoàng Long Trader):', 'Nhà Đầu Tư Mới');
      if (!googleName) return false;
      const googleEmail = window.prompt('Nhập Email Google:', `${googleName.toLowerCase().replace(/\s+/g, '')}@gmail.com`) || 'user@gmail.com';

      const users = getStoredUsers();
      let existingUser = users.find((u) => u.email.toLowerCase() === googleEmail.toLowerCase());

      if (!existingUser) {
        existingUser = {
          id: 'user_' + Date.now(),
          name: googleName,
          email: googleEmail,
          role: 'USER',
          accountNumber: '001C' + Math.floor(100000 + Math.random() * 900000),
          subAccount: '01',
          pin: DEFAULT_PIN,
          theme: 'CYBERPUNK',
          hasCompletedOnboarding: false,
          isLoggedIn: true,
          createdAt: new Date().toISOString()
        };
        users.push(existingUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      localStorage.setItem(ACTIVE_USER_KEY, existingUser.id);
      localTradingEngine.setActiveUserId(existingUser.id, existingUser.role === 'ADMIN');

      set({
        user: existingUser,
        allUsers: users,
        isAuthModalOpen: false,
        isOnboardingOpen: !existingUser.hasCompletedOnboarding
      });

      // Kích hoạt reload store dữ liệu
      window.location.reload();
      return true;
    },

    loginWithEmail: async (email: string, pass: string) => {
      const users = getStoredUsers();
      const found = users.find((u) => u.email.toLowerCase() === email.toLowerCase().trim());
      if (!found) {
        alert('Không tìm thấy tài khoản với email này! Vui lòng chọn tab ĐĂNG KÝ để tạo mới.');
        return false;
      }

      localStorage.setItem(ACTIVE_USER_KEY, found.id);
      localTradingEngine.setActiveUserId(found.id, found.role === 'ADMIN');

      set({
        user: found,
        allUsers: users,
        isAuthModalOpen: false,
        isOnboardingOpen: !found.hasCompletedOnboarding
      });

      window.location.reload();
      return true;
    },

    registerWithEmail: async (name: string, email: string, pass: string) => {
      const users = getStoredUsers();
      if (users.some((u) => u.email.toLowerCase() === email.toLowerCase().trim())) {
        alert('Email này đã được đăng ký! Vui lòng đăng nhập.');
        return false;
      }

      const newUser: UserProfile = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: email.trim(),
        role: 'USER',
        accountNumber: '001C' + Math.floor(100000 + Math.random() * 900000),
        subAccount: '01',
        pin: pass && pass.length >= 4 ? pass : DEFAULT_PIN,
        theme: 'CYBERPUNK',
        hasCompletedOnboarding: false,
        isLoggedIn: true,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem(ACTIVE_USER_KEY, newUser.id);
      localTradingEngine.setActiveUserId(newUser.id, false);

      set({
        user: newUser,
        allUsers: users,
        isAuthModalOpen: false,
        isOnboardingOpen: true
      });

      window.location.reload();
      return true;
    },

    loginAsAdmin: () => {
      const users = getStoredUsers();
      let admin = users.find((u) => u.role === 'ADMIN');
      if (!admin) {
        admin = ADMIN_MASTER_PROFILE;
        users.unshift(admin);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      localStorage.setItem(ACTIVE_USER_KEY, admin.id);
      localTradingEngine.setActiveUserId(admin.id, true);

      set({
        user: admin,
        allUsers: users,
        isAuthModalOpen: false,
        isOnboardingOpen: false
      });

      window.location.reload();
    },

    logout: () => {
      // Đưa về tài khoản khách hoặc mở auth modal
      set({ isAuthModalOpen: true });
    },

    switchUserAccount: (userId: string) => {
      const users = getStoredUsers();
      const target = users.find((u) => u.id === userId);
      if (target) {
        localStorage.setItem(ACTIVE_USER_KEY, target.id);
        localTradingEngine.setActiveUserId(target.id, target.role === 'ADMIN');
        set({ user: target });
        window.location.reload();
      }
    },

    switchSubAccount: (sub: '01' | '06') => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, subAccount: sub };
      const users = getStoredUsers().map((u) => (u.id === current.id ? updated : u));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      set({ user: updated, allUsers: users });
    },

    updateUserProfile: (updates: Partial<UserProfile>) => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, ...updates };
      const users = getStoredUsers().map((u) => (u.id === current.id ? updated : u));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      set({ user: updated, allUsers: users });
    },

    completeOnboarding: () => {
      const current = get().user;
      if (!current) return;
      const updated = { ...current, hasCompletedOnboarding: true };
      const users = getStoredUsers().map((u) => (u.id === current.id ? updated : u));
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      set({ user: updated, allUsers: users, isOnboardingOpen: false });
    },

    lockApp: () => set({ isLocked: true }),
    unlockApp: (pin: string) => {
      const user = get().user;
      if (user && user.pin === pin) {
        set({ isLocked: false });
        return true;
      }
      return false;
    },
    setRequirePinForOrders: (required: boolean) => set({ requirePinForOrders: required }),

    openAuthModal: () => set({ isAuthModalOpen: true }),
    closeAuthModal: () => set({ isAuthModalOpen: false }),
    openAdminPanel: () => set({ isAdminPanelOpen: true }),
    closeAdminPanel: () => set({ isAdminPanelOpen: false }),
    openSupportChat: () => set({ isSupportChatOpen: true }),
    closeSupportChat: () => set({ isSupportChatOpen: false }),
    openShareModal: () => set({ isShareModalOpen: true }),
    closeShareModal: () => set({ isShareModalOpen: false }),
    openOnboarding: () => set({ isOnboardingOpen: true }),
    closeOnboarding: () => set({ isOnboardingOpen: false })
  };
});
