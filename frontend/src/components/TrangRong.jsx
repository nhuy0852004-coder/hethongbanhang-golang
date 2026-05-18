import { Inbox } from "lucide-react";

export default function TrangRong({
  tieude = "Chưa có dữ liệu",
  mota = "Dữ liệu sẽ hiển thị tại đây khi hệ thống có thông tin.",
}) {
  return (
    <div className="trang-rong">
      <div className="trang-rong-icon">
        <Inbox size={34} />
      </div>
      <h3>{tieude}</h3>
      <p>{mota}</p>
    </div>
  );
}
