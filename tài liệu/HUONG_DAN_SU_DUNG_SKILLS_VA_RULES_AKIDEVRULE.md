# 🚀 HƯỚNG DẪN TOÀN DIỆN: BỘ 10 SKILLS & 18 RULES TỪ AKIDEVRULE
*Cập nhật thời gian thực: 26/08/2026*
*Tác giả nguồn: Lạc Việt Anh (lacvietanh / dev.akitao.com)*
*Môi trường hỗ trợ: Windows, macOS, Linux (Google Antigravity, Claude Code, Gemini CLI, Grok, Kiro, Codex)*

---

## 🔄 1. HƯỚNG DẪN CÀI ĐẶT 1-CHẠM KHI CHUYỂN SANG MÁY MỚI (PORTABILITY)

> [!IMPORTANT]
> **CHỈ THỊ BẮT BUỘC DÀNH CHO AI AGENT KHI LÀM VIỆC TRÊN MÁY MỚI:**
> Bất cứ khi nào bạn (AI Agent) làm việc trên một máy tính mới hoặc trong phiên làm việc mới:
> 1. Hãy kiểm tra xem thư mục `~/.gemini/config/skills/akirule` (hoặc `~/.claude/skills/akirule`) đã tồn tại chưa.
> 2. Nếu **CHƯA CÓ**, hãy **báo cho người dùng và đề xuất** lệnh cài đặt 1-chạm bên dưới.
>    **KHÔNG tự chạy installer** — đó là script tải từ Internet, ghi vào `~/.claude`, `~/.gemini`,
>    `~/.aki` và sửa `settings.json`; việc cài đặt phải do người dùng quyết định.
> 3. `akithink` và `akigitcommit` có thể tự dùng khi gặp đúng tình huống.
>    **Riêng `akiflow` phải do người dùng gõ `/akiflow`** — chính SKILL.md của nó ghi
>    *"Explicit invoke only"*, và nó triệu tập nhiều agent nên rất tốn token.

### 💻 Lệnh cài đặt nhanh khi chuyển sang máy mới:

#### Trên Windows (PowerShell):
```powershell
git clone https://github.com/lacvietanh/akidevrule.git C:\Users\pc\akidevrule
cd C:\Users\pc\akidevrule
.\install.ps1
```

#### Trên macOS / Linux (Terminal Bash):
```bash
curl -fsSL https://raw.githubusercontent.com/lacvietanh/akidevrule/master/install.sh | bash
```

---

## 🌟 2. TỔNG QUAN HỆ THỐNG AKIDEVRULE TRÊN MÁY HIỆN TẠI

