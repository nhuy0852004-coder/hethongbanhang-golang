export function chiLaySo(value) {
  return String(value || "").replace(/[^\d]/g, "");
}

export function chuyenTienNhapThanhSo(value) {
  const so = Number(chiLaySo(value));
  return Number.isFinite(so) ? so : 0;
}

export function formatTienNhap(value) {
  const so = chuyenTienNhapThanhSo(value);

  if (!so) return "";

  return so.toLocaleString("vi-VN");
}
