import useGiaoDienStore from "../../stores/giaodienStore";

export default function DangTaiToanManHinh() {
  const dangTaiToanManHinh = useGiaoDienStore(
    (state) => state.dangTaiToanManHinh
  );

  if (!dangTaiToanManHinh) {
    return null;
  }

  return (
    <div className="loading-toan-man-hinh">
      <div className="hop-loading">
        <div className="spinner-border" />
        <strong>Đang xử lý</strong>
        <span>Vui lòng chờ trong giây lát...</span>
      </div>
    </div>
  );
}