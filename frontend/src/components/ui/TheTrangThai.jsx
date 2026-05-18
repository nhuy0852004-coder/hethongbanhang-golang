import clsx from "clsx";

const cauHinhTrangThai = {
  hien_thi: {
    ten: "Hiển thị",
    mau: "xanh",
  },
  an: {
    ten: "Đang ẩn",
    mau: "xam",
  },
  het_hang: {
    ten: "Hết hàng",
    mau: "do",
  },
  cho_xac_nhan: {
    ten: "Chờ xác nhận",
    mau: "vang",
  },
  da_xac_nhan: {
    ten: "Đã xác nhận",
    mau: "xanh",
  },
  dang_giao_hang: {
    ten: "Đang giao hàng",
    mau: "duong",
  },
  hoan_thanh: {
    ten: "Hoàn thành",
    mau: "xanh",
  },
  da_huy: {
    ten: "Đã hủy",
    mau: "do",
  },
  hoat_dong: {
    ten: "Hoạt động",
    mau: "xanh",
  },
  tam_khoa: {
    ten: "Tạm khóa",
    mau: "do",
  },
};

export default function TheTrangThai({ trangthai }) {
  const cauHinh = cauHinhTrangThai[trangthai] || {
    ten: trangthai || "Không rõ",
    mau: "xam",
  };

  return (
    <span className={clsx("the-trang-thai", `the-${cauHinh.mau}`)}>
      {cauHinh.ten}
    </span>
  );
}