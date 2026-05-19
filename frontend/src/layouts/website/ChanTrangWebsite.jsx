import { Globe, Mail, MapPin, Phone, Store } from "lucide-react";

export default function ChanTrangWebsite() {
  return (
    <footer className="footer-website">
      <div className="container-website footer-website-grid">
        <div>
          <div className="footer-brand">
            <div className="logo-website-icon">
              <Store size={22} />
            </div>
            <strong>Cửa Hàng Việt</strong>
          </div>

          <p>
            Website bán hàng hiện đại, sản phẩm rõ ràng, giá Việt Nam Đồng,
            hỗ trợ đặt hàng nhanh và theo dõi trạng thái đơn hàng.
          </p>
        </div>

        <div>
          <h4>Liên hệ</h4>

          <ul>
            <li>
              <Phone size={16} />
              <span>0901234567</span>
            </li>
            <li>
              <Mail size={16} />
              <span>cuahang@example.com</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>Việt Nam</span>
            </li>
          </ul>
        </div>

        <div>
          <h4>Chính sách</h4>

          <ul>
            <li>Chính sách vận chuyển</li>
            <li>Chính sách đổi trả</li>
            <li>Hướng dẫn mua hàng</li>
          </ul>
        </div>

        <div>
          <h4>Kết nối</h4>

          <ul>
            <li>
              <Globe size={16} />
              <span>Trang mạng xã hội cửa hàng</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-copy">
        © 2026 Cửa Hàng Việt. Toàn bộ hệ thống sử dụng tiếng Việt.
      </div>
    </footer>
  );
}