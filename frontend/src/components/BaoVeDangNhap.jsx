import { Navigate, Outlet } from "react-router-dom";
import useTaiKhoanStore from "../stores/taikhoanStore";

export default function BaoVeDangNhap() {
  const daDangNhap = useTaiKhoanStore((state) => state.daDangNhap);

  if (!daDangNhap) {
    return <Navigate to="/admin/dangnhap" replace />;
  }

  return <Outlet />;
}