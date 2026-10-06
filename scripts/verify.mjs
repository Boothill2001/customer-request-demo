import assert from 'node:assert/strict';
const base=process.env.BASE_URL||'http://127.0.0.1:3000';
async function request(url,method='GET',body,status=200){const r=await fetch(base+url,{method,headers:{'Content-Type':'application/json'},body:body===undefined?undefined:JSON.stringify(body)});const data=await r.json();assert.equal(r.status,status,JSON.stringify(data));return data;}
await request('/api/tickets','POST',{name:'',email:'bad',content:''},400);
await request('/api/tickets','POST',{name:'Test',email:'bad',content:'Xin báo giá'},400);
await request('/api/tickets/absent','GET',undefined,404);
await request('/api/tickets/absent/analyze','POST',undefined,404);
const created=[];
for(const [content,category] of [['Xin báo giá dịch vụ','Hỏi giá'],['Tôi không đăng nhập được','Hỗ trợ kỹ thuật'],['Tôi khiếu nại giao sai DH-1024','Khiếu nại'],['Xin chào đội ngũ','Cần nhân viên xem']]){
 const t=await request('/api/tickets','POST',{name:'Kiểm thử',email:'qa@example.com',content});created.push(t.id);
 const url=`/api/tickets/${t.id}`;
 assert.equal((await request(url+'/analyze','POST')).analysis.category,category);
 await request(url,'PATCH',{action:'advance'});
 await request(url,'PATCH',{action:'advance'},409);
 await request(url,'PATCH',{action:'approve',response:' '},400);
 await request(url,'PATCH',{action:'approve',response:'Phản hồi đã kiểm tra'});
 assert.equal((await request(url,'PATCH',{action:'save',response:'Sửa phản hồi'})).approved,false);
 await request(url,'PATCH',{action:'advance'},409);
 await request(url,'PATCH',{action:'approve',response:'Phản hồi cuối'});
 assert.equal((await request(url,'PATCH',{action:'advance'})).status,'Đã hoàn thành');
 await request(url+'/analyze','POST',undefined,409);
 await request(url,'PATCH',{action:'save',response:'Thay đổi'},409);
 assert.ok((await request(url)).history.length>=7);
}
await request('/api/seed','POST',{},400);
await request('/api/seed','POST',{confirm:true});
const all=await request('/api/tickets');assert.equal(all.filter(t=>t.sample).length,3);for(const id of created)assert.ok(all.some(t=>t.id===id));
await request('/api/seed','POST',{confirm:true});assert.equal((await request('/api/tickets')).filter(t=>t.sample).length,3);
console.log('PASS: input validation, 4 workflows, approval guards, history, seed preservation.');
