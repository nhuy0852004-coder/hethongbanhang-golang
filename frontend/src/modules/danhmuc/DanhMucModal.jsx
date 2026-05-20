import { useEffect, useRef, useState } from "react";
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
  const inputTenRef = useRef(null);

  const [form, setForm] = useState(formMacDinh);
  const [loiForm, setLoiForm] = useState({});

  useEffect(() => {
    if (mo && duLieuSua) {
      setForm({
        tendanhmuc: duLieuSua.tendanhmuc || "",
        mota: duLieuSua.mota || "",
        thutu: duLieuSua.thutu || 0,
        trangthai: duLieuSua.trangthai || "hien_thi",
        danhmuccha_id: duLieuSua.danhmuccha_id || null,
      });

      setLoiForm({});
      return;
    }

    if (mo) {
      setForm(formMacDinh);
      setLoiForm({});
    }
  }, [mo, duLieuSua]);

  useEffect(() => {
    if (mo && cheDo === "them") {
      setTimeout(() => {
        inputTenRef.current?.focus();
      }, 80);
    }
  }, [mo, cheDo]);

  if (!mo) return null;

  const kiemTraTungTruong = (tenTruong, giaTri, duLieuMoi = form) => {
    switch (tenTruong) {
      case "tendanhmuc": {
        const ten = String(giaTri || "").trim();

        if (!ten) return "Vui lòng nhập tên danh mục";
        if (ten.length < 2) return "Tên danh mục phải có ít nhất 2 ký tự";
        if (ten.length > 150) return "Tên danh mục không được vượt quá 150 ký tự";

        const trungTen = danhSachDanhMuc.some((item) => {
          const khacChinhNo = item.id !== duLieuSua?.id;
          const chuaBiXoa = !item.daxoa;
          return (
            khacChinhNo &&
            chuaBiXoa &&
            item.tendanhmuc?.trim().toLowerCase() === ten.toLowerCase()
          );
        });

        if (trungTen) return "Tên danh mục này đã tồn tại";

        return "";
      }

      case "thutu": {
        const so = Number(giaTri || 0);

        if (Number.isNaN(so)) return "Thứ tự phải là số";
        if (so < 0) return "Thứ tự không được âm";

        return "";
      }

      case "danhmuccha_id": {
        if (!giaTri) return "";

        if (Number(giaTri) === Number(duLieuSua?.id)) {
          return "Không được chọn chính nó làm danh mục cha";
        }

        return "";
      }

      case "trangthai": {
        if (!["hien_thi", "an"].includes(duLieuMoi.trangthai)) {
          return "Trạng thái không hợp lệ";
        }

        return "";
      }

      default:
        return "";
    }
  };

  const kiemTraForm = () => {
    const loiMoi = {
      tendanhmuc: kiemTraTungTruong("tendanhmuc", form.tendanhmuc),
      thutu: kiemTraTungTruong("thutu", form.thutu),
      danhmuccha_id: kiemTraTungTruong("danhmuccha_id", form.danhmuccha_id),
      trangthai: kiemTraTungTruong("trangthai", form.trangthai),
    };

    Object.keys(loiMoi).forEach((key) => {
      if (!loiMoi[key]) delete loiMoi[key];
    });

    setLoiForm(loiMoi);

    return Object.keys(loiMoi).length === 0;
  };

  const capNhatForm = (event) => {
    const { name, value } = event.target;

    const giaTriMoi =
      name === "thutu"
        ? Number(value || 0)
        : name === "danhmuccha_id"
        ? value
          ? Number(value)
          : null
        : value;

    const formMoi = {
      ...form,
      [name]: giaTriMoi,
    };

    setForm(formMoi);

    setLoiForm((loiCu) => ({
      ...loiCu,
      [name]: kiemTraTungTruong(name, giaTriMoi, formMoi),
    }));
  };

  const xuLyBlur = (event) => {
    const { name, value } = event.target;

    setLoiForm((loiCu) => ({
      ...loiCu,
      [name]: kiemTraTungTruong(name, value),
    }));
  };

  const xuLySubmit = (event) => {
    event.preventDefault();

    if (!kiemTraForm()) return;

    onLuu({
      ...form,
      tendanhmuc: form.tendanhmuc.trim(),
      mota: form.mota.trim(),
      danhmuccha_id: form.danhmuccha_id || null,
      thutu: Number(form.thutu || 0),
    });
  };

  const danhSachChaHopLe = danhSachDanhMuc.filter((item) => {
    if (item.daxoa) return false;
    if (item.id === duLieuSua?.id) return false;
    return true;
  });

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

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

          <button
            type="button"
            className="nut-dong-modal"
            disabled={dangXuLy}
            onClick={onDong}
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={xuLySubmit} className="noi-dung-modal" noValidate>
          <div className="nhom-form">
            <label>
              Tên danh mục <span>*</span>
            </label>

            <input
              ref={inputTenRef}
              name="tendanhmuc"
              value={form.tendanhmuc}
              onChange={capNhatForm}
              onBlur={xuLyBlur}
              className={loiForm.tendanhmuc ? "input-loi" : ""}
              placeholder="Ví dụ: Áo thun, Quần jean, Phụ kiện..."
            />

            {loiForm.tendanhmuc && (
              <div className="loi-form">{loiForm.tendanhmuc}</div>
            )}
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
                onBlur={xuLyBlur}
                className={loiForm.danhmuccha_id ? "input-loi" : ""}
              >
                <option value="">Danh mục gốc</option>

                {danhSachChaHopLe.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.tendanhmuc}
                  </option>
                ))}
              </select>

              {loiForm.danhmuccha_id && (
                <div className="loi-form">{loiForm.danhmuccha_id}</div>
              )}
            </div>

            <div className="nhom-form">
              <label>Thứ tự</label>

              <input
                type="number"
                name="thutu"
                min="0"
                value={form.thutu}
                onChange={capNhatForm}
                onBlur={xuLyBlur}
                className={loiForm.thutu ? "input-loi" : ""}
              />

              {loiForm.thutu && <div className="loi-form">{loiForm.thutu}</div>}
            </div>
          </div>

          <div className="nhom-form">
            <label>Trạng thái</label>

            <div className="dong-toggle-modal">
              <button
                type="button"
                className={`nut-toggle-trang-thai ${
                  form.trangthai === "hien_thi" ? "bat" : "tat"
                }`}
                onClick={() => {
                  const trangThaiMoi =
                    form.trangthai === "hien_thi" ? "an" : "hien_thi";

                  setForm((cu) => ({
                    ...cu,
                    trangthai: trangThaiMoi,
                  }));

                  setLoiForm((loiCu) => ({
                    ...loiCu,
                    trangthai: "",
                  }));
                }}
              >
                <span className="toggle-thumb"></span>
              </button>

              <div>
                <strong>
                  {form.trangthai === "hien_thi" ? "Hiển thị" : "Đang ẩn"}
                </strong>
                <span>
                  {form.trangthai === "hien_thi"
                    ? "Danh mục sẽ hiển thị trên website và trong bộ lọc sản phẩm."
                    : "Danh mục sẽ được ẩn khỏi website và bộ lọc sản phẩm."}
                </span>
              </div>
            </div>

            {loiForm.trangthai && (
              <div className="loi-form">{loiForm.trangthai}</div>
            )}
          </div>

          <div className="chan-modal">
            <NutBam type="button" bienThe="phu" disabled={dangXuLy} onClick={onDong}>
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