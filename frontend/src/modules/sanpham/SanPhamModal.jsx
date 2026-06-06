import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Trash2, X } from "lucide-react";
import NutBam from "../../components/ui/NutBam";

// Tổ chức danh mục thành cây cha-con để hiển thị trong dropdown
function xayDungCayDanhMuc(danhSach) {
  const cha = danhSach.filter((d) => !d.danhmuccha_id);
  const con = danhSach.filter((d) => d.danhmuccha_id);
  const result = [];

  cha.forEach((parent) => {
    const children = con.filter((c) => String(c.danhmuccha_id) === String(parent.id));
    result.push({ ...parent, _laCha: true, _con: children });
    children.forEach((child) => result.push({ ...child, _laCon: true }));
  });

  // Danh mục con mà cha không hiển thị (hidden parent)
  con.forEach((c) => {
    const found = cha.find((p) => String(p.id) === String(c.danhmuccha_id));
    if (!found) result.push(c);
  });

  return result;
}
import {
  chuyenTienNhapThanhSo,
  formatTienNhap,
} from "../../utils/tienviet";
import { formatTienVietNam as formatTienHienThi } from "../../utils/dinhtien";
import { layUrlAnh } from "../../api/ketnoiapi";

const formMacDinh = {
  madinhdanh: "",
  sku: "",
  barcode: "",
  tensanpham: "",
  motangan: "",
  motachitiet: "",
  mota: "",
  thuonghieu: "",
  donvitinh: "cái",
  gianhap: "",
  giaban: "",
  giakhuyenmai: "",
  km_bat_dau: "",
  km_ket_thuc: "",
  soluongton: "",
  nguongcanhbao: "5",
  trongluong: "",
  kichthuoc: "",
  trangthai: "hien_thi",
  danhmuc_id: "",
  noibat: false,
  banchay: false,
  sanphammoi: true,
  chodattruoc: false,
  thuoctinh: "",
  bienthe: "",
};

