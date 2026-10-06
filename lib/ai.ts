import type { Analysis } from './types';
// Replace this implementation with an API provider; keep the same contract.
export interface AIProvider { analyze(content: string): Promise<Analysis> }
export const mockProvider: AIProvider = {
  async analyze(content) {
    const s = content.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd');
    let category = 'Cần nhân viên xem';
    let priority: Analysis['priority'] = 'Bình thường';
    let missing = ['Mục đích và kết quả mong muốn'];
    let suggestion = 'Cảm ơn anh/chị đã gửi yêu cầu. Nhân viên sẽ xem nội dung và liên hệ để làm rõ nhu cầu.';
    if (/khieu nai|hoan tien|that vong|giao sai/.test(s)) {
      category = 'Khiếu nại'; priority = 'Cao'; missing = /dh[- ]?\d+/.test(s) ? [] : ['Mã đơn hàng'];
      suggestion = 'Chúng tôi đã ghi nhận phản ánh của anh/chị. Vui lòng cung cấp mã đơn hàng và thông tin sự việc để nhân viên kiểm tra phương án xử lý.';
    } else if (/loi|khong dang nhap|ky thuat|khong hoat dong/.test(s)) {
      category = 'Hỗ trợ kỹ thuật'; missing = ['Ảnh lỗi hoặc thông báo lỗi', 'Thời điểm và các bước tái hiện'];
      suggestion = 'Chúng tôi đã nhận yêu cầu hỗ trợ. Anh/chị vui lòng gửi thông báo lỗi, thời điểm xảy ra và các bước thao tác để nhân viên kiểm tra.';
    } else if (/bao gia|hoi gia|gia bao nhieu|chi phi/.test(s)) {
      category = 'Hỏi giá'; missing = ['Sản phẩm hoặc phạm vi dịch vụ', 'Số lượng và thời gian cần'];
      suggestion = 'Cảm ơn anh/chị quan tâm. Anh/chị vui lòng bổ sung sản phẩm hoặc phạm vi dịch vụ, số lượng và thời gian cần để chúng tôi chuẩn bị báo giá phù hợp.';
    }
    return {category, priority, missing, suggestion, provider: 'mock'};
  }
};
