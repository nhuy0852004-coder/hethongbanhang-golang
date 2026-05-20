import { AlertTriangle, X } from "lucide-react";
import NutBam from "./NutBam";

export default function XacNhanModal({
  mo,
  tieuDe = "Xác nhận thao tác",
  moTa = "",
  noiDung = "",
  dangXuLy = false,
  tenNutXacNhan = "Xác nhận",
  bienThe = "nguy-hiem",
  onDong,
  onXacNhan,
}) {
  if (!mo) return null;

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

      <div className="hop-modal-xac-nhan">
        <div className="dau-modal-xac-nhan">
          <div className="icon-xac-nhan">
            <AlertTriangle size={24} />
          </div>

          <button
            type="button"
            className="nut-dong-modal"
            disabled={dangXuLy}
            onClick={onDong}
          >
            <X size={19} />
          </button>
        </div>

        <div className="than-modal-xac-nhan">
          <h3>{tieuDe}</h3>

          {moTa && <p>{moTa}</p>}

          {noiDung && <div className="noi-dung-canh-bao">{noiDung}</div>}
        </div>

        <div className="chan-modal-xac-nhan">
          <NutBam type="button" bienThe="phu" disabled={dangXuLy} onClick={onDong}>
            Hủy
          </NutBam>

          <NutBam
            type="button"
            bienThe={bienThe}
            dangXuLy={dangXuLy}
            onClick={onXacNhan}
          >
            {tenNutXacNhan}
          </NutBam>
        </div>
      </div>
    </div>
  );
}