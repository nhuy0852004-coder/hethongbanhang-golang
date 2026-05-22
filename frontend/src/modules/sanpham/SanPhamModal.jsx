import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import NutBam from "../../components/ui/NutBam";
import {
  chuyenTienNhapThanhSo,
  formatTienHienThi,
  formatTienNhap,
} from "../../utils/tienviet";

const formMacDinh = {
  madinhdanh: "",
  sku: "",
  barcode: "",
  tensanpham: "",
  motangan: "",
  motachitiet: "",
  mota: "",
  thuonghieu: "",
  donvitinh: "cÃ¡i",
  gianhap: "",
  giaban: "",
  giakhuyenmai: "",
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

  const [form, setForm] = useState(formMacDinh);
  const [loiForm, setLoiForm] = useState({});
  const [fileAnh, setFileAnh] = useState(null);
  const [albumFiles, setAlbumFiles] = useState([]);
  const [anhXemTruoc, setAnhXemTruoc] = useState("");
  const [albumXemTruoc, setAlbumXemTruoc] = useState([]);

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
        donvitinh: duLieuSua.donvitinh || "cÃ¡i",
        gianhap: duLieuSua.gianhap ? formatTienNhap(duLieuSua.gianhap) : "",
        giaban: duLieuSua.giaban ? formatTienNhap(duLieuSua.giaban) : "",
        giakhuyenmai: duLieuSua.giakhuyenmai
          ? formatTienNhap(duLieuSua.giakhuyenmai)
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

  if (!mo) return null;

  const kiemTraForm = () => {
    const loi = {};

    if (!form.tensanpham.trim()) {
      loi.tensanpham = "Vui lÃ²ng nháº­p tÃªn sáº£n pháº©m";
    }

    if (!form.donvitinh.trim()) {
      loi.donvitinh = "Vui lÃ²ng nháº­p Ä‘Æ¡n vá»‹ tÃ­nh";
    }

    if (!giaBanSo || giaBanSo <= 0) {
      loi.giaban = "GiÃ¡ bÃ¡n pháº£i lá»›n hÆ¡n 0";
    }

    if (giaNhapSo > 0 && giaBanSo < giaNhapSo) {
      loi.giaban = "GiÃ¡ bÃ¡n khÃ´ng Ä‘Æ°á»£c nhá» hÆ¡n giÃ¡ nháº­p";
    }

    if (giaKhuyenMaiSo > 0 && giaKhuyenMaiSo >= giaBanSo) {
      loi.giakhuyenmai = "GiÃ¡ khuyáº¿n mÃ£i pháº£i nhá» hÆ¡n giÃ¡ bÃ¡n";
    }

    if (Number(form.soluongton || 0) < 0) {
      loi.soluongton = "Sá»‘ lÆ°á»£ng tá»“n khÃ´ng Ä‘Æ°á»£c Ã¢m";
    }

    if (Number(form.nguongcanhbao || 0) < 0) {
      loi.nguongcanhbao = "NgÆ°á»¡ng cáº£nh bÃ¡o khÃ´ng Ä‘Æ°á»£c Ã¢m";
    }

    if (form.trongluong !== "" && Number(form.trongluong) < 0) {
      loi.trongluong = "Trá»ng lÆ°á»£ng khÃ´ng Ä‘Æ°á»£c Ã¢m";
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
      const formMoi = {
        ...duLieuCu,
        [name]: giaTri,
      };

      if (
        name === "soluongton" &&
        Number(giaTri || 0) > 0 &&
        duLieuCu.trangthai === "het_hang"
      ) {
        formMoi.trangthai = "hien_thi";
      }

      return formMoi;
    });

    setLoiForm((loiCu) => ({
      ...loiCu,
      [name]: "",
    }));
  };

  const chonAnh = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setFileAnh(file);
    setAnhXemTruoc(URL.createObjectURL(file));
  };

  const chonAlbum = (event) => {
    const files = Array.from(event.target.files || []);
    setAlbumFiles(files);
    setAlbumXemTruoc(files.map((file) => URL.createObjectURL(file)));
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
    };

    onLuu(duLieuGui, fileAnh, albumFiles);
  };

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

      <div className="hop-modal hop-modal-san-pham-moi">
        <div className="dau-modal dau-modal-san-pham-moi">
          <div>
            <span className="nhan-modal-san-pham">
              {cheDo === "them" ? "Tạo mới" : "Cập nhật"}
            </span>

            <h3>{cheDo === "them" ? "Thêm sản phẩm" : "Sửa sản phẩm"}</h3>

            <p>
              Quản lý thông tin sản phẩm, giá bán, tồn kho, trạng thái và hình ảnh.
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

        <form onSubmit={xuLySubmit} className="noi-dung-modal form-san-pham-moi" noValidate>
          <div className="layout-form-san-pham-moi">
            <div className="cot-chinh-form-san-pham">
              <section className="card-form-san-pham">
                <div className="tieu-de-card-form">
                  <h4>Thông tin cơ bản</h4>
                  <p>Thông tin nhận diện và phân loại sản phẩm.</p>
                </div>

                <div className="nhom-form">
                  <label>
                    Tên sản phẩm <span>*</span>
                  </label>
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

                <div className="luoi-form-3">
                  <div className="nhom-form">
                    <label>Mã sản phẩm</label>
                    <input
                      name="madinhdanh"
                      value={form.madinhdanh || ""}
                      readOnly
                      className="input-tu-sinh"
                      placeholder="Tự sinh sau khi lưu"
                    />
                    <small>Hệ thống tự tạo mã sản phẩm, không cần nhập tay.</small>
                  </div>

                  <div className="nhom-form">
                    <label>SKU</label>
                    <input
                      name="sku"
                      value={form.sku || ""}
                      readOnly
                      className="input-tu-sinh"
                      placeholder="Tự sinh sau khi lưu"
                    />
                    <small>SKU sẽ được sinh tự động theo tên sản phẩm.</small>
                  </div>

                  <div className="nhom-form">
                    <label>Barcode</label>
                    <input
                      name="barcode"
                      value={form.barcode}
                      onChange={capNhatForm}
                      placeholder="Mã vạch nếu có"
                    />
                  </div>
                </div>

                <div className="luoi-form-2">
                  <div className="nhom-form">
                    <label>Danh mục</label>
                    <select
                      name="danhmuc_id"
                      value={form.danhmuc_id}
                      onChange={capNhatForm}
                    >
                      <option value="">Chưa chọn danh mục</option>
                      {danhSachDanhMuc.map((item) => (
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

                <div className="luoi-form-3">
                  <div className="nhom-form">
                    <label>Đơn vị tính</label>
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
                    <label>Trọng lượng</label>
                    <input
                      type="number"
                      name="trongluong"
                      value={form.trongluong}
                      onChange={capNhatForm}
                      onFocus={(event) => event.target.select()}
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
                      placeholder="D x R x C"
                    />
                  </div>
                </div>
              </section>

              <section className="card-form-san-pham">
                <div className="tieu-de-card-form">
                  <h4>Giá bán và tồn kho</h4>
                  <p>Kiểm soát giá nhập, giá bán, khuyến mãi và số lượng tồn.</p>
                </div>

                <div className="luoi-form-3">
                  <div className="nhom-form">
                    <label>Giá nhập</label>
                    <input
                      name="gianhap"
                      value={form.gianhap}
                      onChange={capNhatForm}
                      onFocus={(event) => event.target.select()}
                      placeholder="120.000"
                    />
                    <small>{giaNhapSo ? formatTienHienThi(giaNhapSo) : "0 ₫"}</small>
                  </div>

                  <div className="nhom-form">
                    <label>
                      Giá bán <span>*</span>
                    </label>
                    <input
                      name="giaban"
                      value={form.giaban}
                      onChange={capNhatForm}
                      onFocus={(event) => event.target.select()}
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
                      onFocus={(event) => event.target.select()}
                      className={loiForm.giakhuyenmai ? "input-loi" : ""}
                      placeholder="129.000"
                    />
                    {loiForm.giakhuyenmai && (
                      <div className="loi-form">{loiForm.giakhuyenmai}</div>
                    )}
                    <small>
                      {giaKhuyenMaiSo
                        ? formatTienHienThi(giaKhuyenMaiSo)
                        : "Không áp dụng"}
                    </small>
                  </div>
                </div>

                <div className="luoi-form-2">
                  <div className="nhom-form">
                    <label>Số lượng tồn kho</label>
                    <input
                      type="number"
                      min="0"
                      name="soluongton"
                      value={form.soluongton}
                      onChange={capNhatForm}
                      onFocus={(event) => event.target.select()}
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
                      onFocus={(event) => event.target.select()}
                      className={loiForm.nguongcanhbao ? "input-loi" : ""}
                    />
                    {loiForm.nguongcanhbao && (
                      <div className="loi-form">{loiForm.nguongcanhbao}</div>
                    )}
                  </div>
                </div>
              </section>

              <section className="card-form-san-pham">
                <div className="tieu-de-card-form">
                  <h4>Mô tả và biến thể</h4>
                  <p>Nội dung hiển thị trên website và thông tin thuộc tính.</p>
                </div>

                <div className="nhom-form">
                  <label>Mô tả ngắn</label>
                  <textarea
                    name="motangan"
                    value={form.motangan}
                    onChange={capNhatForm}
                    rows={3}
                    placeholder="Mô tả ngắn hiển thị trong danh sách hoặc SEO"
                  />
                </div>

                <div className="nhom-form">
                  <label>Mô tả chi tiết</label>
                  <textarea
                    name="motachitiet"
                    value={form.motachitiet}
                    onChange={capNhatForm}
                    rows={5}
                    placeholder="Mô tả chi tiết sản phẩm"
                  />
                </div>

                <div className="luoi-form-2">
                  <div className="nhom-form">
                    <label>Thuộc tính</label>
                    <textarea
                      name="thuoctinh"
                      value={form.thuoctinh}
                      onChange={capNhatForm}
                      rows={3}
                      placeholder="Ví dụ: Màu: Đen, Trắng; Chất liệu: Cotton"
                    />
                  </div>

                  <div className="nhom-form">
                    <label>Biến thể</label>
                    <textarea
                      name="bienthe"
                      value={form.bienthe}
                      onChange={capNhatForm}
                      rows={3}
                      placeholder="Ví dụ: Size S, M, L; Màu Đen, Trắng"
                    />
                  </div>
                </div>
              </section>
            </div>

            <aside className="cot-phu-form-san-pham">
              <section className="card-form-san-pham card-anh-san-pham">
                <div className="tieu-de-card-form">
                  <h4>Hình ảnh</h4>
                  <p>Ảnh đại diện và album sản phẩm.</p>
                </div>

                <label className="khung-upload-anh">
                  {anhXemTruoc ? (
                    <img
                      src={
                        anhXemTruoc.startsWith("blob:")
                          ? anhXemTruoc
                          : `http://localhost:8080${anhXemTruoc}`
                      }
                      alt="Ảnh sản phẩm"
                    />
                  ) : (
                    <div>
                      <ImagePlus size={34} />
                      <strong>Chọn ảnh chính</strong>
                      <span>JPG, PNG, WEBP dưới 5MB</span>
                    </div>
                  )}

                  <input type="file" accept="image/*" onChange={chonAnh} />
                </label>

                <p className="ghi-chu-anh">
                  Ảnh chính sẽ được upload sau khi lưu sản phẩm.
                </p>

                <label className="khung-upload-album">
                  <ImagePlus size={22} />
                  <span>Chọn album ảnh</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={chonAlbum}
                  />
                </label>

                {albumXemTruoc.length > 0 && (
                  <div className="album-preview-san-pham">
                    {albumXemTruoc.map((src, index) => (
                      <img
                        key={index}
                        src={src.startsWith("blob:") ? src : `http://localhost:8080${src}`}
                        alt={`Album ${index + 1}`}
                      />
                    ))}
                  </div>
                )}
              </section>

              <section className="card-form-san-pham">
                <div className="tieu-de-card-form">
                  <h4>Trạng thái hiển thị</h4>
                  <p>Kiểm soát sản phẩm trên website.</p>
                </div>

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
                        ? "Sản phẩm hết tồn kho nên không thể bật hiển thị."
                        : form.trangthai === "hien_thi"
                        ? "Sản phẩm sẽ hiển thị trên website bán hàng."
                        : "Sản phẩm sẽ được ẩn khỏi website bán hàng."}
                    </span>
                  </div>
                </div>
              </section>

              <section className="card-form-san-pham">
                <div className="tieu-de-card-form">
                  <h4>Nhãn sản phẩm</h4>
                  <p>Dùng để lọc, hiển thị và gợi ý trên website.</p>
                </div>

                <div className="luoi-check-san-pham layout-check-doc">
                  <label>
                    <input
                      type="checkbox"
                      name="noibat"
                      checked={form.noibat}
                      onChange={capNhatForm}
                    />
                    Sản phẩm nổi bật
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="banchay"
                      checked={form.banchay}
                      onChange={capNhatForm}
                    />
                    Sản phẩm bán chạy
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="sanphammoi"
                      checked={form.sanphammoi}
                      onChange={capNhatForm}
                    />
                    Sản phẩm mới
                  </label>

                  <label>
                    <input
                      type="checkbox"
                      name="chodattruoc"
                      checked={form.chodattruoc}
                      onChange={capNhatForm}
                    />
                    Cho phép đặt trước
                  </label>
                </div>
              </section>
            </aside>
          </div>

          <div className="chan-modal chan-modal-san-pham-moi">
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
