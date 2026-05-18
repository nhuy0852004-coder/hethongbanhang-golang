import { create } from "zustand";

const layTaiKhoanTuLocal = () => {
  try {
    const duLieu = localStorage.getItem("thong_tin_tai_khoan");
    return duLieu ? JSON.parse(duLieu) : null;
  } catch {
    return null;
  }
};

const useTaiKhoanStore = create((set) => ({
  token: localStorage.getItem("ma_dang_nhap"),
  taikhoan: layTaiKhoanTuLocal(),

  daDangNhap: Boolean(localStorage.getItem("ma_dang_nhap")),

  luuDangNhap: ({ token, taikhoan }) => {
    localStorage.setItem("ma_dang_nhap", token);
    localStorage.setItem("thong_tin_tai_khoan", JSON.stringify(taikhoan));

    set({
      token,
      taikhoan,
      daDangNhap: true,
    });
  },

  dangXuat: () => {
    localStorage.removeItem("ma_dang_nhap");
    localStorage.removeItem("thong_tin_tai_khoan");

    set({
      token: null,
      taikhoan: null,
      daDangNhap: false,
    });
  },
}));

export default useTaiKhoanStore;