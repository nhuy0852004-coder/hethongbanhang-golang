export function formatTienVietNam(soTien) {
  const giaTri = Number(soTien || 0);

  return giaTri.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}