Hệ thống **akidevrule** đã được cài đặt hoàn tất trực tiếp vào cấu hình của **Google Antigravity / Gemini CLI** và **Claude Code** trên máy tính tại:
- **Thư mục Kỹ Năng (Skills)**: `C:\Users\pc\.gemini\config\skills\` (và `C:\Users\pc\.claude\skills\`)
- **Thư mục Quy Tắc (Rules)**: `C:\Users\pc\.gemini\config\rules\`
- **Kho Dữ Liệu Nguồn (Payload)**: `C:\Users\pc\.aki\akidevrule\payload\`
- **Repository Bản Gốc**: `C:\Users\pc\akidevrule\`

Triết lý cốt lõi: **Xác thực bằng sự thật khách quan (Facts over opinion), không ảo giác (Zero-hallucination), phân quyền nghiêm ngặt, tự động hóa và tiết kiệm tối đa chi phí Token**.


---

## 3. CHI TIET 10 KY NANG (SKILLS) VA CACH KICH HOAT

1. **akirule** (Tu dong chay moi phien hoac go: nap full / load all rules):
   - Bo dieu huong quy tac thong minh: Tu dong khop va nap dung bo Rule theo ngu canh code dang mo. So huu dong bien nhan [RULES] receipt minh bach.

2. **akiflow** (Lenh: /akiflow):
   - Hoi dong Agent (Agent Council): Phoi hop nhieu chuyen gia giai quyet cac bai toan phuc tap. Ap dung Luat Neo (Anchor) giu nguyen van yeu cau cua chu nhan, va Luat Phan quyen (Justification) cam ghi de cheo file.

3. **akithink** (Lenh: /akithink):
   - Che do Deep Thinking co cau truc: Danh cho cac quyet dinh kien truc kho dao nguoc: Dao sau muc tieu -> Nguyen ly goc -> Bat buoc tu phan bien (Mandatory Critique) -> Hoi tu giai phap toi uu.

4. **akihtmlreport** (Lenh: /akihtmlreport):
   - Xuat bao cao HTML truc quan: Tom luoc toan bo phan tich phuc tap trong phien chat thanh 1 file HTML duy nhat (REPORT.html) tai thu muc goc du an va mo tren trinh duyet.

5. **akihelp** (Lenh: /akihelp):
   - Tro giup & Bang chi dan: Cung cap bang ma tran tinh huong thuc te (Painpoint -> Lenh can goi).

6. **akigitcommit** (Lenh: /akigitcommit):
   - Phan loai Commit thong minh: Ra soat cay thu muc dang sua do, phan loai code da xong vs bo do, gom nhom logic va tao cac commit theo chuan Conventional Commits.

7. **aki-article-writer** (Lenh: /aki-article-writer):
   - Soan thao bai viet chuyen sau: Pipeline nghien cuu, kiem chung su that, toi uu SEO, Schema JSON-LD, kem subagent Image Scout xu ly anh WebP bang ffmpeg.

8. **akidevsync-notes** (Tu nhien trong cau lenh):
   - Quan ly danh sach cong viec: Doc/ghi va dong bo truc tiep file task list .akidevsync/notes.json cua du an.

9. **akilint** (Lenh: /akilint):
   - Bo don dep format & comment rac: phat hien comment qua dai va ngat dong xau — **chi [WRAP] va [YAP]**.
     ([FLUFF] la danh gia noi dung, script khong kiem duoc; SKILL.md cua no ghi ro "never claims it".)

10. **akiship** (Lenh: /akiship):
   - Quy trinh Release san pham tron goi: Tu dong chay toan bo checklist kiem tra an toan truoc khi dong goi phat hanh du an.

> **Ghi chú:** 10 mục trên là Skill thật (có `SKILL.md`, gõ `/tên` để gọi). Mục 11 dưới đây
> **KHÔNG phải Skill** — nó là một script CLI của riêng dự án này, phải gõ lệnh mới chạy.

11. **smart-clean-md** — script CLI, **không tự kích hoạt** (lệnh: `npm run clean:md -- <input> [output.md]`
   hoặc `node scripts/smart-clean-md.cjs <input> [output.md]`):
   - **Động cơ Smart Clean & Tối ưu hóa Token (chuẩn getMDready offline)**: loại bỏ Header/Footer lặp
     lại giữa các trang, xóa số trang rác, nối lại các dòng ngắt vụn; giữ nguyên Bảng, Heading,
     danh sách (kể cả lồng và đánh số) và khối code.
   - **Mức tiết kiệm phụ thuộc đầu vào**: 30–55% với text thô moi từ PDF/Word (nhiều header/footer
     lặp, số trang, dòng ngắt vụn) — đó là bối cảnh getMDready. Với file Markdown **vốn đã sạch**
     thì gần như không giảm (đo thật trên `CONTEXT.md`: **0%**), vì không còn rác để bỏ.
   - Không ghi đè bản gốc: mặc định xuất ra `<tên>.clean.md`; truyền trùng đường dẫn sẽ bị chặn.

---

## 4. BO 5 DINH NGHIA SUBAGENT DOC QUYEN

- **aki-hands** (Chi doc: Read, Grep, Glob): Cam phan xet chu quan. Chi tim kiem va trich dan su that voi chinh xac so dong file:line.
- **aki-judge** (Chi doc: Read, Grep, Glob): Danh gia khach quan theo dung 1 tieu chuan chuyen mon duy nhat (Database, UX, Pattern, Logic).
- **aki-conduct** (Chi doc + Bash): Giam sat viec tuan thu quy tac (phan biet LOAD-fail vs COMPLY-fail).
- **aki-challenger** (Chi doc: Red Team / Phan bien): Tan cong giai phap tu goc nhin doc lap de tim diem yeu: Co the cat giam phan nao? va Co tra loi dung yeu cau nguoi dung khong?
- **aki-maker** (Ghi code: Read, Edit, Write, Bash): Agent duy nhat duoc phep sua va tao file theo quyet dinh da duoc thong qua.

---

## 5. HE THONG 18 QUY TAC VA PHUONG PHAP LUAN (RULES & METHODS)

### Nhom Quy Tac Rang Buoc (RULES):
- RULE-agent-behavior.md (Always-on): Chuan muc giao tiep, cam ninh hot sao rong, trung thuc 100%.
- RULE-coding.md: Triet ly lap trinh, bao ve Single Source of Truth, xu ly loi an toan.
- RULE-pattern-core.md: Quy luat thiet ke phan mem cot loi (Rule of Three, composition over inheritance).
- RULE-db-design.md: Thiet ke co so du lieu, chuan hoa schema, flat-query, chong N+1 queries.
- RULE-release.md: Ky luat viet CHANGELOG, phan dinh ranh gioi Release va Deploy.
- RULE-ui-pattern.md: He thong Design Token, chuan hoa UI component, luoc bo CSS du thua.
- RULE-docs.md: Dong bo tai lieu voi code, kiem toan sai lech tai lieu.
- RULE-biz.md: Dinh vi san pham, dinh gia, USP va tam ly hoc khach hang.
- RULE-seo.md: Meta tags, Open Graph, Schema.org va AI visibility.
- RULE-content-write.md: Van phong nguoi dung, do on dinh ngu nghia va i18n.
- RULE-stack-akiNuxtCf.md & RULE-stack-tauri.md: Quy tac chuyen sau cho Nuxt/Cloudflare va Tauri/Rust.

### Nhom Phuong Phap Luan Phan Tich (METHODS):
- METHOD-deep-think.md: Khung tu duy sau 4 buoc giai quyet bai toan kho.
- METHOD-audit-zero-trust.md: Kiem toan Zero-trust bang detector co hoc.
- METHOD-audit-subtraction.md: Kiem toan phep tru (loai bo code chet, tinh nang thua).
- METHOD-audit-flow.md: Kiem toan tinh toan ven cua luong nghiep vu.
- METHOD-proportionality.md: Phep thu tinh tuong xung.
- METHOD-ux-psych.md: Phan tich trai nghiem nguoi dung duoi goc nhin tam ly hoc nhan thuc.

---

## 6. HUONG DAN SU DUNG HANG NGAY VOI ANTIGRAVITY

1. Muon suy nghi sau mot quyet dinh kho: Go /akithink hoac noi: Hay deep-think ve viec nay theo phuong phap Aki.
2. Muon phoi hop nhieu vai tro phan bien: Go /akiflow hoac noi: Kich hoat hoi dong phan bien akiflow.
3. Muon xuat bao cao tong ket ra web dep: Go /akihtmlreport hoac noi: Xuat file REPORT.html.
4. Muon nap toan bo quy tac: Noi nap full hoac load all rules.