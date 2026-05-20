import { Globe, Mail, MapPin, Phone, Store } from "lucide-react";
import { Link } from "react-router-dom";
import useCaiDatStore from "../../stores/caidatStore";

export default function ChanTrangWebsite() {
  const caidat = useCaiDatStore((state) => state.caidat);

  const tenCuaHang = caidat?.tencuahang || "Cửa Hàng Việt";
  const logo = caidat?.logo || "";
  const sodienthoai = caidat?.sodienthoai || "0901234567";
  const email = caidat?.email || "cuahang@example.com";
  const diachi = caidat?.diachi || "Việt Nam";

  return (
    <footer className="footer-website">
      <div className="container-website footer-website-grid">
        <div>
          <div className="footer-brand">
            <div className="logo-website-icon">
              {logo ? (
                <img src={`http://localhost:8080${logo}`} alt={tenCuaHang} />
              ) : (
                <Store size={22} />
              )}
            </div>

            <strong>{tenCuaHang}</strong>
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
              <span>{sodienthoai}</span>
            </li>
            <li>
              <Mail size={16} />
              <span>{email}</span>
            </li>
            <li>
              <MapPin size={16} />
              <span>{diachi}</span>
            </li>
          </ul>
        </div>

        <div>
          <h4>Chính sách</h4>

          <ul>
            <li>
              <Link to="/chinh-sach-van-chuyen">Chính sách vận chuyển</Link>
            </li>
            <li>
              <Link to="/chinh-sach-doi-tra">Chính sách đổi trả</Link>
            </li>
            <li>Hướng dẫn mua hàng</li>
          </ul>
        </div>

        <div>
          <h4>Kết nối</h4>

          <ul>
            <li>
              <Globe size={16} />
              <span>Facebook cửa hàng</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-copy">
        © 2026 {tenCuaHang}. Toàn bộ hệ thống sử dụng tiếng Việt.
      </div>
    </footer>
  );
}