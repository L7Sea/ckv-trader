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

const MESSAGES_KEY = 'ckv_support_messages_v1';

const defaultWelcomeMessages: SupportMessage[] = [
  {
    id: 'msg_welcome_1',
    userId: 'user-vip',
    userName: 'Hải Đẹp Trai (VIP Master)',
    userEmail: 'admin@ckv.pro',
    message: 'Chào mừng bạn đến với CKV Pro Trader! Tôi là Hải (Admin VIP). Nếu bạn có bất kỳ câu hỏi nào về cách quản trị vị thế, nhật ký T+2.5, hay tính điểm hòa vốn Deal, hãy nhắn tin trực tiếp cho tôi tại đây nhé!',
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
    if (userId === 'user-vip') return all;
    return all.filter((m) => m.userId === userId || m.recipientId === userId || (m.userId === 'user-vip' && !m.recipientId));
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
      recipientId,
      replyToId
    };

    all.push(newMsg);
    this.saveMessages(all);
    return newMsg;
  },

  markAsRead(userId: string, byAdmin = false) {
    const all = this.getMessages();
    let updated = false;
    all.forEach((m) => {
      if (byAdmin && !m.isFromAdmin && !m.isRead) {
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
