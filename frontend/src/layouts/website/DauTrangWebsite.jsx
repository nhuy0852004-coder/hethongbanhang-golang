import { Link, NavLink } from "react-router-dom";
import { Search, ShoppingCart, Store } from "lucide-react";
import useGioHangStore from "../../stores/giohangStore";
import useCaiDatStore from "../../stores/caidatStore";

export default function DauTrangWebsite() {
  const danhSach = useGioHangStore((state) => state.danhsach);
  const caidat = useCaiDatStore((state) => state.caidat);

  const tongSoLuong = danhSach.reduce(
    (tong, item) => tong + Number(item.soluong || 0),
    0
  );

  const tenCuaHang = caidat?.tencuahang || "Cửa Hàng Việt";
  const logo = caidat?.logo || "";

  return (
    <header className="header-website">
      <div className="container-website header-website-inner">
        <Link to="/" className="logo-website">
          <div className="logo-website-icon">
            {logo ? (
              <img src={`http://localhost:8080${logo}`} alt={tenCuaHang} />
            ) : (
              <Store size={22} />
            )}
          </div>

          <div>
            <strong>{tenCuaHang}</strong>
            <span>Bán hàng chất lượng</span>
          </div>
        </Link>

        <nav className="menu-website">
          <NavLink to="/">Trang chủ</NavLink>
          <NavLink to="/sanpham">Sản phẩm</NavLink>
          <NavLink to="/tra-cuu-don-hang">Tra cứu đơn</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>

        <div className="hanh-dong-website">
          <div className="tim-kiem-website">
            <Search size={17} />
            <input placeholder="Tìm sản phẩm..." />
          </div>

          <Link to="/giohang" className="nut-gio-hang-website">
            <ShoppingCart size={20} />
            <span>{tongSoLuong}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}