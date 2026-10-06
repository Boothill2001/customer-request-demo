export type Status = 'Mới' | 'Đang xử lý' | 'Đã hoàn thành';
export type Analysis = { category: string; priority: 'Bình thường' | 'Cao'; missing: string[]; suggestion: string; provider: 'mock' };
export type Ticket = { id: string; name: string; email: string; content: string; status: Status; analysis: Analysis | null; response: string; approved: boolean; sample: boolean; createdAt: string; history: { at: string; text: string }[] };
