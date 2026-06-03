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

export async function khoiPhucDanhMuc(id) {
  const phanHoi = await ketNoiApi.patch(`/danhmuc/${id}/khoiphuc`);
  return phanHoi.data;
}

export async function xoaVinhVienDanhMuc(id) {
  const phanHoi = await ketNoiApi.delete(`/danhmuc/${id}/vinhvien`);
  return phanHoi.data;
}

export async function capNhatTrangThaiDanhMuc(id, trangthai) {
  const phanHoi = await ketNoiApi.patch(`/danhmuc/${id}/trangthai`, {
    trangthai,
  });

  return phanHoi.data;
}

export async function bulkCapNhatTrangThaiDanhMuc(ids, trangthai) {
  const phanHoi = await ketNoiApi.patch("/danhmuc/bulk-trangthai", {
    ids,
    trangthai,
  });

  return phanHoi.data;
}

export async function bulkXoaDanhMuc(ids) {
  const phanHoi = await ketNoiApi.post("/danhmuc/bulk-xoa", {
    ids,
  });

  return phanHoi.data;
}

export async function capNhatThuTuDanhMuc(id, thutu) {
  const phanHoi = await ketNoiApi.patch(`/danhmuc/${id}/thutu`, { thutu });
  return phanHoi.data;
}

export async function uploadAnhDanhMuc(id, file) {
  const formData = new FormData();
  formData.append("hinhanh", file);

  const phanHoi = await ketNoiApi.post(`/danhmuc/${id}/upload-anh`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return phanHoi.data;
}
