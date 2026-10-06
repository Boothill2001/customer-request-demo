import { DatabaseSync } from 'node:sqlite';
import { mkdirSync } from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Ticket } from './types';
const location = process.env.TICKET_DB || path.join(process.cwd(), 'data', 'tickets.sqlite');
let connection: DatabaseSync | undefined;
function database() {
  if (!connection) {
    mkdirSync(path.dirname(location), { recursive: true });
    connection = new DatabaseSync(location);
    connection.exec('PRAGMA busy_timeout=5000; PRAGMA journal_mode=WAL; CREATE TABLE IF NOT EXISTS tickets (id TEXT PRIMARY KEY, body TEXT NOT NULL)');
  }
  return connection;
}
export function list(): Ticket[] { return (database().prepare('SELECT body FROM tickets ORDER BY rowid DESC').all() as {body:string}[]).map(r=>JSON.parse(r.body)); }
export function get(id:string): Ticket | undefined { const row = database().prepare('SELECT body FROM tickets WHERE id=?').get(id) as {body:string}|undefined; return row ? JSON.parse(row.body) : undefined; }
export function save(t:Ticket) { database().prepare('INSERT INTO tickets(id,body) VALUES(?,?) ON CONFLICT(id) DO UPDATE SET body=excluded.body').run(t.id, JSON.stringify(t)); return t; }
export function create(name:string,email:string,content:string,sample=false) {
  const at = new Date().toISOString();
  return save({id:`YC-${randomUUID().slice(0,8).toUpperCase()}`,name,email,content,status:'Mới',analysis:null,response:'',approved:false,sample,createdAt:at,history:[{at,text:sample?'Tạo dữ liệu mẫu':'Khách gửi yêu cầu'}]});
}
export function event(t:Ticket,text:string) { t.history.push({at:new Date().toISOString(),text}); }
export function seed() {
  database().exec('BEGIN IMMEDIATE');
  try {
    for (const t of list().filter(t=>t.sample)) database().prepare('DELETE FROM tickets WHERE id=?').run(t.id);
    create('Lan Anh','lananh@example.com','Tôi muốn hỏi báo giá triển khai web quản lý yêu cầu cho công ty.',true);
    create('Minh Đức','minhduc@example.com','Web bị lỗi, tôi không đăng nhập được từ sáng nay.',true);
    create('Thu Hà','thuha@example.com','Tôi muốn khiếu nại giao sai sản phẩm của đơn DH-1024.',true);
    database().exec('COMMIT');
  } catch(e) { database().exec('ROLLBACK'); throw e; }
}
