export interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  message: string;
  isFromAdmin: boolean;
  isRead: boolean;
  timestamp: string;
  recipientId?: string;
  replyToId?: string;
}

const MESSAGES_KEY = 'ckv_support_messages_v2';

const defaultWelcomeMessages: SupportMessage[] = [
  {
    id: 'msg_welcome_1',
    userId: 'admin_hai_master',
    userName: 'Hải Đẹp Trai (VIP Master)',
    userEmail: 'admin@ckv.pro',
    message: 'Chào mừng bạn đến với CKV Pro Trader! Tôi là Hải (Admin VIP). Mọi thắc mắc của bạn về điểm hòa vốn, lãi suất Margin hay quản trị danh mục đều được trao đổi bảo mật 1-1 trực tiếp với tôi tại đây.',
    isFromAdmin: true,
    isRead: true,
    timestamp: '2026-08-26T08:00:00.000Z'
  }
];

export const supportService = {
  getMessages(): SupportMessage[] {
    try {
      const raw = localStorage.getItem(MESSAGES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(defaultWelcomeMessages));
    return defaultWelcomeMessages;
  },

  saveMessages(msgs: SupportMessage[]) {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(msgs));
  },

  getMessagesForUser(userId: string): SupportMessage[] {
    const all = this.getMessages();
    if (userId === 'admin_hai_master') return all;
    // Thành viên chỉ nhìn thấy tin nhắn giữa họ và Admin
    return all.filter((m) => m.userId === userId || m.recipientId === userId || (m.isFromAdmin && !m.recipientId));
  },

  getMessagesForThread(memberId: string): SupportMessage[] {
    const all = this.getMessages();
    return all.filter((m) => m.userId === memberId || m.recipientId === memberId || (m.isFromAdmin && !m.recipientId));
  },

  getUnreadCountForAdmin(): number {
    const all = this.getMessages();
    return all.filter((m) => !m.isFromAdmin && !m.isRead).length;
  },

  getUnreadCountForUser(userId: string): number {
    const all = this.getMessages();
    return all.filter((m) => (m.recipientId === userId || m.userId === userId) && m.isFromAdmin && !m.isRead).length;
  },

  sendMessage(
    userId: string,
    userName: string,
    userEmail: string,
    text: string,
    isFromAdmin = false,
    recipientId?: string,
    replyToId?: string
  ): SupportMessage {
    const all = this.getMessages();
    const newMsg: SupportMessage = {
      id: 'msg_' + Date.now(),
      userId,
      userName,
      userEmail,
      message: text.trim(),
      isFromAdmin,
      isRead: isFromAdmin,
      timestamp: new Date().toISOString(),
      recipientId: isFromAdmin ? recipientId : 'admin_hai_master',
      replyToId
    };

    all.push(newMsg);
    this.saveMessages(all);
    return newMsg;
  },

  markAsRead(userId: string, byAdmin = false, targetMemberId?: string) {
    const all = this.getMessages();
    let updated = false;
    all.forEach((m) => {
      if (byAdmin && !m.isFromAdmin && !m.isRead && (!targetMemberId || m.userId === targetMemberId)) {
        m.isRead = true;
        updated = true;
      } else if (!byAdmin && (m.recipientId === userId || m.userId === userId) && m.isFromAdmin && !m.isRead) {
        m.isRead = true;
        updated = true;
      }
    });
    if (updated) {
      this.saveMessages(all);
    }
  }
};
