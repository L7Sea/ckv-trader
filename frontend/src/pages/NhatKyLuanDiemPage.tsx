import React, { useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, Check, Minus, Target, TrendingDown, TrendingUp, X } from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { useNhatKy } from '../store/useNhatKy';
import { GhiLuanDiem } from '../components/GhiLuanDiem';
import {
  Huong,
  KetQua,
  LuanDiem,
  NHAN_HUONG,
  NHAN_KET_QUA,
  bienDongGia,
  daDoiChieu,
  goiYKetQua,
  quaHanChuaCham,
  thongKe
} from '../services/luanDiem';

/* ═══════════════════════════════════════════════════════════════════════════
   TRANG NHẬT KÝ LUẬN ĐIỂM — ĐIỂM D
   Ghi nhận định · Đối chiếu với kết quả · Xem mình đúng bao nhiêu phần.
   ═══════════════════════════════════════════════════════════════════════════ */

const homNay = () => new Date().toISOString().slice(0, 10);

const mauHuong = (h: Huong) =>
  h === 'TANG' || h === 'GIU' ? 'text-tot' : h === 'GIAM' || h === 'CAT' ? 'text-loi' : 'text-chu-phu';

const KIEU_KQ: Record<KetQua, { chu: string; nen: string; Icon: typeof Check }> = {
  DUNG: { chu: 'text-tot', nen: 'bg-tot-nen', Icon: Check },
  SAI: { chu: 'text-loi', nen: 'bg-loi-nen', Icon: X },
  MOT_PHAN: { chu: 'text-canh-bao', nen: 'bg-canh-bao-nen', Icon: Minus }
};

/* ── Thẻ thống kê tổng ── */
const TheThongKe: React.FC<{ ds: LuanDiem[] }> = ({ ds }) => {
  const tk = thongKe(ds);
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <div className="the p-4">
        <p className="text-xs text-chu-mo">Tổng nhận định</p>
        <p className="so mt-1 text-2xl text-chu">{tk.tong}</p>
      </div>
      <div className="the p-4">
        <p className="text-xs text-chu-mo">Đã đối chiếu</p>
        <p className="so mt-1 text-2xl text-chu">
          {tk.daCham}
          <span className="text-sm text-chu-mo"> / {tk.tong}</span>
        </p>
      </div>
      <div className="the p-4">
        <p className="text-xs text-chu-mo">Điểm chính xác</p>
        <p className={`so mt-1 text-2xl ${tk.tyLeDung === null ? 'text-chu-mo' : tk.tyLeDung >= 50 ? 'text-tot' : 'text-loi'}`}>
          {tk.tyLeDung === null ? '—' : `${tk.tyLeDung}%`}
        </p>
      </div>
      <div className="the p-4">
        <p className="text-xs text-chu-mo">Đúng / Sai / Một phần</p>
        <p className="so mt-1 text-lg">
          <span className="text-tot">{tk.dung}</span>
          <span className="text-chu-mo"> · </span>
          <span className="text-loi">{tk.sai}</span>
          <span className="text-chu-mo"> · </span>
          <span className="text-canh-bao">{tk.motPhan}</span>
        </p>
      </div>
    </div>
  );
};

