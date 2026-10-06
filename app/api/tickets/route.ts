import {create,list} from '@/lib/store';
import {body,field,handle,InputError} from '@/lib/http';
export const runtime='nodejs';
export const dynamic='force-dynamic';
export function GET(){return handle(()=>list());}
export function POST(req:Request){return handle(async()=>{const b=await body(req); const name=field(b,'name',100); const email=field(b,'email',254); const content=field(b,'content',5000,5); if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new InputError('Email không hợp lệ.'); return create(name,email,content);});}
