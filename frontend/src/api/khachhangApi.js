import ketNoiApi from "./ketnoiapi";

export async function layDanhSachKhachHang(params = {}) {
  const phanHoi = await ketNoiApi.get("/khachhang", {
    params,
  });

  return phanHoi.data;
}

export async function layChiTietKhachHang(id) {
  const phanHoi = await ketNoiApi.get(`/khachhang/${id}`);
  return phanHoi.data;
}

export async function layDonHangCuaKhachHang(id) {
  const phanHoi = await ketNoiApi.get(`/khachhang/${id}/donhang`);
  return phanHoi.data;
}