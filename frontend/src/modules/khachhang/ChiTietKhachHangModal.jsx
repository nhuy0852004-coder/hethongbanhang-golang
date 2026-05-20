import { X } from "lucide-react";
import TheTrangThai from "../../components/ui/TheTrangThai";
import { formatTienVietNam } from "../../utils/dinhtien";

export default function ChiTietKhachHangModal({ mo, duLieu, onDong }) {
  if (!mo || !duLieu) {
    return null;
  }

  const khachhang = duLieu.khachhang;
  const donhang = duLieu.donhang || [];

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />

      <div className="hop-modal hop-modal-rong">
        <div className="dau-modal">
          <div>
            <h3>Chi tiết khách hàng</h3>
            <p>Xem thông tin khách hàng và lịch sử đơn hàng.</p>
          </div>

          <button className="nut-dong-modal" onClick={onDong}>
            <X size={20} />
          </button>
        </div>

        <div className="noi-dung-modal">
          <div className="khach-hang-chi-tiet-grid">
            <div className="khung-thong-tin-don">
              <h4>Thông tin khách hàng</h4>

              <div className="dong-thong-tin">
                <span>Họ tên</span>
                <strong>{khachhang.hoten}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Số điện thoại</span>
                <strong>{khachhang.sodienthoai}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Email</span>
                <strong>{khachhang.email || "Không có"}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Địa chỉ</span>
                <strong>{khachhang.diachi || "Chưa có"}</strong>
              </div>

              <div className="dong-thong-tin">
                <span>Trạng thái</span>
                <strong>
                  <TheTrangThai trangthai={khachhang.trangthai} />
                </strong>
              </div>
            </div>

            <div className="khung-thong-tin-don">
              <h4>Thống kê mua hàng</h4>

              <div className="the-thong-ke-khach">
                <span>Tổng đơn hàng</span>
                <strong>{khachhang.tongdonhang}</strong>
              </div>

              <div className="the-thong-ke-khach">
                <span>Tổng chi tiêu</span>
                <strong>{formatTienVietNam(khachhang.tongchitieu)}</strong>
              </div>

              <div className="the-thong-ke-khach">
                <span>Đơn gần nhất</span>
                <strong>{khachhang.dongannhat || "Chưa có"}</strong>
              </div>
            </div>
          </div>

          <div className="khung-bang mt-3">
            <div className="bang-responsive">
              <table className="bang-du-lieu bang-lich-su-khach">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th style={{ width: 160 }}>Tổng tiền</th>
                    <th style={{ width: 150 }}>Trạng thái</th>
                    <th style={{ width: 170 }}>Thời gian</th>
                  </tr>
                </thead>

                <tbody>
                  {donhang.length === 0 ? (
                    <tr>
                      <td colSpan="4">
                        <div className="dong-rong-bang">
                          Khách hàng chưa có đơn hàng.
                        </div>
                      </td>
                    </tr>
                  ) : (
                    donhang.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <div className="ma-don-hang">
                            <strong>{item.madonhang}</strong>
                            <span>#{item.id}</span>
                          </div>
                        </td>

                        <td>
                          <strong>{formatTienVietNam(item.tongtien)}</strong>
                        </td>

                        <td>
                          <TheTrangThai trangthai={item.trangthai} />
                        </td>

                        <td>{item.created_at}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}