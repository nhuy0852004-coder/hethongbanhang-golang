import { useEffect, useState } from "react";
import { X } from "lucide-react";
import NutBam from "../../components/ui/NutBam";

const formMacDinh = {
  tendanhmuc: "",
  mota: "",
  thutu: 0,
  trangthai: "hien_thi",
  danhmuccha_id: null,
};

export default function DanhMucModal({
  mo,
  cheDo = "them",
  duLieuSua,
  danhSachDanhMuc = [],
  dangXuLy = false,
  onDong,
  onLuu,
}) {
  const [form, setForm] = useState(formMacDinh);

  useEffect(() => {
    if (mo && duLieuSua) {
      setForm({
        tendanhmuc: duLieuSua.tendanhmuc || "",
        mota: duLieuSua.mota || "",
        thutu: duLieuSua.thutu || 0,
        trangthai: duLieuSua.trangthai || "hien_thi",
        danhmuccha_id: duLieuSua.danhmuccha_id || null,
      });
      return;
    }

    if (mo) {
      setForm(formMacDinh);
    }
  }, [mo, duLieuSua]);

  if (!mo) {
    return null;
  }

  const capNhatForm = (event) => {
    const { name, value } = event.target;

    setForm((duLieuCu) => ({
      ...duLieuCu,
      [name]:
        name === "thutu"
          ? Number(value || 0)
          : name === "danhmuccha_id"
          ? value
            ? Number(value)
            : null
          : value,
    }));
  };

  const xuLySubmit = (event) => {
    event.preventDefault();

    onLuu({
      ...form,
      tendanhmuc: form.tendanhmuc.trim(),
      mota: form.mota.trim(),
      danhmuccha_id: form.danhmuccha_id || null,
    });
  };

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={onDong} />

      <div className="hop-modal">
        <div className="dau-modal">
          <div>
            <h3>{cheDo === "them" ? "Thêm danh mục" : "Sửa danh mục"}</h3>
            <p>
              {cheDo === "them"
                ? "Tạo danh mục mới để phân loại sản phẩm."
                : "Cập nhật thông tin danh mục hiện tại."}
            </p>
          </div>

          <button className="nut-dong-modal" onClick={onDong}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={xuLySubmit} className="noi-dung-modal">
          <div className="nhom-form">
            <label>
              Tên danh mục <span>*</span>
            </label>
            <input
              name="tendanhmuc"
              value={form.tendanhmuc}
              onChange={capNhatForm}
              placeholder="Ví dụ: Áo thun, Quần jean, Phụ kiện..."
              autoFocus
            />
          </div>

          <div className="nhom-form">
            <label>Mô tả</label>
            <textarea
              name="mota"
              value={form.mota}
              onChange={capNhatForm}
              placeholder="Nhập mô tả ngắn cho danh mục"
              rows={3}
            />
          </div>

          <div className="luoi-form-2">
            <div className="nhom-form">
              <label>Danh mục cha</label>
              <select
                name="danhmuccha_id"
                value={form.danhmuccha_id || ""}
                onChange={capNhatForm}
              >
                <option value="">Danh mục gốc</option>

                {danhSachDanhMuc
                  .filter((item) => item.id !== duLieuSua?.id)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.tendanhmuc}
                    </option>
                  ))}
              </select>
            </div>

            <div className="nhom-form">
              <label>Thứ tự</label>
              <input
                type="number"
                name="thutu"
                min="0"
                value={form.thutu}
                onChange={capNhatForm}
              />
            </div>
          </div>

          <div className="nhom-form">
            <label>Trạng thái</label>
            <select name="trangthai" value={form.trangthai} onChange={capNhatForm}>
              <option value="hien_thi">Hiển thị</option>
              <option value="an">Đang ẩn</option>
            </select>
          </div>

          <div className="chan-modal">
            <NutBam type="button" bienThe="phu" onClick={onDong}>
              Hủy
            </NutBam>

            <NutBam type="submit" dangXuLy={dangXuLy}>
              {cheDo === "them" ? "Thêm danh mục" : "Lưu thay đổi"}
            </NutBam>
          </div>
        </form>
      </div>
    </div>
  );
}