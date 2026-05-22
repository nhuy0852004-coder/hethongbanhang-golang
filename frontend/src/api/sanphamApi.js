import ketNoiApi from "./ketnoiapi";

export async function layDanhSachSanPham(params = {}) {
  const filteredParams = {};
  Object.keys(params || {}).forEach((key) => {
    const val = params[key];
    if (val === undefined || val === null) return;
    if (typeof val === "string") {
      if (val.trim() === "") return;
    }
    filteredParams[key] = val;
  });

  const phanHoi = await ketNoiApi.get("/sanpham", {
    params: filteredParams,
  });

  return phanHoi.data;
}

export async function layChiTietSanPham(id) {
  const phanHoi = await ketNoiApi.get(`/sanpham/${id}`);
  return phanHoi.data;
}

export async function themSanPham(duLieu) {
  const phanHoi = await ketNoiApi.post("/sanpham", duLieu);
  return phanHoi.data;
}

export async function capNhatSanPham(id, duLieu) {
  const phanHoi = await ketNoiApi.put(`/sanpham/${id}`, duLieu);
  return phanHoi.data;
}

export async function xoaSanPham(id) {
  const phanHoi = await ketNoiApi.delete(`/sanpham/${id}`);
  return phanHoi.data;
}

export async function capNhatTrangThaiSanPham(id, trangthai) {
  const phanHoi = await ketNoiApi.patch(`/sanpham/${id}/trangthai`, {
    trangthai,
  });

  return phanHoi.data;
}

export async function uploadAnhSanPham(id, file) {
  const formData = new FormData();
  formData.append("hinhanh", file);

  const phanHoi = await ketNoiApi.post(`/sanpham/${id}/upload-anh`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return phanHoi.data;
}

export async function uploadAlbumAnhSanPham(id, files = []) {
  const formData = new FormData();

  Array.from(files).forEach((file) => {
    formData.append("album", file);
  });

  const phanHoi = await ketNoiApi.post(
    `/sanpham/${id}/upload-album`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return phanHoi.data;
}

export async function bulkCapNhatTrangThaiSanPham(ids, trangthai) {
  const phanHoi = await ketNoiApi.patch("/sanpham/bulk-trangthai", {
    ids,
    trangthai,
  });

  return phanHoi.data;
}

export async function bulkXoaSanPham(ids) {
  const phanHoi = await ketNoiApi.post("/sanpham/bulk-xoa", {
    ids,
  });

  return phanHoi.data;
}