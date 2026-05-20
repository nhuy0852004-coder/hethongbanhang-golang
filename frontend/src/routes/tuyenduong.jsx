import { createBrowserRouter } from "react-router-dom";
import BocCucAdmin from "../layouts/admin/BocCucAdmin";
import BocCucWebsite from "../layouts/website/BocCucWebsite";
import DashboardAdmin from "../modules/tongquan/DashboardAdmin";
import BaoVeDangNhap from "../components/BaoVeDangNhap";
import DangNhap from "../modules/taikhoan/DangNhap";
import DanhSachDanhMuc from "../modules/danhmuc/DanhSachDanhMuc";
import DanhSachSanPham from "../modules/sanpham/DanhSachSanPham";
import DanhSachDonHang from "../modules/donhang/DanhSachDonHang";
import DanhSachKhachHang from "../modules/khachhang/DanhSachKhachHang";
import DanhSachThongBao from "../modules/thongbao/DanhSachThongBao";
import BaoCaoDoanhThu from "../modules/doanhthu/BaoCaoDoanhThu";
import CaiDatCuaHang from "../modules/caidat/CaiDatCuaHang";
import TraCuuDonHangWebsite from "../modules/website/donhang/TraCuuDonHangWebsite";
import TrangChuWebsite from "../modules/website/trangchu/TrangChuWebsite";
import DanhSachSanPhamWebsite from "../modules/website/sanpham/DanhSachSanPhamWebsite";
import ChiTietSanPhamWebsite from "../modules/website/sanpham/ChiTietSanPhamWebsite";
import GioHangWebsite from "../modules/website/giohang/GioHangWebsite";
import ThanhToanWebsite from "../modules/website/thanhtoan/ThanhToanWebsite";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BocCucWebsite />,
    children: [
      {
        index: true,
        element: <TrangChuWebsite />,
      },
      {
        path: "sanpham",
        element: <DanhSachSanPhamWebsite />,
      },
      {
        path: "sanpham/:id",
        element: <ChiTietSanPhamWebsite />,
      },
      {
        path: "giohang",
        element: <GioHangWebsite />,
      },
      {
        path: "tra-cuu-don-hang",
        element: <TraCuuDonHangWebsite />,
      },
      {
        path: "thanhtoan",
        element: <ThanhToanWebsite />,
      },
    ],
  },
  {
    path: "/admin/dangnhap",
    element: <DangNhap />,
  },
  {
    element: <BaoVeDangNhap />,
    children: [
      {
        path: "/admin",
        element: <BocCucAdmin />,
        children: [
          {
            index: true,
            element: <DashboardAdmin />,
          },
          {
            path: "danhmuc",
            element: <DanhSachDanhMuc />,
          },
          {
            path: "sanpham",
            element: <DanhSachSanPham />,
          },
          {
            path: "donhang",
            element: <DanhSachDonHang />,
          },
          {
            path: "khachhang",
            element: <DanhSachKhachHang />,
          },
          {
            path: "thongbao",
            element: <DanhSachThongBao />,
          },
          {
            path: "doanhthu",
            element: <BaoCaoDoanhThu />,
          },
          {
            path: "caidat",
            element: <CaiDatCuaHang />,
          },
        ],
      },
    ],
  },
]);

export default router;