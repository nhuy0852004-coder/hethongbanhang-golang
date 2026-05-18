import ketNoiApi from "./ketnoiapi";

export async function layDanhSachDanhMuc(params = {}) {
  const phanHoi = await ketNoiApi.get("/danhmuc", {
    params,
  });

  return phanHoi.data;
}

export async function layChiTietDanhMuc(id) {
  const phanHoi = await ketNoiApi.get(`/danhmuc/${id}`);
  return phanHoi.data;
}

export async function themDanhMuc(duLieu) {
  const phanHoi = await ketNoiApi.post("/danhmuc", duLieu);
  return phanHoi.data;
}

export async function capNhatDanhMuc(id, duLieu) {
  const phanHoi = await ketNoiApi.put(`/danhmuc/${id}`, duLieu);
  return phanHoi.data;
}

export async function xoaDanhMuc(id) {
  const phanHoi = await ketNoiApi.delete(`/danhmuc/${id}`);
  return phanHoi.data;
}

export async function capNhatTrangThaiDanhMuc(id, trangthai) {
  const phanHoi = await ketNoiApi.patch(`/danhmuc/${id}/trangthai`, {
    trangthai,
  });

  return phanHoi.data;
}