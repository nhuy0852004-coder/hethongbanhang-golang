import { Outlet } from "react-router-dom";
import ThanhBenAdmin from "./ThanhBenAdmin";
import DauTrangAdmin from "./DauTrangAdmin";
import DangTaiToanManHinh from "../../components/ui/DangTaiToanManHinh";
import useGiaoDienStore from "../../stores/giaodienStore";
import clsx from "clsx";

export default function BocCucAdmin() {
  const sidebarThuGon = useGiaoDienStore((state) => state.sidebarThuGon);

  return (
    <div className={clsx("bo-cuc-admin-moi", sidebarThuGon && "sidebar-thu-gon")}>
      <ThanhBenAdmin />

      <main className="noi-dung-admin-moi">
        <DauTrangAdmin />

        <section className="vung-noi-dung-admin">
          <Outlet />
        </section>
      </main>

      <DangTaiToanManHinh />
    </div>
  );
}