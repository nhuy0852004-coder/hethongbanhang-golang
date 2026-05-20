import ketNoiApi from "./ketnoiapi";

export async function layCaiDat() {
  const phanHoi = await ketNoiApi.get("/caidat");
  return phanHoi.data;
}

export async function capNhatCaiDat(duLieu) {
  const phanHoi = await ketNoiApi.put("/caidat", duLieu);
  return phanHoi.data;
}

export async function uploadLogo(file) {
  const formData = new FormData();
  formData.append("logo", file);

  const phanHoi = await ketNoiApi.post("/caidat/upload-logo", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return phanHoi.data;
}