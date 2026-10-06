import {get,save,event} from '@/lib/store';
import {body,field,handle,InputError} from '@/lib/http';
type Context={params:Promise<{id:string}>};
export const runtime='nodejs';
export const dynamic='force-dynamic';
export function GET(req:Request,c:Context){return handle(async()=>{const t=get((await c.params).id);if(!t)throw new InputError('Không tìm thấy ticket.',404);return t;});}
export function PATCH(req:Request,c:Context){return handle(async()=>{
  const b=await body(req);const t=get((await c.params).id);if(!t)throw new InputError('Không tìm thấy ticket.',404);
  if(t.status==='Đã hoàn thành')throw new InputError('Ticket đã hoàn thành, không thể sửa.',409);
  if(b.action==='save'||b.action==='approve') {
    t.response=field(b,'response',5000,b.action==='approve'?1:0);t.approved=b.action==='approve';
    event(t,t.approved?'Nhân viên duyệt phản hồi (chỉ lưu nội bộ)':'Lưu bản nháp; cần duyệt lại');
  } else if(b.action==='advance') {
    if(t.status==='Mới')t.status='Đang xử lý';
    else {if(!t.approved)throw new InputError('Cần duyệt phản hồi trước khi hoàn thành.',409);t.status='Đã hoàn thành';}
    event(t,`Chuyển trạng thái: ${t.status}`);
  } else throw new InputError('Thao tác không hợp lệ.');
  return save(t);
});}
