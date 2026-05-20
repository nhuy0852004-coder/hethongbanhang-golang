import ketNoiApi from "./ketnoiapi";

export async function layBaoCaoDoanhThu(params = {}) {
  const phanHoi = await ketNoiApi.get("/baocao/doanhthu", { params });
  return phanHoi.data;
}

export async function layTopSanPham(params = {}) {
  const phanHoi = await ketNoiApi.get("/baocao/top-sanpham", { params });
  return phanHoi.data;
}

export async function layBaoCaoDonHang(params = {}) {
  const phanHoi = await ketNoiApi.get("/baocao/donhang", { params });
  return phanHoi.data;
}