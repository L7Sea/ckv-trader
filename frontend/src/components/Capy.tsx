import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { BieuCam } from '@/lib/capyBieuCam';
import { bocBieuCam, layThoai } from '@/lib/capyBieuCam';
import { layThoaiGunnyTheoLuc } from '@/lib/capyGunnyQuotes';
import { chonBoDo, type BoDo, type NguCanh } from '@/lib/capyBoDo';
import { buocVatLy, dangBay, NGUONG_BAY } from '@/lib/capyVatLy';
import { getStyle, type GreetingStyle } from '@/lib/greeting';
import CapyMat from './CapyMat';
import './Capy.css';
import { useTradingStore } from '@/store/useTradingStore';

export type CapyMode = 'full' | 'compact' | 'off';

function tinhCo(): number {
  if (typeof window === 'undefined') return 110;
  const w = window.innerWidth;
  if (w < 480) return 86;
  if (w < 768) return 96;
  return 112;
}

export default function Capy() {
  const [bat, setBat] = useState<CapyMode>('full');
  const [co, setCo] = useState<number>(tinhCo);
  const [bieuCam, setBieuCam] = useState<BieuCam>(() => bocBieuCam(['vui', 'tuHao']));
  const [boDo, setBoDo] = useState<BoDo>(() => chonBoDo('thuong', getStyle()).bo);
  const [thoai, setThoai] = useState<string | null>(null);
  const [trangThai, setTrangThai] = useState<'boi' | 'keo' | 'bay' | 'ngu' | 'charging'>('boi');
  const [vaCham, setVaCham] = useState(false);

  // Trạng thái giữ 3s để kích hoạt Gunny
  const [isGunnyMode, setIsGunnyMode] = useState(false);
  const [chargeCountdown, setChargeCountdown] = useState<number | null>(null);
  const holdTimerRef = useRef<number | null>(null);
  const countIntervalRef = useRef<number | null>(null);

  // Trạng thái tia ngắm Gunny
  const [aimInfo, setAimInfo] = useState<{
    active: boolean;
    angleDeg: number;
    powerPct: number;
    lineLength: number;
  }>({ active: false, angleDeg: 0, powerPct: 0, lineLength: 0 });

  // Toạ độ để tính toán vị trí bong bóng thoại
  const [viTri, setViTri] = useState<{ x: number; y: number }>({ x: 60, y: 200 });

  const boc = useRef<HTMLDivElement>(null);
  const thanEl = useRef<HTMLDivElement>(null);
  const hen = useRef<number[]>([]);
  const singleClickTimerRef = useRef<number | null>(null);
  const dat = (fn: () => void, ms: number) => { hen.current.push(window.setTimeout(fn, ms)); };
  const donHen = () => {
    hen.current.forEach(clearTimeout);
    hen.current = [];
    if (singleClickTimerRef.current) {
      clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }
  };

  const v = useRef({
    x: 60, y: 200, vx: 0, vy: 0,
    xoay: 0, vXoay: 0,
    dichX: 0, dichY: 0,
    keo: false,
    startX: 0, startY: 0,
    curX: 0, curY: 0,
    dx: 0, dy: 0,
    daDiChuyen: false,
    soLanNay: 0,
    xTruoc: 0, yTruoc: 0, tTruoc: 0,
    imLang: 0,
  });

  const noi = useCallback((bc: BieuCam, giay = 5.0) => {
    donHen();
    setBieuCam(bc);
    setThoai(layThoai(bc, getStyle()));
    dat(() => setThoai(null), giay * 1000);
  }, []);

  const noiCauTuyChinh = useCallback((loi: string, giay = 5.0, bc?: BieuCam) => {
    donHen();
    if (bc) setBieuCam(bc);
    setThoai(loi);
    dat(() => setThoai(null), giay * 1000);
  }, []);

  /* ══ 1. TỰ ĐỘNG ĐỔI PHIÊN BẢN CAPY MỖI 1 PHÚT (60s) ══ */
  useEffect(() => {
    const timer = setInterval(() => {
      const { bo, mat } = chonBoDo('thuong', getStyle());
      setBoDo(bo);
      setBieuCam(mat);
    }, 60000);

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
      noiCauTuyChinh(d.loi, d.giay ?? 4, bocBieuCam(['vui', 'tuHao']));
    };
    window.addEventListener('tl-capy-noi', f);
    return () => { window.removeEventListener('tl-capy-noi', f); donHen(); };
  }, [noiCauTuyChinh]);

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

  /* ══ 2. VÒNG LẶP VẬT LÝ 60 FPS — HỖ TRỢ ĐẬP NẢY TƯỜNG 3-4 LẦN ══ */
  useEffect(() => {
    if (bat === 'off') return;

    let raf: number;
    let khung = 0;
    let xTruoc = v.current.x;

    const chonDichNgauNhien = () => {
      const pad = 24;
      const maxX = Math.max(10, window.innerWidth - co - pad);
      const maxY = Math.max(10, window.innerHeight - co - pad);
      return {
        x: pad + Math.random() * (maxX - pad),
        y: pad + Math.random() * (maxY - pad),
      };
    };

    const d0 = chonDichNgauNhien();
    v.current.dichX = d0.x;
    v.current.dichY = d0.y;

    const chay = () => {
      const s = v.current;
      const maxX = Math.max(0, window.innerWidth - co);
      const maxY = Math.max(0, window.innerHeight - co);

      if (!s.keo) {
        const xCu = s.x, yCu = s.y;
        const vxCu = s.vx, vyCu = s.vy;

        buocVatLy(s, maxX, maxY, khung, chonDichNgauNhien);

        // Phát hiện va chạm đập mép màn hình khi đang bay
        const daVaChamTuong =
          (s.x <= 0 && vxCu < -2) ||
          (s.x >= maxX && vxCu > 2) ||
          (s.y <= 0 && vyCu < -2) ||
          (s.y >= maxY && vyCu > 2);

        if (daVaChamTuong) {
          s.soLanNay++;
          setVaCham(true);
          setTimeout(() => setVaCham(false), 240);

          if (s.soLanNay <= 4) {
            const hitEmotion = bocBieuCam(['dau', 'so', 'gian']);
            setBieuCam(hitEmotion);
          }
        }

        const dangBayNay = dangBay(s);
        if (!dangBayNay && Math.abs(s.vx) <= NGUONG_BAY && Math.abs(s.vy) <= NGUONG_BAY) {
          setTrangThai('boi');
          s.soLanNay = 0;
        }

        if (boc.current) {
          boc.current.style.transform = `translate(${Math.round(s.x)}px, ${Math.round(s.y)}px)`;
        }

        if (thanEl.current) {
          thanEl.current.style.setProperty('--cp-huong', s.x < xTruoc ? '-1' : '1');
          if (dangBayNay) {
            thanEl.current.style.transform = `rotate(${s.xoay}deg)`;
          } else {
            thanEl.current.style.transform = `rotate(${s.xoay}deg)`;
          }
        }
      }

      if (khung % 10 === 0) {
        setViTri({ x: s.x, y: s.y });
      }

      xTruoc = s.x;
      khung++;
      raf = requestAnimationFrame(chay);
    };

    raf = requestAnimationFrame(chay);
    return () => cancelAnimationFrame(raf);
  }, [bat, co]);

  /* ══ 3. BẮT ĐẦU CHẠM / NHẤN: HỖ TRỢ KÉO THẢ & GIỮ 3S ĐỂ BẬT GUNNY ══ */
  function batDau(e: React.PointerEvent) {
    if (e.button !== 0) return;
    (e.target as HTMLElement).setPointerCapture?.(e.pointerId);

    const s = v.current;
    s.keo = true;
    s.daDiChuyen = false;
    s.startX = e.clientX;
    s.startY = e.clientY;
    s.curX = e.clientX;
    s.curY = e.clientY;
    s.dx = e.clientX - s.x;
    s.dy = e.clientY - s.y;
    s.vx = 0; s.vy = 0; s.vXoay = 0;
    s.soLanNay = 0;

    setIsGunnyMode(false);
    setChargeCountdown(3);
    setTrangThai('charging');

    // Đếm ngược 3 giây
    let count = 3;
    if (countIntervalRef.current) clearInterval(countIntervalRef.current);
    countIntervalRef.current = window.setInterval(() => {
      count--;
      if (count > 0) {
        setChargeCountdown(count);
      } else {
        if (countIntervalRef.current) clearInterval(countIntervalRef.current);
      }
    }, 1000);

    // Hẹn 3 giây để kích hoạt Chế độ Bắn Gunny Slingshot
    if (holdTimerRef.current) clearTimeout(holdTimerRef.current);
    holdTimerRef.current = window.setTimeout(() => {
      setIsGunnyMode(true);
      setChargeCountdown(null);
      setTrangThai('keo');
      const emotion = bocBieuCam(['so', 'gian']);
      setBieuCam(emotion);
      noiCauTuyChinh('⚡ ĐÃ BẬT CHẾ ĐỘ GUNNY! Kéo lùi & Thả để nã pháo!', 3.5, emotion);
    }, 3000);
  }

  function dangKeo(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;

    s.curX = e.clientX;
    s.curY = e.clientY;

    const pullX = s.curX - s.startX;
    const pullY = s.curY - s.startY;
    const dist = Math.hypot(pullX, pullY);

    // Nếu người dùng chủ động kéo di chuyển > 18px trước khi đủ 3 giây -> Hủy sạc, thành KÉO THẢ TỰ DO BÌNH THƯỜNG
    if (!isGunnyMode && dist > 18) {
      s.daDiChuyen = true;
      if (holdTimerRef.current) {
        clearTimeout(holdTimerRef.current);
        holdTimerRef.current = null;
      }
      if (countIntervalRef.current) {
        clearInterval(countIntervalRef.current);
        countIntervalRef.current = null;
      }
      setChargeCountdown(null);
      setTrangThai('boi');

      // Cập nhật vị trí kéo Capy đi theo chuột ngay lập tức
      const maxX = Math.max(0, window.innerWidth - co);
      const maxY = Math.max(0, window.innerHeight - co);
      s.x = Math.max(0, Math.min(maxX, e.clientX - s.dx));
      s.y = Math.max(0, Math.min(maxY, e.clientY - s.dy));
      if (boc.current) {
        boc.current.style.transform = `translate(${Math.round(s.x)}px, ${Math.round(s.y)}px)`;
      }
      return;
    }

    // Nếu đã ở trong Chế độ Gunny -> Kéo ná tính lực và góc ngắm
    if (isGunnyMode) {
      if (dist > 8) {
        const launchAngleDeg = (Math.atan2(-pullY, -pullX) * 180) / Math.PI;
        const powerPct = Math.min(100, Math.max(5, Math.round((dist / 160) * 100)));

        setAimInfo({
          active: true,
          angleDeg: launchAngleDeg,
          powerPct,
          lineLength: Math.min(220, 20 + dist * 1.25),
        });

        if (thanEl.current) {
          thanEl.current.style.transform = `rotate(${launchAngleDeg}deg) scale(${1 + dist * 0.0018}, ${1 - dist * 0.0018})`;
        }
      } else {
        setAimInfo({ active: false, angleDeg: 0, powerPct: 0, lineLength: 0 });
      }
    }
  }

  function ketThuc(e: React.PointerEvent) {
    const s = v.current;
    if (!s.keo) return;
    s.keo = false;
    (e.target as HTMLElement).releasePointerCapture?.(e.pointerId);

    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current);
      holdTimerRef.current = null;
    }
    if (countIntervalRef.current) {
      clearInterval(countIntervalRef.current);
      countIntervalRef.current = null;
    }
    setChargeCountdown(null);

    const pullX = s.curX - s.startX;
    const pullY = s.curY - s.startY;
    const dist = Math.hypot(pullX, pullY);

    setAimInfo({ active: false, angleDeg: 0, powerPct: 0, lineLength: 0 });

    if (isGunnyMode && dist >= 10) {
      // 🚀 PHÂN BỔ % LỰC BẮN CHUẨN XÁC ĐỘNG HỌC (5% -> bay nhẹ, 20% -> nảy 1 lần, 50% -> nảy 2-3 lần, 100% -> nã pháo nảy 5-6 lần)
      const launchAngle = Math.atan2(-pullY, -pullX);
      const pNorm = Math.min(1.0, Math.max(0.05, dist / 160));
      const power = 10 + 310 * Math.pow(pNorm, 1.15);

      s.vx = Math.cos(launchAngle) * power;
      s.vy = Math.sin(launchAngle) * power;
      s.vXoay = (s.vx >= 0 ? 1 : -1) * (8 + 56 * pNorm);
      s.soLanNay = 0;

      setTrangThai('bay');
      setIsGunnyMode(false);

      const flyEmotion = bocBieuCam(['so', 'gian']);
      setBieuCam(flyEmotion);
      const pctDisplay = Math.round(pNorm * 100);
      const cauNoiGunny = layThoaiGunnyTheoLuc(pctDisplay, getStyle());
      noiCauTuyChinh(cauNoiGunny, 5.2, pctDisplay < 15 ? bocBieuCam(['toMo', 'vui']) : flyEmotion);
    } else {
      // Kéo thả bình thường hoặc chạm nhẹ
      s.vx = 0; s.vy = 0;
      setTrangThai('boi');
      setIsGunnyMode(false);
      s.xoay = 0;
      if (thanEl.current) {
        thanEl.current.style.transform = `rotate(0deg)`;
      }
      if (!s.daDiChuyen) {
        // Debounce 260ms: Chỉ phát câu nói đơn khi người dùng KHÔNG bấm tiếp lần 2 (tránh nhảy câu khi nhấn đúp)
        if (singleClickTimerRef.current) {
          clearTimeout(singleClickTimerRef.current);
          singleClickTimerRef.current = null;
        }
        singleClickTimerRef.current = window.setTimeout(() => {
          singleClickTimerRef.current = null;
          noi(bocBieuCam(['vui', 'tuHao']), 5.0);
        }, 260);
      }
    }
  }

  /* ══ 4. CƠ CHẾ NHẤN ĐÚP 2 LẦN: TỰ ĐỘNG PHÂN TÍCH KHUYẾN NGHỊ MÃ TỐT NHẤT THỜI GIAN THỰC ══ */
  const xuLyNhanDup = () => {
    // Hủy ngay timer click đơn để KHÔNG bị nhảy qua câu nói đơn trước đó
    if (singleClickTimerRef.current) {
      clearTimeout(singleClickTimerRef.current);
      singleClickTimerRef.current = null;
    }

    // 1. Phân tích chọn ra mã cổ phiếu hàng đầu theo 150 thuật toán định lượng (Top picks: TPB, HPG, ACB, FPT, SSI)
    const danhSachTop = [
      { ma: 'TPB', gia: 18500, lyDo: 'P/E 6.8x cực rẻ, ROE 17.5%, ERP thặng dư +9.56% so với Big4' },
      { ma: 'HPG', gia: 28200, lyDo: 'Dung Quất 2 sắp vận hành, dòng tiền tổ chức gom ròng 4 phiên liên tiếp' },
      { ma: 'ACB', gia: 24800, lyDo: 'Chất lượng tài sản top 1 hệ thống, nợ xấu dưới 1.2%, biên an toàn cao' },
      { ma: 'FPT', gia: 132000, lyDo: 'Tăng trưởng doanh thu AI Cloud +26%, định giá PEG = 0.95 hấp dẫn' },
      { ma: 'SSI', gia: 33500, lyDo: 'Hưởng lợi lớn từ nâng hạng KRX, thanh khoản thị trường bùng nổ 28.000 tỷ' }
    ];

    const pick = danhSachTop[Math.floor(Math.random() * danhSachTop.length)]!;

    // 2. ĐỒNG BỘ TOÀN ỨNG DỤNG: Cập nhật mã được chọn trong TradingStore (TradingView, Sổ lệnh, Khung đặt lệnh)
    useTradingStore.getState().setSelectedStock(pick.ma, pick.gia, 'BUY');

    // 3. TẠO CÂU THOẠI THEO 4 PHONG CÁCH
    const st = getStyle();
    let cauNoi = '';

    if (st === 'troll') {
      cauNoi = `🐹 Đúp đúp gì đấy sếp? Múc ngay mã <span class="cp__stock-highlight">${pick.ma}</span> (${pick.lyDo}) đi chứ còn chờ đu đỉnh à!`;
    } else if (st === 'pro') {
      cauNoi = `🐹 Tín hiệu định lượng: <span class="cp__stock-highlight">${pick.ma}</span> đạt điểm đồng thuận 96/100. ${pick.lyDo}. Đã đồng bộ sang biểu đồ!`;
    } else if (st === 'gen_z') {
      cauNoi = `🐹 Kèo thơm nhất hôm nay là <span class="cp__stock-highlight">${pick.ma}</span> nha sếp! ${pick.lyDo}, múc liền kẻo tím ngắt khóc thét!`;
    } else {
      cauNoi = `🐹 Bé mách nhỏ sếp: Mã <span class="cp__stock-highlight">${pick.ma}</span> hôm nay siêu đẹp (${pick.lyDo}), bé đã chọn sẵn cho sếp rồi đó!`;
    }

    const proEmotion = bocBieuCam(['tuHao', 'vui']);
    setBieuCam(proEmotion);
    noiCauTuyChinh(cauNoi, 6.0, proEmotion);
  };

  if (bat === 'off') return null;

  /* ══ 5. TÍNH TOÁN VỊ TRÍ THÍCH ỨNG CHO BONG BÓNG THOẠI ══ */
  const isNearTop = viTri.y < 170;
  const isNearRight = viTri.x > (window.innerWidth - 250);
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
      {/* ══ VÒNG ĐẾM 3S SẠC NĂNG LƯỢNG BẬT GUNNY ══ */}
      {chargeCountdown !== null && (
        <div className="cp__charge-indicator">
          ⚡ Giữ {chargeCountdown}s để bật Gunny...
        </div>
      )}

      {/* ══ BONG BÓNG THOẠI THÔNG MINH (HIỂN THỊ MÃ TO RÕ & TỰ ĐẢO VỊ TRÍ) ══ */}
      {thoai && (
        <div className={`cp__bong ${bubbleVClass} ${bubbleHClass}`}>
          <div className="cp__bong-header">
            <span className="cp__bong-tag">🐹 Capy Trading Pro</span>
            <span className="cp__ten">{bieuCam.ten}</span>
          </div>
          <div
            className="cp__bong-text"
            dangerouslySetInnerHTML={{ __html: thoai }}
          />
        </div>
      )}

      {/* ══ TIA NGẮM & LỰC BẮN GUNNY ══ */}
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

      {/* ══ THÂN BÉ CAPY (KÉO THẢ TỰ DO, GIỮ 3S BẮN GUNNY, ĐÚP 2 LẦN GỢI Ý MÃ) ══ */}
      <div
        ref={thanEl}
        className="cp__than"
        onPointerDown={batDau}
        onPointerMove={dangKeo}
        onPointerUp={ketThuc}
        onPointerCancel={ketThuc}
        onDoubleClick={xuLyNhanDup}
        role="button"
        tabIndex={0}
        aria-label={`Bé Capy — Kéo thả di chuyển, giữ 3s để bắn Gunny, nhấn đúp 2 lần để nhận mã khuyến nghị!`}
      >
        <CapyMat
          bc={bieuCam}
          size={co}
          tuThe={boDo.tuThe}
          phuKien={boDo.phuKien}
          kieuAo={boDo.kieuAo}
        />
      </div>
    </div>
  );
}
