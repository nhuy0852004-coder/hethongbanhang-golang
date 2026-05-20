import { createBrowserRouter } from "react-router-dom";
import BocCucAdmin from "../layouts/admin/BocCucAdmin";
import BocCucWebsite from "../layouts/website/BocCucWebsite";
import TrangRong from "../components/TrangRong";
import DashboardAdmin from "../modules/tongquan/DashboardAdmin";
import BaoVeDangNhap from "../components/BaoVeDangNhap";
import DangNhap from "../modules/taikhoan/DangNhap";
import DanhSachDanhMuc from "../modules/danhmuc/DanhSachDanhMuc";
import DanhSachSanPham from "../modules/sanpham/DanhSachSanPham";
import DanhSachDonHang from "../modules/donhang/DanhSachDonHang";
import DanhSachKhachHang from "../modules/khachhang/DanhSachKhachHang";
import DanhSachThongBao from "../modules/thongbao/DanhSachThongBao";
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
        element: (
          <TrangRong
            tieude="Tra cứu đơn hàng"
            mota="Chức năng tra cứu đơn hàng sẽ được làm sau phần đặt hàng."
          />
        ),
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
            element: (
              <TrangRong
                tieude="Module doanh thu"
                mota="Sẽ làm chi tiết ở Ngày 12 và 14."
              />
            ),
          },
          {
            path: "caidat",
            element: (
              <TrangRong
                tieude="Cài đặt cửa hàng"
                mota="Sẽ làm chi tiết ở Ngày 14."
              />
            ),
          },
        ],
      },
    ],
  },
]);

export default router;