import { useEffect, useRef, useState, useCallback } from 'react';
import { getCapy, type CapyMode } from '@/lib/capyService';
import { getStyle } from '@/lib/greeting';
import { bocBieuCam, layThoai, BIEU_CAM, type BieuCam } from '@/lib/capyBieuCam';
import { buocVatLy, dangBay } from '@/lib/capyVatLy';
import { layThoaiHanhDong, type HanhDong } from '@/lib/capyThoaiHanhDong';
import { chonBoDo, type NguCanh } from '@/lib/capyBoDo';
import type { BoDo } from '@/lib/capyBoDo';
import { docKho } from '@/lib/capyMemeKho';
import type { CongThucMeme } from '@/lib/capyMemeSpec';
import CapyMat from './CapyMat';
import './Capy.css';

/* ═══════════════════════════════════════════════════════════════
   BÉ CAPY — linh vật bơi lang thang khắp app, tính nết như con mèo.

   TÍNH MÈO nghĩa là gì ở đây (không phải nói cho vui):
     · Nằm ngay chỗ anh cần bấm, và KHÔNG tự tránh.
     · Muốn bấm nút dưới bé thì phải nhấc bé ném đi chỗ khác.
     · Bị chạm thì phản ứng thật: hét, sợ, quạo, e thẹn — tuỳ lúc.
     · Ném xong giận một lát rồi... thản nhiên bơi lại.
     · Để yên lâu thì tự ngủ.

   VÌ SAO KHÔNG DÙNG state React cho toạ độ: vòng lặp vật lý chạy
   60 khung/giây. setState 60 lần/giây kéo cả cây component render
   theo, app giật khi đang nhập liệu. Toạ độ nằm trong ref và ghi
   thẳng vào style.transform; React chỉ render lại khi ĐỔI BIỂU CẢM
   (vài giây một lần).
   ═══════════════════════════════════════════════════════════════ */

/* Cỡ bé: ~1/10 màn hình. Lấy theo cạnh NGẮN nên điện thoại (dọc) và
   máy tính (ngang) đều ra tỉ lệ nhìn thuận mắt, kẹp 2 đầu để không
   bé li ti trên màn 4K, cũng không chiếm nửa màn trên điện thoại. */
function tinhCo() {
  const canhNgan = Math.min(window.innerWidth, window.innerHeight);
  return Math.round(Math.max(92, Math.min(canhNgan * 0.19, 180)));
}

const NGUONG_KEO = 6;        // px — quá mức này coi là KÉO, dưới là CHẠM

type TrangThai = 'boi' | 'keo' | 'bay' | 'ngu';

