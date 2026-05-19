import ketNoiApi from "./ketnoiapi";

export async function taoDonHang(duLieu) {
    const phanHoi = await ketNoiApi.post("/donhang", duLieu);
    return phanHoi.data;
}