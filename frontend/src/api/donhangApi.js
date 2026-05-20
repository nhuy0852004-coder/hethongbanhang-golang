import ketNoiApi from "./ketnoiapi";

export async function taoDonHang(duLieu) {
  const phanHoi = await ketNoiApi.post("/donhang", duLieu);
  return phanHoi.data;
}

export async function traCuuDonHang(params = {}) {
  const phanHoi = await ketNoiApi.get("/donhang/tracuu", {
    params,
  });

  return phanHoi.data;
}

export async function layDanhSachDonHang(params = {}) {
  const phanHoi = await ketNoiApi.get("/donhang", {
    params,
  });

  return phanHoi.data;
}

export async function layChiTietDonHang(id) {
  const phanHoi = await ketNoiApi.get(`/donhang/${id}`);
  return phanHoi.data;
}

export async function capNhatTrangThaiDonHang(id, trangthai) {
  const phanHoi = await ketNoiApi.patch(`/donhang/${id}/trangthai`, {
    trangthai,
  });

  return phanHoi.data;
}

export async function xoaDonHang(id) {
  const phanHoi = await ketNoiApi.delete(`/donhang/${id}`);
  return phanHoi.data;
}