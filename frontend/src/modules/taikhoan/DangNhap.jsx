import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { dangNhapTaiKhoan } from "../../api/taikhoanApi";
import useTaiKhoanStore from "../../stores/taikhoanStore";
import logoQH from "../../assets/logo-qhsoftware.png";

export default function DangNhap() {
  const navigate = useNavigate();
  const luuDangNhap = useTaiKhoanStore((state) => state.luuDangNhap);
  const daDangNhap = useTaiKhoanStore((state) => state.daDangNhap);

  const [dangXuLy, setDangXuLy] = useState(false);
  const [hienMatKhau, setHienMatKhau] = useState(false);
  const [ghiNhoDangNhap, setGhiNhoDangNhap] = useState(false);
  const [form, setForm] = useState({
    email: "",
    matkhau: "",
  });

  useEffect(() => {
    if (daDangNhap) {
      navigate("/admin", { replace: true });
      return;
    }

    const duLieuLuuTru = localStorage.getItem("duLieuDangNhap");
    if (duLieuLuuTru) {
      try {
        const duLieu = JSON.parse(duLieuLuuTru);
        if (duLieu.email) {
          setForm(duLieu);
          setGhiNhoDangNhap(true);
        }
      } catch {
        localStorage.removeItem("duLieuDangNhap");
      }
    } else {
      setForm({ email: "admin@cuahang.vn", matkhau: "123456" });
    }
  }, [daDangNhap, navigate]);

  const capNhatForm = (event) => {
    const { name, value } = event.target;
    setForm((duLieuCu) => ({
      ...duLieuCu,
      [name]: value,
    }));
  };

  const xuLyDangNhap = async (event) => {
    event.preventDefault();

    if (!form.email.trim()) {
      toast.error("Vui lòng nhập email");
      return;
    }

    if (!form.matkhau.trim()) {
      toast.error("Vui lòng nhập mật khẩu");
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await dangNhapTaiKhoan(form);

      // Lưu dữ liệu nếu người dùng ghi nhớ
      if (ghiNhoDangNhap) {
        localStorage.setItem("duLieuDangNhap", JSON.stringify(form));
      } else {
        localStorage.removeItem("duLieuDangNhap");
      }

      luuDangNhap({
        token: ketQua.dulieu.token,
        taikhoan: ketQua.dulieu.taikhoan,
      });

      toast.success("Đăng nhập thành công");
      navigate("/admin", { replace: true });
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Đăng nhập thất bại, vui lòng kiểm tra lại";
      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  return (
    <div className="trang-dang-nhap">
      <div className="hop-dang-nhap">
        <div className="panel-trai">
          <div className="logo-khu-vuc">
            <img src={logoQH} alt="QHSoftware" className="logo-hinh" />
          </div>

          <div className="thong-tin-khu-vuc">
            <h2 className="tieu-de-panel">Quản lý cửa hàng</h2>
            <p className="mo-ta-panel">
              Hệ thống quản lý toàn diện cho cửa hàng của bạn. Theo dõi sản phẩm, đơn hàng, khách hàng và doanh thu một cách dễ dàng.
            </p>
            <ul className="danh-sach-tinh-nang">
              <li>Quản lý sản phẩm &amp; kho hàng</li>
              <li>Theo dõi đơn hàng realtime</li>
              <li>Báo cáo doanh thu chi tiết</li>
            </ul>
          </div>
        </div>

        <div className="panel-phai">
          <div className="tieu-de-form">
            <h1>Đăng nhập</h1>
            <p>Chào mừng trở lại! Vui lòng đăng nhập để tiếp tục.</p>
          </div>

          <form onSubmit={xuLyDangNhap} className="form-dang-nhap">
            <div className="nhom-nhap">
              <label>Email</label>
              <div className="o-nhap-co-icon">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={capNhatForm}
                  placeholder="admin@cuahang.vn"
                />
              </div>
            </div>

            <div className="nhom-nhap">
              <label>Mật khẩu</label>
              <div className="o-nhap-co-icon">
                <LockKeyhole size={18} />
                <input
                  type={hienMatKhau ? "text" : "password"}
                  name="matkhau"
                  value={form.matkhau}
                  onChange={capNhatForm}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="nut-toggle-matkhau"
                  onClick={() => setHienMatKhau(!hienMatKhau)}
                  title={hienMatKhau ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                >
                  {hienMatKhau ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="nhan-ghi-nho">
              <label className="label-checkbox">
                <input
                  type="checkbox"
                  checked={ghiNhoDangNhap}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setGhiNhoDangNhap(checked);
                    if (!checked) {
                      localStorage.removeItem("duLieuDangNhap");
                    }
                  }}
                />
                <span>Ghi nhớ mật khẩu</span>
              </label>
            </div>

            <button type="submit" className="nut-dang-nhap" disabled={dangXuLy}>
              {dangXuLy ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <div className="goi-y-dang-nhap">
            Tài khoản mặc định: <strong>admin@cuahang.vn</strong> / <strong>123456</strong>
          </div>
        </div>
      </div>
    </div>
  );
}
