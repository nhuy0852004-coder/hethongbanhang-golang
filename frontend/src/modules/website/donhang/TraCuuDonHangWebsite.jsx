import { useEffect, useState } from "react";
import { PackageCheck, Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import TrangRong from "../../../components/TrangRong";
import TheTrangThai from "../../../components/ui/TheTrangThai";
import { formatTienVietNam } from "../../../utils/dinhtien";
import { traCuuDonHang } from "../../../api/donhangApi";
import useRealtimeDonHang from "../../../hooks/useRealtimeDonHang";

export default function TraCuuDonHangWebsite() {
  const [searchParams] = useSearchParams();

  const [dangTai, setDangTai] = useState(false);
  const [donHang, setDonHang] = useState(null);

  const [form, setForm] = useState({
    madonhang: searchParams.get("madonhang") || "",
    sodienthoai: "",
  });

  useRealtimeDonHang({
    bat: Boolean(donHang?.madonhang),
    madonhang: donHang?.madonhang,
    onCapNhatDonHang: (duLieuMoi) => {
      setDonHang(duLieuMoi);
    },
  });

  useEffect(() => {
    const maDonHangTuUrl = searchParams.get("madonhang");

    if (maDonHangTuUrl) {
      xuLyTraCuuTuMa(maDonHangTuUrl);
    }
  }, []);

  const capNhatForm = (event) => {
    const { name, value } = event.target;

    setForm((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const xuLyTraCuuTuMa = async (madonhang) => {
    try {
      setDangTai(true);

      const ketQua = await traCuuDonHang({
        madonhang,
      });

      setDonHang(ketQua.dulieu);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tìm thấy đơn hàng";

      toast.error(thongBao);
      setDonHang(null);
    } finally {
      setDangTai(false);
    }
  };

  const xuLyTraCuu = async (event) => {
    event.preventDefault();

    if (!form.madonhang.trim() && !form.sodienthoai.trim()) {
      toast.error("Vui lòng nhập mã đơn hàng hoặc số điện thoại");
      return;
    }

    try {
      setDangTai(true);

      const ketQua = await traCuuDonHang({
        madonhang: form.madonhang.trim(),
        sodienthoai: form.sodienthoai.trim(),
      });

      setDonHang(ketQua.dulieu);
      toast.success("Tra cứu đơn hàng thành công");
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tìm thấy đơn hàng";

      toast.error(thongBao);
      setDonHang(null);
    } finally {
      setDangTai(false);
    }
  };

  return (
    <div className="container-website trang-tra-cuu-don-web">
      <div className="dau-trang-web">
        <h1>Tra cứu đơn hàng</h1>
        <p>Nhập mã đơn hàng hoặc số điện thoại để xem trạng thái đơn hàng.</p>
      </div>

      <form className="khung-tra-cuu-don" onSubmit={xuLyTraCuu}>
        <div className="o-tra-cuu-don">
          <label>Mã đơn hàng</label>
          <input
            name="madonhang"
            value={form.madonhang}
            onChange={capNhatForm}
            placeholder="Ví dụ: DH20260520153000123"
          />
        </div>

        <div className="o-tra-cuu-don">
          <label>Số điện thoại</label>
          <input
            name="sodienthoai"
            value={form.sodienthoai}
            onChange={capNhatForm}
            placeholder="Ví dụ: 0901234567"
          />
        </div>

        <button type="submit" disabled={dangTai}>
          <Search size={18} />
          {dangTai ? "Đang tra cứu..." : "Tra cứu"}
        </button>
      </form>

      {!donHang && !dangTai && (
        <TrangRong
          tieude="Chưa có thông tin đơn hàng"
          mota="Thông tin đơn hàng sẽ hiển thị sau khi bạn tra cứu thành công."
        />
      )}

      {donHang && (
        <div className="ket-qua-tra-cuu-don">
          <div className="the-trang-thai-don-web">
            <div className="icon-don-web">
              <PackageCheck size={30} />
            </div>

            <div>
              <span>Mã đơn hàng</span>
              <h2>{donHang.madonhang}</h2>
              <TheTrangThai trangthai={donHang.trangthai} />
            </div>
          </div>

          <div className="tra-cuu-grid">
            <div className="khung-thong-tin-tra-cuu">
              <h3>Thông tin giao hàng</h3>

              <div className="dong-tra-cuu">
                <span>Khách hàng</span>
                <strong>{donHang.hoten}</strong>
              </div>

              <div className="dong-tra-cuu">
                <span>Số điện thoại</span>
                <strong>{donHang.sodienthoai}</strong>
              </div>

              <div className="dong-tra-cuu">
                <span>Email</span>
                <strong>{donHang.email || "Không có"}</strong>
              </div>

              <div className="dong-tra-cuu">
                <span>Địa chỉ</span>
                <strong>{donHang.diachi}</strong>
              </div>

              <div className="dong-tra-cuu">
                <span>Ghi chú</span>
                <strong>{donHang.ghichu || "Không có"}</strong>
              </div>
            </div>

            <div className="khung-thong-tin-tra-cuu">
              <h3>Tóm tắt đơn hàng</h3>

              <div className="dong-tra-cuu">
                <span>Tổng tiền</span>
                <strong className="mau-tien">{formatTienVietNam(donHang.tongtien)}</strong>
              </div>

              <div className="dong-tra-cuu">
                <span>Trạng thái</span>
                <strong>
                  <TheTrangThai trangthai={donHang.trangthai} />
                </strong>
              </div>

              <div className="ghi-chu-realtime-don">
                Trạng thái đơn hàng sẽ tự cập nhật khi cửa hàng thay đổi.
              </div>
            </div>
          </div>

          <div className="khung-san-pham-tra-cuu">
            <h3>Sản phẩm trong đơn</h3>

            {(donHang.chitiet || []).map((item) => (
              <div className="dong-san-pham-tra-cuu" key={item.id}>
                {item.hinhanh ? (
                  <img
                    src={`http://localhost:8080${item.hinhanh}`}
                    alt={item.tensanpham}
                  />
                ) : (
                  <div className="anh-tra-cuu-trong">Ảnh</div>
                )}

                <div>
                  <strong>{item.tensanpham}</strong>
                  <span>
                    {item.soluong} x {formatTienVietNam(item.dongia)}
                  </span>
                </div>

                <b>{formatTienVietNam(item.thanhtien)}</b>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}