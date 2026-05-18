import { NavLink } from "react-router-dom";
import { ChevronLeft, Store, X } from "lucide-react";
import clsx from "clsx";
import menuAdmin from "./menuAdmin";
import useGiaoDienStore from "../../stores/giaodienStore";

export default function ThanhBenAdmin() {
  const sidebarThuGon = useGiaoDienStore((state) => state.sidebarThuGon);
  const sidebarMobileMo = useGiaoDienStore((state) => state.sidebarMobileMo);
  const batTatSidebar = useGiaoDienStore((state) => state.batTatSidebar);
  const dongSidebarMobile = useGiaoDienStore((state) => state.dongSidebarMobile);

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
        <div className="sidebar-header">
          <div className="thuong-hieu-admin">
            <div className="logo-admin">
              <Store size={22} />
            </div>

            <div className="chu-thuong-hieu">
              <strong>Hệ thống bán hàng</strong>
              <span>Quản trị cửa hàng</span>
            </div>
          </div>

          <button className="nut-dong-mobile" onClick={dongSidebarMobile}>
            <X size={19} />
          </button>
        </div>

        <nav className="sidebar-menu">
          {menuAdmin.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.duongdan}
                to={item.duongdan}
                className={({ isActive }) =>
                  clsx("sidebar-link", isActive && "active")
                }
                onClick={dongSidebarMobile}
              >
                <Icon size={19} />
                <span>{item.ten}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <button className="nut-thu-gon-sidebar" onClick={batTatSidebar}>
            <ChevronLeft size={18} />
            <span>Thu gọn menu</span>
          </button>
        </div>
      </aside>
    </>
  );
}