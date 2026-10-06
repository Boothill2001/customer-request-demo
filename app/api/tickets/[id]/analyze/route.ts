import {mockProvider} from '@/lib/ai';
import {get,save,event} from '@/lib/store';
import {handle,InputError} from '@/lib/http';
export const runtime='nodejs';
export function POST(req:Request,c:{params:Promise<{id:string}>}){return handle(async()=>{
  const id=(await c.params).id;const t=get(id);if(!t)throw new InputError('Không tìm thấy ticket.',404);
  if(t.status==='Đã hoàn thành')throw new InputError('Ticket đã hoàn thành.',409);
  const analysis=await mockProvider.analyze(t.content);
  // Re-read after awaiting a future real provider, to preserve intervening edits.
  const current=get(id);if(!current)throw new InputError('Không tìm thấy ticket.',404);
  if(current.status==='Đã hoàn thành')throw new InputError('Ticket đã hoàn thành.',409);
  current.analysis=analysis; if(!current.response)current.response=analysis.suggestion;
  event(current,'Phân tích bằng AI mô phỏng; chưa gửi phản hồi');return save(current);
});}
