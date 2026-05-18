export default function DangTai({ noidung = "Đang tải dữ liệu..." }) {
  return (
    <div className="khung-dang-tai-moi">
      <div className="spinner-border spinner-border-sm" role="status" />
      <span>{noidung}</span>
    </div>
  );
}