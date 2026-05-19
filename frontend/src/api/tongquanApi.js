import ketNoiApi from "./ketnoiapi";

export async function layTongQuan() {
  const phanHoi = await ketNoiApi.get("/tongquan");
  return phanHoi.data;
}