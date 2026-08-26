import { create } from 'zustand';
import { localTradingEngine } from '../services/localTradingEngine';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'USER';
  accountNumber: string;
  subAccount: '01' | '06'; // 01: Thường, 06: Margin
  brokerage: 'DNSE' | 'VPS' | 'TCBS' | 'SSI' | 'VNDIRECT' | 'CUSTOM';
  customMarginRate: number; // %/năm (VD: DNSE 11.5, VPS 13.5, TCBS 10.5, SSI 12.0)
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
  isHelpCenterOpen: boolean;
  isLocked: boolean;
  requirePinForOrders: boolean;

  // Actions
  loginWithGoogle: () => Promise<boolean>;
  loginWithEmail: (email: string, pass: string) => Promise<boolean>;
  registerWithEmail: (name: string, email: string, pass: string) => Promise<boolean>;
  loginAsAdmin: (adminEmail?: string) => void;
  logout: () => void;
  switchUserAccount: (userId: string) => void;
  switchSubAccount: (sub: '01' | '06') => void;
  updateBrokerage: (brokerage: 'DNSE' | 'VPS' | 'TCBS' | 'SSI' | 'VNDIRECT' | 'CUSTOM', rate: number) => void;
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
  openHelpCenter: () => void;
  closeHelpCenter: () => void;
}

const USERS_STORAGE_KEY = 'ckv_registered_users_v5';
const ACTIVE_USER_KEY = 'ckv_active_user_id_v5';
const DEFAULT_PIN = '542463';

// Tài khoản Khách Trải Nghiệm Mặc Định (0đ, 0 CP)
export const GUEST_PROFILE: UserProfile = {
  id: 'guest',
  name: 'Khách Trải Nghiệm',
  email: 'guest@ckv.pro',
  role: 'USER',
  accountNumber: '001C000000',
  subAccount: '01',
  brokerage: 'DNSE',
  customMarginRate: 11.5,
  pin: '',
  theme: 'CYBERPUNK',
  hasCompletedOnboarding: true,
  isLoggedIn: false,
  createdAt: '2026-08-26T00:00:00.000Z'
};

