import { Link } from "react-router-dom";
import useCaiDatStore from "../../stores/caidatStore";

export default function ChanTrangWebsite() {
  const caidat = useCaiDatStore((state) => state.caidat);

  const tenCuaHang = caidat?.tencuahang || "Cửa Hàng";
  const sodienthoai = caidat?.sodienthoai || "0901234567";
  const email = caidat?.email || "cuahang@example.com";

  return (
    <footer className="mu-footer">
      <div className="mu-footer-main">
        <div className="mu-container mu-footer-grid">
          <div>
            <h4>HỖ TRỢ KHÁCH HÀNG</h4>
            <ul>
              <li><span>Trung tâm hỗ trợ</span></li>
              <li><span>Liên hệ: {sodienthoai}</span></li>
              <li><Link to="/tra-cuu-don-hang">Đơn hàng & Đổi trả</Link></li>
              <li><Link to="/chinh-sach-van-chuyen">Thông tin giao hàng</Link></li>
              <li><span>Hướng dẫn chọn size</span></li>
            </ul>
          </div>

          <div>
            <h4>VỀ CHÚNG TÔI</h4>
            <ul>
              <li><span>{tenCuaHang}</span></li>
              <li><span>Cam kết chất lượng</span></li>
              <li><span>Tuyển dụng</span></li>
              <li><span>Tin tức</span></li>
            </ul>
          </div>

          <div>
            <h4>PHÁP LÝ</h4>
            <ul>
              <li><span>Điều khoản & Điều kiện</span></li>
              <li><Link to="/chinh-sach-doi-tra">Chính sách bảo mật</Link></li>
              <li><span>Chính sách Cookie</span></li>
              <li><span>Trợ năng</span></li>
            </ul>
          </div>

          <div>
            <h4>KẾT NỐI</h4>
            <ul>
              <li><span className="mu-social"><span className="mu-social-dot" style={{background: "#1877F2"}} />Facebook</span></li>
              <li><span className="mu-social"><span className="mu-social-dot" style={{background: "#1DA1F2"}} />Twitter / X</span></li>
              <li><span className="mu-social"><span className="mu-social-dot" style={{background: "#E4405F"}} />Instagram</span></li>
              <li><span className="mu-social"><span className="mu-social-dot" style={{background: "#000000"}} />TikTok</span></li>
              <li><span className="mu-social"><span className="mu-social-dot" style={{background: "#FF0000"}} />YouTube</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mu-footer-bottom">
        <div className="mu-container mu-footer-bottom-inner">
          <div className="mu-footer-copy">
            <span className="mu-footer-logo-mini">{tenCuaHang.substring(0, 2).toUpperCase()}</span>
            <span>© 2026 {tenCuaHang}. Bản quyền thuộc về cửa hàng.</span>
          </div>
          <div className="mu-footer-payments">
            <span className="mu-pay mu-pay-visa">VISA</span>
            <span className="mu-pay mu-pay-mc">MC</span>
            <span className="mu-pay mu-pay-amex">AMEX</span>
            <span className="mu-pay mu-pay-momo">MOMO</span>
            <span className="mu-pay mu-pay-vnpay">VNPAY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
