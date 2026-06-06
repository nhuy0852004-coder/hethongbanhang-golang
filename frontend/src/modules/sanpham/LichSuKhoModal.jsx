import { useEffect, useState } from "react";
import { X, TrendingUp, TrendingDown, History, ArrowRight } from "lucide-react";
import toast from "react-hot-toast";
import { layLichSuKho } from "../../api/sanphamApi";

const LY_DO_CONFIG = {
  khoi_tao:  { ten: "Khởi tạo",      mau: "xanh-la", dot: "#22c55e" },
  nhap_them: { ten: "Nhập thêm",     mau: "xanh-la", dot: "#22c55e" },
  sua_tay:   { ten: "Sửa thủ công",  mau: "vang",    dot: "#f59e0b" },
  ban_hang:  { ten: "Bán hàng",      mau: "do",      dot: "#ef4444" },
  huy_don:   { ten: "Hủy đơn",       mau: "xanh",    dot: "#3b82f6" },
};

function hienThiNgay(value) {
  if (!value) return "—";
  const d = new Date(value);
  return d.toLocaleString("vi-VN", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  });
}

export default function LichSuKhoModal({ mo, sanPham, onDong }) {
  const [dangTai, setDangTai] = useState(false);
  const [danhSach, setDanhSach] = useState([]);
  const [phanTrang, setPhanTrang] = useState({ trang: 1, gioihan: 20, tongsodong: 0, tongsotrang: 1 });
  const [trang, setTrang] = useState(1);
  const [locLyDo, setLocLyDo] = useState("");

  const taiDanhSach = async (trangMoi = 1) => {
    if (!sanPham?.id) return;
    try {
      setDangTai(true);
      const ketQua = await layLichSuKho(sanPham.id, { trang: trangMoi, gioihan: 20 });
      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không tải được lịch sử kho");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    if (!mo || !sanPham?.id) return;
    setTrang(1);
    setLocLyDo("");
    taiDanhSach(1);
  }, [mo, sanPham?.id]);

  useEffect(() => {
    if (!mo) return;
    taiDanhSach(trang);
  }, [trang]);

  if (!mo) return null;

  // Lọc phía client theo lý do
  const danhSachHienThi = locLyDo
    ? danhSach.filter((i) => i.lydo === locLyDo)
    : danhSach;

  // Tổng hợp stats
  const tongTang = danhSach.reduce((s, i) => i.soluongthaydoi > 0 ? s + i.soluongthaydoi : s, 0);
  const tongGiam = danhSach.reduce((s, i) => i.soluongthaydoi < 0 ? s + Math.abs(i.soluongthaydoi) : s, 0);

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />

      <div className="lsk-modal">
        {/* ── Header ── */}
        <div className="lsk-header">
          <div className="lsk-header-trai">
            <div className="lsk-header-icon"><History size={17} /></div>
            <div>
              <h3 className="lsk-header-tieu-de">Lịch sử biến động kho</h3>
              <p className="lsk-header-sp">{sanPham?.tensanpham || "Sản phẩm"}</p>
            </div>
          </div>
          <button type="button" className="lsk-nut-dong" onClick={onDong}>
            <X size={18} />
          </button>
        </div>

        {/* ── Stats ── */}
        {phanTrang.tongsodong > 0 && (
          <div className="lsk-stats">
            <div className="lsk-stat-item">
              <span className="lsk-stat-label">Tổng bản ghi</span>
              <strong className="lsk-stat-value">{phanTrang.tongsodong}</strong>
            </div>
            <div className="lsk-stat-sep" />
            <div className="lsk-stat-item">
              <TrendingUp size={14} className="lsk-stat-icon tang" />
              <span className="lsk-stat-label">Tổng nhập</span>
              <strong className="lsk-stat-value tang">+{tongTang}</strong>
            </div>
            <div className="lsk-stat-sep" />
            <div className="lsk-stat-item">
              <TrendingDown size={14} className="lsk-stat-icon giam" />
              <span className="lsk-stat-label">Tổng xuất</span>
              <strong className="lsk-stat-value giam">-{tongGiam}</strong>
            </div>
            <div className="lsk-stat-sep" />
            <div className="lsk-stat-item">
              <span className="lsk-stat-label">Tồn hiện tại</span>
              <strong className="lsk-stat-value">{sanPham?.soluongton ?? "—"}</strong>
            </div>
          </div>
        )}

        {/* ── Bộ lọc lý do ── */}
        {phanTrang.tongsodong > 0 && (
          <div className="lsk-loc">
            {[{ key: "", ten: "Tất cả" }, ...Object.entries(LY_DO_CONFIG).map(([k, v]) => ({ key: k, ten: v.ten }))].map(({ key, ten }) => (
              <button
                key={key}
                type="button"
                className={`lsk-loc-nut ${locLyDo === key ? "active" : ""}`}
                onClick={() => setLocLyDo(key)}
              >
                {key && <span className="lsk-loc-dot" style={{ background: LY_DO_CONFIG[key]?.dot }} />}
                {ten}
              </button>
            ))}
          </div>
        )}

        {/* ── Body ── */}
        <div className="lsk-body">
          {dangTai ? (
            <div className="lsk-loading">
              <div className="lsk-spinner" />
              <span>Đang tải...</span>
            </div>
          ) : danhSachHienThi.length === 0 ? (
            <div className="lsk-rong">
              <History size={36} strokeWidth={1.5} />
              <p>Chưa có lịch sử biến động kho</p>
            </div>
          ) : (
            <div className="lsk-danh-sach">
              {danhSachHienThi.map((item) => {
                const cfg = LY_DO_CONFIG[item.lydo] || { ten: item.lydo, mau: "xam", dot: "#9ca3af" };
                const laTang = item.soluongthaydoi > 0;
                const laGiam = item.soluongthaydoi < 0;
                return (
                  <div key={item.id} className="lsk-dong">
                    {/* Timeline dot */}
                    <div className="lsk-timeline">
                      <div className="lsk-dot" style={{ background: cfg.dot }} />
                      <div className="lsk-duong" />
                    </div>

                    {/* Nội dung */}
                    <div className="lsk-noi-dung">
                      <div className="lsk-dong-dau">
                        <span className={`lsk-nhan lsk-nhan--${cfg.mau}`}>{cfg.ten}</span>
                        <span className="lsk-ngay">{hienThiNgay(item.created_at)}</span>
                      </div>

                      <div className="lsk-dong-giua">
                        {/* Luồng: trước → thay đổi → sau */}
                        <div className="lsk-luong">
                          <div className="lsk-luong-hop">
                            <span className="lsk-luong-nhan">Trước</span>
                            <strong className="lsk-luong-so">{item.soluongtruoc}</strong>
                          </div>

                          <div className={`lsk-luong-thay-doi ${laTang ? "tang" : laGiam ? "giam" : ""}`}>
                            <ArrowRight size={14} />
                            <span>{laTang ? `+${item.soluongthaydoi}` : item.soluongthaydoi}</span>
                          </div>

                          <div className="lsk-luong-hop">
                            <span className="lsk-luong-nhan">Sau</span>
                            <strong className={`lsk-luong-so ${laTang ? "tang" : laGiam ? "giam" : ""}`}>{item.soluongsau}</strong>
                          </div>
                        </div>

                        {item.ghichu && (
                          <p className="lsk-ghi-chu">"{item.ghichu}"</p>
                        )}
                        {item.thamchieu && (
                          <span className="lsk-tham-chieu">Ref: {item.thamchieu}</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Phân trang ── */}
        {!dangTai && phanTrang.tongsotrang > 1 && (
          <div className="lsk-phan-trang">
            <span className="lsk-pt-info">Trang {trang} / {phanTrang.tongsotrang}</span>
            <div className="lsk-pt-nhom">
              <button className="lsk-pt-nut" disabled={trang === 1} onClick={() => setTrang(t => t - 1)}>‹ Trước</button>
              <button className="lsk-pt-nut" disabled={trang === phanTrang.tongsotrang} onClick={() => setTrang(t => t + 1)}>Sau ›</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
