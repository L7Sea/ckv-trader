import { useState, useEffect, useCallback, useRef } from 'react';
import { Trash2, Copy, Check, AlertTriangle, Download } from 'lucide-react';
import { xuatVaTai, type CoAnh } from '@/lib/capyXuatAnh';
import { GOI_Y, kiemCongThuc, type CongThucMeme } from '@/lib/capyMemeSpec';
import { docKho, themNhieu, xoaCongThuc } from '@/lib/capyMemeKho';
import { BIEU_CAM } from '@/lib/capyBieuCam';
import CapyMat from './CapyMat';
import { useToast } from './Toast';

/* ═══════════════════════════════════════════════════════════════
   Ô NHẬP CÔNG THỨC MEME.

   Quy trình anh Hải muốn: thấy một meme hay → đưa ảnh cho AI bất kỳ
   phân tích ra công thức JSON → dán vào đây → app dựng ra dáng mới.
   Khả năng vẽ tay của tôi không còn là nút thắt nữa.

   Ba chốt chặn trước khi một công thức được nhận:
     1. Kiểm tên mảnh — gõ sai "mat"/"phuKien" là báo ngay, kèm danh
        sách đúng, không âm thầm bỏ qua rồi vẽ ra hình thiếu.
     2. Lọc an toàn — `lopThem` là SVG người ngoài dán vào, phải qua
        danh sách trắng, nếu không thì dán <script> là chạy được mã
        trong phiên đăng nhập.
     3. So trùng — hai công thức khác tên mà cùng mọi thành phần thì
        vẽ ra hình y hệt; báo rõ trùng với cái nào.
   ═══════════════════════════════════════════════════════════════ */

const MAU = `{
  "ten": "Ngâm bồn đội cam",
  "tuThe": "tamBon",
  "mat": "nhamCuoi",
  "mieng": "cuoiNhe",
  "phu": ["maHong"],
  "phuKien": ["cam", "vitVang"],
  "thoai": "Sướng quá đi mất...",
  "nhom": "vui"
}`;

