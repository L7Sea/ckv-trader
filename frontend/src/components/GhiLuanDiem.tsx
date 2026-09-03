import React, { useState } from 'react';
import { PenLine, X } from 'lucide-react';
import { Huong, NHAN_HUONG, PhamVi } from '../services/luanDiem';
import { useNhatKy } from '../store/useNhatKy';
import { marketDataService } from '../services/marketDataService';

/* Form ghi một luận điểm mới. Gọn để không cản việc ghi nhanh, nhưng ô nhận
   định là textarea đủ rộng — đây là chỗ thiếu nhất của app cũ (chỉ có 1 dòng). */

const HUONGS: Huong[] = ['TANG', 'GIAM', 'DI_NGANG', 'GIU', 'CAT'];

export const GhiLuanDiem: React.FC<{ maGoiY?: string; onXong?: () => void }> = ({ maGoiY, onXong }) => {
  const them = useNhatKy((s) => s.them);

  const [phamVi, setPhamVi] = useState<PhamVi>(maGoiY ? 'MA' : 'THI_TRUONG');
  const [ma, setMa] = useState(maGoiY || '');
  const [huong, setHuong] = useState<Huong>('TANG');
  const [noiDung, setNoiDung] = useState('');
  const [doTuTin, setDoTuTin] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [giaMucTieu, setGiaMucTieu] = useState('');
  const [hanDanhGia, setHanDanhGia] = useState('');

  const dat = noiDung.trim().length > 0 && (phamVi === 'THI_TRUONG' || ma.trim().length > 0);

  const luuLai = () => {
    if (!dat) return;
    const maSach = ma.trim().toUpperCase();
    const giaLucGhi =
      phamVi === 'MA' ? marketDataService.getWatchlist().find((w) => w.symbol === maSach)?.price : undefined;

    them({
      phamVi,
      ma: phamVi === 'MA' ? maSach : undefined,
      huong,
      noiDung: noiDung.trim(),
      doTuTin,
      giaLucGhi,
      giaMucTieu: giaMucTieu ? Number(giaMucTieu.replace(/[^0-9]/g, '')) || undefined : undefined,
      hanDanhGia: hanDanhGia || undefined
    });

    setNoiDung('');
    setGiaMucTieu('');
    setHanDanhGia('');
    onXong?.();
  };

  return (
    <div className="the p-4 sm:p-5 space-y-4">
      <div className="flex items-center gap-2">
        <PenLine className="h-5 w-5 text-nhan-chu" />
        <h3 className="font-tieu-de text-lg font-bold text-chu">Ghi một nhận định</h3>
      </div>

      {/* Phạm vi: về một mã hay về thị trường chung */}
      <div className="grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={() => setPhamVi('MA')}
          className={`nut ${phamVi === 'MA' ? 'bg-nhan text-tren-nhan' : 'nut-phu'}`}
        >
          Về một mã
        </button>
        <button
          type="button"
          onClick={() => setPhamVi('THI_TRUONG')}
          className={`nut ${phamVi === 'THI_TRUONG' ? 'bg-nhan text-tren-nhan' : 'nut-phu'}`}
        >
          Về thị trường chung
        </button>
      </div>

      {phamVi === 'MA' && (
        <div>
          <label className="text-xs font-semibold text-chu-phu">Mã cổ phiếu</label>
          <input
            value={ma}
            onChange={(e) => setMa(e.target.value.toUpperCase())}
            placeholder="VD: TPB"
            className="o-nhap mt-1 uppercase"
          />
          {ma && (
            <p className="mt-1 text-xs text-chu-mo">
              Giá lúc ghi sẽ lấy từ bảng giá hiện tại — làm mốc để đối chiếu sau.
            </p>
          )}
        </div>
      )}

      {/* Hướng kỳ vọng */}
      <div>
        <label className="text-xs font-semibold text-chu-phu">Kỳ vọng</label>
        <div className="mt-1 flex flex-wrap gap-1.5">
          {HUONGS.map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setHuong(h)}
              className={`min-h-[44px] rounded-md border px-3 text-xs font-semibold transition ${
                huong === h ? 'border-nhan-chu bg-the2 text-chu' : 'border-vien text-chu-phu hover:text-chu'
              }`}
            >
              {NHAN_HUONG[h]}
            </button>
          ))}
        </div>
      </div>

      {/* Nội dung — chỗ quan trọng nhất, textarea rộng */}
      <div>
        <label className="text-xs font-semibold text-chu-phu">Luận điểm của anh</label>
        <textarea
          rows={4}
          value={noiDung}
          onChange={(e) => setNoiDung(e.target.value)}
          placeholder="VD: TPB giữ nền 14.6 rất khoẻ, khối ngoại bán ròng nhưng tập trung ở mã khác. Không cắt lỗ vì biên an toàn còn nguyên."
          className="o-nhap mt-1 resize-none py-2"
          style={{ minHeight: 'auto' }}
        />
      </div>

      {/* Độ tự tin + đích giá + hạn — hàng phụ */}
      <div className="grid gap-3 sm:grid-cols-3">
        <div>
          <label className="text-xs font-semibold text-chu-phu">Độ tự tin</label>
          <div className="mt-1 flex gap-1">
            {[1, 2, 3, 4, 5].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setDoTuTin(m as 1 | 2 | 3 | 4 | 5)}
                aria-label={`Độ tự tin ${m} trên 5`}
                className={`h-11 flex-1 rounded-md border text-sm font-bold transition ${
                  doTuTin >= m ? 'border-nhan-chu bg-the2 text-nhan-chu' : 'border-vien text-chu-mo'
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {phamVi === 'MA' && (
          <div>
            <label className="text-xs font-semibold text-chu-phu">Đích giá (tuỳ chọn)</label>
            <input
              value={giaMucTieu}
              onChange={(e) => setGiaMucTieu(e.target.value)}
              inputMode="numeric"
              placeholder="VD: 16500"
              className="o-nhap mt-1 so"
            />
          </div>
        )}

        <div>
          <label className="text-xs font-semibold text-chu-phu">Hạn đánh giá (tuỳ chọn)</label>
          <input
            type="date"
            value={hanDanhGia}
            onChange={(e) => setHanDanhGia(e.target.value)}
            className="o-nhap mt-1"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2">
        {onXong && (
          <button type="button" onClick={onXong} className="nut-phu">
            <X className="h-4 w-4" /> Đóng
          </button>
        )}
        <button type="button" onClick={luuLai} disabled={!dat} className="nut-chinh disabled:opacity-40">
          Lưu nhận định
        </button>
      </div>
    </div>
  );
};
