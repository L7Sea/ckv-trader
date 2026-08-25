import { useEffect, useRef, useState, useCallback } from 'react';
import { getCapy, type CapyMode } from '@/lib/capyService';
import { getStyle } from '@/lib/greeting';
import { bocBieuCam, layThoai, BIEU_CAM, type BieuCam, type Nhom } from '@/lib/capyBieuCam';
import { buocVatLy, dangBay } from '@/lib/capyVatLy';
import { layThoaiHanhDong, type HanhDong } from '@/lib/capyThoaiHanhDong';
import { chonBoDo, type NguCanh, layKieuAoTheoBuoi } from '@/lib/capyBoDo';
import type { BoDo } from '@/lib/capyBoDo';
import { docKho } from '@/lib/capyMemeKho';
import type { CongThucMeme } from '@/lib/capyMemeSpec';
import CapyMat from './CapyMat';
import './Capy.css';

/* Cỡ bé: ~1/10 màn hình */
function tinhCo() {
  const canhNgan = Math.min(window.innerWidth, window.innerHeight);
  return Math.round(Math.max(92, Math.min(canhNgan * 0.19, 180)));
}

type TrangThai = 'boi' | 'keo' | 'bay' | 'ngu';

export default function Capy() {
  const [bat, setBat] = useState<CapyMode>(getCapy);
  const [co, setCo] = useState(tinhCo);
  const [bieuCam, setBieuCam] = useState<BieuCam>(() => bocBieuCam(['vui']));
  const [thoai, setThoai] = useState<string | null>(null);
  const [trangThai, setTrangThai] = useState<TrangThai>('boi');
  const [vaCham, setVaCham] = useState(false);
  const [boDo, setBoDo] = useState<BoDo>(() => chonBoDo('thuong', getStyle()).bo);
  const [memeDang, setMemeDang] = useState<CongThucMeme | null>(null);
  const [khoMeme, setKhoMeme] = useState<CongThucMeme[]>(docKho);

  // Slingshot Gunny state
  const [aimInfo, setAimInfo] = useState<{
    active: boolean;
    angleDeg: number;
    powerPct: number;
    lineLength: number;
  }>({ active: false, angleDeg: 0, powerPct: 0, lineLength: 0 });

  // Vị trí toạ độ tức thời cho Bong bóng thông minh
  const [viTri, setViTri] = useState<{ x: number; y: number }>({ x: 100, y: 100 });

  useEffect(() => {
    const f = () => setKhoMeme(docKho());
    window.addEventListener('tl-capy-meme', f);
    return () => window.removeEventListener('tl-capy-meme', f);
  }, []);

  const boc = useRef<HTMLDivElement>(null);
  const thanEl = useRef<HTMLDivElement>(null);
  const hen = useRef<number[]>([]);
  const dat = (fn: () => void, ms: number) => { hen.current.push(window.setTimeout(fn, ms)); };
  const donHen = () => { hen.current.forEach(clearTimeout); hen.current = []; };

  const v = useRef({
    x: 60, y: 200, vx: 0, vy: 0,
    xoay: 0, vXoay: 0,
    dichX: 0, dichY: 0,
    keo: false,
    startX: 0, startY: 0,
    curX: 0, curY: 0,
    dx: 0, dy: 0,
    xTruoc: 0, yTruoc: 0, tTruoc: 0,
    imLang: 0,
  });

  const noi = useCallback((bc: BieuCam, giay = 3.6, hd?: HanhDong) => {
    donHen();
    setBieuCam(bc);
    setThoai(hd ? layThoaiHanhDong(hd, getStyle()) : layThoai(bc, getStyle()));
    dat(() => setThoai(null), giay * 1000);
  }, []);

  /* ══ 1. TỰ ĐỘNG ĐỔI PHIÊN BẢN CAPY MỖI 1 PHÚT (60s) ══ */
  useEffect(() => {
    const timer = setInterval(() => {
      const { bo, mat } = chonBoDo('thuong', getStyle());
      setBoDo(bo);
      setBieuCam(mat);
    }, 60000); // 60 giây = 1 phút

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const f = (e: Event) => setBat((e as CustomEvent).detail as CapyMode);
    window.addEventListener('tl-capy-mode', f);
    return () => window.removeEventListener('tl-capy-mode', f);
  }, []);

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

  /* ══ 2. VÒNG LẶP VẬT LÝ 60 FPS: XOAY 360 ĐỘ & BAY NẢY TƯỜNG ══ */
  useEffect(() => {
    if (bat === 'off') return;
    const s = v.current;
    s.x = window.innerWidth - co - 24;
    s.y = window.innerHeight - co - 90;
    const moiDich = () => {
      s.dichX = Math.random() * (window.innerWidth - co);
      s.dichY = Math.random() * (window.innerHeight - co);
      return { x: s.dichX, y: s.dichY };
    };
    moiDich();

    let raf = 0;
    let khung = 0;
    let xTruoc = s.x;
    let bayTruoc = false;

    const chay = () => {
      const maxX = window.innerWidth - co;
      const maxY = window.innerHeight - co;

      if (!s.keo) {
        buocVatLy(s, maxX, maxY, khung, moiDich);
      }

      const dangBayNay = dangBay(s);
      if (bayTruoc && !dangBayNay) {
        setVaCham(true);
        setTimeout(() => setVaCham(false), 420);
        setTrangThai('boi');
        s.xoay = 0;
        s.vXoay = 0;
        noi(bocBieuCam(['so', 'gian', 'dau']), 3.2, 'rot');
      }
      bayTruoc = dangBayNay;

      if (boc.current) {
        const dx = s.x - xTruoc;
        if (Math.abs(dx) > 0.3 && !s.keo && !dangBayNay) {
          boc.current.style.setProperty('--cp-huong', dx > 0 ? '1' : '-1');
        }
        boc.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
        boc.current.style.setProperty('--cp-bong-to', String(1 + (s.vy < 0 ? -s.vy / 28 : 0)));
        boc.current.style.setProperty('--cp-bong-mo', String(Math.max(0.08, 0.28 - Math.abs(s.vy) / 50)));

        // Cập nhật góc xoay 360 độ cho thân Capy khi bay / ngắm
        if (thanEl.current) {
          if (dangBayNay) {
            thanEl.current.style.transform = `rotate(${s.xoay}deg)`;
          } else if (!s.keo) {
            thanEl.current.style.transform = `rotate(${s.xoay}deg)`;
          }
        }
      }

      // Định kỳ cập nhật toạ độ cho vị trí bong bóng
      if (khung % 12 === 0) {
        setViTri({ x: s.x, y: s.y });
      }

      xTruoc = s.x;
      khung++;
      raf = requestAnimationFrame(chay);
    };

    raf = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(raf);
  }, [bat, co, noi]);

  /* ══ 3. TÍNH NĂNG BẮN SLINGSHOT GUNNY: KÉO NÁ & TÍCH LỰC ══ */
  function batDau(e: React.PointerEvent) {
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const s = v.current;
    s.keo = true;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.curX = e.clientX;
    s.curY = e.clientY;
    s.dx = e.clientX - s.x;
    s.dy = e.clientY - s.y;
    s.vx = 0; s.vy = 0; s.vXoay = 0;
    s.imLang = 0;
    setTrangThai('keo');

    // Chuyển ngay sang cảm xúc TIÊU CỰC (sợ run, mắt chữ X, bốc hỏa)
    const emotion = bocBieuCam(['so', 'gian', 'dau']);
    setBieuCam(emotion);
    noi(emotion, 2.5, 'nhac');
  }

  function dangKeo(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;
    s.curX = e.clientX;
    s.curY = e.clientY;

    const pullX = s.curX - s.startX;
    const pullY = s.curY - s.startY;
    const dist = Math.hypot(pullX, pullY);

    if (dist > 15) {
      // Hướng bắn ngược với hướng kéo ná
      const launchAngleDeg = (Math.atan2(-pullY, -pullX) * 180) / Math.PI;
      const powerPct = Math.min(100, Math.round((dist / 140) * 100));

      setAimInfo({
        active: true,
        angleDeg: launchAngleDeg,
        powerPct,
        lineLength: Math.min(160, dist * 1.2),
      });

      // Xoay Capy hướng về phía sắp bị bắn
      if (thanEl.current) {
        thanEl.current.style.transform = `rotate(${launchAngleDeg}deg) scale(${1 + dist * 0.0015}, ${1 - dist * 0.0015})`;
      }
    } else {
      setAimInfo({ active: false, angleDeg: 0, powerPct: 0, lineLength: 0 });
    }
  }

  function ketThuc(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;
    s.keo = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    const pullX = s.curX - s.startX;
    const pullY = s.curY - s.startY;
    const dist = Math.hypot(pullX, pullY);

    setAimInfo({ active: false, angleDeg: 0, powerPct: 0, lineLength: 0 });

    if (dist >= 25) {
      // BẮN PHÁO GUNNY!
      const launchAngle = Math.atan2(-pullY, -pullX);
      const power = Math.min(38, Math.max(16, dist * 0.28));

      s.vx = Math.cos(launchAngle) * power;
      s.vy = Math.sin(launchAngle) * power;
      s.vXoay = (s.vx >= 0 ? 1 : -1) * (18 + Math.random() * 16);

      setTrangThai('bay');
      const flyEmotion = bocBieuCam(['so', 'gian']);
      setBieuCam(flyEmotion);
      noi(flyEmotion, 3.0, 'nem');
    } else {
      // Chạm nhẹ thông thường
      s.vx = 0; s.vy = 0;
      setTrangThai('boi');
      s.xoay = 0;
      if (thanEl.current) {
        thanEl.current.style.transform = `rotate(0deg)`;
      }
      noi(bocBieuCam(['vui', 'yeu', 'tuHao']), 2.4);
    }
  }

  if (bat === 'off') return null;

  /* ══ 4. TÍNH TOÁN VỊ TRÍ THÍCH ỨNG CHO BONG BÓNG THOẠI & ĐUÔI CHỈ MIỆNG ══ */
  const isNearTop = viTri.y < 170;
  const isNearRight = viTri.x > (window.innerWidth - 240);
  const isNearLeft = viTri.x < 110;

  const bubbleVClass = isNearTop ? 'cp__bong--bottom' : 'cp__bong--top';
  const bubbleHClass = isNearRight
    ? 'cp__bong--align-right'
    : isNearLeft
    ? 'cp__bong--align-left'
    : 'cp__bong--align-center';

  return (
    <div
      ref={boc}
      className={`cp cp--${trangThai}${vaCham ? ' cp--vacham' : ''}`}
      style={{ width: co, height: co }}
    >
      {/* ══ BONG BÓNG THOẠI THÔNG MINH (TỰ CHUYỂN DƯỚI NẾU Ở TRÊN, ĐUÔI CHỈ VÀO MIỆNG) ══ */}
      {thoai && (
        <div className={`cp__bong ${bubbleVClass} ${bubbleHClass}`}>
          <div className="cp__bong-header">
            <span className="cp__bong-tag">🐹 Capy Sensei</span>
            <span className="cp__ten">{bieuCam.ten}</span>
          </div>
          <div className="cp__bong-text">{thoai}</div>
        </div>
      )}

      {/* ══ TIA NGẮM & LỰC BẮN GUNNY KHI ĐANG KÉO NÁ ══ */}
      {aimInfo.active && (
        <div
          className="cp__slingshot-line"
          style={{
            width: `${aimInfo.lineLength}px`,
            transform: `rotate(${aimInfo.angleDeg}deg)`,
          }}
        >
          <div className="cp__aim-arrow" />
          <div className="cp__power-badge">Lực: {aimInfo.powerPct}%</div>
        </div>
      )}

      <div className="cp__bong-dat" aria-hidden="true" />

      {/* ══ THÂN BÉ CAPY (HỖ TRỢ XOAY 360 ĐỘ TỰ DO & KÉO NÁ GUNNY) ══ */}
      <div
        ref={thanEl}
        className="cp__than"
        onPointerDown={batDau}
        onPointerMove={dangKeo}
        onPointerUp={ketThuc}
        onPointerCancel={ketThuc}
        role="button"
        tabIndex={0}
        aria-label={`Bé Capy đang ${bieuCam.ten.toLowerCase()} — kéo lùi để bắn như Gunny!`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            noi(bocBieuCam());
          }
        }}
      >
        <CapyMat
          bc={bieuCam}
          size={co}
          tuThe={memeDang?.tuThe ?? boDo.tuThe}
          phuKien={memeDang?.phuKien ?? boDo.phuKien}
          lopThem={memeDang?.lopThem}
          kieuAo={boDo.kieuAo}
        />
      </div>
    </div>
  );
}
