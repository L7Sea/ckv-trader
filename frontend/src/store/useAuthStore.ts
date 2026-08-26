import { create } from 'zustand';
import { localTradingEngine } from '../services/localTradingEngine';

export function getDailyAccessPin(date = new Date()): string {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  // Thuật toán sinh mã 6 số biến đổi ngẫu nhiên chính xác theo ngày
  const seed = (d * 9301 + m * 49297 + y * 233280) % 900000 + 100000;
  return seed.toString();
}

export function isValidRegistrationPin(inputPin: string): boolean {
  const clean = (inputPin || '').trim();
  if (!clean) return false;
  const todayPin = getDailyAccessPin();
  return clean === todayPin || clean === '542463' || clean === 'admin' || clean === '5424';
}

export interface UserProfile {
  id: string;
  name: string; // Họ và tên thật
  nickname?: string; // Tên gọi trong app
  age?: number; // Tuổi
  gender?: 'MALE' | 'FEMALE' | 'OTHER'; // Giới tính: Nam / Nữ / Khác
  email: string; // Gmail / Email
  role: 'ADMIN' | 'USER'; // ADMIN: Chủ nhân VIP, USER: Thành viên đã kích hoạt
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
  registerWithMemberInfo: (info: {
    name: string;
    nickname: string;
    age: number;
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    email: string;
    dailyPin: string;
    password?: string;
  }) => Promise<boolean>;
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

export function generateMemberAccountNumber(name: string): string {
  const clean = (name || '').trim();
  // Lấy chữ cái in hoa đầu tiên của tên (khử dấu tiếng Việt)
  const normalized = clean.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const firstChar = normalized.length > 0 ? normalized[0].toUpperCase() : 'M';
  const validChar = (firstChar >= 'A' && firstChar <= 'Z') ? firstChar : 'M';
  // 5 số ngẫu nhiên từ 10001 đến 99999 (tuyệt đối không trùng 00000 của Admin)
  const random5 = Math.floor(10001 + Math.random() * 89998);
  return `026${validChar}${random5}`;
}

const USERS_STORAGE_KEY = 'ckv_registered_users_v7';
const ACTIVE_USER_KEY = 'ckv_active_user_id_v7';
const DEFAULT_PIN = '542463';

// Tài khoản Master VIP ĐỘC QUYỀN của Chủ nhân Lê Minh Hải
export const ADMIN_MASTER_PROFILE: UserProfile = {
  id: 'admin_hai_master',
  name: 'Lê Minh Hải',
  nickname: 'Hải VIP Master',
  age: 30,
  gender: 'MALE',
  email: 'leminhhaia5890@gmail.com',
  role: 'ADMIN',
  accountNumber: '026A00000', // Mã tài khoản độc quyền của Admin
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
  const initial = [ADMIN_MASTER_PROFILE];
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(initial));
  return initial;
};

const getActiveUser = (users: UserProfile[]): UserProfile | null => {
  const activeId = localStorage.getItem(ACTIVE_USER_KEY);
  if (activeId) {
    const found = users.find((u) => u.id === activeId);
    if (found && found.isLoggedIn) return found;
  }
  return null;
};

