import { createBrowserRouter } from "react-router-dom";
import BocCucAdmin from "../layouts/BocCucAdmin";
import TrangKiemTra from "../pages/TrangKiemTra";
import TrangRong from "../components/TrangRong";

const router = createBrowserRouter([
  {
    path: "/",
    element: <BocCucAdmin />,
    children: [
      {
        index: true,
        element: <TrangKiemTra />,
      },
      {
        path: "admin/danhmuc",
        element: <TrangRong tieude="Module danh mục" mota="Sẽ làm chi tiết ở Ngày 4." />,
      },
      {
        path: "admin/sanpham",
        element: <TrangRong tieude="Module sản phẩm" mota="Sẽ làm chi tiết ở Ngày 5." />,
      },
      {
        path: "admin/donhang",
        element: <TrangRong tieude="Module đơn hàng" mota="Sẽ làm chi tiết ở Ngày 9." />,
      },
      {
        path: "admin/khachhang",
        element: <TrangRong tieude="Module khách hàng" mota="Sẽ làm chi tiết ở Ngày 13." />,
      },
      {
        path: "admin/thongbao",
        element: <TrangRong tieude="Module thông báo" mota="Sẽ làm chi tiết ở Ngày 11." />,
      },
      {
        path: "admin/doanhthu",
        element: <TrangRong tieude="Module doanh thu" mota="Sẽ làm chi tiết ở Ngày 12 và 14." />,
      },
      {
        path: "admin/caidat",
        element: <TrangRong tieude="Cài đặt cửa hàng" mota="Sẽ làm chi tiết ở Ngày 14." />,
      },
    ],
  },
]);

export default router;
