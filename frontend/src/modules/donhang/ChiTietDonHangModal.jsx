import { X } from "lucide-react";
import TheTrangThai from "../../components/ui/TheTrangThai";
import { formatTienVietNam } from "../../utils/dinhtien";

const trangThaiDonHang = [
  { value: "cho_xac_nhan", label: "Chờ xác nhận" },
  { value: "da_xac_nhan", label: "Đã xác nhận" },
  { value: "dang_giao_hang", label: "Đang giao hàng" },
  { value: "hoan_thanh", label: "Hoàn thành" },
  { value: "da_huy", label: "Đã hủy" },
];

export default function ChiTietDonHangModal({
  mo,
  donHang,
  dangXuLy = false,
  onDong,
  onCapNhatTrangThai,
}) {
  if (!mo || !donHang) {
    return null;
  }

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />

      <div className="hop-modal hop-modal-rong">
        <div className="dau-modal">
          <div>
            <h3>Chi tiết đơn hàng #{donHang.madonhang}</h3>
            <p>Xem thông tin khách hàng, sản phẩm và cập nhật trạng thái đơn.</p>
          </div>

          <button className="nut-dong-modal" onClick={onDong}>
            <X size={20} />
          </button>
        </div>

        <div className="noi-dung-modal">
          <div className="chi-tiet-don-grid">
            <div className="khung-thong-tin-don">
              <h4>Thông tin khách hàng</h4>

              <div className="dong-thong-tin">
                <span>Họ tên</span>
                <strong>{donHang.hoten}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Số điện thoại</span>
                <strong>{donHang.sodienthoai}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Email</span>
                <strong>{donHang.email || "Không có"}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Địa chỉ</span>
                <strong>{donHang.diachi}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Ghi chú</span>
                <strong>{donHang.ghichu || "Không có"}</strong>
              </div>
            </div>

            <div className="khung-thong-tin-don">
              <h4>Trạng thái đơn hàng</h4>

              <div className="trang-thai-hien-tai">
                <TheTrangThai trangthai={donHang.trangthai} />
              </div>

              <div className="nhom-form mb-0">
                <label>Cập nhật trạng thái</label>
                <select
                  value={donHang.trangthai}
                  disabled={dangXuLy}
                  onChange={(event) => onCapNhatTrangThai(donHang, event.target.value)}
                >
                  {trangThaiDonHang.map((item) => (
                    <option key={item.value} value={item.value}>
                      {item.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="canh-bao-trang-thai">
                Nếu chuyển sang <strong>Đã hủy</strong>, hệ thống sẽ tự cộng lại tồn kho.
              </div>
            </div>
          </div>

          <div className="khung-bang mt-3">
            <div className="bang-responsive">
              <table className="bang-du-lieu bang-chi-tiet-don">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th style={{ width: 120 }}>Số lượng</th>
                    <th style={{ width: 150 }}>Đơn giá</th>
                    <th style={{ width: 160 }}>Thành tiền</th>
                  </tr>
                </thead>

                <tbody>
                  {(donHang.chitiet || []).map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="san-pham-trong-don">
                          {item.hinhanh ? (
                            <img
                              src={`http://localhost:8080${item.hinhanh}`}
                              alt={item.tensanpham}
                            />
                          ) : (
                            <div className="anh-don-trong">Ảnh</div>
                          )}

                          <div>
                            <strong>{item.tensanpham}</strong>
                            <span>Mã sản phẩm: #{item.sanpham_id}</span>
                          </div>
                        </div>
                      </td>

                      <td>{item.soluong}</td>
                      <td>{formatTienVietNam(item.dongia)}</td>
                      <td>
                        <strong>{formatTienVietNam(item.thanhtien)}</strong>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="tong-tien-chi-tiet-don">
              <span>Tổng tiền đơn hàng</span>
              <strong>{formatTienVietNam(donHang.tongtien)}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}