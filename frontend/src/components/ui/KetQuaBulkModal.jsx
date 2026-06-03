import { X, CheckCircle2, AlertCircle, Info } from "lucide-react";
import NutBam from "./NutBam";

export default function KetQuaBulkModal({
  mo,
  ketQua,
  dangXuLy = false,
  onDong,
}) {
  if (!mo || !ketQua) return null;

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

      <div className="hop-modal" style={{ maxWidth: "600px", borderRadius: "20px" }}>
        <div className="dau-modal" style={{ borderBottom: "none", paddingBottom: "10px", padding: "24px 24px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "14px",
              background: "#eff6ff",
              color: "#3b82f6",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0
            }}>
              <Info size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: "20px", fontWeight: "800", color: "#111827", margin: "0 0 6px 0" }}>
                Kết quả xử lý hàng loạt
              </h3>
              <p style={{ margin: 0, color: "#6b7280", fontSize: "14px", lineHeight: "1.5" }}>
                Đã thực hiện thao tác trên <strong>{ketQua.tongso}</strong> danh mục được chọn.
              </p>
            </div>
          </div>

          <button
            type="button"
            className="nut-dong-modal"
            disabled={dangXuLy}
            onClick={onDong}
            style={{ position: "absolute", top: "20px", right: "20px", border: "none", background: "#f3f4f6" }}
          >
            <X size={20} />
          </button>
        </div>

        <div className="noi-dung-modal" style={{ padding: "0 24px 24px", maxHeight: "60vh", overflowY: "auto" }}>
          
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "12px",
            marginBottom: "20px",
            marginTop: "16px"
          }}>
            <div style={{
              background: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <CheckCircle2 size={24} color="#22c55e" />
              <div>
                <div style={{ color: "#166534", fontSize: "22px", fontWeight: "800", lineHeight: "1" }}>{ketQua.thanhcong}</div>
                <div style={{ color: "#15803d", fontSize: "13px", marginTop: "4px", fontWeight: "500" }}>Thành công</div>
              </div>
            </div>

            <div style={{
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "12px",
              padding: "16px",
              display: "flex",
              alignItems: "center",
              gap: "12px"
            }}>
              <AlertCircle size={24} color="#ef4444" />
              <div>
                <div style={{ color: "#991b1b", fontSize: "22px", fontWeight: "800", lineHeight: "1" }}>{ketQua.thatbai}</div>
                <div style={{ color: "#b91c1c", fontSize: "13px", marginTop: "4px", fontWeight: "500" }}>Thất bại</div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <div style={{ fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "4px" }}>Chi tiết kết quả:</div>
            
            {ketQua.ketqua && ketQua.ketqua.map((item, index) => (
              <div 
                key={`${item.id}-${index}`} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "14px",
                  padding: "16px",
                  borderRadius: "12px",
                  backgroundColor: item.thanhcong ? "#ffffff" : "#fef2f2",
                  border: `1px solid ${item.thanhcong ? "#e5e7eb" : "#fecaca"}`,
                  boxShadow: item.thanhcong ? "0 1px 2px rgba(0,0,0,0.02)" : "none"
                }}
              >
                {item.thanhcong ? (
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#dcfce7", display: "grid", placeItems: "center", color: "#15803d", flexShrink: 0 }}>
                    <CheckCircle2 size={20} />
                  </div>
                ) : (
                  <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "#fee2e2", display: "grid", placeItems: "center", color: "#b91c1c", flexShrink: 0 }}>
                    <AlertCircle size={20} />
                  </div>
                )}
                
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ fontWeight: 700, fontSize: "14px", color: item.thanhcong ? "#111827" : "#991b1b" }}>
                      ID: {item.id}
                    </span>
                    <span style={{ 
                      fontSize: "11px", 
                      padding: "2px 8px", 
                      borderRadius: "99px",
                      background: item.thanhcong ? "#dcfce7" : "#fee2e2",
                      color: item.thanhcong ? "#15803d" : "#b91c1c",
                      fontWeight: "600",
                      textTransform: "uppercase"
                    }}>
                      {item.thanhcong ? "Thành công" : "Thất bại"}
                    </span>
                  </div>
                  <div style={{ fontSize: "14px", color: item.thanhcong ? "#4b5563" : "#b91c1c", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.thongbao}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chan-modal" style={{ padding: "16px 24px", borderTop: "1px solid #e5e7eb", background: "#f9fafb" }}>
          <NutBam type="button" onClick={onDong}>
            Đóng cửa sổ
          </NutBam>
        </div>
      </div>
    </div>
  );
}
