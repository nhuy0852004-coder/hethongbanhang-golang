import { useState } from "react";
import {
  CalendarClock,
  Copy,
  History,
  ImageOff,
  PackageCheck,
  Pencil,
  ShoppingCart,
  Tag,
  X,
} from "lucide-react";
import { layUrlAnh } from "../../api/ketnoiapi";
import { formatTienVietNam as formatTienHienThi } from "../../utils/dinhtien";
import LichSuKhoModal from "./LichSuKhoModal";

function nhanTrangThai(trangthai) {
  if (trangthai === "hien_thi") return { text: "Đang bán", cls: "ct-nhan-xanh" };
  if (trangthai === "het_hang") return { text: "Hết hàng", cls: "ct-nhan-do" };
  return { text: "Đang ẩn", cls: "ct-nhan-xam" };
}

function hienThiNgay(value) {
  if (!value) return "Chưa có";
  return new Date(value).toLocaleString("vi-VN");
}

function DongThongTin({ nhan, gia }) {
  return (
    <div className="ct-dong">
      <span className="ct-dong-nhan">{nhan}</span>
      <strong className="ct-dong-gia">{gia}</strong>
    </div>
  );
}

export default function ChiTietSanPhamModal({
  mo,
  sanPham,
  album = [],
  dangTai = false,
  onDong,
  onSuaNhanh,
  onNhanBan,
}) {
  const [modalLichSuKhoMo, setModalLichSuKhoMo] = useState(false);

  if (!mo) return null;

  const anhChinh =
    sanPham?.hinhanh ||
    album.find((a) => a.anhchinh)?.duongdan ||
    album[0]?.duongdan ||
    "";

  const trangThai = nhanTrangThai(sanPham?.trangthai);

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />

      <div className="hop-modal ct-modal-ngang">
        {/* Header */}
        <div className="dau-modal ct-modal-header">
          <div>
            <span className="nhan-modal-san-pham">Chi tiết</span>
            <h3>{sanPham?.tensanpham || "Chi tiết sản phẩm"}</h3>
          </div>
          <button type="button" className="nut-dong-modal" onClick={onDong}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="ct-modal-body">
          {dangTai ? (
            <div className="ct-dang-tai">Đang tải chi tiết sản phẩm...</div>
          ) : (
            <>
              {/* CỘT TRÁI — Hình ảnh */}
              <div className="ct-cot-anh">
                <div className="ct-section-label">Hình ảnh</div>

                <div className="ct-anh-chinh">
                  {anhChinh ? (
                    <img src={layUrlAnh(anhChinh)} alt={sanPham?.tensanpham} />
                  ) : (
                    <div className="ct-anh-trong">
                      <ImageOff size={32} strokeWidth={1.5} />
                      <span>Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                {album.length > 0 && (
                  <>
                    <div className="ct-section-label ct-section-label--gap">Album ({album.length})</div>
                    <div className="ct-album">
                      {album.map((item) => (
                        <img
                          key={item.id}
                          src={layUrlAnh(item.duongdan)}
                          alt="Album"
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>

              {/* CỘT GIỮA — Thông tin chính */}
              <div className="ct-cot-info">
                {/* Tên + trạng thái */}
                <div className="ct-dau-san-pham">
                  <div>
                    <h4 className="ct-ten">{sanPham?.tensanpham || "—"}</h4>
                    {sanPham?.motangan && (
                      <p className="ct-mota-ngan">{sanPham.motangan}</p>
                    )}
                  </div>
                  <span className={`ct-nhan-tt ${trangThai.cls}`}>
                    {trangThai.text}
                  </span>
                </div>

                {/* Định danh */}
                <div className="ct-section-label">Thông tin nhận diện</div>
                <div className="ct-luoi-3">
                  <DongThongTin nhan="Mã sản phẩm" gia={sanPham?.madinhdanh || "—"} />
                  <DongThongTin nhan="SKU" gia={sanPham?.sku || "—"} />
                  <DongThongTin nhan="Barcode" gia={sanPham?.barcode || "Chưa có"} />
                </div>
                <div className="ct-luoi-3">
                  <DongThongTin nhan="Danh mục" gia={sanPham?.tendanhmuc || "Chưa phân loại"} />
                  <DongThongTin nhan="Thương hiệu" gia={sanPham?.thuonghieu || "Chưa có"} />
                  <DongThongTin nhan="Đơn vị tính" gia={sanPham?.donvitinh || "cái"} />
                </div>

                {/* Giá & tồn kho */}
                <div className="ct-section-label ct-section-label--gap">
                  <PackageCheck size={13} /> Giá bán & Tồn kho
                </div>
                <div className="ct-luoi-3">
                  <DongThongTin nhan="Giá nhập" gia={formatTienHienThi(sanPham?.gianhap || 0)} />
                  <DongThongTin nhan="Giá bán" gia={formatTienHienThi(sanPham?.giaban || 0)} />
                  <DongThongTin
                    nhan="Giá khuyến mãi"
                    gia={sanPham?.giakhuyenmai ? formatTienHienThi(sanPham.giakhuyenmai) : "Không áp dụng"}
                  />
                </div>
                <div className="ct-luoi-3">
                  <DongThongTin nhan="Tồn kho" gia={`${sanPham?.soluongton ?? 0} sản phẩm`} />
                  <DongThongTin nhan="Ngưỡng cảnh báo" gia={`${sanPham?.nguongcanhbao ?? 5} sản phẩm`} />
                  <DongThongTin nhan="Lượt bán" gia={`${sanPham?.luotban ?? 0} đơn`} />
                </div>

                {/* Vận chuyển */}
                <div className="ct-section-label ct-section-label--gap">
                  <ShoppingCart size={13} /> Vận chuyển
                </div>
                <div className="ct-luoi-2">
                  <DongThongTin
                    nhan="Trọng lượng"
                    gia={sanPham?.trongluong ? `${sanPham.trongluong} gram` : "Chưa có"}
                  />
                  <DongThongTin nhan="Kích thước" gia={sanPham?.kichthuoc || "Chưa có"} />
                </div>

                {/* Nhãn */}
                <div className="ct-section-label ct-section-label--gap">
                  <Tag size={13} /> Nhãn sản phẩm
                </div>
                <div className="ct-nhan-list">
                  <span className={sanPham?.noibat ? "ct-tag ct-tag--bat" : "ct-tag ct-tag--tat"}>
                    {sanPham?.noibat ? "✓ Nổi bật" : "✗ Nổi bật"}
                  </span>
                  <span className={sanPham?.banchay ? "ct-tag ct-tag--bat" : "ct-tag ct-tag--tat"}>
                    {sanPham?.banchay ? "✓ Bán chạy" : "✗ Bán chạy"}
                  </span>
                  <span className={sanPham?.sanphammoi ? "ct-tag ct-tag--bat" : "ct-tag ct-tag--tat"}>
                    {sanPham?.sanphammoi ? "✓ Sản phẩm mới" : "✗ Sản phẩm mới"}
                  </span>
                  <span className={sanPham?.chodattruoc ? "ct-tag ct-tag--bat" : "ct-tag ct-tag--tat"}>
                    {sanPham?.chodattruoc ? "✓ Đặt trước" : "✗ Đặt trước"}
                  </span>
                </div>
              </div>

              {/* CỘT PHẢI — Mô tả + thời gian */}
              <div className="ct-cot-mota">
                <div className="ct-section-label">
                  <CalendarClock size={13} /> Mô tả
                </div>

                <div className="ct-mota-nhom">
                  <p className="ct-mota-tieu">Mô tả ngắn</p>
                  <p className="ct-mota-noi-dung">
                    {sanPham?.motangan || <span className="ct-chua-co">Chưa có mô tả ngắn.</span>}
                  </p>
                </div>

                <div className="ct-mota-nhom">
                  <p className="ct-mota-tieu">Mô tả chi tiết</p>
                  <p className="ct-mota-noi-dung">
                    {sanPham?.motachitiet || sanPham?.mota || (
                      <span className="ct-chua-co">Chưa có mô tả chi tiết.</span>
                    )}
                  </p>
                </div>

                <div className="ct-mota-nhom" style={{ gridColumn: "1 / -1" }}>
                  <p className="ct-mota-tieu">Danh sách biến thể</p>
                  {sanPham?.danhsachbienthe && sanPham.danhsachbienthe.length > 0 ? (
                    <div style={{ overflowX: "auto", marginTop: 8 }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                        <thead>
                          <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                            <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Thuộc tính</th>
                            <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Giá bán</th>
                            <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Tồn kho</th>
                          </tr>
                        </thead>
                        <tbody>
                          {sanPham.danhsachbienthe.map((bt, i) => (
                            <tr key={i}>
                              <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>
                                {bt.tenthuoctinh1 && <span>{bt.tenthuoctinh1}: <strong>{bt.giatrithuoctinh1}</strong></span>}
                                {bt.tenthuoctinh1 && bt.tenthuoctinh2 && " | "}
                                {bt.tenthuoctinh2 && <span>{bt.tenthuoctinh2}: <strong>{bt.giatrithuoctinh2}</strong></span>}
                              </td>
                              <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0", color: "#0ea5e9", fontWeight: 500 }}>
                                {bt.giaban ? formatTienHienThi(bt.giaban) : "Theo giá gốc"}
                              </td>
                              <td style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>
                                {bt.soluongton}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="ct-mota-noi-dung">
                      <span className="ct-chua-co">Sản phẩm này không có biến thể.</span>
                    </p>
                  )}
                </div>

                <div className="ct-section-label ct-section-label--gap">
                  <CalendarClock size={13} /> Thời gian
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <DongThongTin nhan="Ngày tạo" gia={hienThiNgay(sanPham?.created_at)} />
                  <DongThongTin nhan="Cập nhật" gia={hienThiNgay(sanPham?.updated_at)} />
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="ct-modal-footer">
          <button type="button" className="nut-chi-tiet-phu" onClick={onDong}>
            Đóng
          </button>
          <button
            type="button"
            className="nut-chi-tiet-phu"
            onClick={() => setModalLichSuKhoMo(true)}
            disabled={!sanPham}
          >
            <History size={15} />
            Lịch sử kho
          </button>
          <button
            type="button"
            className="nut-chi-tiet-phu"
            onClick={() => onNhanBan?.(sanPham)}
            disabled={!sanPham}
          >
            <Copy size={15} />
            Nhân bản
          </button>
          <button
            type="button"
            className="nut-chi-tiet-chinh"
            onClick={() => onSuaNhanh?.(sanPham)}
            disabled={!sanPham}
          >
            <Pencil size={15} />
            Sửa nhanh
          </button>
        </div>
      </div>

      <LichSuKhoModal
        mo={modalLichSuKhoMo}
        sanPham={sanPham}
        onDong={() => setModalLichSuKhoMo(false)}
      />
    </div>
  );
}