export default function Capy() {
  const [bat, setBat] = useState<CapyMode>(getCapy);
  const [co, setCo] = useState(tinhCo);
  const [bieuCam, setBieuCam] = useState<BieuCam>(() => bocBieuCam(['vui']));
  const [thoai, setThoai] = useState<string | null>(null);
  const [trangThai, setTrangThai] = useState<TrangThai>('boi');
  const [vaCham, setVaCham] = useState(false);
  /* Bộ đồ hiện tại: tư thế + phụ kiện. Đổi theo NGỮ CẢNH app đang làm gì. */
  const [boDo, setBoDo] = useState<BoDo>(() => chonBoDo('thuong', getStyle()).bo);
  /* Dáng do anh Hải tự nhập ở Cài đặt — dùng LẪN với dáng sẵn có.
     Đang mặc dáng tự nhập thì `memeDang` khác null và nó thắng boDo. */
  const [memeDang, setMemeDang] = useState<CongThucMeme | null>(null);
  const [khoMeme, setKhoMeme] = useState<CongThucMeme[]>(docKho);
  useEffect(() => {
    const f = () => setKhoMeme(docKho());
    window.addEventListener('tl-capy-meme', f);
    return () => window.removeEventListener('tl-capy-meme', f);
  }, []);
  const huong = useRef(1);          // 1 = quay phải, -1 = quay trái

  const boc = useRef<HTMLDivElement>(null);
  const hen = useRef<number[]>([]);
  const dat = (fn: () => void, ms: number) => { hen.current.push(window.setTimeout(fn, ms)); };
  const donHen = () => { hen.current.forEach(clearTimeout); hen.current = []; };

  /* Toàn bộ trạng thái vật lý — KHÔNG phải React state (xem ghi chú đầu file) */
  const v = useRef({
    x: 60, y: 200, vx: 0, vy: 0,
    xoay: 0, vXoay: 0,
    dichX: 0, dichY: 0,          // điểm bé đang bơi tới
    keo: false, dx: 0, dy: 0,    // lệch giữa ngón tay và tâm bé
    xTruoc: 0, yTruoc: 0, tTruoc: 0,
    imLang: 0,                   // đếm khung hình không bị đụng → buồn ngủ
  });

  /* ── Nói 1 câu kèm biểu cảm ── */
  const noi = useCallback((bc: BieuCam, giay = 3.4, hd?: HanhDong) => {
    donHen();
    setBieuCam(bc);
    /* Có hành động (nhấc/ném/rơi) thì câu phải khớp việc vừa xảy ra;
       chạm nhẹ thì bốc theo tâm trạng cho đủ bất ngờ. */
    setThoai(hd ? layThoaiHanhDong(hd, getStyle()) : layThoai(bc, getStyle()));
    dat(() => setThoai(null), giay * 1000);
  }, []);

  /* ── Nghe bật/tắt từ Cài đặt ── */
  useEffect(() => {
    const f = (e: Event) => setBat((e as CustomEvent).detail as CapyMode);
    window.addEventListener('tl-capy-mode', f);
    return () => window.removeEventListener('tl-capy-mode', f);
  }, []);

  /* ── Nghe câu thoại do chỗ khác trong app gửi tới ── */
  useEffect(() => {
    const f = (e: Event) => {
      const d = (e as CustomEvent).detail as { loi: string; giay: number };
      donHen();
      setBieuCam(bocBieuCam(['vui', 'tuHao']));
      setThoai(d.loi);
      dat(() => setThoai(null), (d.giay ?? 4) * 1000);
    };
    window.addEventListener('tl-capy-noi', f);
    return () => { window.removeEventListener('tl-capy-noi', f); donHen(); };
  }, []);

  /* ── Nghe NGỮ CẢNH: chỗ khác trong app báo "đang xuất báo cáo",
        "vừa đạt KPI"... → bé thay đồ cho khớp, hết giờ thì về đồ thường ── */
  useEffect(() => {
    const f = (e: Event) => {
      const d = (e as CustomEvent).detail as { nc: NguCanh; giay: number };
      const { bo, mat } = chonBoDo(d.nc, getStyle());
      setBoDo(bo);
      setBieuCam(mat);
      dat(() => setBoDo(chonBoDo('thuong', getStyle()).bo), (d.giay ?? 8) * 1000);
    };
    window.addEventListener('tl-capy-ngucanh', f);
    return () => window.removeEventListener('tl-capy-ngucanh', f);
  }, []);

  useEffect(() => {
    const f = () => setCo(tinhCo());
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);

  /* ═══ VÒNG LẶP VẬT LÝ ═══ */
  useEffect(() => {
    if (bat === 'off') return;
    const s = v.current;
    s.x = window.innerWidth - co - 24;
    s.y = window.innerHeight - co - 90;
    const moiDich = () => {
      s.dichX = Math.random() * (window.innerWidth - co);
      s.dichY = Math.random() * (window.innerHeight - co);
    };
    moiDich();

    let raf = 0;
    let khung = 0;
    let xTruoc = s.x;
    let bayTruoc = false;
    const chay = () => {
      const maxX = window.innerWidth - co;
      const maxY = window.innerHeight - co;

      /* Toàn bộ chuyển động nằm trong buocVatLy() — hàm thuần, test được
         bằng Node (rAF không chạy khi tab ẩn nên không thể kiểm ở đây). */
      if (!s.keo) buocVatLy(s, maxX, maxY, khung, () => ({
        x: Math.random() * maxX,
        y: Math.random() * maxY,
      }));

      if (boc.current) {
        boc.current.style.transform =
          `translate3d(${s.x}px, ${s.y}px, 0) rotate(${s.xoay}deg)`;

        /* Quay mặt theo hướng đi — học từ góp ý anh gửi. Bơi sang trái mà
           mặt vẫn ngoảnh sang phải thì trông như bị kéo lê. Chỉ lật khi
           tốc độ đủ rõ, nếu không bé sẽ giật qua giật lại lúc gần đứng yên. */
        const dx = s.x - xTruoc;
        if (Math.abs(dx) > 0.15) huong.current = dx > 0 ? 1 : -1;
        xTruoc = s.x;
        boc.current.style.setProperty('--cp-huong', String(huong.current));

        /* Bóng dưới đất: bé càng "cao" (đang bị nhấc / đang bay) thì bóng
           càng to và càng mờ. Đây là mẹo tạo chiều sâu rẻ nhất — mắt người
           đọc khoảng cách qua cái bóng chứ không qua bản thân vật thể. */
        const cao = s.keo ? 1 : Math.min(1, Math.hypot(s.vx, s.vy) / 18);
        boc.current.style.setProperty('--cp-bong-to', String(1 + cao * 0.5));
        boc.current.style.setProperty('--cp-bong-mo', String(0.26 - cao * 0.17));
      }

      /* Vừa tiếp đất sau cú ném → bẹp một cái rồi nảy về. Bản trước bé dừng
         êm ru như đặt xuống, mất hẳn cảm giác "bị ném". */
      const bayGio = dangBay(s);
      if (bayTruoc && !bayGio) {
        setTrangThai('boi');
        setVaCham(true);
        dat(() => setVaCham(false), 380);
        noi(bocBieuCam(['dau', 'gian', 'chan']), 2.8, 'rot');
      }
      bayTruoc = bayGio;

      /* Để yên lâu (~50 giây) thì bé ngủ — đúng kiểu mèo */
      if (!s.keo) s.imLang++;
      if (s.imLang === 3000) {
        setTrangThai('ngu');
        setBieuCam(BIEU_CAM.find((b) => b.ten === 'Ngủ gật') ?? bocBieuCam(['buonNgu']));
      }

      khung++;
      raf = requestAnimationFrame(chay);
    };
    raf = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(raf);
  }, [bat, co]);

  /* ═══ CHẠM / KÉO / NÉM ═══ */
  function batDau(e: React.PointerEvent) {
    const s = v.current;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
    s.keo = true; s.imLang = 0;
    s.vx = 0; s.vy = 0; s.vXoay = 0;
    s.dx = e.clientX - s.x; s.dy = e.clientY - s.y;
    s.xTruoc = e.clientX; s.yTruoc = e.clientY; s.tTruoc = performance.now();
    /* Chưa biết là chạm hay kéo — chờ ngón tay di chuyển mới quyết */
    (e.target as HTMLElement).dataset.dixa = '0';
  }

  function dangKeo(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;
    s.x = e.clientX - s.dx;
    s.y = e.clientY - s.dy;

    const t = performance.now();
    const dt = Math.max(1, t - s.tTruoc);
    /* Vận tốc tức thời, quy về ~pixel mỗi khung 60fps */
    s.vx = ((e.clientX - s.xTruoc) / dt) * 16;
    s.vy = ((e.clientY - s.yTruoc) / dt) * 16;
    s.xTruoc = e.clientX; s.yTruoc = e.clientY; s.tTruoc = t;

    const el = e.target as HTMLElement;
    if (el.dataset.dixa === '0' && Math.hypot(s.vx, s.vy) > NGUONG_KEO) {
      el.dataset.dixa = '1';
      setTrangThai('keo');
      /* Bị nhấc lên giữa không trung → sợ hoặc quạo, tuỳ hôm */
      noi(bocBieuCam(['so', 'gian', 'nguong']), 2.4, 'nhac');
    }
  }

  function ketThuc(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;
    s.keo = false;
    const el = e.target as HTMLElement;
    try { el.releasePointerCapture(e.pointerId); } catch { /* con trỏ đã rời */ }

    const luc = Math.hypot(s.vx, s.vy);

    if (el.dataset.dixa !== '1') {
      /* ── CHẠM NHẸ: đổi biểu cảm + nói 1 câu ── */
      s.vx = 0; s.vy = 0;
      setTrangThai('boi');
      /* Có dáng tự nhập thì thỉnh thoảng bốc trúng — trộn vào cho bất ngờ */
      if (khoMeme.length && Math.random() < 0.5) {
        const m = khoMeme[Math.floor(Math.random() * khoMeme.length)]!;
        setMemeDang(m);
        donHen();
        setBieuCam({ ten: m.ten, mat: m.mat, mieng: m.mieng, phu: m.phu, nhom: m.nhom ?? 'vui' });
        setThoai(m.thoai ?? m.ten);
        dat(() => setThoai(null), 3400);
        dat(() => setMemeDang(null), 9000);
        return;
      }
      setMemeDang(null);
      noi(bocBieuCam());
      return;
    }

    if (luc > 4) {
      /* ── NÉM ĐI: bay, lăn tít, hét lên ── */
      setTrangThai('bay');
      s.vXoay = Math.max(-22, Math.min(22, s.vx * 1.7));
      noi(bocBieuCam(['so', 'gian']), 2.2, 'nem');
      /* KHÔNG hẹn giờ cứng 2.2s nữa: bé "rơi uỵch" đúng lúc vận tốc tắt hẳn,
         do vòng lặp vật lý phát hiện. Ném mạnh thì bay lâu, ném nhẹ thì tiếp
         đất sớm — hẹn giờ cứng làm bé than "rớt rồi" trong khi còn đang bay. */
    } else {
      /* Đặt xuống nhẹ nhàng */
      s.vx = 0; s.vy = 0;
      setTrangThai('boi');
      noi(bocBieuCam(['nguong', 'toMo']), 2.4);
    }
  }

  if (bat === 'off') return null;

  return (
    <div
      ref={boc}
      className={`cp cp--${trangThai}${vaCham ? ' cp--vacham' : ''}`}
      style={{ width: co, height: co }}
    >
      {thoai && (
        <div className="cp__bong" style={{ bottom: co + 6 }}>
          {thoai}
          <span className="cp__ten">{bieuCam.ten}</span>
        </div>
      )}

      <div className="cp__bong-dat" aria-hidden="true" />

      <div
        className="cp__than"
        style={{ transform: `rotate(${bieuCam.nghieng ?? 0}deg)` }}
        onPointerDown={batDau}
        onPointerMove={dangKeo}
        onPointerUp={ketThuc}
        onPointerCancel={ketThuc}
        role="button"
        tabIndex={0}
        aria-label={`Bé Capy đang ${bieuCam.ten.toLowerCase()} — chạm để đùa, kéo để ném đi chỗ khác`}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); noi(bocBieuCam()); } }}
      >
        <CapyMat
          bc={bieuCam}
          size={co}
          tuThe={memeDang?.tuThe ?? boDo.tuThe}
          phuKien={memeDang?.phuKien ?? boDo.phuKien}
          lopThem={memeDang?.lopThem}
        />
      </div>
    </div>
  );
}
