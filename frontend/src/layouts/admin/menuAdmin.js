import {
  BarChart3,
  Bell,
  FolderOpen,
  Home,
  Package,
  Settings,
  ShoppingCart,
  Users,
} from "lucide-react";

const menuAdmin = [
  {
    nhom: "MENU CHÍNH",
    danhSach: [
      {
        ten: "Tổng quan",
        duongdan: "/admin",
        icon: Home,
      },
      {
        ten: "Quản lý đơn hàng",
        duongdan: "/admin/donhang",
        icon: ShoppingCart,
      },
      {
        ten: "Quản lý sản phẩm",
        duongdan: "/admin/sanpham",
        icon: Package,
      },
      {
        ten: "Danh mục",
        duongdan: "/admin/danhmuc",
        icon: FolderOpen,
      },
      {
        ten: "Khách hàng",
        duongdan: "/admin/khachhang",
        icon: Users,
      },
    ],
  },
  {
    nhom: "PHÂN TÍCH",
    danhSach: [
      {
        ten: "Báo cáo doanh thu",
        duongdan: "/admin/doanhthu",
        icon: BarChart3,
      },
      {
        ten: "Thông báo",
        duongdan: "/admin/thongbao",
        icon: Bell,
      },
    ],
  },
  {
    nhom: "",
    danhSach: [
      {
        ten: "Cài đặt",
        duongdan: "/admin/caidat",
        icon: Settings,
      },
    ],
  },
];

export default menuAdmin;
