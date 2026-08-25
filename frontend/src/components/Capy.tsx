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

/* Cỡ bé: ~1/10 màn hình */
function tinhCo() {
  const canhNgan = Math.min(window.innerWidth, window.innerHeight);
  return Math.round(Math.max(92, Math.min(canhNgan * 0.19, 180)));
}

const NGUONG_KEO = 6;

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

  useEffect(() => {
    const f = () => setKhoMeme(docKho());
    window.addEventListener('tl-capy-meme', f);
    return () => window.removeEventListener('tl-capy-meme', f);
  }, []);

  const boc = useRef<HTMLDivElement>(null);
  const hen = useRef<number[]>([]);
  const dat = (fn: () => void, ms: number) => { hen.current.push(window.setTimeout(fn, ms)); };
  const donHen = () => { hen.current.forEach(clearTimeout); hen.current = []; };

  const v = useRef({
    x: 60, y: 200, vx: 0, vy: 0,
    xoay: 0, vXoay: 0,
    dichX: 0, dichY: 0,
    keo: false, dx: 0, dy: 0,
    xTruoc: 0, yTruoc: 0, tTruoc: 0,
    imLang: 0,
  });

  const noi = useCallback((bc: BieuCam, giay = 3.6, hd?: HanhDong) => {
    donHen();
    setBieuCam(bc);
    setThoai(hd ? layThoaiHanhDong(hd, getStyle()) : layThoai(bc, getStyle()));
    dat(() => setThoai(null), giay * 1000);
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

      if (!s.keo) buocVatLy(s, maxX, maxY, khung, () => ({
        doiDich: moiDich,
        ngu: () => { setTrangThai('ngu'); setBieuCam(bocBieuCam(['ngu'])); },
        thuc: () => { setTrangThai('boi'); setBieuCam(bocBieuCam(['ngacNhien', 'ngoNgac'])); },
      }));

      const dangBayNay = dangBay(s);
      if (bayTruoc && !dangBayNay) {
        setVaCham(true);
        setTimeout(() => setVaCham(false), 420);
        noi(bocBieuCam(['hoangHot', 'chongMat', 'gian']), 3.2, 'nemXongRoi');
      }
      bayTruoc = dangBayNay;

      if (boc.current) {
        const dx = s.x - xTruoc;
        if (Math.abs(dx) > 0.3) {
          boc.current.style.setProperty('--cp-huong', dx > 0 ? '1' : '-1');
        }
        boc.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
        boc.current.style.setProperty('--cp-bong-to', String(1 + (s.vy < 0 ? -s.vy / 28 : 0)));
        boc.current.style.setProperty('--cp-bong-mo', String(Math.max(0.08, 0.28 - Math.abs(s.vy) / 50)));
      }
      xTruoc = s.x;
      khung++;
      raf = requestAnimationFrame(chay);
    };
    raf = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(raf);
  }, [bat, co, noi]);

  function batDau(e: React.PointerEvent) {
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
    const s = v.current;
    s.keo = true;
    s.dx = e.clientX - s.x;
    s.dy = e.clientY - s.y;
    s.vx = 0; s.vy = 0; s.xoay = 0; s.vXoay = 0;
    s.xTruoc = e.clientX; s.yTruoc = e.clientY; s.tTruoc = performance.now();
    s.imLang = 0;
    setTrangThai('keo');
    noi(bocBieuCam(['hoangHot', 'het', 'ngacNhien']), 2.8, 'biNhat');
  }

  function dangKeo(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;
    s.x = Math.max(0, Math.min(window.innerWidth - co, e.clientX - s.dx));
    s.y = Math.max(0, Math.min(window.innerHeight - co, e.clientY - s.dy));

    const now = performance.now();
    const dt = Math.max(1, now - s.tTruoc);
    s.vx = (e.clientX - s.xTruoc) / dt * 16;
    s.vy = (e.clientY - s.yTruoc) / dt * 16;
    s.xTruoc = e.clientX; s.yTruoc = e.clientY; s.tTruoc = now;
  }

  function ketThuc(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;
    s.keo = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    const vTong = Math.hypot(s.vx, s.vy);
    if (vTong > NGUONG_KEO) {
      setTrangThai('bay');
      s.vXoay = (s.vx * 0.4);
      noi(bocBieuCam(['het', 'hoangHot']), 2.6, 'biNem');
    } else {
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
      {/* Ô thoại kiểu Anime Manga siêu rõ nét */}
      {thoai && (
        <div className="cp__bong cp__bong--anime" style={{ bottom: co + 10 }}>
          <div className="cp__bong-header">
            <span className="cp__bong-tag">🐹 Capy Sensei</span>
            <span className="cp__ten">{bieuCam.ten}</span>
          </div>
          <div className="cp__bong-text">{thoai}</div>
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
