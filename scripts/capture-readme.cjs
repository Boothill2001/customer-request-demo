const {chromium}=require(process.env.PLAYWRIGHT_PATH||'playwright');
const {mkdirSync}=require('node:fs');
const assert=require('node:assert/strict');
const base=process.env.BASE_URL||'http://127.0.0.1:3102';
(async()=>{
const r=await fetch(base+'/api/seed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({confirm:true})});assert.equal(r.status,200);
const b=await chromium.launch({headless:true,executablePath:process.env.BROWSER_EXE});const p=await b.newPage({viewport:{width:1440,height:1000}});mkdirSync('docs/screenshots',{recursive:true});
await p.goto(base);await p.screenshot({path:'docs/screenshots/overview.png',fullPage:true});await p.goto(base+'/submit');await p.getByLabel('Họ tên',{exact:true}).fill('Khách hàng demo');await p.getByLabel('Email',{exact:true}).fill('demo@example.com');await p.getByLabel('Nội dung',{exact:true}).fill('Công ty tôi muốn triển khai quy trình tiếp nhận yêu cầu. Nhờ tư vấn phạm vi và báo giá.');await p.screenshot({path:'docs/screenshots/customer-form.png',fullPage:true});
await p.goto(base+'/manage');await p.getByRole('button').filter({hasText:'Lan Anh'}).click();await p.getByRole('button',{name:'Phân tích',exact:true}).click();await p.getByText('Hỏi giá',{exact:true}).waitFor();await p.screenshot({path:'docs/screenshots/workspace.png',fullPage:true});
await p.getByLabel('Phản hồi do nhân viên duyệt').fill('Chào chị Lan Anh, chúng tôi đã nhận yêu cầu. Chị vui lòng cho biết số nhân viên sử dụng, các bước xử lý hiện tại và hệ thống cần kết nối để chúng tôi tư vấn phạm vi triển khai.');await p.getByRole('button',{name:'Duyệt phản hồi',exact:true}).click();await p.getByRole('button',{name:'Bắt đầu xử lý',exact:true}).click();await p.getByRole('button',{name:'Hoàn thành',exact:true}).click();await p.getByRole('button',{name:'Đã hoàn thành',exact:true}).waitFor();await p.screenshot({path:'docs/screenshots/approved-request.png',fullPage:true});
await p.setViewportSize({width:375,height:900});await p.getByRole('button').filter({hasText:'Minh Đức'}).click();await p.getByRole('button',{name:'Phân tích',exact:true}).click();await p.getByText('Hỗ trợ kỹ thuật',{exact:true}).waitFor();await p.screenshot({path:'docs/screenshots/mobile.png',fullPage:true});
for(const width of [320,375,414,768,1280]){await p.setViewportSize({width,height:900});assert.ok(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),`overflow ${width}`);}await b.close();console.log('PASS: 5 screenshots from running app; responsive checks.');
})().catch(e=>{console.error(e);process.exit(1)});
