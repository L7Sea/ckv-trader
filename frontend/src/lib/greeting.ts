/* ═══════════════════════════════════════════════════════════════
   CKV PRO - LỜI CHÀO CHỨNG KHOÁN THÔNG MINH
   • 6 Buổi: Rạng sáng (0-4h) · Sáng (5-10h) · Trưa (11-13h) · Chiều (14-17h) · Tối (18-21h) · Đêm (22-23h)
   • 4 Phong cách: Vui vẻ (vui) · Troll/Kháy đểu (troll) · Chuyên nghiệp (pro) · Gen Z (gen_z)
   • Thích ứng theo ngữ cảnh Chứng khoán Việt Nam (VN30, T+2.5, Bắt đáy, Đu đỉnh, Cổ tức)
   ═══════════════════════════════════════════════════════════════ */

export type GreetingStyle = 'vui' | 'troll' | 'pro' | 'gen_z';
export type CkvPageKey = 'trade' | 'market' | 'charts' | 'analytics' | 'dividend';
type Buoi = 'rang' | 'sang' | 'trua' | 'chieu' | 'toi' | 'dem';

const LS_STYLE_KEY = 'ckv_greeting_style';

export function getBuoiHienTai(h = new Date().getHours()): Buoi {
  if (h < 5) return 'rang';
  if (h < 11) return 'sang';
  if (h < 14) return 'trua';
  if (h < 18) return 'chieu';
  if (h < 22) return 'toi';
  return 'dem';
}

const TIME_GREETINGS: Record<GreetingStyle, Record<Buoi, string[]>> = {
  vui: {
    rang: ['Rạng sáng rồi, sớm thế này chắc đang soi chart săn siêu cổ', 'Chào bình minh sớm, chuẩn bị tinh thần đón phiên tím lịm nhé!'],
    sang: ['Chào buổi sáng! Sẵn sàng trước giờ ATO chưa?', 'Cà phê sáng thơm nồng, chúc danh mục hôm nay rực rỡ sắc tím!', 'Phiên sáng mở cửa, đón sóng tăng trưởng nào!'],
    trua: ['Nghỉ trưa chút đã, tạm gác bảng điện để ăn cơm nào', 'Tạm khép phiên sáng, danh mục đang xanh mượt chứ?', 'Trưa rồi, nạp năng lượng chờ phiên chiều bùng nổ!'],
    chieu: ['Phiên chiều kịch tính, canh lệnh ATC chuẩn xác nha', 'Chiều nay dòng tiền vào mạnh, chúc anh chốt lời rực rỡ!', 'Chuẩn bị chốt phiên, NAV hôm nay tăng bao nhiêu % rồi?'],
    toi: ['Chào buổi tối! Làm ly nước rồi cùng soi lại sổ lệnh hôm nay', 'Tối rồi, tổng kết NAV và lên kế hoạch săn hàng cho ngày mai nhé!'],
    dem: ['Khuya rồi, nghỉ ngơi thôi anh, mai bảng điện lại mở xanh mướt', 'Đêm muộn rồi, ngủ ngon để mai có tinh thần thép giao dịch nha!'],
  },
  troll: {
    rang: ['03:00 sáng còn mở app? Định đặt lệnh ATO sớm cho đỡ lag à?', 'Khuya lơ khuya lắc còn soi chart, tính bắt đáy hay lại sợ đu đỉnh?'],
    sang: ['Mở app trước giờ ATO, hôm nay tính gồng lãi hay lại cưa chân bàn?', 'Sáng sớm đã vào ngắm bảng, nếu ngắm mà ra tiền thì anh giàu to rồi!', 'Chào buổi sáng, mở phiên ATO nhớ giữ chặt tay lái nha!'],
    trua: ['Nghỉ trưa đi anh, ngắm bảng hoài lái có kéo trần cho đâu!', 'Ăn cơm trưa ngon lành nhé, đừng để mấy cây nến đỏ làm mất ngon!'],
    chieu: ['14:00 rồi kìa, giờ vàng lái ép hay lái kéo đây?', 'Canh ATC dữ quá, định múc thêm hay chuẩn bị chạy làng?'],
    toi: ['Tối rồi mà vẫn vào ngắm NAV, có nở thêm được đồng nào đâu!', 'Soi lịch sử lệnh thấy toàn mua đỉnh bán đáy vậy nè, kháy xíu thôi nha!'],
    dem: ['Khuya rồi tắt máy đi ngủ đi anh, mai thị trường vẫn còn đó mà!'],
  },
  pro: {
    rang: ['Chuẩn bị dữ liệu và vị thế trước phiên giao dịch mới.'],
    sang: ['Chào buổi sáng. Hệ thống giao dịch T+2.5 đã sẵn sàng khớp lệnh.'],
    trua: ['Tổng kết phiên giao dịch buổi sáng. Kiểm soát tỷ trọng an toàn.'],
    chieu: ['Theo dõi sát diễn biến phiên chiều và cân đối danh mục tại ATC.'],
    toi: ['Tổng kết tài sản ròng (NAV) và nhật ký giao dịch trong ngày.'],
    dem: ['Hệ thống đã lưu trữ sổ lệnh an toàn. Chúc quý nhà đầu tư nghỉ ngơi tốt.'],
  },
  gen_z: {
    rang: ['3AM grind, soi chart hunt siêu cổ xịn sò nè bestie!'],
    sang: ['GM! Sáng nay all-in hay chill chill săn hàng tím? Lesgooo!'],
    trua: ['Lunch time! Ăn no nê lấy sức chiều combat với lái nha!', 'Trưa chill, NAV hôm nay slay quá đi!'],
    chieu: ['Afternoon combat! Canh ATC flex lãi tưng bừng nào!'],
    toi: ['Tối chill, mở app check NAV flex nhẹ với anh em!', 'Tối nay không fomo, bảo toàn vốn là chân ái!'],
    dem: ['Khuya rồi ngủ thôi bestie, mai dậy sớm hốt deal hời!'],
  },
};

