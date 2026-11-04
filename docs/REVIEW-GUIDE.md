# Reviewer guide — xem demo không cần video

## 30 giây: sản phẩm làm gì?

Web tiếp nhận yêu cầu CSKH và giúp nhân viên xử lý có kiểm soát. Khách gửi yêu cầu; bộ quy tắc đề xuất phân loại/checklist/phản hồi; nhân viên sửa và duyệt; trạng thái và lịch sử được lưu để tra cứu.

Ảnh trong README là screenshot thật của ứng dụng chạy local với dữ liệu synthetic. Không phải hệ thống khách hàng, ERP, integration email hay CRM đã triển khai.

## Demo 3 phút

1. Mở `/manage`, nạp dữ liệu mẫu.
2. Chọn Lan Anh → Phân tích → xem checklist và đề xuất.
3. Sửa nội dung → Duyệt phản hồi → Bắt đầu xử lý.
4. Sửa lại nội dung → Lưu nháp: Hoàn thành bị chặn.
5. Duyệt lại → Hoàn thành → refresh: ticket và lịch sử vẫn còn.
6. Thử Thu Hà (khiếu nại) hoặc Minh Đức (kỹ thuật); gợi ý không thay quyết định của nhân viên.

Không có email nào được gửi. Khi bấm Hoàn thành, người dùng ghi nhận rằng mình đã xử lý bên ngoài ứng dụng.

## Bản đồ code

| Thành phần | File | Trách nhiệm |
| --- | --- | --- |
| Form khách | `app/submit/page.tsx` | Thu thập input, gọi create API, nhận mã ticket |
| Bàn xử lý | `app/manage/page.tsx` | Search/filter, chọn ticket, edit/approve/advance |
| API tạo/list | `app/api/tickets/route.ts` | Validate name/email/content, lưu và đọc dữ liệu |
| API chuyển trạng thái | `app/api/tickets/[id]/route.ts` | Guard approval, chặn sửa ticket đã hoàn thành |
| API phân tích | `app/api/tickets/[id]/analyze/route.ts` | Gọi provider, lưu analysis, giữ nội dung đã chỉnh |
| Provider | `lib/ai.ts` | `AIProvider` contract và rule-based mock |
| Persistence | `lib/store.ts` | Lazy SQLite connection, CRUD, seed trong transaction |
| HTTP errors | `lib/http.ts` | Parse/validate input và cấu trúc lỗi |
| Kiểm thử API | `scripts/verify.mjs` | Negative inputs, workflow guards, history, seed |

## Cách làm việc với coding agent

Một workflow có thể áp dụng khi phát triển sản phẩm này:

- Viết bài toán người dùng và acceptance criteria trước, không chỉ yêu cầu AI “build app”.
- Chốt `Ticket`, các trạng thái, API contracts và approval rules.
- Chia task nhỏ: persistence → API → UI → test.
- Review diff để kiểm tra validation, SQL parameters, state transitions, dữ liệu lưu và failure paths.
- Chạy tests, build và tự thao tác tình huống lỗi; yêu cầu AI sửa khi behavior không khớp tiêu chí.

Đây là mô tả phương pháp, không phải bản ghi lịch sử prompt/commit chứng minh tỷ lệ code AI tạo. Repo không chứa provider LLM thật hoặc prompt transcript. Không suy diễn lượng code gõ tay hay năng suất từ số dòng.

## Những gì chưa làm

- Authentication, identity-backed authorization, tenant isolation, rate limiting.
- Real LLM provider/evaluation, email/CRM, ERP, marketplace/accounting integration.
- Conflict detection cho concurrent edits (hiện last-write-wins).
- Normalized relational model cho nghiệp vụ lớn; hiện ticket body lưu JSON.
- Load testing, production SLA, backup/restore drill và public deployment.

Không nhập dữ liệu nhạy cảm. Server mặc định chỉ bind 127.0.0.1. Trước khi chạy online, cần bổ sung security và vận hành phù hợp.

## Kiểm chứng lại

Node.js 24+:

```powershell
npm ci
npm test
npm run typecheck
npm run build
```

API regression (chạy với server và DB kiểm thử riêng):

```powershell
$env:TICKET_DB = 'D:\demo-test\tickets.sqlite'
npm run dev -- --port 3101
# Trong cửa sổ khác, cùng thư mục repo:
$env:BASE_URL = 'http://127.0.0.1:3101'
node scripts/verify.mjs
```

`scripts/capture-readme.cjs` chụp 5 màn hình cơ bản khi có Playwright/browser được cấu hình; ảnh reapproval-required bổ sung được chụp sau bước 4 ở trên. Chỉ dùng DB synthetic dành riêng cho demo vì script nạp lại dữ liệu mẫu.
