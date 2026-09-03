/* ═══════════════════════════════════════════════════════════════════════════
   KIỂM THỬ NHẬT KÝ LUẬN ĐIỂM
   Import ĐÚNG module app đang chạy (frontend/src/services/luanDiem.ts).
   Chạy: node scripts/test-luan-diem.mjs
   ═══════════════════════════════════════════════════════════════════════════ */

import assert from 'node:assert/strict';
import test from 'node:test';

import {
  bienDongGia,
  daDoiChieu,
  goiYKetQua,
  moiNhatTruoc,
  quaHanChuaCham,
  thongKe
} from '../frontend/src/services/luanDiem.ts';

/** Dựng nhanh một luận điểm cho test. */
const ld = (o) => ({
  id: o.id || 'x',
  ngayGhi: o.ngayGhi || '2026-09-01',
  phamVi: o.ma ? 'MA' : 'THI_TRUONG',
  ma: o.ma,
  huong: o.huong || 'TANG',
  noiDung: o.noiDung || 'test',
  doTuTin: o.doTuTin || 3,
  giaLucGhi: o.giaLucGhi,
  giaMucTieu: o.giaMucTieu,
  hanDanhGia: o.hanDanhGia,
  ketQua: o.ketQua ?? null,
  giaLucDoiChieu: o.giaLucDoiChieu,
  ngayDoiChieu: o.ngayDoiChieu,
  baiHoc: o.baiHoc
});

test('1. Biến động giá tính đúng, và null khi thiếu dữ liệu', () => {
  assert.equal(bienDongGia(14000, 14700), 5.0);
  assert.equal(bienDongGia(15000, 14700), -2.0);
  assert.equal(bienDongGia(0, 14700), null, 'giá gốc 0 phải trả null, không chia cho 0');
  assert.equal(bienDongGia(14000, undefined), null);
  assert.equal(bienDongGia(undefined, 14700), null);
});

test('2. daDoiChieu: chỉ đúng khi đã có kết quả', () => {
  assert.equal(daDoiChieu(ld({ ketQua: null })), false);
  assert.equal(daDoiChieu(ld({ ketQua: 'DUNG' })), true);
  assert.equal(daDoiChieu(ld({ ketQua: 'SAI' })), true);
  assert.equal(daDoiChieu(ld({ ketQua: 'MOT_PHAN' })), true);
});

test('3. Gợi ý kết quả theo giá — hướng TĂNG', () => {
  const l = ld({ huong: 'TANG', giaLucGhi: 14000 });
  assert.equal(goiYKetQua(l, 14700), 'DUNG', 'tăng 5% với nhận định TĂNG = đúng');
  assert.equal(goiYKetQua(l, 13500), 'SAI', 'giảm 3.6% với nhận định TĂNG = sai');
  assert.equal(goiYKetQua(l, 14050), 'MOT_PHAN', 'nhích 0.36% = một phần (dưới ngưỡng 1%)');
});

test('4. Gợi ý kết quả — hướng GIẢM ngược lại hướng TĂNG', () => {
  const l = ld({ huong: 'GIAM', giaLucGhi: 14000 });
  assert.equal(goiYKetQua(l, 13500), 'DUNG');
  assert.equal(goiYKetQua(l, 14700), 'SAI');
});

test('5. Gợi ý kết quả — GIỮ/CẮT là quyết định hành động, không tự gợi ý bằng giá', () => {
  assert.equal(goiYKetQua(ld({ huong: 'GIU', giaLucGhi: 14000 }), 14700), null);
  assert.equal(goiYKetQua(ld({ huong: 'CAT', giaLucGhi: 14000 }), 13000), null);
});

test('6. Gợi ý kết quả — thiếu giá thì không gợi ý (nhận định định tính)', () => {
  assert.equal(goiYKetQua(ld({ huong: 'TANG' }), 14700), null, 'không có giá lúc ghi');
  assert.equal(goiYKetQua(ld({ huong: 'TANG', giaLucGhi: 14000 }), undefined), null, 'không có giá hiện tại');
});

test('7. Thống kê: điểm chính xác tính một phần = nửa điểm', () => {
  const ds = [
    ld({ id: '1', ketQua: 'DUNG' }),
    ld({ id: '2', ketQua: 'DUNG' }),
    ld({ id: '3', ketQua: 'SAI' }),
    ld({ id: '4', ketQua: 'MOT_PHAN' }),
    ld({ id: '5', ketQua: null }) // chưa chấm, không tính vào tỉ lệ
  ];
  const tk = thongKe(ds);
  assert.equal(tk.tong, 5);
  assert.equal(tk.daCham, 4);
  assert.equal(tk.chuaCham, 1);
  assert.equal(tk.dung, 2);
  assert.equal(tk.sai, 1);
  assert.equal(tk.motPhan, 1);
  // (2 đúng + 0.5×1 một phần) / 4 đã chấm = 2.5/4 = 62.5%
  assert.equal(tk.tyLeDung, 62.5);
});

test('8. Thống kê rỗng: tỉ lệ là null, không phải 0 (chưa chấm khác chấm sai)', () => {
  const tk = thongKe([ld({ ketQua: null }), ld({ ketQua: null })]);
  assert.equal(tk.daCham, 0);
  assert.equal(tk.tyLeDung, null);
});

test('9. Thống kê tách theo hướng và theo độ tự tin', () => {
  const ds = [
    ld({ huong: 'TANG', doTuTin: 5, ketQua: 'DUNG' }),
    ld({ huong: 'TANG', doTuTin: 5, ketQua: 'SAI' }),
    ld({ huong: 'GIAM', doTuTin: 2, ketQua: 'DUNG' })
  ];
  const tk = thongKe(ds);
  assert.equal(tk.theoHuong.TANG.daCham, 2);
  assert.equal(tk.theoHuong.TANG.tyLeDung, 50.0);
  assert.equal(tk.theoHuong.GIAM.tyLeDung, 100.0);
  assert.equal(tk.theoHuong.DI_NGANG.daCham, 0);
  assert.equal(tk.theoHuong.DI_NGANG.tyLeDung, null);
  assert.equal(tk.theoDoTuTin[5].daCham, 2);
  assert.equal(tk.theoDoTuTin[5].tyLeDung, 50.0);
  assert.equal(tk.theoDoTuTin[2].tyLeDung, 100.0);
});

test('10. Quá hạn chưa chấm: nhắc đúng cái tới hạn mà chưa đối chiếu', () => {
  const ds = [
    ld({ id: '1', hanDanhGia: '2026-09-01', ketQua: null }), // quá hạn, chưa chấm
    ld({ id: '2', hanDanhGia: '2026-09-01', ketQua: 'DUNG' }), // quá hạn NHƯNG đã chấm
    ld({ id: '3', hanDanhGia: '2026-12-31', ketQua: null }), // chưa tới hạn
    ld({ id: '4', ketQua: null }) // không đặt hạn
  ];
  const qua = quaHanChuaCham(ds, '2026-09-04');
  assert.deepEqual(qua.map((l) => l.id), ['1']);
});

test('11. Sắp xếp mới nhất lên đầu, không sửa mảng gốc', () => {
  const goc = [ld({ id: 'a', ngayGhi: '2026-09-01' }), ld({ id: 'b', ngayGhi: '2026-09-03' })];
  const sx = moiNhatTruoc(goc);
  assert.deepEqual(sx.map((l) => l.id), ['b', 'a']);
  assert.deepEqual(goc.map((l) => l.id), ['a', 'b'], 'không được sửa mảng gốc');
});
