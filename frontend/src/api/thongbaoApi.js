import ketNoiApi from "./ketnoiapi";

export async function layDanhSachThongBao(params = {}) {
  const phanHoi = await ketNoiApi.get("/thongbao", {
    params,
  });

  return phanHoi.data;
}

export async function demThongBaoChuaDoc() {
  const phanHoi = await ketNoiApi.get("/thongbao/dem-chua-doc");
  return phanHoi.data;
}

export async function capNhatDaDocThongBao(id, dadoc = true) {
  const phanHoi = await ketNoiApi.patch(`/thongbao/${id}/dadoc`, {
    dadoc,
  });

  return phanHoi.data;
}

export async function danhDauTatCaThongBaoDaDoc() {
  const phanHoi = await ketNoiApi.patch("/thongbao/danh-dau-tat-ca");
  return phanHoi.data;
}

export async function xoaThongBao(id) {
  const phanHoi = await ketNoiApi.delete(`/thongbao/${id}`);
  return phanHoi.data;
}