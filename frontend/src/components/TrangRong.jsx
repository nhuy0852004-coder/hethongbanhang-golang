import { Inbox } from "lucide-react";
import NutBam from "./ui/NutBam";

export default function TrangRong({
  tieude = "Chưa có dữ liệu",
  mota = "Dữ liệu sẽ hiển thị tại đây khi hệ thống có thông tin.",
  nut = "",
  icon: Icon = Inbox,
  onClick,
}) {
  return (
    <div className="trang-rong-moi">
      <div className="trang-rong-icon-moi">
        <Icon size={36} />
      </div>

      <h3>{tieude}</h3>
      <p>{mota}</p>

      {nut && (
        <NutBam onClick={onClick} className="mt-2">
          {nut}
        </NutBam>
      )}
    </div>
  );
}