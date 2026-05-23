import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";

function layMaDonHang(item) {
  return (
    item?.madonhang ||
    item?.madon ||
    item?.ma_don_hang ||
    `DH${String(item?.id || 0).padStart(6, "0")}`
  );
}

export default function HuyDonHangModal({
  mo,
  donHang,
  dangXuLy = false,
  onDong,
  onXacNhan,
}) {
  const [lyDoHuy, setLyDoHuy] = useState("");

  useEffect(() => {
    if (mo) {
      setLyDoHuy("");
    }
  }, [mo]);

  if (!mo) return null;

  const coTheLuu = lyDoHuy.trim().length >= 5;

  const xuLyXacNhan = () => {
    if (!coTheLuu || dangXuLy) return;

    onXacNhan?.({
      lydohuy: lyDoHuy.trim(),
    });
  };

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

      <div className="hop-modal hop-modal-huy-don-hang">
        <div className="dau-modal dau-modal-huy-don">
          <div>
            <span className="nhan-modal-nguy-hiem">Hủy đơn hàng</span>
            <h3>#{layMaDonHang(donHang)}</h3>
            <p>Đơn hàng sẽ được chuyển sang trạng thái đã hủy.</p>
          </div>

          <button
            type="button"
            className="nut-dong-modal"
            disabled={dangXuLy}
            onClick={onDong}
          >
            <X size={20} />
          </button>
        </div>

        <div className="noi-dung-modal noi-dung-huy-don">
          <div className="canh-bao-huy-don">
            <AlertTriangle size={20} />
            <div>
              <strong>Xác nhận hủy đơn hàng</strong>
              <span>
                Thao tác này không xóa đơn khỏi hệ thống. Đơn sẽ được giữ lại để
                đối soát và theo dõi lịch sử xử lý.
              </span>
            </div>
          </div>

          <label className="form-ly-do-huy">
            <span>Lý do hủy đơn</span>

            <textarea
              value={lyDoHuy}
              disabled={dangXuLy}
              onChange={(event) => setLyDoHuy(event.target.value)}
              placeholder="Ví dụ: Khách yêu cầu hủy, không liên hệ được khách, sản phẩm hết hàng..."
              rows={4}
            />

            <small>Nhập tối thiểu 5 ký tự để xác nhận hủy đơn.</small>
          </label>
        </div>

        <div className="chan-modal chan-modal-huy-don">
          <button
            type="button"
            className="nut-modal-phu"
            disabled={dangXuLy}
            onClick={onDong}
          >
            Đóng
          </button>

          <button
            type="button"
            className="nut-modal-nguy-hiem"
            disabled={dangXuLy || !coTheLuu}
            onClick={xuLyXacNhan}
          >
            {dangXuLy ? "Đang hủy..." : "Hủy đơn hàng"}
          </button>
        </div>
      </div>
    </div>
  );
}