/* ── Hộp đối chiếu một luận điểm ── */
const HopDoiChieu: React.FC<{ ld: LuanDiem; onXong: () => void }> = ({ ld, onXong }) => {
  const { capNhat, giaHienTai } = useNhatKy();
  const gia = giaHienTai(ld.ma);
  const bd = bienDongGia(ld.giaLucGhi, gia);
  const goiY = goiYKetQua(ld, gia);

  const [ketQua, setKetQua] = useState<KetQua | null>(goiY);
  const [baiHoc, setBaiHoc] = useState('');

  const luu = () => {
    if (!ketQua) return;
    capNhat(ld.id, {
      ketQua,
      giaLucDoiChieu: gia,
      ngayDoiChieu: homNay(),
      baiHoc: baiHoc.trim() || undefined
    });
    onXong();
  };

  return (
    <div className="mt-3 rounded-md border border-vien bg-nen p-3 space-y-3">
      {/* Căn cứ bằng giá — chỉ gợi ý, người dùng tự chấm */}
      {ld.phamVi === 'MA' && (
        <div className="text-xs text-chu-phu">
          {bd === null ? (
            <span className="text-chu-mo">Chưa có giá để đối chiếu — anh tự đánh giá theo nhận định.</span>
          ) : (
            <>
              Giá lúc ghi <b className="so text-chu">{ld.giaLucGhi?.toLocaleString('vi-VN')}</b> → hiện tại{' '}
              <b className="so text-chu">{gia?.toLocaleString('vi-VN')}</b>{' '}
              <span className={bd >= 0 ? 'text-tot' : 'text-loi'}>
                ({bd >= 0 ? '▲' : '▼'} {Math.abs(bd)}%)
              </span>
              {goiY && <span className="text-chu-mo"> · gợi ý: {NHAN_KET_QUA[goiY]}</span>}
            </>
          )}
        </div>
      )}

      <div>
        <p className="text-xs font-semibold text-chu-phu">Anh chấm nhận định này:</p>
        <div className="mt-1.5 flex gap-1.5">
          {(['DUNG', 'MOT_PHAN', 'SAI'] as KetQua[]).map((kq) => {
            const { chu, nen, Icon } = KIEU_KQ[kq];
            const chon = ketQua === kq;
            return (
              <button
                key={kq}
                type="button"
                onClick={() => setKetQua(kq)}
                className={`inline-flex min-h-[44px] flex-1 items-center justify-center gap-1.5 rounded-md border text-xs font-bold transition ${
                  chon ? `${nen} ${chu} border-vien-ro` : 'border-vien text-chu-phu hover:text-chu'
                }`}
              >
                <Icon className="h-4 w-4" /> {NHAN_KET_QUA[kq]}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold text-chu-phu">Bài học rút ra (tuỳ chọn)</label>
        <textarea
          rows={2}
          value={baiHoc}
          onChange={(e) => setBaiHoc(e.target.value)}
          placeholder="Điều gì đúng, điều gì mình đã bỏ sót lần này?"
          className="o-nhap mt-1 resize-none py-2"
        />
      </div>

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onXong} className="nut-phu">
          Huỷ
        </button>
        <button type="button" onClick={luu} disabled={!ketQua} className="nut-chinh disabled:opacity-40">
          Lưu đối chiếu
        </button>
      </div>
    </div>
  );
};

/* ── Một dòng luận điểm ── */
const DongLuanDiem: React.FC<{ ld: LuanDiem }> = ({ ld }) => {
  const xoa = useNhatKy((s) => s.xoa);
  const [dangDoiChieu, setDangDoiChieu] = useState(false);
  const daCham = daDoiChieu(ld);
  const HuongIcon = ld.huong === 'GIAM' || ld.huong === 'CAT' ? TrendingDown : TrendingUp;

  return (
    <div className="the p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {ld.ma ? (
              <span className="rounded bg-the2 px-2 py-0.5 font-mono font-bold text-chu">{ld.ma}</span>
            ) : (
              <span className="rounded bg-the2 px-2 py-0.5 font-semibold text-chu-phu">Thị trường</span>
            )}
            <span className={`inline-flex items-center gap-1 font-semibold ${mauHuong(ld.huong)}`}>
              <HuongIcon className="h-3.5 w-3.5" /> {NHAN_HUONG[ld.huong]}
            </span>
            <span className="text-chu-mo">·</span>
            <span className="text-chu-mo">Tự tin {ld.doTuTin}/5</span>
            <span className="text-chu-mo">·</span>
            <span className="text-chu-mo">{ld.ngayGhi}</span>
            {ld.giaMucTieu && (
              <span className="inline-flex items-center gap-1 text-chu-mo">
                <Target className="h-3 w-3" /> đích {ld.giaMucTieu.toLocaleString('vi-VN')}
              </span>
            )}
          </div>

          <p className="mt-2 text-sm text-chu">{ld.noiDung}</p>

          {daCham && (
            <div className="mt-2 flex flex-wrap items-center gap-2 rounded-md bg-nen p-2 text-xs">
              {(() => {
                const { chu, Icon } = KIEU_KQ[ld.ketQua as KetQua];
                return (
                  <span className={`inline-flex items-center gap-1 font-bold ${chu}`}>
                    <Icon className="h-3.5 w-3.5" /> {NHAN_KET_QUA[ld.ketQua as KetQua]}
                  </span>
                );
              })()}
              {ld.ngayDoiChieu && <span className="text-chu-mo">chấm ngày {ld.ngayDoiChieu}</span>}
              {ld.baiHoc && <span className="w-full text-chu-phu">Bài học: {ld.baiHoc}</span>}
            </div>
          )}
        </div>

        <div className="flex shrink-0 flex-col items-end gap-1.5">
          {!daCham && !dangDoiChieu && (
            <button onClick={() => setDangDoiChieu(true)} className="nut-phu text-xs">
              Đối chiếu
            </button>
          )}
          <button
            onClick={() => xoa(ld.id)}
            className="rounded-md p-1.5 text-chu-mo transition hover:bg-the2 hover:text-loi"
            aria-label="Xoá nhận định"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {dangDoiChieu && <HopDoiChieu ld={ld} onXong={() => setDangDoiChieu(false)} />}
    </div>
  );
};

export const NhatKyLuanDiemPage: React.FC = () => {
  const { user } = useAuthStore();
  const { danhSach, napCho } = useNhatKy();
  const [loc, setLoc] = useState<'TAT_CA' | 'CHUA_CHAM' | 'DA_CHAM'>('TAT_CA');

  // Nạp nhật ký đúng theo tài khoản đang đăng nhập
  useEffect(() => {
    napCho(user?.id || 'guest');
  }, [user?.id, napCho]);

  const quaHan = useMemo(() => quaHanChuaCham(danhSach, homNay()), [danhSach]);

  const hienThi = useMemo(() => {
    if (loc === 'CHUA_CHAM') return danhSach.filter((l) => !daDoiChieu(l));
    if (loc === 'DA_CHAM') return danhSach.filter(daDoiChieu);
    return danhSach;
  }, [danhSach, loc]);

  return (
    <div className="animate-in space-y-5">
      <div className="flex items-center gap-2">
        <BookOpen className="h-6 w-6 text-nhan-chu" />
        <div>
          <h2 className="font-tieu-de text-xl font-bold text-chu">Nhật Ký Nhận Định</h2>
          <p className="text-sm text-chu-phu">Ghi luận điểm, rồi đối chiếu với kết quả để biết mình đúng bao nhiêu phần.</p>
        </div>
      </div>

      <TheThongKe ds={danhSach} />

      {quaHan.length > 0 && (
        <div className="flex items-start gap-2 rounded-md border border-vien bg-canh-bao-nen p-3">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-canh-bao" />
          <p className="text-sm text-chu">
            <b className="text-canh-bao">{quaHan.length}</b> nhận định đã tới hạn đánh giá mà chưa đối chiếu. Chấm sớm để
            nhật ký phản ánh đúng.
          </p>
        </div>
      )}

      <GhiLuanDiem />

      {/* Bộ lọc + danh sách */}
      <div>
        <div className="mb-3 flex items-center gap-1.5">
          {([['TAT_CA', 'Tất cả'], ['CHUA_CHAM', 'Chưa chấm'], ['DA_CHAM', 'Đã chấm']] as const).map(([k, nhan]) => (
            <button
              key={k}
              onClick={() => setLoc(k)}
              className={`min-h-[44px] rounded-md px-3 text-xs font-semibold transition ${
                loc === k ? 'bg-nhan text-tren-nhan' : 'border border-vien text-chu-phu hover:text-chu'
              }`}
            >
              {nhan}
            </button>
          ))}
        </div>

        {hienThi.length === 0 ? (
          <div className="the p-10 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-chu-mo" />
            <p className="mt-3 text-sm text-chu-phu">Chưa có nhận định nào ở đây.</p>
            <p className="mt-1 text-xs text-chu-mo">
              Ghi lại một luận điểm ở khung bên trên — sau này đối chiếu để biết mình đúng hay sai.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {hienThi.map((ld) => (
              <DongLuanDiem key={ld.id} ld={ld} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
