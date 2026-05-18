import ketNoiApi from "./ketnoiapi";

export async function dangNhapTaiKhoan(duLieu) {
    const phanhoi = await ketNoiApi.post("/dangnhap", duLieu);
    return phanhoi.data;
}

export async function layThongTinTaiKhoan() {
    const phanhoi = await ketNoiApi.get("/thong-tin-tai-khoan");
    return phanhoi.data;
}

export async function dangXuatTaiKhoan() {
    const phanhoi = await ketNoiApi.post("/dangxuat",);
    return phanhoi.data;
}