import { useMemo, useState } from "react";
import { CheckCircle2, CreditCard, MapPin, Phone, User } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import TrangRong from "../../../components/TrangRong";
import ThongTinCuaHang from "../../../components/website/ThongTinCuaHang";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";
import useGioHangStore from "../../../stores/giohangStore";
import { formatTienVietNam } from "../../../utils/dinhtien";
import { taoDonHang } from "../../../api/donhangApi";

const formMacDinh = {
  hoten: "",
  sodienthoai: "",
  email: "",
  diachi: "",
  ghichu: "",
};

export default function ThanhToanWebsite() {
  useTieuDeTrang("Thanh toán");
  const navigate = useNavigate();

  const danhSach = useGioHangStore((state) => state.danhsach);
  const xoaTatCa = useGioHangStore((state) => state.xoaTatCa);
  const dongBoVoiServer = useGioHangStore((state) => state.dongBoVoiServer);
  const tongTien = useGioHangStore((state) => state.tongTien);

  const [form, setForm] = useState(formMacDinh);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [donHangThanhCong, setDonHangThanhCong] = useState(null);

  const tongSoLuong = useMemo(() => {
    return danhSach.reduce((tong, item) => tong + Number(item.soluong || 0), 0);
  }, [danhSach]);

  const capNhatForm = (event) => {
    const { name, value } = event.target;

    setForm((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const kiemTraForm = () => {
    if (!form.hoten.trim()) {
      toast.error("Vui lòng nhập họ tên");
      return false;
    }

    const regexSoDienThoai = /^(03|05|07|08|09)[0-9]{8}$/;
    if (!regexSoDienThoai.test(form.sodienthoai.trim())) {
      toast.error("Số điện thoại Việt Nam không hợp lệ");
      return false;
    }

    if (form.email.trim()) {
      const regexEmail = /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/;
      if (!regexEmail.test(form.email.trim())) {
        toast.error("Email không đúng định dạng");
        return false;
      }
    }

    if (!form.diachi.trim() || form.diachi.trim().length < 8) {
      toast.error("Vui lòng nhập địa chỉ giao hàng rõ hơn");
      return false;
    }

    if (danhSach.length === 0) {
      toast.error("Giỏ hàng đang trống");
      return false;
    }

    return true;
  };

  const xuLyDatHang = async (event) => {
    event.preventDefault();

    if (!kiemTraForm()) {
      return;
    }

    let ketQuaKiemTra;

    try {
      ketQuaKiemTra = await dongBoVoiServer();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không kiểm tra được giỏ hàng trước khi thanh toán";

      toast.error(thongBao);
      return;
    }

    if (!ketQuaKiemTra.hople) {
      toast.error(ketQuaKiemTra.thongbao || "Giỏ hàng có sản phẩm không hợp lệ");
      return;
    }

    if (ketQuaKiemTra.cothaydoi) {
      toast.success("Giỏ hàng đã được cập nhật theo giá và tồn kho mới nhất");
    }

    const duLieuGui = {
      hoten: form.hoten.trim(),
      sodienthoai: form.sodienthoai.trim(),
      email: form.email.trim(),
      diachi: form.diachi.trim(),
      ghichu: form.ghichu.trim(),
      sanpham: ketQuaKiemTra.danhsach
        .filter((item) => item.hople && item.soluong > 0)
        .map((item) => ({
          sanpham_id: item.id,
          soluong: item.soluong,
        })),
    };

    try {
      setDangXuLy(true);

      const ketQua = await taoDonHang(duLieuGui);

      setDonHangThanhCong(ketQua.dulieu);
      xoaTatCa();

      toast.success("Đặt hàng thành công");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không thể tạo đơn hàng, vui lòng thử lại";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  if (donHangThanhCong) {
    return (
      <div className="container-website trang-thanh-toan-web">
        <div className="dat-hang-thanh-cong">
          <div className="icon-thanh-cong">
            <CheckCircle2 size={48} />
          </div>

          <h1>Đặt hàng thành công</h1>

          <p>
            Cảm ơn bạn đã đặt hàng. Mã đơn hàng của bạn là{" "}
            <strong>{donHangThanhCong.madonhang}</strong>.
          </p>

          <div className="thong-tin-don-thanh-cong">
            <div>
              <span>Khách hàng</span>
              <strong>{donHangThanhCong.hoten}</strong>
            </div>

            <div>
              <span>Số điện thoại</span>
              <strong>{donHangThanhCong.sodienthoai}</strong>
            </div>

            <div>
              <span>Tổng tiền</span>
              <strong>{formatTienVietNam(donHangThanhCong.tongtien)}</strong>
            </div>

            <div>
              <span>Trạng thái</span>
              <strong>Chờ xác nhận</strong>
            </div>
          </div>

          <div className="hanh-dong-thanh-cong">
            <Link to="/" className="nut-web-phu">
              Về trang chủ
            </Link>

            <button
              className="nut-web-chinh"
              onClick={() => 
                navigate('/tra-cuu-don-hang?madonhang=${donHangThanhCong.madonhang}')
              }
            >
              Tra cứu đơn hàng
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (danhSach.length === 0) {
    return (
      <div className="container-website trang-thanh-toan-web">
        <TrangRong
          tieude="Không có sản phẩm để thanh toán"
          mota="Giỏ hàng đang trống, vui lòng thêm sản phẩm trước khi thanh toán."
          nut="Xem sản phẩm"
          onClick={() => navigate("/sanpham")}
        />
      </div>
    );
  }

  return (
    <div className="container-website trang-thanh-toan-web">
      <div className="dau-trang-web">
        <h1>Thanh toán</h1>
        <p>Nhập thông tin giao hàng để hoàn tất đặt hàng</p>
      </div>

      <form className="thanh-toan-grid" onSubmit={xuLyDatHang}>
        <div className="khung-form-thanh-toan">
          <div className="tieu-de-form-thanh-toan">
            <User size={22} />
            <div>
              <h2>Thông tin khách hàng</h2>
              <p>Thông tin này dùng để xác nhận và giao hàng</p>
            </div>
          </div>

          <div className="luoi-thanh-toan-2">
            <div className="nhom-form">
              <label>
                Họ tên <span>*</span>
              </label>
              <input
                name="hoten"
                value={form.hoten}
                onChange={capNhatForm}
                placeholder="Ví dụ: Nguyễn Quốc Huy"
              />
            </div>

            <div className="nhom-form">
              <label>
                Số điện thoại <span>*</span>
              </label>
              <input
                name="sodienthoai"
                value={form.sodienthoai}
                onChange={capNhatForm}
                placeholder="Ví dụ: 0901234567"
              />
            </div>
          </div>

          <div className="nhom-form">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={capNhatForm}
              placeholder="Email nếu có"
            />
          </div>

          <div className="tieu-de-form-thanh-toan mt-3">
            <MapPin size={22} />
            <div>
              <h2>Địa chỉ giao hàng</h2>
              <p>Nhập đầy đủ tỉnh/thành, quận/huyện, phường/xã</p>
            </div>
          </div>

          <div className="nhom-form">
            <label>
              Địa chỉ <span>*</span>
            </label>
            <textarea
              name="diachi"
              value={form.diachi}
              onChange={capNhatForm}
              rows={3}
              placeholder="Ví dụ: 123 Nguyễn Trãi, phường..., quận..., TP..."
            />
          </div>

          <div className="nhom-form">
            <label>Ghi chú</label>
            <textarea
              name="ghichu"
              value={form.ghichu}
              onChange={capNhatForm}
              rows={3}
              placeholder="Ghi chú cho cửa hàng nếu có"
            />
          </div>
        </div>

        <aside className="tom-tat-thanh-toan">
          <div className="tom-tat-card">
            <div className="tom-tat-icon">
              <CreditCard size={26} />
            </div>

            <h2>Đơn hàng của bạn</h2>

            <div className="ds-san-pham-thanh-toan">
              {danhSach.map((item) => {
                const gia =
                  item.giakhuyenmai && item.giakhuyenmai > 0
                    ? item.giakhuyenmai
                    : item.giaban;

                return (
                  <div className="dong-sp-thanh-toan" key={item.id}>
                    <div>
                      <strong>{item.tensanpham}</strong>
                      <span>Số lượng: {item.soluong}</span>
                    </div>

                    <b>{formatTienVietNam(gia * item.soluong)}</b>
                  </div>
                );
              })}
            </div>

            <div className="dong-tom-tat">
              <span>Số loại sản phẩm</span>
              <strong>{danhSach.length}</strong>
            </div>

            <div className="dong-tom-tat">
              <span>Tổng số lượng</span>
              <strong>{tongSoLuong}</strong>
            </div>

            <div className="dong-tong-cong">
              <span>Tổng tiền</span>
              <strong>{formatTienVietNam(tongTien())}</strong>
            </div>

            <button className="nut-dat-hang-web" type="submit" disabled={dangXuLy}>
              {dangXuLy ? "Đang đặt hàng..." : "Xác nhận đặt hàng"}
            </button>

            <div className="ghi-chu-thanh-toan">
              <Phone size={16} />
              <span>Cửa hàng sẽ liên hệ xác nhận đơn hàng sau khi bạn đặt.</span>
            </div>

            <div className="mt-3">
              <ThongTinCuaHang />
            </div>
          </div>
        </aside>
      </form>
    </div>
  );
}