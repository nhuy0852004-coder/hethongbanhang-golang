import ketNoiApi from "./ketnoiapi";

export async function kiemTraGioHang(duLieu) {
  const phanHoi = await ketNoiApi.post("/giohang/kiemtra", duLieu);
  return phanHoi.data;
}