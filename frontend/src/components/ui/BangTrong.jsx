import { Inbox } from "lucide-react";

export default function BangTrong({
  tieuDe = "Không có dữ liệu",
  moTa = "Dữ liệu sẽ hiển thị ở đây sau khi được tạo.",
}) {
  return (
    <div className="bang-trong">
      <div className="bang-trong-icon">
        <Inbox size={42} />
      </div>

      <h3>{tieuDe}</h3>

      <p>{moTa}</p>
    </div>
  );
}