const CAPY_QUOTES: Record<GreetingStyle, string[]> = {
  vui: [
    'Capy bảo: Đầu tư như ngâm bồn nước nóng, cứ bình tĩnh từ từ tiền sẽ về!',
    'Hôm nay danh mục nở hoa, Capy tặng anh 100 điểm kiên nhẫn!',
    'Cổ tức về tài khoản rồi kìa, Capy chúc mừng anh nhé!',
    'Cổ phiếu tốt như Capy vậy đó, kiên nhẫn nắm giữ là có quà!',
  ],
  troll: [
    'Capy nhắc nhẹ: Đừng fomo đu đỉnh rồi lại bảo tại số phận nha!',
    'Thấy xanh thì ham, thấy đỏ thì hoảng, Capy nhìn mà Capy mệt giùm á!',
    'Lại vào ngắm NAV nữa hả? Tiền không tự đẻ ra khi nhìn đâu anh ơi!',
    'Cắt lỗ đúng lúc là nghệ thuật, còn gồng lỗ là bản năng vô cực!',
  ],
  pro: [
    'Quản trị rủi ro là yếu tố sống còn: Luôn tuân thủ nguyên tắc T+2.5 và tỷ lệ Margin.',
    'Bình quân giá vốn phải có chiến lược, không giải ngân theo cảm xúc.',
    'Hiệu suất dài hạn được quyết định bởi kỷ luật chốt lời và cắt lỗ.',
  ],
  gen_z: [
    'Capy said: No cap, danh mục hôm nay slay cực kỳ!',
    'Đừng để fomo cuốn đi tâm trí, chill như Capy mới là đỉnh nóc kịch trần!',
    'Xanh chín thì chốt, đỏ lòm thì gom, easy game bestie!',
  ],
};

export function getGreetingStyle(): GreetingStyle {
  try {
    const s = localStorage.getItem(LS_STYLE_KEY);
    if (s && s in TIME_GREETINGS) return s as GreetingStyle;
  } catch {}
  return 'vui';
}

export const getStyle = getGreetingStyle;

export function setGreetingStyle(style: GreetingStyle): void {
  try {
    localStorage.setItem(LS_STYLE_KEY, style);
  } catch {}
}

export function getSmartGreeting(name = 'VIP Trader'): string {
  const style = getGreetingStyle();
  const buoi = getBuoiHienTai();
  const list = TIME_GREETINGS[style][buoi] || TIME_GREETINGS.vui.sang;
  const picked = list[Math.floor(Math.random() * list.length)];
  return `${picked} (${name})`;
}

export function getCapyQuote(): string {
  const style = getGreetingStyle();
  const quotes = CAPY_QUOTES[style] || CAPY_QUOTES.vui;
  return quotes[Math.floor(Math.random() * quotes.length)];
}