// Tài khoản Master VIP của Chủ nhân (1,000 TPB, NAV 7.598tr, Nợ 7.002tr)
export const ADMIN_MASTER_PROFILE: UserProfile = {
  id: 'admin_hai_master',
  name: 'Hải Đẹp Trai (VIP Master)',
  email: 'admin@ckv.pro',
  role: 'ADMIN',
  accountNumber: '001C888999',
  subAccount: '06', // Margin Deal
  brokerage: 'DNSE',
  customMarginRate: 11.5,
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
  const initial = [GUEST_PROFILE, ADMIN_MASTER_PROFILE];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const getActiveUser = (users: UserProfile[]): UserProfile => {
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  if (activeId) {
    const found = users.find((u) => u.id === activeId);
    if (found) return found;
  }
  // MẶC ĐỊNH TẤT CẢ MÁY LẦN ĐẦU ĐỀU LÀ KHÁCH TRẢI NGHIỆM (0đ)
  return GUEST_PROFILE;
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
    isHelpCenterOpen: false,
    isLocked: false,
    requirePinForOrders: true,

    loginWithGoogle: async () => {
      const email = window.prompt('Nhập địa chỉ Gmail / Email của bạn để đăng nhập:', '');
      if (!email || !email.trim()) return false;
      const cleanEmail = email.trim().toLowerCase();

      // Kiểm tra nếu là Chủ nhân hoặc muốn đăng nhập Admin
      if (cleanEmail === 'admin@ckv.pro' || cleanEmail.includes('admin') || cleanEmail.includes('hai')) {
        const pin = window.prompt('Nhập mã PIN xác thực Chủ Nhân (VIP Master):', '');
        if (pin === '542463' || pin === 'admin' || pin === '5424') {
          get().loginAsAdmin(cleanEmail);
          return true;
        } else {
          alert('Mã PIN không chính xác! Không thể mở tài khoản Admin Master.');
          return false;
        }
      }

      // Đăng nhập tài khoản người dùng thông thường (0đ khởi đầu)
      const users = getStoredUsers();
      let targetUser: UserProfile | undefined = users.find((u) => u.email.toLowerCase() === cleanEmail);

      if (!targetUser) {
        targetUser = {
          id: 'user_' + Date.now(),
          name: cleanEmail.split('@')[0],
          email: cleanEmail,
          role: 'USER',
          accountNumber: '001C' + Math.floor(100000 + Math.random() * 900000),
          subAccount: '01',
          brokerage: 'DNSE',
          customMarginRate: 11.5,
          pin: DEFAULT_PIN,
          theme: 'CYBERPUNK',
          hasCompletedOnboarding: true,
          isLoggedIn: true,
          createdAt: new Date().toISOString()
        };
        users.push(targetUser);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }

      localStorage.setItem(ACTIVE_USER_KEY, targetUser.id);
      localTradingEngine.setActiveUserId(targetUser.id, false);

      set({
        user: targetUser,
        allUsers: users,
        isAuthModalOpen: false
      });

      window.location.reload();
      return true;
    },

    loginWithEmail: async (email: string, pass: string) => {
      const users = getStoredUsers();
      const cleanEmail = email.toLowerCase().trim();

      // Trường hợp đăng nhập Admin
      if (cleanEmail === 'admin@ckv.pro' || cleanEmail.includes('admin')) {
        if (pass === '542463' || pass === 'admin' || pass === '5424') {
          get().loginAsAdmin(cleanEmail);
          return true;
        } else {
          alert('Mã PIN/Mật khẩu Admin không chính xác!');
          return false;
        }
      }

      const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!found) {
        alert('Không tìm thấy tài khoản! Vui lòng chọn tab ĐĂNG KÝ MỚI để tạo tài khoản.');
        return false;
      }

      localStorage.setItem(ACTIVE_USER_KEY, found.id);
      localTradingEngine.setActiveUserId(found.id, found.role === 'ADMIN');

      set({
        user: found,
        allUsers: users,
        isAuthModalOpen: false
      });

      window.location.reload();
      return true;
    },

    registerWithEmail: async (name: string, email: string, pass: string) => {
      const users = getStoredUsers();
      const cleanEmail = email.toLowerCase().trim();
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        alert('Email này đã được đăng ký! Vui lòng chọn ĐĂNG NHẬP.');
        return false;
      }

      const newUser: UserProfile = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        role: 'USER',
        accountNumber: '001C' + Math.floor(100000 + Math.random() * 900000),
        subAccount: '01',
        brokerage: 'DNSE',
        customMarginRate: 11.5,
        pin: pass && pass.length >= 4 ? pass : DEFAULT_PIN,
        theme: 'CYBERPUNK',
        hasCompletedOnboarding: true,
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
        isAuthModalOpen: false
      });

      window.location.reload();
      return true;
    },

    loginAsAdmin: (adminEmail?: string) => {
      const users = getStoredUsers();
      let admin = users.find((u) => u.role === 'ADMIN');
      if (!admin) {
        admin = { ...ADMIN_MASTER_PROFILE, email: adminEmail || ADMIN_MASTER_PROFILE.email };
        users.push(admin);
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      } else if (adminEmail) {
        admin.email = adminEmail;
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
      // Đăng xuất về Guest Mode (0đ)
      localStorage.setItem(ACTIVE_USER_KEY, GUEST_PROFILE.id);
      localTradingEngine.setActiveUserId(GUEST_PROFILE.id, false);
      set({ user: GUEST_PROFILE, isAuthModalOpen: false });
      window.location.reload();
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

    updateBrokerage: (brokerage: 'DNSE' | 'VPS' | 'TCBS' | 'SSI' | 'VNDIRECT' | 'CUSTOM', rate: number) => {
      const current = get().user;
      if (!current) return;
      const updated: UserProfile = { ...current, brokerage, customMarginRate: rate };
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
    closeOnboarding: () => set({ isOnboardingOpen: false }),
    openHelpCenter: () => set({ isHelpCenterOpen: true }),
    closeHelpCenter: () => set({ isHelpCenterOpen: false })
  };
});
