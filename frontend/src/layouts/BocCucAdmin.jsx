import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Package, Tags, ShoppingCart, Users, Bell, BarChart3, Settings } from "lucide-react";

const menu = [
  { ten: "Tổng quan", duongdan: "/", icon: LayoutDashboard },
  { ten: "Danh mục", duongdan: "/admin/danhmuc", icon: Tags },
  { ten: "Sản phẩm", duongdan: "/admin/sanpham", icon: Package },
  { ten: "Đơn hàng", duongdan: "/admin/donhang", icon: ShoppingCart },
  { ten: "Khách hàng", duongdan: "/admin/khachhang", icon: Users },
  { ten: "Thông báo", duongdan: "/admin/thongbao", icon: Bell },
  { ten: "Doanh thu", duongdan: "/admin/doanhthu", icon: BarChart3 },
  { ten: "Cài đặt", duongdan: "/admin/caidat", icon: Settings },
];

export default function BocCucAdmin() {
  return (
    <div className="bo-cuc-admin">
      <aside className="thanh-ben">
        <div className="thuong-hieu">
          <div className="logo-chu">BH</div>
          <div>
            <strong>Bán Hàng</strong>
            <span>Quản trị cửa hàng</span>
          </div>
        </div>

        <nav className="menu-ben">
          {menu.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink key={item.duongdan} to={item.duongdan} className="menu-link">
                <Icon size={18} />
                <span>{item.ten}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      <main className="noi-dung-admin">
        <header className="dau-trang-admin">
          <div>
            <h1>Hệ thống bán hàng</h1>
            <p>Quản lý cửa hàng, sản phẩm, đơn hàng và doanh thu</p>
          </div>

          <button className="nut-thong-bao">
            <Bell size={18} />
            <span>0</span>
          </button>
        </header>

        <section className="khung-noi-dung">
          <Outlet />
        </section>
      </main>
    </div>
  );
}
