import {
  CalendarClock,
  CreditCard,
  MapPin,
  Package,
  Phone,
  Printer,
  User,
  WalletCards,
  X,
} from "lucide-react";

const API_URL = "http://localhost:8080";

function formatTien(value) {
  const so = Number(value || 0);

  return so.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

function formatNgay(value) {
  if (!value) return "Chưa có";

  const ngay = new Date(value);

  if (Number.isNaN(ngay.getTime())) return "Chưa có";

  return ngay.toLocaleString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function layMaDonHang(item) {
  return (
    item?.madonhang ||
    item?.madon ||
    item?.ma_don_hang ||
    `DH${String(item?.id || 0).padStart(6, "0")}`
  );
}

function layTenKhachHang(item) {
  return (
    item?.tenkhachhang ||
    item?.hoten ||
    item?.tennguoinhan ||
    item?.khachhang?.hoten ||
    "Khách lẻ"
  );
}

function laySoDienThoai(item) {
  return (
    item?.sodienthoai ||
    item?.sdt ||
    item?.sodienthoainguoinhan ||
    item?.khachhang?.sodienthoai ||
    "Chưa có"
  );
}

function layDiaChi(item) {
  return (
    item?.diachi ||
    item?.diachinhanhang ||
    item?.dia_chi_nhan_hang ||
    item?.diachinguoinhan ||
    "Chưa có địa chỉ"
  );
}

function layTongTien(item) {
  return item?.tongtien || item?.tongthanhtoan || item?.thanhtien || 0;
}

function layNgayDat(item) {
  return item?.ngaydat || item?.created_at || item?.ngaytao || item?.CreatedAt;
}

function layTrangThaiDon(item) {
  return item?.trangthai || item?.trangthaidonhang || "cho_xac_nhan";
}

function layTrangThaiThanhToan(item) {
  return (
    item?.trangthaithanhtoan ||
    item?.trang_thai_thanh_toan ||
    "chua_thanh_toan"
  );
}

function hienThiTrangThaiDon(trangThai) {
  const danhSach = {
    cho_xac_nhan: "Chờ xác nhận",
    cho_xuly: "Chờ xác nhận",
    choxacnhan: "Chờ xác nhận",
    da_xac_nhan: "Đã xác nhận",
    daxacnhan: "Đã xác nhận",
    dang_chuan_bi: "Đang chuẩn bị",
    dangchuanbi: "Đang chuẩn bị",
    dang_giao: "Đang giao",
    danggiao: "Đang giao",
    hoan_thanh: "Hoàn thành",
    hoanthanh: "Hoàn thành",
    da_huy: "Đã hủy",
    dahuy: "Đã hủy",
  };

  return danhSach[trangThai] || "Chờ xác nhận";
}

function hienThiThanhToan(trangThai) {
  const danhSach = {
    chua_thanh_toan: "Chưa thanh toán",
    chuathanhtoan: "Chưa thanh toán",
    da_thanh_toan: "Đã thanh toán",
    dathanhtoan: "Đã thanh toán",
    hoan_tien: "Hoàn tiền",
    hoantien: "Hoàn tiền",
  };

  return danhSach[trangThai] || "Chưa thanh toán";
}

function layDanhSachSanPham(donHang, chiTiet) {
  if (Array.isArray(chiTiet) && chiTiet.length > 0) return chiTiet;
  if (Array.isArray(donHang?.chitiet) && donHang.chitiet.length > 0) return donHang.chitiet;
  if (Array.isArray(donHang?.chitietdonhang) && donHang.chitietdonhang.length > 0) return donHang.chitietdonhang;
  if (Array.isArray(donHang?.sanpham) && donHang.sanpham.length > 0) return donHang.sanpham;

  return [];
}

function layTenSanPham(item) {
  return (
    item?.tensanpham ||
    item?.ten_san_pham ||
    item?.sanpham?.tensanpham ||
    "Sản phẩm"
  );
}

function layMaSanPham(item) {
  return (
    item?.sku ||
    item?.masanpham ||
    item?.madinhdanh ||
    item?.sanpham?.sku ||
    item?.sanpham?.madinhdanh ||
    "Chưa có mã"
  );
}

function layAnhSanPham(item) {
  const duongDan =
    item?.hinhanh ||
    item?.hinh_anh ||
    item?.sanpham?.hinhanh ||
    item?.sanpham?.hinh_anh ||
    "";

  if (!duongDan) return "";
  if (duongDan.startsWith("http")) return duongDan;

  return `${API_URL}${duongDan}`;
}

function laySoLuong(item) {
  return Number(item?.soluong || item?.so_luong || item?.quantity || 0);
}

function layDonGia(item) {
  return Number(
    item?.dongia ||
      item?.gia ||
      item?.giaban ||
      item?.sanpham?.giaban ||
      0
  );
}

function layThanhTien(item) {
  return Number(
    item?.thanhtien ||
      item?.thanh_tien ||
      laySoLuong(item) * layDonGia(item)
  );
}

export default function ChiTietDonHangModal({
  mo,
  dangTai = false,
  donHang,
  chiTiet = [],
  onDong,
  onXuLyDon,
  onInDon,
}) {
  if (!mo) return null;

  const danhSachSanPham = layDanhSachSanPham(donHang, chiTiet);
  const trangThaiDon = layTrangThaiDon(donHang);
  const trangThaiThanhToan = layTrangThaiThanhToan(donHang);
  const tongTien = layTongTien(donHang);

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />

      <div className="hop-modal hop-modal-chi-tiet-don-hang modal-don-hang-moi">
        <div className="dau-modal dau-modal-don-hang-moi">
          <div>
            <span className="nhan-modal-don-hang">Chi tiết đơn hàng</span>
            <h3>#{layMaDonHang(donHang)}</h3>
            <p>Kiểm tra thông tin khách hàng, sản phẩm và thanh toán.</p>
          </div>

          <button type="button" className="nut-dong-modal" onClick={onDong}>
            <X size={20} />
          </button>
        </div>

        {dangTai ? (
          <div className="noi-dung-dang-tai-don-hang">
            Đang tải chi tiết đơn hàng...
          </div>
        ) : (
          <>
            <div className="noi-dung-don-hang-moi">
              <div className="tong-quan-don-hang-moi">
                <div className="the-tong-quan-don">
                  <CalendarClock size={20} />
                  <div>
                    <span>Ngày đặt</span>
                    <strong>{formatNgay(layNgayDat(donHang))}</strong>
                  </div>
                </div>

                <div className="the-tong-quan-don">
                  <Package size={20} />
                  <div>
                    <span>Trạng thái đơn</span>
                    <strong>
                      <span className={`badge-trang-thai-don-hang ${trangThaiDon}`}>
                        {hienThiTrangThaiDon(trangThaiDon)}
                      </span>
                    </strong>
                  </div>
                </div>

                <div className="the-tong-quan-don">
                  <CreditCard size={20} />
                  <div>
                    <span>Thanh toán</span>
                    <strong>
                      <span
                        className={`badge-thanh-toan-don-hang ${trangThaiThanhToan}`}
                      >
                        {hienThiThanhToan(trangThaiThanhToan)}
                      </span>
                    </strong>
                  </div>
                </div>

                <div className="the-tong-quan-don noi-bat">
                  <WalletCards size={20} />
                  <div>
                    <span>Tổng thanh toán</span>
                    <strong>{formatTien(tongTien)}</strong>
                  </div>
                </div>
              </div>

              <div className="layout-don-hang-moi">
                <div className="cot-san-pham-don-moi">
                  <div className="card-don-hang-moi">
                    <div className="tieu-de-card-don-moi">
                      <div>
                        <h4>Sản phẩm trong đơn</h4>
                        <p>{danhSachSanPham.length} sản phẩm được đặt</p>
                      </div>
                    </div>

                    {danhSachSanPham.length === 0 ? (
                      <div className="trang-rong-san-pham-don">
                        Chưa có dữ liệu sản phẩm trong đơn hàng.
                      </div>
                    ) : (
                      <div className="danh-sach-san-pham-don-moi">
                        {danhSachSanPham.map((item, index) => {
                          const anh = layAnhSanPham(item);

                          return (
                            <div className="dong-san-pham-don-moi" key={item.id || index}>
                              <div className="anh-san-pham-don-moi">
                                {anh ? (
                                  <img src={anh} alt={layTenSanPham(item)} />
                                ) : (
                                  <Package size={20} />
                                )}
                              </div>

                              <div className="thong-tin-san-pham-don-moi">
                                <strong>{layTenSanPham(item)}</strong>
                                <span>{layMaSanPham(item)}</span>
                              </div>

                              <div className="so-luong-san-pham-don-moi">
                                x{laySoLuong(item)}
                              </div>

                              <div className="gia-san-pham-don-moi">
                                <span>{formatTien(layDonGia(item))}</span>
                                <strong>{formatTien(layThanhTien(item))}</strong>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>

                <div className="cot-thong-tin-don-moi">
                  <div className="card-don-hang-moi">
                    <div className="tieu-de-card-don-moi">
                      <div>
                        <h4>Khách hàng</h4>
                        <p>Thông tin người nhận</p>
                      </div>
                    </div>

                    <div className="danh-sach-thong-tin-don-moi">
                      <div>
                        <User size={18} />
                        <div>
                          <span>Họ tên</span>
                          <strong>{layTenKhachHang(donHang)}</strong>
                        </div>
                      </div>

                      <div>
                        <Phone size={18} />
                        <div>
                          <span>Số điện thoại</span>
                          <strong>{laySoDienThoai(donHang)}</strong>
                        </div>
                      </div>

                      <div>
                        <MapPin size={18} />
                        <div>
                          <span>Địa chỉ nhận hàng</span>
                          <strong>{layDiaChi(donHang)}</strong>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="card-don-hang-moi">
                    <div className="tieu-de-card-don-moi">
                      <div>
                        <h4>Tổng kết thanh toán</h4>
                        <p>Giá trị đơn hàng</p>
                      </div>
                    </div>

                    <div className="tong-ket-don-moi">
                      <div>
                        <span>Tạm tính</span>
                        <strong>{formatTien(tongTien)}</strong>
                      </div>

                      <div>
                        <span>Phí giao hàng</span>
                        <strong>{formatTien(donHang?.phigiaohang || 0)}</strong>
                      </div>

                      <div>
                        <span>Giảm giá</span>
                        <strong>{formatTien(donHang?.giamgia || 0)}</strong>
                      </div>

                      <div className="tong-cuoi">
                        <span>Tổng thanh toán</span>
                        <strong>{formatTien(tongTien)}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="card-don-hang-moi">
                    <div className="tieu-de-card-don-moi">
                      <div>
                        <h4>Ghi chú</h4>
                        <p>Thông tin khách để lại</p>
                      </div>
                    </div>

                    <p className="ghi-chu-don-moi">
                      {donHang?.ghichu || donHang?.ghi_chu || "Không có ghi chú."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="chan-modal chan-modal-don-hang-moi">
              <button type="button" className="nut-modal-phu" onClick={onDong}>
                Đóng
              </button>

              <button type="button" className="nut-modal-phu" onClick={onInDon}>
                <Printer size={16} />
                In đơn hàng
              </button>

              <button
                type="button"
                className="nut-modal-chinh"
                onClick={() => onXuLyDon?.(donHang)}
              >
                Xử lý đơn hàng
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}