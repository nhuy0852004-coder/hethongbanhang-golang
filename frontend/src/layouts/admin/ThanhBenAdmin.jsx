import { NavLink } from "react-router-dom";
import { ChevronLeft, X } from "lucide-react";
import clsx from "clsx";
import menuAdmin from "./menuAdmin";
import useGiaoDienStore from "../../stores/giaodienStore";
import useTaiKhoanStore from "../../stores/taikhoanStore";
export default function ThanhBenAdmin() {
  const sidebarThuGon = useGiaoDienStore((state) => state.sidebarThuGon);
  const sidebarMobileMo = useGiaoDienStore((state) => state.sidebarMobileMo);
  const batTatSidebar = useGiaoDienStore((state) => state.batTatSidebar);
  const dongSidebarMobile = useGiaoDienStore((state) => state.dongSidebarMobile);
  const taiKhoan = useTaiKhoanStore((state) => state.taikhoan);

  const tenHienThi = taiKhoan?.hoten || "Quản trị viên";
  const emailHienThi = taiKhoan?.email || "admin@shop.vn";
  const chuCai = tenHienThi.charAt(0).toUpperCase();

  return (
    <>
      <div
        className={clsx("nen-mo-mobile", sidebarMobileMo && "hien")}
        onClick={dongSidebarMobile}
      />

      <aside
        className={clsx(
          "sidebar-admin",
          sidebarThuGon && "thu-gon",
          sidebarMobileMo && "mo-mobile"
        )}
      >
        <div className="sidebar-logo-container">
          <div className="sidebar-logo-wrap">
            <div className="sidebar-logo-brand">
              <span className="sidebar-logo-qh">QH</span>
              <span className="sidebar-logo-soft">SOFTWARE</span>
            </div>
            <span className="sidebar-logo-text">Quản trị cửa hàng</span>
          </div>

          <button className="nut-dong-mobile" onClick={dongSidebarMobile}>
            <X size={19} />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuAdmin.map((nhomMenu, idx) => (
            <div className="sidebar-nhom" key={idx}>
              {nhomMenu.nhom && (
                <span className="sidebar-nhom-label">{nhomMenu.nhom}</span>
              )}

              {idx > 0 && <div className="sidebar-divider" />}

              {nhomMenu.danhSach.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.duongdan}
                    to={item.duongdan}
                    end={item.duongdan === "/admin"}
                    className={({ isActive }) =>
                      clsx("sidebar-link", isActive && "active")
                    }
                    onClick={dongSidebarMobile}
                  >
                    <Icon size={15} />
                    <span>{item.ten}</span>
                  </NavLink>
                );
              })}
            </div>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-user">
            <div className="sidebar-user-avatar">{chuCai}</div>
            <div className="sidebar-user-info">
              <strong>{tenHienThi}</strong>
              <span>{emailHienThi}</span>
            </div>
          </div>

          <button className="nut-thu-gon-sidebar" onClick={batTatSidebar}>
            <ChevronLeft size={14} />
            <span>Thu gọn menu</span>
          </button>
        </div>
      </aside>
    </>
  );
}