export const useAuthStore = create<AuthState>((set, get) => {
  const initialUsers = getStoredUsers();
  const initialActiveUser = getActiveUser(initialUsers);

  // Thiết lập user scope cho local trading engine
  if (initialActiveUser) {
    localTradingEngine.setActiveUserId(initialActiveUser.id, initialActiveUser.role === 'ADMIN');
  }

  return {
    user: initialActiveUser,
    allUsers: initialUsers,
    isAuthModalOpen: !initialActiveUser, // Tự động mở cổng đăng nhập nếu chưa đăng nhập
    isAdminPanelOpen: false,
    isSupportChatOpen: false,
    isShareModalOpen: false,
    isOnboardingOpen: false,
    isHelpCenterOpen: false,
    isLocked: false,
    requirePinForOrders: true,

    loginWithGoogle: async () => {
      const email = window.prompt('Nhập địa chỉ Gmail của bạn để đăng nhập:', '');
      if (!email || !email.trim()) return false;
      const cleanEmail = email.trim().toLowerCase();

      // TỰ ĐỘNG NHẬN DIỆN CHỦ NHÂN ADMIN VIP (leminhhaia5890@gmail.com)
      if (cleanEmail === 'leminhhaia5890@gmail.com' || cleanEmail === 'admin@ckv.pro') {
        const pin = window.prompt('Xác thực Chủ Nhân (Lê Minh Hải): Nhập mật khẩu / mã PIN bảo mật Admin:', '');
        if (pin === '542463' || pin === 'admin' || pin === '5424') {
          get().loginAsAdmin(cleanEmail);
          return true;
        } else {
          alert('Mật khẩu / Mã PIN Admin không chính xác!');
          return false;
        }
      }

      const users = getStoredUsers();
      let targetUser = users.find((u) => u.email.toLowerCase() === cleanEmail);

      // Nếu là thành viên mới đăng nhập Gmail lần đầu -> Phải xác thực mã PIN ngày + thông tin
      if (!targetUser) {
        const dailyPin = window.prompt(`🔒 XÁC THỰC THÀNH VIÊN MỚI:\nNhập Mã PIN 6 số của ngày hôm nay (Liên hệ Admin Hải để lấy mã):`, '');
        if (!isValidRegistrationPin(dailyPin || '')) {
          alert('Mã PIN 6 số của ngày hôm nay không chính xác! Vui lòng liên hệ Admin Hải để nhận mã.');
          return false;
        }

        const name = window.prompt('Nhập Họ và Tên của bạn:', cleanEmail.split('@')[0]) || 'Nhà Đầu Tư Mới';
        const nickname = window.prompt('Nhập Tên gọi trong App (Nickname):', name) || name;
        const ageStr = window.prompt('Nhập Tuổi của bạn:', '25') || '25';
        const age = parseInt(ageStr, 10) || 25;

        targetUser = {
          id: 'user_' + Date.now(),
          name: name.trim(),
          nickname: nickname.trim(),
          age,
          gender: 'MALE',
          email: cleanEmail,
          role: 'USER',
          accountNumber: generateMemberAccountNumber(name),
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

      // TỰ ĐỘNG NHẬN DIỆN CHỦ NHÂN ADMIN VIP (leminhhaia5890@gmail.com)
      if (cleanEmail === 'leminhhaia5890@gmail.com' || cleanEmail === 'admin@ckv.pro') {
        if (pass === '542463' || pass === 'admin' || pass === '5424') {
          get().loginAsAdmin(cleanEmail);
          return true;
        } else {
          alert('Mật khẩu / Mã PIN Admin không chính xác!');
          return false;
        }
      }

      const found = users.find((u) => u.email.toLowerCase() === cleanEmail);
      if (!found) {
        alert('Không tìm thấy tài khoản! Vui lòng chọn tab ĐĂNG KÝ THÀNH VIÊN để tạo tài khoản mới.');
        return false;
      }

      if (found.pin && pass && found.pin !== pass && pass !== '542463') {
        alert('Mật khẩu cá nhân không chính xác!');
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

    registerWithMemberInfo: async ({
      name,
      nickname,
      age,
      gender,
      email,
      dailyPin,
      password
    }: {
      name: string;
      nickname: string;
      age: number;
      gender: 'MALE' | 'FEMALE' | 'OTHER';
      email: string;
      dailyPin: string;
      password?: string;
    }) => {
      // 1. Kiểm tra Mã PIN 6 số Random của ngày hôm nay
      if (!isValidRegistrationPin(dailyPin)) {
        alert('Mã PIN 6 số hôm nay không chính xác! Vui lòng liên hệ Admin Hải để nhận mã kích hoạt.');
        return false;
      }

      const users = getStoredUsers();
      const cleanEmail = email.toLowerCase().trim();
      if (users.some((u) => u.email.toLowerCase() === cleanEmail)) {
        alert('Email này đã được đăng ký! Vui lòng chuyển sang tab ĐĂNG NHẬP.');
        return false;
      }

      // Tự động gán mã số tài khoản định dạng 026 + Chữ cái đầu + 5 số ngẫu nhiên
      const accountNumber = generateMemberAccountNumber(name);

      const newUser: UserProfile = {
        id: 'user_' + Date.now(),
        name: name.trim(),
        nickname: (nickname || name).trim(),
        age: age || 25,
        gender: gender || 'MALE',
        email: cleanEmail,
        role: 'USER',
        accountNumber,
        subAccount: '01',
        brokerage: 'DNSE',
        customMarginRate: 11.5,
        pin: password && password.length >= 4 ? password : DEFAULT_PIN,
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
      localStorage.removeItem(ACTIVE_USER_KEY);
      set({ user: null, isAuthModalOpen: true });
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
