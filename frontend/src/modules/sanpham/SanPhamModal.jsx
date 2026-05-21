import { useEffect, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import NutBam from "../../components/ui/NutBam";

const formMacDinh = { madinhdanh: "", tensanpham: "", mota: "", giaban: "", giakhuyenmai: "", soluongton: 0, trangthai: "hien_thi", danhmuc_id: "" };

export default function SanPhamModal({ mo, cheDo = "them", duLieuSua, danhSachDanhMuc = [], dangXuLy = false, onDong, onLuu }) {
  const [form, setForm] = useState(formMacDinh);
  const [fileAnh, setFileAnh] = useState(null);
  const [anhXemTruoc, setAnhXemTruoc] = useState("");

  useEffect(() => {
    if (mo && duLieuSua) {
      setForm({
        madinhdanh: duLieuSua.madinhdanh || "",
        tensanpham: duLieuSua.tensanpham || "",
        mota: duLieuSua.mota || "",
        giaban: duLieuSua.giaban ?? "",
        giakhuyenmai: duLieuSua.giakhuyenmai ?? "",
        soluongton: duLieuSua.soluongton ?? 0,
        trangthai: duLieuSua.trangthai || "hien_thi",
        danhmuc_id: duLieuSua.danhmuc_id ? String(duLieuSua.danhmuc_id) : "",
      });
      setFileAnh(null);
      setAnhXemTruoc(duLieuSua.hinhanh || "");
      return;
    }
    if (mo) {
      setForm(formMacDinh);
      setFileAnh(null);
      setAnhXemTruoc("");
    }
  }, [mo, duLieuSua]);

  if (!mo) return null;

  const capNhatForm = (event) => {
    const { name, value } = event.target;

    setForm((duLieuCu) => {
      const formMoi = {
        ...duLieuCu,
        [name]: value,
      };

      if (
        name === "soluongton" &&
        Number(value || 0) > 0 &&
        duLieuCu.trangthai === "het_hang"
      ) {
        formMoi.trangthai = "hien_thi";
      }

      return formMoi;
    });
  };

  const chonAnh = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileAnh(file);
    setAnhXemTruoc(URL.createObjectURL(file));
  };

  const xuLySubmit = (event) => {
    event.preventDefault();
    const giaban = Number(form.giaban || 0);
    const giakhuyenmai = form.giakhuyenmai === "" ? null : Number(form.giakhuyenmai);
    const soluongton = Number(form.soluongton || 0);
    const danhmuc_id = form.danhmuc_id === "" ? null : Number(form.danhmuc_id);

    if (!form.tensanpham.trim()) return onLuu({ error: "tên sản phẩm không được để trống" });
    if (!giaban || giaban <= 0) return onLuu({ error: "giá bán phải lớn hơn 0" });
    if (giakhuyenmai != null && giakhuyenmai > 0 && giakhuyenmai >= giaban) return onLuu({ error: "giá khuyến mãi phải nhỏ hơn giá bán" });

    onLuu(
      {
        madinhdanh: form.madinhdanh.trim(),
        tensanpham: form.tensanpham.trim(),
        mota: form.mota.trim(),
        giaban,
        giakhuyenmai,
        soluongton,
        trangthai:
          Number(form.soluongton || 0) <= 0
            ? "het_hang"
            : form.trangthai === "het_hang"
            ? "an"
            : form.trangthai,
        danhmuc_id,
      },
      fileAnh
    );
  };

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />
      <div className="hop-modal hop-modal-rong">
        <div className="dau-modal">
          <div><h3>{cheDo === "them" ? "Thêm sản phẩm" : "Sửa sản phẩm"}</h3><p>{cheDo === "them" ? "Tạo sản phẩm mới, nhập giá VNĐ và tồn kho thực tế." : "Cập nhật thông tin sản phẩm hiện tại."}</p></div>
          <button type="button" className="nut-dong-modal" onClick={onDong}><X size={20} /></button>
        </div>
        <form onSubmit={xuLySubmit} className="noi-dung-modal">
          <div className="luoi-form-san-pham">
            <div>
              <div className="nhom-form"><label>Tên sản phẩm <span>*</span></label><input name="tensanpham" value={form.tensanpham} onChange={capNhatForm} /></div>
              <div className="luoi-form-2"><div className="nhom-form"><label>Mã định danh</label><input name="madinhdanh" value={form.madinhdanh} onChange={capNhatForm} /></div><div className="nhom-form"><label>Danh mục</label><select name="danhmuc_id" value={form.danhmuc_id} onChange={capNhatForm}><option value="">Chưa chọn danh mục</option>{danhSachDanhMuc.map((item) => <option key={item.id} value={item.id}>{item.tendanhmuc}</option>)}</select></div></div>
              <div className="luoi-form-3"><div className="nhom-form"><label>Giá bán <span>*</span></label><input type="number" min="0" name="giaban" value={form.giaban} onChange={capNhatForm} /></div><div className="nhom-form"><label>Giá khuyến mãi</label><input type="number" min="0" name="giakhuyenmai" value={form.giakhuyenmai} onChange={capNhatForm} /></div><div className="nhom-form"><label>Số lượng tồn</label><input type="number" min="0" name="soluongton" value={form.soluongton} onChange={capNhatForm} /></div></div>
              <div className="nhom-form">
                <label>Trạng thái</label>

                <div className="dong-toggle-modal">
                  <button
                    type="button"
                    className={`nut-toggle-trang-thai ${
                      form.trangthai === "hien_thi" ? "bat" : "tat"
                    } ${Number(form.soluongton || 0) <= 0 ? "het-hang" : ""}`}
                    disabled={Number(form.soluongton || 0) <= 0}
                    onClick={() => {
                      setForm((cu) => ({
                        ...cu,
                        trangthai: cu.trangthai === "hien_thi" ? "an" : "hien_thi",
                      }));
                    }}
                  >
                    <span className="toggle-thumb"></span>
                  </button>

                  <div>
                    <strong>
                      {Number(form.soluongton || 0) <= 0
                        ? "Hết hàng"
                        : form.trangthai === "hien_thi"
                        ? "Hiển thị"
                        : "Đang ẩn"}
                    </strong>

                    <span>
                      {Number(form.soluongton || 0) <= 0
                        ? "Sản phẩm hết tồn kho nên không thể bật hiển thị."
                        : form.trangthai === "hien_thi"
                        ? "Sản phẩm sẽ hiển thị trên website bán hàng."
                        : "Sản phẩm sẽ được ẩn khỏi website bán hàng."}
                    </span>
                  </div>
                </div>
              </div>
              <div className="nhom-form"><label>Mô tả</label><textarea name="mota" value={form.mota} onChange={capNhatForm} rows={4} /></div>
            </div>
            <div><label className="label-anh-san-pham">Ảnh sản phẩm</label><label className="khung-upload-anh">{anhXemTruoc ? <img src={anhXemTruoc.startsWith("blob:") ? anhXemTruoc : `http://localhost:8080${anhXemTruoc}`} alt="Ảnh sản phẩm" /> : <div><ImagePlus size={34} /><strong>Chọn ảnh</strong><span>JPG, PNG, WEBP dưới 5MB</span></div>}<input type="file" accept="image/*" onChange={chonAnh} /></label></div>
          </div>
          <div className="chan-modal"><NutBam type="button" bienThe="phu" onClick={onDong}>Hủy</NutBam><NutBam type="submit" dangXuLy={dangXuLy}>{cheDo === "them" ? "Thêm sản phẩm" : "Lưu thay đổi"}</NutBam></div>
        </form>
      </div>
    </div>
  );
}
