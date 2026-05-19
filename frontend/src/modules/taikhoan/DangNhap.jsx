import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LockKeyhole, Mail, Store } from "lucide-react";
import toast from "react-hot-toast";
import { dangNhapTaiKhoan } from "../../api/taikhoanApi";
import useTaiKhoanStore from "../../stores/taikhoanStore";

export default function DangNhap() {
  const navigate = useNavigate();
  const luuDangNhap = useTaiKhoanStore((state) => state.luuDangNhap);

  const [dangXuLy, setDangXuLy] = useState(false);
  const [form, setForm] = useState({
    email: "admin@cuahang.vn",
    matkhau: "123456",
  });

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
        <div className="logo-dang-nhap">
          <Store size={28} />
        </div>

        <h1>Đăng nhập quản trị</h1>
        <p>Quản lý sản phẩm, đơn hàng, khách hàng và doanh thu cửa hàng.</p>

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
                placeholder="Nhập email quản trị"
              />
            </div>
          </div>

          <div className="nhom-nhap">
            <label>Mật khẩu</label>
            <div className="o-nhap-co-icon">
              <LockKeyhole size={18} />
              <input
                type="password"
                name="matkhau"
                value={form.matkhau}
                onChange={capNhatForm}
                placeholder="Nhập mật khẩu"
              />
            </div>
          </div>

          <button type="submit" className="nut-dang-nhap" disabled={dangXuLy}>
            {dangXuLy ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="goi-y-dang-nhap">
          <span>Tài khoản mặc định:</span>
          <strong>admin@cuahang.vn / 123456</strong>
        </div>
      </div>
    </div>
  );
}