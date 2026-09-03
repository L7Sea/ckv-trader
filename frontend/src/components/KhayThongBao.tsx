import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from 'lucide-react';
import { MucThongBao, useThongBao } from '../lib/thongBao';

/* ═══════════════════════════════════════════════════════════════════════════
   KHAY THÔNG BÁO + HỘP HỎI XÁC NHẬN
   ───────────────────────────────────────────────────────────────────────────
   Thay toàn bộ `window.alert` / `confirm` / `prompt`. Theo bảng màu app nên đổi
   được cả sáng lẫn tối, và không đóng băng luồng JavaScript.

   Mỗi mức dùng MỘT BIỂU TƯỢNG RIÊNG, không chỉ khác màu — người mù màu vẫn
   phân biệt được đây là lỗi hay chỉ là cảnh báo.
   ═══════════════════════════════════════════════════════════════════════════ */

const KIEU: Record<MucThongBao, { nen: string; chu: string; Icon: typeof Info; nhan: string }> = {
  tot: { nen: 'bg-tot-nen', chu: 'text-tot', Icon: CheckCircle2, nhan: 'Xong' },
  'canh-bao': { nen: 'bg-canh-bao-nen', chu: 'text-canh-bao', Icon: AlertTriangle, nhan: 'Cần để ý' },
  loi: { nen: 'bg-loi-nen', chu: 'text-loi', Icon: XCircle, nhan: 'Lỗi' },
  tin: { nen: 'bg-the2', chu: 'text-nhan-chu', Icon: Info, nhan: 'Thông tin' }
};

/* Hộp nhập một con số — thay window.prompt. Tách riêng để giữ được state của
   ô nhập mà không làm KhayThongBao dựng lại mỗi lần gõ phím. */
const HopNhap: React.FC = () => {
  const { cauHoiNhap, traLoiNhap } = useThongBao();
  const [giaTri, setGiaTri] = useState('');

  useEffect(() => {
    if (cauHoiNhap) setGiaTri(cauHoiNhap.giaTriDau);
  }, [cauHoiNhap]);

  if (!cauHoiNhap) return null;

  const xong = () => {
    const so = Number(giaTri.replace(/[^0-9]/g, '')) || 0;
    traLoiNhap(so);
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-nen/80 p-4">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          xong();
        }}
        className="animate-in w-full max-w-sm rounded-lg border border-vien bg-the p-5 shadow-md"
      >
        <h3 className="font-tieu-de text-lg font-bold text-chu">{cauHoiNhap.loi}</h3>
        {cauHoiNhap.chiTiet && <p className="mt-2 text-sm text-chu-phu">{cauHoiNhap.chiTiet}</p>}

        <label className="mt-4 block text-xs font-semibold text-chu-phu">{cauHoiNhap.nhan}</label>
        <input
          autoFocus
          inputMode="numeric"
          value={giaTri}
          onChange={(e) => setGiaTri(e.target.value)}
          placeholder={cauHoiNhap.goiY}
          className="o-nhap mt-1 so"
        />

        <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => traLoiNhap(null)} className="nut-phu">
            Huỷ
          </button>
          <button type="submit" className="nut-chinh">
            {cauHoiNhap.nhanDong}
          </button>
        </div>
      </form>
    </div>
  );
};

export const KhayThongBao: React.FC = () => {
  const { danhSach, tat, cauHoi, traLoiCauHoi } = useThongBao();

  return (
    <>
      {/* Khay xếp từ dưới lên, không che thanh điều hướng dưới cùng trên điện thoại */}
      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[60] flex flex-col items-center gap-2 p-3 pb-24 sm:items-end sm:pb-4"
        role="status"
        aria-live="polite"
      >
        {danhSach.map((t) => {
          const { nen, chu, Icon, nhan } = KIEU[t.muc];
          return (
            <div
              key={t.id}
              className={`animate-in pointer-events-auto flex w-full max-w-md items-start gap-3 rounded-lg border border-vien ${nen} p-3 shadow-md`}
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${chu}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className={`text-xs font-bold uppercase tracking-wide ${chu}`}>{nhan}</p>
                <p className="mt-0.5 text-sm text-chu">{t.loi}</p>
                {t.chiTiet && t.chiTiet.length > 0 && (
                  <ul className="mt-1.5 space-y-1">
                    {t.chiTiet.map((d, i) => (
                      <li key={i} className="flex gap-1.5 text-xs text-chu-phu">
                        <span aria-hidden="true">·</span>
                        <span>{d}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <button
                onClick={() => tat(t.id)}
                className="shrink-0 rounded-md p-1 text-chu-mo transition hover:bg-the hover:text-chu"
                aria-label="Đóng thông báo"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Hộp hỏi xác nhận — thay window.confirm */}
      {cauHoi && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-nen/80 p-4">
          <div className="animate-in w-full max-w-sm rounded-lg border border-vien bg-the p-5 shadow-md">
            <h3 className="font-tieu-de text-lg font-bold text-chu">{cauHoi.loi}</h3>
            {cauHoi.chiTiet && <p className="mt-2 text-sm text-chu-phu">{cauHoi.chiTiet}</p>}

            <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <button onClick={() => traLoiCauHoi(false)} className="nut-phu">
                {cauHoi.nhanHuy}
              </button>
              <button
                onClick={() => traLoiCauHoi(true)}
                autoFocus
                className={
                  cauHoi.nguyHiem
                    ? 'nut bg-loi text-tren-nhan hover:opacity-90'
                    : 'nut-chinh'
                }
              >
                {cauHoi.nhanDong}
              </button>
            </div>
          </div>
        </div>
      )}

      <HopNhap />
    </>
  );
};