export default function SanPhamModal({
  mo,
  cheDo = "them",
  duLieuSua,
  danhSachDanhMuc = [],
  dangXuLy = false,
  onDong,
  onLuu,
}) {
  const inputTenRef = useRef(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState(formMacDinh);
  const [loiForm, setLoiForm] = useState({});
  const [fileAnh, setFileAnh] = useState(null);
  const [albumFiles, setAlbumFiles] = useState([]);
  const [anhXemTruoc, setAnhXemTruoc] = useState("");
  const [albumXemTruoc, setAlbumXemTruoc] = useState([]);
  const [danhSachBienThe, setDanhSachBienThe] = useState([]);

  useEffect(() => {
    if (mo && duLieuSua) {
      setForm({
        madinhdanh: duLieuSua.madinhdanh || "",
        sku: duLieuSua.sku || "",
        barcode: duLieuSua.barcode || "",
        tensanpham: duLieuSua.tensanpham || "",
        motangan: duLieuSua.motangan || "",
        motachitiet: duLieuSua.motachitiet || "",
        mota: duLieuSua.mota || "",
        thuonghieu: duLieuSua.thuonghieu || "",
        donvitinh: duLieuSua.donvitinh || "cái",
        gianhap: duLieuSua.gianhap ? formatTienNhap(duLieuSua.gianhap) : "",
        giaban: duLieuSua.giaban ? formatTienNhap(duLieuSua.giaban) : "",
        giakhuyenmai: duLieuSua.giakhuyenmai
          ? formatTienNhap(duLieuSua.giakhuyenmai)
          : "",
        km_bat_dau: duLieuSua.km_bat_dau
          ? new Date(duLieuSua.km_bat_dau).toISOString().slice(0, 16)
          : "",
        km_ket_thuc: duLieuSua.km_ket_thuc
          ? new Date(duLieuSua.km_ket_thuc).toISOString().slice(0, 16)
          : "",
        soluongton: duLieuSua.soluongton ?? "",
        nguongcanhbao: duLieuSua.nguongcanhbao ?? "5",
        trongluong: duLieuSua.trongluong ?? "",
        kichthuoc: duLieuSua.kichthuoc || "",
        trangthai: duLieuSua.trangthai || "hien_thi",
        danhmuc_id: duLieuSua.danhmuc_id ? String(duLieuSua.danhmuc_id) : "",
        noibat: Boolean(duLieuSua.noibat),
        banchay: Boolean(duLieuSua.banchay),
        sanphammoi: Boolean(duLieuSua.sanphammoi),
        chodattruoc: Boolean(duLieuSua.chodattruoc),
        thuoctinh: duLieuSua.thuoctinh || "",
        bienthe: duLieuSua.bienthe || "",
      });

      setDanhSachBienThe(duLieuSua.danhsachbienthe || []);
      setFileAnh(null);
      setAlbumFiles([]);
      setAnhXemTruoc(duLieuSua.hinhanh || "");
      setAlbumXemTruoc((duLieuSua.albumanh || []).map((item) => item.duongdan));
      setLoiForm({});
      return;
    }

    if (mo) {
      setForm(formMacDinh);
      setFileAnh(null);
      setAlbumFiles([]);
      setAnhXemTruoc("");
      setAlbumXemTruoc([]);
      setDanhSachBienThe([]);
      setLoiForm({});

      setTimeout(() => {
        inputTenRef.current?.focus();
      }, 80);
    }
  }, [mo, duLieuSua]);

  const giaNhapSo = useMemo(
    () => chuyenTienNhapThanhSo(form.gianhap),
    [form.gianhap]
  );

  const giaBanSo = useMemo(
    () => chuyenTienNhapThanhSo(form.giaban),
    [form.giaban]
  );

  const giaKhuyenMaiSo = useMemo(
    () => chuyenTienNhapThanhSo(form.giakhuyenmai),
    [form.giakhuyenmai]
  );

  const cayDanhMuc = useMemo(
    () => xayDungCayDanhMuc(danhSachDanhMuc),
    [danhSachDanhMuc]
  );

  if (!mo) return null;

  const kiemTraForm = () => {
    const loi = {};

    if (!form.tensanpham.trim()) {
      loi.tensanpham = "Vui lòng nhập tên sản phẩm";
    }

    if (!form.donvitinh.trim()) {
      loi.donvitinh = "Vui lòng nhập đơn vị tính";
    }

    if (!giaBanSo || giaBanSo <= 0) {
      loi.giaban = "Giá bán phải lớn hơn 0";
    }

    if (giaNhapSo > 0 && giaBanSo < giaNhapSo) {
      loi.giaban = "Giá bán không được nhỏ hơn giá nhập";
    }

    if (giaKhuyenMaiSo > 0 && giaKhuyenMaiSo >= giaBanSo) {
      loi.giakhuyenmai = "Giá khuyến mãi phải nhỏ hơn giá bán";
    }

    if (Number(form.soluongton || 0) < 0) {
      loi.soluongton = "Số lượng tồn không được âm";
    }

    if (Number(form.nguongcanhbao || 0) < 0) {
      loi.nguongcanhbao = "Ngưỡng cảnh báo không được âm";
    }

    if (form.trongluong !== "" && Number(form.trongluong) < 0) {
      loi.trongluong = "Trọng lượng không được âm";
    }

    setLoiForm(loi);
    return Object.keys(loi).length === 0;
  };

  const capNhatForm = (event) => {
    const { name, value, type, checked } = event.target;

    let giaTri = type === "checkbox" ? checked : value;

    if (["gianhap", "giaban", "giakhuyenmai"].includes(name)) {
      giaTri = formatTienNhap(value);
    }

    setForm((duLieuCu) => {
      const formMoi = { ...duLieuCu, [name]: giaTri };

      if (
        name === "soluongton" &&
        Number(giaTri || 0) > 0 &&
        duLieuCu.trangthai === "het_hang"
      ) {
        formMoi.trangthai = "hien_thi";
      }

      return formMoi;
    });

    setLoiForm((loiCu) => ({ ...loiCu, [name]: "" }));
  };

  const chonAnh = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setFileAnh(file);
    setAnhXemTruoc(URL.createObjectURL(file));
    event.target.value = "";
  };

  const chonAlbum = (event) => {
    const files = Array.from(event.target.files || []);
    setAlbumFiles(files);
    setAlbumXemTruoc(files.map((file) => URL.createObjectURL(file)));
  };

  const themBienThe = () => {
    setDanhSachBienThe([
      ...danhSachBienThe,
      {
        sku: "",
        tenthuoctinh1: "",
        giatrithuoctinh1: "",
        tenthuoctinh2: "",
        giatrithuoctinh2: "",
        giaban: "",
        soluongton: 0,
      },
    ]);
  };

  const xoaBienThe = (index) => {
    setDanhSachBienThe(danhSachBienThe.filter((_, i) => i !== index));
  };

  const capNhatBienThe = (index, field, value) => {
    const newList = [...danhSachBienThe];
    newList[index][field] = value;
    setDanhSachBienThe(newList);
  };

  const xuLySubmit = (event) => {
    event.preventDefault();

    if (!kiemTraForm()) return;

    const soLuongTon = Number(form.soluongton || 0);

    const duLieuGui = {
      madinhdanh: form.madinhdanh.trim(),
      sku: form.sku.trim(),
      barcode: form.barcode.trim(),
      tensanpham: form.tensanpham.trim(),
      mota: form.motachitiet.trim() || form.mota.trim(),
      motangan: form.motangan.trim(),
      motachitiet: form.motachitiet.trim(),
      thuonghieu: form.thuonghieu.trim(),
      donvitinh: form.donvitinh.trim(),
      gianhap: giaNhapSo,
      giaban: giaBanSo,
      giakhuyenmai: giaKhuyenMaiSo > 0 ? giaKhuyenMaiSo : null,
      km_bat_dau: giaKhuyenMaiSo > 0 && form.km_bat_dau ? new Date(form.km_bat_dau).toISOString() : null,
      km_ket_thuc: giaKhuyenMaiSo > 0 && form.km_ket_thuc ? new Date(form.km_ket_thuc).toISOString() : null,
      soluongton: soLuongTon,
      nguongcanhbao: Number(form.nguongcanhbao || 0),
      trongluong: form.trongluong === "" ? null : Number(form.trongluong),
      kichthuoc: form.kichthuoc.trim(),
      trangthai:
        soLuongTon <= 0
          ? "het_hang"
          : form.trangthai === "het_hang"
          ? "an"
          : form.trangthai,
      danhmuc_id: form.danhmuc_id ? Number(form.danhmuc_id) : null,
      noibat: Boolean(form.noibat),
      banchay: Boolean(form.banchay),
      sanphammoi: Boolean(form.sanphammoi),
      chodattruoc: Boolean(form.chodattruoc),
      thuoctinh: form.thuoctinh.trim(),
      bienthe: form.bienthe.trim(),
      danhsachbienthe: danhSachBienThe.map(bt => ({
        ...bt,
        giaban: bt.giaban ? chuyenTienNhapThanhSo(bt.giaban) : null,
        soluongton: Number(bt.soluongton || 0),
      })),
    };

    onLuu(duLieuGui, fileAnh, albumFiles);
  };

  const urlAnhHienThi = anhXemTruoc
    ? anhXemTruoc.startsWith("blob:")
      ? anhXemTruoc
      : layUrlAnh(anhXemTruoc)
    : "";

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

      <div className="hop-modal hop-modal-san-pham-ngang">
        {/* Header */}
        <div className="dau-modal sp-modal-header">
          <div>
            <span className="nhan-modal-san-pham">
              {cheDo === "them" ? "Tạo mới" : "Cập nhật"}
            </span>
            <h3>{cheDo === "them" ? "Thêm sản phẩm" : "Sửa sản phẩm"}</h3>
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

        {/* Body */}
        <form
          onSubmit={xuLySubmit}
          className="sp-modal-form"
          noValidate
        >
          <div className="sp-modal-body">
            {/* ===== CỘT TRÁI ===== */}
            <div className="sp-modal-trai">
              {/* Thông tin cơ bản */}
              <div className="sp-section-label">Thông tin cơ bản</div>

              <div className="nhom-form">
                <label>Tên sản phẩm <span>*</span></label>
                <input
                  ref={inputTenRef}
                  name="tensanpham"
                  value={form.tensanpham}
                  onChange={capNhatForm}
                  className={loiForm.tensanpham ? "input-loi" : ""}
                  placeholder="Ví dụ: Áo thun nam basic"
                />
                {loiForm.tensanpham && (
                  <div className="loi-form">{loiForm.tensanpham}</div>
                )}
              </div>

              <div className="sp-luoi-3">
                <div className="nhom-form">
                  <label>Mã sản phẩm</label>
                  <input
                    name="madinhdanh"
                    value={form.madinhdanh || ""}
                    readOnly
                    className="input-tu-sinh"
                    placeholder="Tự sinh sau khi lưu"
                  />
                </div>
                <div className="nhom-form">
                  <label>SKU</label>
                  <input
                    name="sku"
                    value={form.sku || ""}
                    readOnly
                    className="input-tu-sinh"
                    placeholder="Tự sinh tự động"
                  />
                </div>
                <div className="nhom-form">
                  <label>Barcode</label>
                  <input
                    name="barcode"
                    value={form.barcode}
                    onChange={capNhatForm}
                    placeholder="Mã vạch (nếu có)"
                  />
                </div>
              </div>

              <div className="sp-luoi-2">
                <div className="nhom-form">
                  <label>Danh mục</label>
                  <select
                    name="danhmuc_id"
                    value={form.danhmuc_id}
                    onChange={capNhatForm}
                  >
                    <option value="">— Chưa chọn danh mục —</option>
                    {cayDanhMuc
                      .filter((item) => item._laCon)
                      .map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.tendanhmuc}
                        </option>
                      ))}
                  </select>
                </div>
                <div className="nhom-form">
                  <label>Thương hiệu</label>
                  <input
                    name="thuonghieu"
                    value={form.thuonghieu}
                    onChange={capNhatForm}
                    placeholder="Ví dụ: Local Brand"
                  />
                </div>
              </div>

              <div className="sp-luoi-3">
                <div className="nhom-form">
                  <label>Đơn vị tính <span>*</span></label>
                  <input
                    name="donvitinh"
                    value={form.donvitinh}
                    onChange={capNhatForm}
                    className={loiForm.donvitinh ? "input-loi" : ""}
                    placeholder="cái, bộ, hộp..."
                  />
                  {loiForm.donvitinh && (
                    <div className="loi-form">{loiForm.donvitinh}</div>
                  )}
                </div>
                <div className="nhom-form">
                  <label>Trọng lượng (g)</label>
                  <input
                    type="number"
                    name="trongluong"
                    value={form.trongluong}
                    onChange={capNhatForm}
                    onFocus={(e) => e.target.select()}
                    className={loiForm.trongluong ? "input-loi" : ""}
                    placeholder="Gram"
                  />
                  {loiForm.trongluong && (
                    <div className="loi-form">{loiForm.trongluong}</div>
                  )}
                </div>
                <div className="nhom-form">
                  <label>Kích thước</label>
                  <input
                    name="kichthuoc"
                    value={form.kichthuoc}
                    onChange={capNhatForm}
                    placeholder="D × R × C"
                  />
                </div>
              </div>

              {/* Giá & Tồn kho */}
              <div className="sp-section-label sp-section-label--gap">Giá bán & Tồn kho</div>

              <div className="sp-luoi-3">
                <div className="nhom-form">
                  <label>Giá nhập</label>
                  <input
                    name="gianhap"
                    value={form.gianhap}
                    onChange={capNhatForm}
                    onFocus={(e) => e.target.select()}
                    placeholder="120.000"
                  />
                  <small>{giaNhapSo ? formatTienHienThi(giaNhapSo) : "0 ₫"}</small>
                </div>
                <div className="nhom-form">
                  <label>Giá bán <span>*</span></label>
                  <input
                    name="giaban"
                    value={form.giaban}
                    onChange={capNhatForm}
                    onFocus={(e) => e.target.select()}
                    className={loiForm.giaban ? "input-loi" : ""}
                    placeholder="150.000"
                  />
                  {loiForm.giaban && (
                    <div className="loi-form">{loiForm.giaban}</div>
                  )}
                  <small>{giaBanSo ? formatTienHienThi(giaBanSo) : "0 ₫"}</small>
                </div>
                <div className="nhom-form">
                  <label>Giá khuyến mãi</label>
                  <input
                    name="giakhuyenmai"
                    value={form.giakhuyenmai}
                    onChange={capNhatForm}
                    onFocus={(e) => e.target.select()}
                    className={loiForm.giakhuyenmai ? "input-loi" : ""}
                    placeholder="129.000"
                  />
                  {loiForm.giakhuyenmai && (
                    <div className="loi-form">{loiForm.giakhuyenmai}</div>
                  )}
                  <small>{giaKhuyenMaiSo ? formatTienHienThi(giaKhuyenMaiSo) : "Không áp dụng"}</small>
                </div>
              </div>

              {giaKhuyenMaiSo > 0 && (
                <div className="luoi-form-2">
                  <div className="nhom-form">
                    <label>Bắt đầu KM</label>
                    <input
                      type="datetime-local"
                      name="km_bat_dau"
                      value={form.km_bat_dau}
                      onChange={capNhatForm}
                    />
                    <small>Để trống = áp dụng ngay</small>
                  </div>
                  <div className="nhom-form">
                    <label>Kết thúc KM</label>
                    <input
                      type="datetime-local"
                      name="km_ket_thuc"
                      value={form.km_ket_thuc}
                      onChange={capNhatForm}
                    />
                    <small>Để trống = không giới hạn</small>
                  </div>
                </div>
              )}

              <div className="sp-luoi-2">
                <div className="nhom-form">
                  <label>Số lượng tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    name="soluongton"
                    value={form.soluongton}
                    onChange={capNhatForm}
                    onFocus={(e) => e.target.select()}
                    className={loiForm.soluongton ? "input-loi" : ""}
                  />
                  {loiForm.soluongton && (
                    <div className="loi-form">{loiForm.soluongton}</div>
                  )}
                </div>
                <div className="nhom-form">
                  <label>Ngưỡng cảnh báo tồn kho</label>
                  <input
                    type="number"
                    min="0"
                    name="nguongcanhbao"
                    value={form.nguongcanhbao}
                    onChange={capNhatForm}
                    onFocus={(e) => e.target.select()}
                    className={loiForm.nguongcanhbao ? "input-loi" : ""}
                  />
                  {loiForm.nguongcanhbao && (
                    <div className="loi-form">{loiForm.nguongcanhbao}</div>
                  )}
                </div>
              </div>

              {/* Mô tả */}
              <div className="sp-section-label sp-section-label--gap">Biến thể chi tiết</div>

              <div className="nhom-form" style={{ gridColumn: "1 / -1" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
                  <label style={{ margin: 0 }}>Danh sách biến thể (Size, Màu sắc...)</label>
                  <NutBam type="button" bienThe="phu" nho onClick={themBienThe}>
                    + Thêm biến thể
                  </NutBam>
                </div>
                
                {danhSachBienThe.length === 0 ? (
                  <div style={{ padding: 20, textAlign: "center", background: "#f8fafc", borderRadius: 6, border: "1px dashed #cbd5e1" }}>
                    Chưa có biến thể nào. Nhấn "Thêm biến thể" để tạo (VD: Size S - Màu Đen).
                  </div>
                ) : (
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                      <thead>
                        <tr style={{ background: "#f1f5f9", textAlign: "left" }}>
                          <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Thuộc tính 1</th>
                          <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Giá trị 1</th>
                          <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Thuộc tính 2</th>
                          <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Giá trị 2</th>
                          <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Giá bán riêng</th>
                          <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0" }}>Tồn kho</th>
                          <th style={{ padding: 8, borderBottom: "1px solid #e2e8f0", width: 40 }}></th>
                        </tr>
                      </thead>
                      <tbody>
                        {danhSachBienThe.map((bt, index) => (
                          <tr key={index}>
                            <td style={{ padding: 4, borderBottom: "1px solid #e2e8f0" }}>
                              <input
                                style={{ width: "100%", padding: 6, border: "1px solid #cbd5e1", borderRadius: 4 }}
                                placeholder="VD: Màu sắc"
                                value={bt.tenthuoctinh1}
                                onChange={(e) => capNhatBienThe(index, "tenthuoctinh1", e.target.value)}
                              />
                            </td>
                            <td style={{ padding: 4, borderBottom: "1px solid #e2e8f0" }}>
                              <input
                                style={{ width: "100%", padding: 6, border: "1px solid #cbd5e1", borderRadius: 4 }}
                                placeholder="VD: Đỏ"
                                value={bt.giatrithuoctinh1}
                                onChange={(e) => capNhatBienThe(index, "giatrithuoctinh1", e.target.value)}
                              />
                            </td>
                            <td style={{ padding: 4, borderBottom: "1px solid #e2e8f0" }}>
                              <input
                                style={{ width: "100%", padding: 6, border: "1px solid #cbd5e1", borderRadius: 4 }}
                                placeholder="VD: Kích cỡ"
                                value={bt.tenthuoctinh2}
                                onChange={(e) => capNhatBienThe(index, "tenthuoctinh2", e.target.value)}
                              />
                            </td>
                            <td style={{ padding: 4, borderBottom: "1px solid #e2e8f0" }}>
                              <input
                                style={{ width: "100%", padding: 6, border: "1px solid #cbd5e1", borderRadius: 4 }}
                                placeholder="VD: XL"
                                value={bt.giatrithuoctinh2}
                                onChange={(e) => capNhatBienThe(index, "giatrithuoctinh2", e.target.value)}
                              />
                            </td>
                            <td style={{ padding: 4, borderBottom: "1px solid #e2e8f0" }}>
                              <input
                                style={{ width: "100%", padding: 6, border: "1px solid #cbd5e1", borderRadius: 4 }}
                                placeholder="Để trống lấy mặc định"
                                value={bt.giaban !== null && bt.giaban !== undefined ? bt.giaban : ""}
                                onChange={(e) => capNhatBienThe(index, "giaban", formatTienNhap(e.target.value))}
                                onFocus={(e) => e.target.select()}
                              />
                            </td>
                            <td style={{ padding: 4, borderBottom: "1px solid #e2e8f0" }}>
                              <input
                                type="number"
                                min="0"
                                style={{ width: "100%", padding: 6, border: "1px solid #cbd5e1", borderRadius: 4 }}
                                value={bt.soluongton}
                                onChange={(e) => capNhatBienThe(index, "soluongton", e.target.value)}
                              />
                            </td>
                            <td style={{ padding: 4, borderBottom: "1px solid #e2e8f0", textAlign: "center" }}>
                              <button
                                type="button"
                                onClick={() => xoaBienThe(index)}
                                style={{ color: "#ef4444", background: "none", border: "none", cursor: "pointer", padding: 4 }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* ===== CỘT PHẢI ===== */}
            <div className="sp-modal-phai">
              {/* Hình ảnh */}
              <div>
                <div className="sp-section-label">Hình ảnh</div>

                <div
                  className="sp-khung-anh"
                  onClick={() => fileInputRef.current?.click()}
                >
                  {urlAnhHienThi ? (
                    <img src={urlAnhHienThi} alt="Ảnh sản phẩm" />
                  ) : (
                    <div className="sp-khung-anh-trong">
                      <ImagePlus size={28} strokeWidth={1.5} />
                      <span>Nhấn để chọn ảnh</span>
                    </div>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={chonAnh}
                />

                <div className="sp-hanh-dong-anh">
                  <NutBam
                    type="button"
                    bienThe="phu"
                    nho
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Tải ảnh lên
                  </NutBam>
                  {anhXemTruoc && (
                    <button
                      type="button"
                      className="sp-nut-xoa-anh"
                      onClick={() => {
                        setAnhXemTruoc("");
                        setFileAnh(null);
                      }}
                    >
                      <Trash2 size={13} /> Xóa
                    </button>
                  )}
                </div>

                <small className="sp-ghi-chu-anh">JPG, PNG, WEBP — tối đa 5MB</small>

                <label className="sp-upload-album">
                  <ImagePlus size={14} />
                  <span>Thêm album ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={chonAlbum}
                  />
                </label>

                {albumXemTruoc.length > 0 && (
                  <div className="sp-album-preview">
                    {albumXemTruoc.map((src, i) => (
                      <img
                        key={i}
                        src={src.startsWith("blob:") ? src : layUrlAnh(src)}
                        alt={`Album ${i + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Trạng thái */}
              <div>
                <div className="sp-section-label">Trạng thái</div>
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
                        trangthai:
                          cu.trangthai === "hien_thi" ? "an" : "hien_thi",
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
                        ? "Hết tồn kho, không thể bật."
                        : form.trangthai === "hien_thi"
                        ? "Hiển thị trên website."
                        : "Ẩn khỏi website."}
                    </span>
                  </div>
                </div>
              </div>

              {/* Nhãn sản phẩm */}
              <div>
                <div className="sp-section-label">Nhãn sản phẩm</div>
                <div className="sp-nhan-list">
                  <label className="sp-nhan-item">
                    <input
                      type="checkbox"
                      name="noibat"
                      checked={form.noibat}
                      onChange={capNhatForm}
                    />
                    <span>Sản phẩm nổi bật</span>
                  </label>
                  <label className="sp-nhan-item">
                    <input
                      type="checkbox"
                      name="banchay"
                      checked={form.banchay}
                      onChange={capNhatForm}
                    />
                    <span>Sản phẩm bán chạy</span>
                  </label>
                  <label className="sp-nhan-item">
                    <input
                      type="checkbox"
                      name="sanphammoi"
                      checked={form.sanphammoi}
                      onChange={capNhatForm}
                    />
                    <span>Sản phẩm mới</span>
                  </label>
                  <label className="sp-nhan-item">
                    <input
                      type="checkbox"
                      name="chodattruoc"
                      checked={form.chodattruoc}
                      onChange={capNhatForm}
                    />
                    <span>Cho phép đặt trước</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="sp-modal-footer">
            <NutBam
              type="button"
              bienThe="phu"
              onClick={onDong}
              disabled={dangXuLy}
            >
              Hủy
            </NutBam>
            <NutBam type="submit" dangXuLy={dangXuLy}>
              {cheDo === "them" ? "Thêm sản phẩm" : "Lưu thay đổi"}
            </NutBam>
          </div>
        </form>
      </div>
    </div>
  );
}
