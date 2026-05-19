import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useTaiKhoanStore from "../../stores/taikhoanStore";
import useGiaoDienStore from "../../stores/giaodienStore";

export default function DauTrangAdmin() {
  const navigate = useNavigate();

  const taikhoan = useTaiKhoanStore((state) => state.taikhoan);
  const dangXuat = useTaiKhoanStore((state) => state.dangXuat);

  const moSidebarMobile = useGiaoDienStore((state) => state.moSidebarMobile);
  const tieuDeTrang = useGiaoDienStore((state) => state.tieuDeTrang);
  const moTaTrang = useGiaoDienStore((state) => state.moTaTrang);

  const xuLyDangXuat = () => {
    dangXuat();
    toast.success("Đã đăng xuất");
    navigate("/admin/dangnhap", { replace: true });
  };

  return (
    <header className="header-admin">
      <div className="header-trai">
        <button className="nut-menu-mobile" onClick={moSidebarMobile}>
          <Menu size={21} />
        </button>

        <div className="tieu-de-header">
          <h1>{tieuDeTrang}</h1>
          {moTaTrang && <p>{moTaTrang}</p>}
        </div>
      </div>

      <div className="header-giua">
        <div className="o-tim-kiem-header">
          <Search size={18} />
          <input placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..." />
        </div>
      </div>

      <div className="header-phai">
        <button className="nut-chuong">
          <Bell size={19} />
          <span>0</span>
        </button>

        <div className="tai-khoan-admin">
          <div className="avatar-admin">
            {(taikhoan?.hoten || "Q").charAt(0).toUpperCase()}
          </div>

          <div className="thong-tin-admin">
            <strong>{taikhoan?.hoten || "Quản trị viên"}</strong>
            <span>{taikhoan?.vaitro === "quantri" ? "Quản trị" : "Nhân viên"}</span>
          </div>

          <button className="nut-dang-xuat-admin" onClick={xuLyDangXuat}>
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}