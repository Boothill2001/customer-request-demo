import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mockProvider} from '../lib/ai';
test('three scenarios and manual fallback',async()=>{for(const [content,category] of [['Xin báo giá','Hỏi giá'],['Không đăng nhập được','Hỗ trợ kỹ thuật'],['Khiếu nại giao sai DH-1024','Khiếu nại'],['Chào bạn nhé','Cần nhân viên xem']]){const a=await mockProvider.analyze(content);assert.equal(a.category,category);assert.equal(a.provider,'mock');assert.ok(a.suggestion);}});
test('complaints outrank price enquiries, case and accents handled',async()=>{const a=await mockProvider.analyze('KHIẾU NẠI báo giá sai');assert.equal(a.category,'Khiếu nại');assert.equal(a.priority,'Cao');assert.ok(a.missing.includes('Mã đơn hàng'));});
