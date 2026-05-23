import {
  CalendarClock,
  Copy,
  ImageOff,
  PackageCheck,
  Pencil,
  ShoppingCart,
  X,
} from "lucide-react";
import { formatTienHienThi } from "../../utils/tienviet";

function hienThiTrangThai(trangthai) {
  if (trangthai === "hien_thi") return "Hiển thị";
  if (trangthai === "an") return "Đang ẩn";
  if (trangthai === "het_hang") return "Hết hàng";
  return "Không rõ";
}

function hienThiNgay(value) {
  if (!value) return "Chưa có";
  return new Date(value).toLocaleString("vi-VN");
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
  if (!mo) return null;

  const anhChinh =
    sanPham?.hinhanh ||
    album.find((item) => item.anhchinh)?.duongdan ||
    album[0]?.duongdan ||
    "";

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />

      <div className="hop-modal hop-modal-chi-tiet-san-pham">
        <div className="dau-modal dau-modal-chi-tiet-san-pham">
          <div>
            <span className="nhan-modal-san-pham">Chi tiết</span>
            <h3>Chi tiết sản phẩm</h3>
            <p>Xem đầy đủ thông tin sản phẩm, giá, tồn kho và hình ảnh.</p>
          </div>

          <button type="button" className="nut-dong-modal" onClick={onDong}>
            <X size={20} />
          </button>
        </div>

        {dangTai ? (
          <div className="noi-dung-modal">
            <div className="dang-tai-chi-tiet-san-pham">
              Đang tải chi tiết sản phẩm...
            </div>
          </div>
        ) : (
          <div className="noi-dung-modal noi-dung-chi-tiet-san-pham">
            <div className="layout-chi-tiet-san-pham">
              <aside className="cot-anh-chi-tiet-san-pham">
                <div className="anh-chinh-chi-tiet-san-pham">
                  {anhChinh ? (
                    <img
                      src={`http://localhost:8080${anhChinh}`}
                      alt={sanPham?.tensanpham}
                    />
                  ) : (
                    <div>
                      <ImageOff size={42} />
                      <span>Chưa có ảnh</span>
                    </div>
                  )}
                </div>

                <div className="album-chi-tiet-san-pham">
                  {album.length > 0 ? (
                    album.map((item) => (
                      <div key={item.id} className="anh-album-chi-tiet">
                        <img
                          src={`http://localhost:8080${item.duongdan}`}
                          alt="Ảnh sản phẩm"
                        />
                      </div>
                    ))
                  ) : (
                    <p>Chưa có album ảnh.</p>
                  )}
                </div>
              </aside>

              <main className="cot-thong-tin-chi-tiet-san-pham">
                <section className="card-chi-tiet-san-pham">
                  <div className="dau-card-chi-tiet">
                    <div>
                      <h4>{sanPham?.tensanpham || "Sản phẩm"}</h4>
                      <p>
                        {sanPham?.motangan ||
                          "Thông tin tổng quan của sản phẩm."}
                      </p>
                    </div>

                    <span
                      className={`nhan-trang-thai-chi-tiet ${
                        sanPham?.trangthai === "hien_thi"
                          ? "hien-thi"
                          : sanPham?.trangthai === "het_hang"
                          ? "het-hang"
                          : "an"
                      }`}
                    >
                      {hienThiTrangThai(sanPham?.trangthai)}
                    </span>
                  </div>

                  <div className="luoi-thong-tin-chi-tiet">
                    <div>
                      <span>Mã sản phẩm</span>
                      <strong>{sanPham?.madinhdanh || "Tự sinh"}</strong>
                    </div>

                    <div>
                      <span>SKU</span>
                      <strong>{sanPham?.sku || "Tự sinh"}</strong>
                    </div>

                    <div>
                      <span>Barcode</span>
                      <strong>{sanPham?.barcode || "Chưa có"}</strong>
                    </div>

                    <div>
                      <span>Danh mục</span>
                      <strong>{sanPham?.tendanhmuc || "Chưa phân loại"}</strong>
                    </div>

                    <div>
                      <span>Thương hiệu</span>
                      <strong>{sanPham?.thuonghieu || "Chưa có"}</strong>
                    </div>

                    <div>
                      <span>Đơn vị tính</span>
                      <strong>{sanPham?.donvitinh || "cái"}</strong>
                    </div>
                  </div>
                </section>

                <section className="card-chi-tiet-san-pham">
                  <div className="tieu-de-card-chi-tiet">
                    <PackageCheck size={18} />
                    <h4>Giá bán và tồn kho</h4>
                  </div>

                  <div className="luoi-thong-tin-chi-tiet">
                    <div>
                      <span>Giá nhập</span>
                      <strong>{formatTienHienThi(sanPham?.gianhap || 0)}</strong>
                    </div>

                    <div>
                      <span>Giá bán</span>
                      <strong>{formatTienHienThi(sanPham?.giaban || 0)}</strong>
                    </div>

                    <div>
                      <span>Giá khuyến mãi</span>
                      <strong>
                        {sanPham?.giakhuyenmai
                          ? formatTienHienThi(sanPham.giakhuyenmai)
                          : "Không áp dụng"}
                      </strong>
                    </div>

                    <div>
                      <span>Tồn kho</span>
                      <strong>{sanPham?.soluongton ?? 0} sản phẩm</strong>
                    </div>

                    <div>
                      <span>Ngưỡng cảnh báo</span>
                      <strong>{sanPham?.nguongcanhbao ?? 5} sản phẩm</strong>
                    </div>

                    <div>
                      <span>Lượt bán</span>
                      <strong>{sanPham?.luotban ?? 0} lượt</strong>
                    </div>
                  </div>
                </section>

                <section className="card-chi-tiet-san-pham">
                  <div className="tieu-de-card-chi-tiet">
                    <ShoppingCart size={18} />
                    <h4>Nhãn và vận hành</h4>
                  </div>

                  <div className="luoi-nhan-san-pham-chi-tiet">
                    <span>{sanPham?.noibat ? "Có nổi bật" : "Không nổi bật"}</span>
                    <span>{sanPham?.banchay ? "Có bán chạy" : "Không bán chạy"}</span>
                    <span>{sanPham?.sanphammoi ? "Sản phẩm mới" : "Không phải sản phẩm mới"}</span>
                    <span>{sanPham?.chodattruoc ? "Cho đặt trước" : "Không đặt trước"}</span>
                  </div>

                  <div className="luoi-thong-tin-chi-tiet mt-3">
                    <div>
                      <span>Trọng lượng</span>
                      <strong>
                        {sanPham?.trongluong
                          ? `${sanPham.trongluong} gram`
                          : "Chưa có"}
                      </strong>
                    </div>

                    <div>
                      <span>Kích thước</span>
                      <strong>{sanPham?.kichthuoc || "Chưa có"}</strong>
                    </div>

                    <div>
                      <span>Ngày tạo</span>
                      <strong>{hienThiNgay(sanPham?.created_at)}</strong>
                    </div>

                    <div>
                      <span>Ngày cập nhật</span>
                      <strong>{hienThiNgay(sanPham?.updated_at)}</strong>
                    </div>
                  </div>
                </section>

                <section className="card-chi-tiet-san-pham">
                  <div className="tieu-de-card-chi-tiet">
                    <CalendarClock size={18} />
                    <h4>Mô tả và thuộc tính</h4>
                  </div>

                  <div className="noi-dung-mo-ta-chi-tiet">
                    <h5>Mô tả ngắn</h5>
                    <p>{sanPham?.motangan || "Chưa có mô tả ngắn."}</p>

                    <h5>Mô tả chi tiết</h5>
                    <p>
                      {sanPham?.motachitiet ||
                        sanPham?.mota ||
                        "Chưa có mô tả chi tiết."}
                    </p>

                    <h5>Thuộc tính</h5>
                    <p>{sanPham?.thuoctinh || "Chưa có thuộc tính."}</p>

                    <h5>Biến thể</h5>
                    <p>{sanPham?.bienthe || "Chưa có biến thể."}</p>
                  </div>
                </section>

                <section className="card-chi-tiet-san-pham">
                  <div className="tieu-de-card-chi-tiet">
                    <CalendarClock size={18} />
                    <h4>Lịch sử chỉnh sửa</h4>
                  </div>

                  <div className="lich-su-trong-san-pham">
                    Hệ thống chưa bật lịch sử chỉnh sửa cho sản phẩm.
                  </div>
                </section>
              </main>
            </div>
          </div>
        )}

        <div className="chan-modal chan-modal-chi-tiet-san-pham">
          <button type="button" className="nut-chi-tiet-phu" onClick={onDong}>
            Đóng
          </button>

          <button
            type="button"
            className="nut-chi-tiet-phu"
            onClick={() => onNhanBan?.(sanPham)}
            disabled={!sanPham}
          >
            <Copy size={16} />
            Nhân bản
          </button>

          <button
            type="button"
            className="nut-chi-tiet-chinh"
            onClick={() => onSuaNhanh?.(sanPham)}
            disabled={!sanPham}
          >
            <Pencil size={16} />
            Sửa nhanh
          </button>
        </div>
      </div>
    </div>
  );
}