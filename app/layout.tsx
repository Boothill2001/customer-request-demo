import './globals.css';
import Link from 'next/link';
export const metadata={title:'Yêu cầu khách hàng · Demo 01',description:'Demo local xử lý yêu cầu với AI mô phỏng'};
export default function Layout({children}:{children:React.ReactNode}){return <html lang="vi"><body><header><Link className="brand" href="/">Yêu cầu<span> / Demo 01</span></Link><nav aria-label="Điều hướng"><Link href="/">Giới thiệu</Link><Link href="/submit">Gửi yêu cầu</Link><Link href="/manage">Quản lý</Link></nav><span className="badge">AI mô phỏng</span></header><main>{children}</main><footer>Demo local · Dữ liệu mẫu · Phản hồi chỉ lưu nội bộ, chưa gửi email.</footer></body></html>}
