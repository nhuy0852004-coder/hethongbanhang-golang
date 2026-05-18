import { Outlet, NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Package,
  Tags,
  ShoppingCart,
  Users,
  Bell,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";
import toast from "react-hot-toast";
import useTaiKhoanStore from "../stores/taikhoanStore";

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
  const navigate = useNavigate();
  const taikhoan = useTaiKhoanStore((state) => state.taikhoan);
  const dangXuat = useTaiKhoanStore((state) => state.dangXuat);

  const xuLyDangXuat = () => {
    dangXuat();
    toast.success("Đã đăng xuất");
    navigate("/dangnhap", { replace: true });
  };

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

          <div className="cum-ben-phai-header">
            <button className="nut-thong-bao">
              <Bell size={18} />
              <span>0</span>
            </button>

            <div className="tai-khoan-header">
              <div>
                <strong>{taikhoan?.hoten || "Quản trị viên"}</strong>
                <span>{taikhoan?.vaitro === "quantri" ? "Quản trị" : "Nhân viên"}</span>
              </div>

              <button className="nut-dang-xuat" onClick={xuLyDangXuat}>
                <LogOut size={17} />
              </button>
            </div>
          </div>
        </header>

        <section className="khung-noi-dung">
          <Outlet />
        </section>
      </main>
    </div>
  );
}