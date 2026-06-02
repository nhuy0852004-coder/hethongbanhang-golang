import { Link, NavLink } from "react-router-dom";
import { Heart, MessageCircle, Search, ShoppingCart } from "lucide-react";
import useGioHangStore from "../../stores/giohangStore";
import useCaiDatStore from "../../stores/caidatStore";

export default function DauTrangWebsite() {
  const danhSach = useGioHangStore((state) => state.danhsach);
  const caidat = useCaiDatStore((state) => state.caidat);

  const tongSoLuong = danhSach.reduce(
    (tong, item) => tong + Number(item.soluong || 0),
    0
  );

  const tenCuaHang = caidat?.tencuahang || "CỬA HÀNG";

  return (
    <header className="mu-header">
      <div className="mu-header-inner">
        <Link to="/" className="mu-logo">
          <span className="mu-logo-bold">{tenCuaHang.split(" ")[0] || "MANCHESTE"}</span>
          <span className="mu-logo-light">{tenCuaHang.split(" ").slice(1).join(" ") || "STORE"}</span>
        </Link>

        <nav className="mu-nav">
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/sanpham">Sản phẩm</NavLink>
          <NavLink to="/tra-cuu-don-hang">Tra cứu đơn hàng</NavLink>
          <NavLink to="/chinh-sach-van-chuyen">Vận chuyển</NavLink>
          <NavLink to="/admin" className="mu-nav-highlight">Admin</NavLink>
        </nav>

        <div className="mu-header-actions">
          <button className="mu-header-icon" title="Tìm kiếm">
            <Search size={18} />
          </button>
          <button className="mu-header-icon" title="Tin nhắn">
            <MessageCircle size={14} />
          </button>
          <span className="mu-header-icon mu-heart-icon">♡</span>
          <Link to="/giohang" className="mu-header-icon mu-cart-link" title="Giỏ hàng">
            <ShoppingCart size={14} />
            {tongSoLuong > 0 && <span className="mu-cart-badge">{tongSoLuong}</span>}
          </Link>
        </div>
      </div>
    </header>
  );
}
