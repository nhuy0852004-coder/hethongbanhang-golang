import {
    LayoutDashboard,
    Package,
    Tags,
    ShoppingCart,
    Users,
    Bell,
    BarChart3,
    Settings,
} from "lucide-react";

export const menuAdmin = [
    {
        ten: "Tổng quan",
        duongdan: "/",
        icon: LayoutDashboard,
    },
    {
        ten: "Danh mục",
        duongdan: "/admin/danhmuc",
        icon: Tags,
    },
    {
        ten: "Sản phẩm",
        duongdan: "/admin/sanpham",
        icon: Package,
    },
    {
        ten: "Đơn hàng",
        duongdan: "/admin/donhang",
        icon: ShoppingCart,
    },
    {
        ten: "Khách hàng",
        duongdan: "/admin/khachhang",
        icon: Users,
    },
    {
        ten: "Thông báo",
        duongdan: "/admin/thongbao",
        icon: Bell,
    },
    {
        ten: "Doanh thu",
        duongdan: "/admin/doanhthu",
        icon: BarChart3,
    },
    {
        ten: "Cài đặt",
        duongdan: "/admin/caidat",
        icon: Settings,
    },
];

export default menuAdmin;
