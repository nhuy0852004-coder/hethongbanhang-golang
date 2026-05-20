import { ImagePlus, Save } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import NutBam from "../../components/ui/NutBam";
import useGiaoDienStore from "../../stores/giaodienStore";
import useCaiDatStore from "../../stores/caidatStore";
import { capNhatCaiDat, layCaiDat, uploadLogo } from "../../api/caidatApi";

const formMacDinh = {
  tencuahang: "",
  sodienthoai: "",
  email: "",
  diachi: "",
  chinhsachvanchuyen: "",
  chinhsachdoitra: "",
};

export default function CaiDatCuaHang() {
  const capNhatTieuDeTrang = useGiaoDienStore((state) => state.capNhatTieuDeTrang);
  const capNhatCaiDatLocal = useCaiDatStore((state) => state.capNhatCaiDatLocal);

  const [dangTai, setDangTai] = useState(true);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [form, setForm] = useState(formMacDinh);
  const [logo, setLogo] = useState("");

  useEffect(() => {
    capNhatTieuDeTrang(
      "Cài đặt cửa hàng",
      "Cập nhật tên cửa hàng, logo, liên hệ, địa chỉ và chính sách"
    );
  }, [capNhatTieuDeTrang]);

  useEffect(() => {
    taiCaiDat();
  }, []);

  const taiCaiDat = async () => {
    try {
      setDangTai(true);

      const ketQua = await layCaiDat();
      const duLieu = ketQua.dulieu;

      setForm({
        tencuahang: duLieu.tencuahang || "",
        sodienthoai: duLieu.sodienthoai || "",
        email: duLieu.email || "",
        diachi: duLieu.diachi || "",
        chinhsachvanchuyen: duLieu.chinhsachvanchuyen || "",
        chinhsachdoitra: duLieu.chinhsachdoitra || "",
      });

      setLogo(duLieu.logo || "");
    } catch {
      toast.error("Không tải được cài đặt cửa hàng");
    } finally {
      setDangTai(false);
    }
  };

  const capNhatForm = (event) => {
    const { name, value } = event.target;

    setForm((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const luuCaiDat = async (event) => {
    event.preventDefault();

    try {
      setDangXuLy(true);

      const ketQua = await capNhatCaiDat(form);

      toast.success("Cập nhật cài đặt thành công");

      const duLieu = ketQua.dulieu;
      setLogo(duLieu.logo || "");
      capNhatCaiDatLocal(duLieu);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được cài đặt";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const chonLogo = async (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    try {
      setDangXuLy(true);

      const ketQua = await uploadLogo(file);

      setLogo(ketQua.dulieu.logo || "");
      capNhatCaiDatLocal(ketQua.dulieu);
      toast.success("Upload logo thành công");
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không upload được logo";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  if (dangTai) {
    return <DangTai noidung="Đang tải cài đặt cửa hàng..." />;
  }

  return (
    <form className="trang-cai-dat-admin cai-dat-grid" onSubmit={luuCaiDat}>
      <div className="khung-form-thanh-toan">
        <div className="tieu-de-form-thanh-toan">
          <Save size={22} />
          <div>
            <h2>Thông tin cửa hàng</h2>
            <p>Thông tin này sẽ dùng cho website bán hàng và đơn hàng.</p>
          </div>
        </div>

        <div className="nhom-form">
          <label>Tên cửa hàng <span>*</span></label>
          <input
            name="tencuahang"
            value={form.tencuahang}
            onChange={capNhatForm}
            placeholder="Ví dụ: Cửa Hàng Việt"
          />
        </div>

        <div className="luoi-thanh-toan-2">
          <div className="nhom-form">
            <label>Số điện thoại</label>
            <input
              name="sodienthoai"
              value={form.sodienthoai}
              onChange={capNhatForm}
              placeholder="0901234567"
            />
          </div>

          <div className="nhom-form">
            <label>Email</label>
            <input
              name="email"
              value={form.email}
              onChange={capNhatForm}
              placeholder="cuahang@example.com"
            />
          </div>
        </div>

        <div className="nhom-form">
          <label>Địa chỉ</label>
          <textarea
            name="diachi"
            value={form.diachi}
            onChange={capNhatForm}
            rows={3}
            placeholder="Nhập địa chỉ cửa hàng"
          />
        </div>

        <div className="nhom-form">
          <label>Chính sách vận chuyển</label>
          <textarea
            name="chinhsachvanchuyen"
            value={form.chinhsachvanchuyen}
            onChange={capNhatForm}
            rows={4}
            placeholder="Nhập chính sách vận chuyển"
          />
        </div>

        <div className="nhom-form">
          <label>Chính sách đổi trả</label>
          <textarea
            name="chinhsachdoitra"
            value={form.chinhsachdoitra}
            onChange={capNhatForm}
            rows={4}
            placeholder="Nhập chính sách đổi trả"
          />
        </div>

        <NutBam type="submit" icon={Save} dangXuLy={dangXuLy}>
          Lưu cài đặt
        </NutBam>
      </div>

      <aside className="khung-logo-cai-dat">
        <h3>Logo cửa hàng</h3>
        <p>Logo nên là ảnh vuông, nền sáng, dung lượng dưới 3MB.</p>

        <label className="khung-upload-logo">
          {logo ? (
            <img src={`http://localhost:8080${logo}`} alt="Logo cửa hàng" />
          ) : (
            <div>
              <ImagePlus size={38} />
              <strong>Chọn logo</strong>
              <span>JPG, PNG, WEBP</span>
            </div>
          )}

          <input type="file" accept="image/*" onChange={chonLogo} />
        </label>
      </aside>
    </form>
  );
}