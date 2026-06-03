import ketNoiApi from "./ketnoiapi";

export async function layTongQuan(khoangNgay = "7ngay") {
  const phanHoi = await ketNoiApi.get("/tongquan", {
    params: { khoangngay: khoangNgay },
  });
  return phanHoi.data;
}
