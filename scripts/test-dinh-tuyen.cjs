#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   test-dinh-tuyen.cjs — CANH BẢNG ĐỊA CHỈ 8 MÀN HÌNH

   App này chạy nhiều tháng KHÔNG có router (thêm 03/09/2026). Bài test này
   giữ cho nó không tuột lại: mỗi tab phải có đúng một địa chỉ, mỗi địa chỉ
   phải có đúng một tab, và App.tsx phải render đủ 8 tab đã khai.

   Chạy: node scripts/test-dinh-tuyen.cjs
   ═══════════════════════════════════════════════════════════════ */
const fs = require('fs');
const path = require('path');

const goc = path.join(__dirname, '..');

/* TypeScript nằm ở frontend/node_modules chứ không phải gốc kho — kho này
   không có package riêng ở gốc. Trỏ thẳng, đừng để `require` tự dò rồi hỏng. */
const ts = require(path.join(goc, 'frontend', 'node_modules', 'typescript'));
let pass = 0, fail = 0;
const ok = (ten, dat, vi = '') => {
  if (dat) { pass++; console.log(`  ✓ ${ten}`); }
  else { fail++; console.log(`  ✗ ${ten}${vi ? '\n      → ' + vi : ''}`); }
};

/* Nạp module THẬT, không chép lại bảng — chép sang test là test kiểm chính nó */
function napThuan(rel) {
  const src = fs.readFileSync(path.join(goc, rel), 'utf8');
  const js = ts.transpileModule(src, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const mod = { exports: {} };
  new Function('module', 'exports', 'require', js)(mod, mod.exports, require);
  return mod.exports;
}

console.log('\n🧭 ĐỊNH TUYẾN — 8 màn hình\n');

const dd = napThuan('frontend/src/lib/duongDan.ts');
const app = fs.readFileSync(path.join(goc, 'frontend/src/App.tsx'), 'utf8');

/* 1. Đủ 9 màn, không thiếu không thừa */
ok(`Khai đủ 9 màn hình (đang có ${dd.MAN_HINH.length})`, dd.MAN_HINH.length === 9);

/* 2. Không trùng địa chỉ — hai màn cùng địa chỉ thì một cái vĩnh viễn không vào được */
const duong = dd.MAN_HINH.map((m) => m.duong);
const trungD = duong.filter((d, i) => duong.indexOf(d) !== i);
ok('Không địa chỉ nào trùng nhau', trungD.length === 0, 'trùng: ' + trungD.join(', '));

/* 3. Không trùng tab */
const tab = dd.MAN_HINH.map((m) => m.tab);
const trungT = tab.filter((t, i) => tab.indexOf(t) !== i);
ok('Không tab nào trùng nhau', trungT.length === 0, 'trùng: ' + trungT.join(', '));

/* 4. Địa chỉ phải bắt đầu bằng / và không có dấu tiếng Việt.
      Dấu trong địa chỉ bị mã hoá thành %C3%A1… — dán link cho người khác
      thành một chuỗi rác không đọc được. */
const xauD = duong.filter((d) => !/^\/[a-z0-9-]+$/.test(d));
ok('Địa chỉ đều dạng /chu-thuong-khong-dau', xauD.length === 0, 'sai: ' + xauD.join(', '));

/* 5. Đi và về phải khớp — tabCuaDuong(duongCuaTab(x)) === x */
const lech = tab.filter((t) => dd.tabCuaDuong(dd.duongCuaTab(t)) !== t);
ok('Đi và về khớp nhau với cả 9 tab', lech.length === 0, 'lệch: ' + lech.join(', '));

/* 6. Địa chỉ lạ → về màn mặc định, KHÔNG ra màn trắng */
ok('Địa chỉ lạ rơi về màn mặc định', dd.tabCuaDuong('/khong-co-that') === dd.TAB_MAC_DINH);
ok('Địa chỉ gốc "/" rơi về màn mặc định', dd.tabCuaDuong('/') === dd.TAB_MAC_DINH);
ok('Bỏ được dấu / thừa ở cuối', dd.tabCuaDuong('/bang-gia/') === dd.tabCuaDuong('/bang-gia'));
ok('Bỏ được tham số truy vấn', dd.tabCuaDuong('/bang-gia?ma=TPB') === dd.tabCuaDuong('/bang-gia'));

/* 7. App.tsx phải render ĐỦ 8 tab đã khai — khai mà không render là màn trắng */
const thieuRender = tab.filter((t) => !app.includes(`activeTab === '${t}'`));
ok('App.tsx render đủ 9 tab đã khai', thieuRender.length === 0,
  'khai mà không render (vào là màn trắng): ' + thieuRender.join(', '));

/* 8. Router phải thật sự được lắp — thiếu là mọi thứ trên vô nghĩa */
const main = fs.readFileSync(path.join(goc, 'frontend/src/main.tsx'), 'utf8');
/* Phải kiểm CẢ HAI: có nhập VÀ có dùng.
   Bản đầu chỉ tìm chữ "BrowserRouter" — xoá dòng import mà vẫn để thẻ JSX thì
   bài test vẫn XANH trong khi app không build được. Kiểm ngược lộ ra ngay. */
ok('BrowserRouter được NHẬP ở main.tsx',
  /import\s*\{[^}]*BrowserRouter[^}]*\}\s*from\s*['"]react-router-dom['"]/.test(main),
  'thiếu import thì app không dựng được');
ok('BrowserRouter được DÙNG bọc <App/>', /<BrowserRouter>/.test(main),
  'không có router thì nút Back vẫn thoát hẳn app và F5 vẫn mất chỗ đang xem');
ok('App.tsx có gọi useDongBoDiaChi', /useDongBoDiaChi\(\)/.test(app),
  'không nối thì địa chỉ và màn hình đi hai đường');

console.log(`\n🧭 ĐỊNH TUYẾN: ${pass} PASSED, ${fail} FAILED.\n`);
process.exit(fail > 0 ? 1 : 0);
