import { createBrowserRouter } from "react-router-dom";
import BocCucAdmin from "../layouts/admin/BocCucAdmin";
import BocCucWebsite from "../layouts/website/BocCucWebsite";
import TrangKiemTra from "../pages/TrangKiemTra";
import TrangRong from "../components/TrangRong";
import BaoVeDangNhap from "../components/BaoVeDangNhap";
import DangNhap from "../modules/taikhoan/DangNhap";
import DanhSachDanhMuc from "../modules/danhmuc/DanhSachDanhMuc";
import DanhSachSanPham from "../modules/sanpham/DanhSachSanPham";
import TrangChuWebsite from "../modules/website/trangchu/TrangChuWebsite";
import DanhSachSanPhamWebsite from "../modules/website/sanpham/DanhSachSanPhamWebsite";
import ChiTietSanPhamWebsite from "../modules/website/sanpham/ChiTietSanPhamWebsite";

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
        element: (
          <TrangRong
            tieude="Giỏ hàng"
            mota="Chức năng giỏ hàng sẽ được làm ở Ngày 7."
          />
        ),
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
            element: <TrangKiemTra />,
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
            element: (
              <TrangRong
                tieude="Module đơn hàng"
                mota="Sẽ làm chi tiết ở Ngày 9."
              />
            ),
          },
          {
            path: "khachhang",
            element: (
              <TrangRong
                tieude="Module khách hàng"
                mota="Sẽ làm chi tiết ở Ngày 13."
              />
            ),
          },
          {
            path: "thongbao",
            element: (
              <TrangRong
                tieude="Module thông báo"
                mota="Sẽ làm chi tiết ở Ngày 11."
              />
            ),
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