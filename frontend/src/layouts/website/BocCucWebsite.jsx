import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";
import DauTrangWebsite from "./DauTrangWebsite";
import ChanTrangWebsite from "./ChanTrangWebsite";
import ThanhTienTrinh from "../../components/ui/ThanhTienTrinh";
import useCaiDatStore from "../../stores/caidatStore";

export default function BocCucWebsite() {
  const taiCaiDat = useCaiDatStore((state) => state.taiCaiDat);

  useEffect(() => {
    taiCaiDat();
  }, [taiCaiDat]);

  return (
    <div className="bo-cuc-website">
      <ThanhTienTrinh />
      {/* Thanh thông báo vàng trên cùng */}
      <div className="mu-announcement-bar">
        <span className="mu-announcement-text">
          Sản phẩm mới đang bán chạy! <u>Mua ngay khi còn hàng.</u>
        </span>
        <div className="mu-announcement-links">
          <Link to="/">Trang chủ</Link>
          <Link to="/chinh-sach-van-chuyen">Hỗ trợ</Link>
          <Link to="/chinh-sach-doi-tra">Vận chuyển & đổi trả</Link>
        </div>
      </div>

      <DauTrangWebsite />

      <main className="noi-dung-website">
        <Outlet />
      </main>

      <ChanTrangWebsite />
    </div>
  );
}