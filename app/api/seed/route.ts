import {seed,list} from '@/lib/store';
import {handle,body,InputError} from '@/lib/http';
export const runtime='nodejs';
export function POST(req:Request){return handle(async()=>{if((await body(req)).confirm!==true)throw new InputError('Cần xác nhận nạp lại dữ liệu mẫu.');seed();return list();});}