export default function CapyMemePanel() {
  const toast = useToast();
  const [raw, setRaw] = useState('');
  const [kho, setKho] = useState<CongThucMeme[]>(docKho);
  const [daChep, setDaChep] = useState(false);
  const [coAnh, setCoAnh] = useState<CoAnh>(2048);
  /* Giữ tham chiếu tới từng <svg> đang hiện, để xuất ảnh đúng con đó */
  const oSvg = useRef<Record<string, HTMLDivElement | null>>({});

  async function taiAnh(ten: string, thoai?: string) {
    const svg = oSvg.current[ten]?.querySelector('svg');
    if (!svg) { toast.error('Chưa dựng xong hình, thử lại sau một nhịp'); return; }
    try {
      await xuatVaTai(svg as SVGSVGElement, ten, { co: coAnh, thoai });
      toast.success(`Đã tải "${ten}" — PNG ${coAnh}px, nền trong suốt`);
    } catch (e) {
      toast.error('Không xuất được ảnh: ' + (e instanceof Error ? e.message : ''));
    }
  }

  useEffect(() => {
    const f = () => setKho(docKho());
    window.addEventListener('tl-capy-meme', f);
    return () => window.removeEventListener('tl-capy-meme', f);
  }, []);

  /* Xem trước ngay khi gõ — không phải bấm Lưu rồi mới biết sai */
  const xemTruoc = useCallback(() => {
    if (!raw.trim()) return null;
    try {
      const v = JSON.parse(raw);
      const ds = Array.isArray(v) ? v : [v];
      return ds.map((x) => kiemCongThuc(x));
    } catch (e) {
      return [{ ok: false, loi: ['JSON sai cú pháp: ' + (e instanceof Error ? e.message : '')], canhBao: [] }];
    }
  }, [raw]);

  const kq = xemTruoc();
  const hopLe = (kq ?? []).filter((k) => k.ok && k.spec);

  function luu() {
    let v: unknown;
    try { v = JSON.parse(raw); }
    catch { toast.error('JSON sai cú pháp — kiểm lại dấu ngoặc, dấu phẩy'); return; }

    const ds = Array.isArray(v) ? v : [v];
    const r = themNhieu(ds);
    setKho(docKho());

    const phan: string[] = [];
    if (r.them) phan.push(`thêm ${r.them}`);
    if (r.trung) phan.push(`bỏ ${r.trung} vì TRÙNG hình`);
    if (r.hong) phan.push(`${r.hong} lỗi`);
    const loi = phan.join(' · ') || 'không có gì để thêm';

    if (r.them && !r.hong) toast.success(`Đã ${loi}`);
    else toast.error(`${loi}${r.chiTiet.length ? '\n' + r.chiTiet.slice(0, 4).join('\n') : ''}`);

    if (r.them) setRaw('');
  }

  function chepHuongDan() {
    const hd = huongDanChoAI();
    navigator.clipboard?.writeText(hd).then(
      () => { setDaChep(true); setTimeout(() => setDaChep(false), 2200); },
      () => toast.error('Trình duyệt chặn sao chép — bấm vào ô rồi Ctrl+A, Ctrl+C'),
    );
  }

  return (
    <section style={section}>
      <h2 style={h2}>Bé Capy — nhập công thức dáng mới</h2>
      <p style={desc}>
        Thấy một meme hay: đưa ảnh cho AI bất kỳ, bảo nó đọc bản hướng dẫn bên dưới
        rồi viết ra công thức JSON, dán vào đây. App dựng ra dáng mới ngay.
        Dán được cả <b>một mảng nhiều công thức</b> một lượt.
      </p>

      <button
        onClick={chepHuongDan}
        style={{ ...btnPhu, marginBottom: 'var(--sp-3)' }}
      >
        {daChep ? <><Check size={14} /> Đã chép</> : <><Copy size={14} /> Chép hướng dẫn để đưa cho AI</>}
      </button>

      <textarea
        value={raw}
        onChange={(e) => setRaw(e.target.value)}
        placeholder={MAU}
        spellCheck={false}
        style={{
          width: '100%', minHeight: 150, padding: 10, borderRadius: 8,
          border: '1.5px solid var(--c-surface-dim)', background: 'var(--c-surface)',
          color: 'var(--c-ink)', fontFamily: 'ui-monospace, Menlo, Consolas, monospace',
          fontSize: 12.5, lineHeight: 1.55, resize: 'vertical', outline: 'none',
        }}
      />

      {/* ── Xem trước / báo lỗi ngay khi gõ ── */}
      {kq && (
        <div style={{ marginTop: 'var(--sp-3)' }}>
          {kq.map((k, i) => (
            <div key={i} style={{ marginBottom: 10 }}>
              {k.ok && k.spec ? (
                <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
                  <div style={{ flexShrink: 0, background: 'var(--c-surface)', borderRadius: 10, padding: 4 }}>
                    <CapyMat
                      bc={{
                        ten: k.spec.ten, mat: k.spec.mat, mieng: k.spec.mieng,
                        phu: k.spec.phu, nhom: k.spec.nhom ?? BIEU_CAM[0]!.nhom,
                      }}
                      size={78}
                      tuThe={k.spec.tuThe}
                      phuKien={k.spec.phuKien}
                      lopThem={k.spec.lopThem}
                    />
                  </div>
                  <div style={{ fontSize: 13, minWidth: 0 }}>
                    <b>{k.spec.ten}</b>
                    <div style={{ color: 'var(--c-ink-muted)', fontSize: 12, marginTop: 2 }}>
                      {k.spec.tuThe} · {k.spec.mat} · {k.spec.mieng}
                      {k.spec.phuKien?.length ? ` · ${k.spec.phuKien.join(', ')}` : ''}
                    </div>
                    {k.spec.thoai && (
                      <div style={{ fontSize: 12, marginTop: 3, fontStyle: 'italic' }}>“{k.spec.thoai}”</div>
                    )}
                    {k.canhBao.map((c) => (
                      <div key={c} style={{ fontSize: 11.5, color: 'var(--c-warning)', marginTop: 3 }}>
                        <AlertTriangle size={11} style={{ verticalAlign: -1 }} /> {c}
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <ul style={{ margin: 0, paddingLeft: 18, color: 'var(--c-danger)', fontSize: 12.5, lineHeight: 1.6 }}>
                  {k.loi.map((l) => <li key={l}>{l}</li>)}
                </ul>
              )}
            </div>
          ))}
        </div>
      )}

      <button onClick={luu} disabled={hopLe.length === 0} style={{ ...btn, marginTop: 'var(--sp-3)', opacity: hopLe.length ? 1 : .45 }}>
        Lưu {hopLe.length > 1 ? `${hopLe.length} công thức` : 'công thức'}
      </button>

      {/* ── Kho đã có ── */}
      {kho.length > 0 && (
        <div style={{ marginTop: 'var(--sp-5)', paddingTop: 'var(--sp-4)', borderTop: '1px solid var(--c-surface-dim)' }}>
          <p style={{ ...desc, marginBottom: 'var(--sp-3)' }}>
            Đã có <b>{kho.length}</b> dáng tự nhập. Bé sẽ dùng lẫn với các dáng sẵn có.
            Bấm <Download size={12} style={{ verticalAlign: -1 }} /> trên mỗi dáng để tải
            PNG <b>nền trong suốt</b>, có in sẵn câu thoại.
          </p>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 'var(--sp-3)' }}>
            <span style={{ fontSize: 12.5, color: 'var(--c-ink-soft)' }}>Cỡ ảnh tải về:</span>
            {([1080, 2048] as CoAnh[]).map((c) => (
              <button key={c} onClick={() => setCoAnh(c)} style={{
                ...btnPhu,
                background: coAnh === c ? 'var(--c-accent)' : 'transparent',
                color: coAnh === c ? '#fff' : 'var(--c-accent-ink)',
                borderColor: coAnh === c ? 'var(--c-accent)' : 'var(--c-surface-dim)',
              }}>{c === 1080 ? '1080px' : '2K (2048px)'}</button>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(104px, 1fr))', gap: 8 }}>
            {kho.map((s) => (
              <div key={s.ten} style={{
                background: 'var(--c-surface)', border: '1px solid var(--c-surface-dim)',
                borderRadius: 10, padding: '6px 4px', textAlign: 'center', position: 'relative',
              }}>
                <div ref={(el) => { oSvg.current[s.ten] = el; }}>
                  <CapyMat
                    bc={{ ten: s.ten, mat: s.mat, mieng: s.mieng, phu: s.phu, nhom: s.nhom ?? BIEU_CAM[0]!.nhom }}
                    size={72} tuThe={s.tuThe} phuKien={s.phuKien} lopThem={s.lopThem}
                  />
                </div>
                <button
                  onClick={() => taiAnh(s.ten, s.thoai)}
                  title={`Tải PNG ${coAnh}px, nền trong suốt`}
                  style={{
                    position: 'absolute', top: 3, left: 3, border: 'none', background: 'none',
                    cursor: 'pointer', color: 'var(--c-accent-ink)', padding: 2, lineHeight: 0,
                  }}
                ><Download size={13} /></button>
                <div style={{ fontSize: 10.5, color: 'var(--c-ink-muted)', marginTop: 2 }}>{s.ten}</div>
                <button
                  onClick={async () => {
                    if (await toast.confirm(`Xoá dáng "${s.ten}"?`, { danger: true })) {
                      xoaCongThuc(s.ten); setKho(docKho());
                    }
                  }}
                  title="Xoá dáng này"
                  style={{
                    position: 'absolute', top: 3, right: 3, border: 'none', background: 'none',
                    cursor: 'pointer', color: 'var(--c-ink-muted)', padding: 2, lineHeight: 0,
                  }}
                ><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

/* Bản hướng dẫn để anh đưa cho AI khác — sinh TỰ ĐỘNG từ các tủ đang có,
   nên thêm một phụ kiện mới là hướng dẫn tự cập nhật, không bao giờ lạc hậu. */
export function huongDanChoAI(): string {
  return `Tôi có một app quản lý bán đá, trong đó có linh vật chuột lang nước (capybara).
App dựng hình linh vật từ CÔNG THỨC JSON. Hãy nhìn ảnh meme tôi gửi và viết ra công
thức JSON mô tả lại dáng đó, CHỈ dùng những giá trị có trong danh sách dưới đây.

Định dạng:
{
  "ten":      "<tên ngắn gọn cho dáng này>",
  "tuThe":    <một trong: ${GOI_Y.tuThe.join(' | ')}>,
  "mat":      <một trong: ${GOI_Y.mat.join(' | ')}>,
  "mieng":    <một trong: ${GOI_Y.mieng.join(' | ')}>,
  "phu":      [<0 hoặc nhiều: ${GOI_Y.phu.join(' | ')}>],
  "phuKien":  [<0 hoặc nhiều: ${GOI_Y.phuKien.join(' | ')}>],
  "thoai":    "<câu bé nói, tiếng Việt, tối đa 120 ký tự>",
  "nhom":     <một trong: ${GOI_Y.nhom.join(' | ')}>
}

Quy tắc bắt buộc:
- "mat" và "mieng" là BẮT BUỘC. Các trường khác bỏ được.
- KHÔNG bịa tên mới. Nếu meme có chi tiết mà danh sách không có, hãy chọn thứ
  GẦN NHẤT và nói rõ cho tôi biết đã thay gì bằng gì.
- Nếu thật sự cần vẽ thêm chi tiết, dùng "lopThem": [{"neo":"canh","z":"truoc",
  "svg":"<path .../>"}] — toạ độ trong khung 200x250, đầu bé quanh (100,96).
  Chỉ được dùng thẻ: g, path, circle, ellipse, rect, line, polyline, polygon, text.
  Mọi thẻ/thuộc tính khác sẽ bị app lọc bỏ.
- Nếu tôi gửi nhiều ảnh, trả về một MẢNG các công thức: [ {...}, {...} ]
- Chỉ trả JSON, không giải thích thêm.`;
}

const section: React.CSSProperties = { background: 'var(--c-surface-card)', padding: 'var(--sp-6)', borderRadius: 'var(--r-md)', boxShadow: 'var(--shadow-sm)', marginBottom: 'var(--sp-6)' };
const h2: React.CSSProperties = { fontSize: 'var(--text-lg)', fontWeight: 'var(--fw-semi)' as unknown as number, marginBottom: 'var(--sp-2)' };
const desc: React.CSSProperties = { color: 'var(--c-ink-soft)', fontSize: 'var(--text-sm)', marginBottom: 'var(--sp-4)', lineHeight: 1.6 };
const btn: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 'var(--sp-2)', padding: '8px 16px', border: 'none', borderRadius: 'var(--r-sm)', background: 'var(--c-accent)', color: '#fff', fontSize: 'var(--text-sm)', fontWeight: 600, fontFamily: 'var(--font-main)', cursor: 'pointer' };
const btnPhu: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 12px', borderRadius: 8, border: '1px solid var(--c-surface-dim)', background: 'transparent', color: 'var(--c-accent-ink)', fontSize: 12.5, fontFamily: 'var(--font-main)', cursor: 'pointer', fontWeight: 600 };
