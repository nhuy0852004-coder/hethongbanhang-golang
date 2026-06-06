import { useEffect, useState, useMemo, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  Eye,
  ImageOff,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
  Download,
  Upload,
  Check,
  X as XIcon,
} from "lucide-react";
import toast from "react-hot-toast";
import { layUrlAnh } from "../../api/ketnoiapi";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import useGiaoDienStore from "../../stores/giaodienStore";
import { formatTienVietNam } from "../../utils/dinhtien";
import { layDanhSachDanhMuc } from "../../api/danhmucApi";
import SanPhamModal from "./SanPhamModal";
import ChiTietSanPhamModal from "./ChiTietSanPhamModal";
import ThungRacSanPham from "./ThungRacSanPham";
import XacNhanModal from "../../components/ui/XacNhanModal";

import {
  bulkCapNhatTrangThaiSanPham,
  bulkXoaSanPham,
  capNhatSanPham,
  capNhatTrangThaiSanPham,
  layDanhSachSanPham,
  layChiTietSanPham,
  themSanPham,
  uploadAlbumAnhSanPham,
  uploadAnhSanPham,
  xoaSanPham,
  xuatExcelSanPham,
  nhapExcelSanPham,
} from "../../api/sanphamApi";

// Tổ chức danh mục thành cây để hiển thị trong select lọc
function xayDungCayDanhMuc(danhSach) {
  const cha = danhSach.filter((d) => !d.danhmuccha_id);
  const con = danhSach.filter((d) => d.danhmuccha_id);
  const result = [];
  cha.forEach((parent) => {
    const children = con.filter((c) => String(c.danhmuccha_id) === String(parent.id));
    result.push({ ...parent, _laCha: true });
    children.forEach((child) => result.push({ ...child, _laCon: true }));
  });
  con.forEach((c) => {
    if (!cha.find((p) => String(p.id) === String(c.danhmuccha_id))) {
      result.push(c);
    }
  });
  return result;
}

export default function DanhSachSanPham() {
  const [searchParams, setSearchParams] = useSearchParams();
  const danhmucIdTuUrl = searchParams.get("danhmuc_id") || "";

  const capNhatTieuDeTrang = useGiaoDienStore((state) => state.capNhatTieuDeTrang);
  const [dangTai, setDangTai] = useState(true);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [dangDoiTrangThaiId, setDangDoiTrangThaiId] = useState(null);
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [phanTrang, setPhanTrang] = useState({ trang: 1, gioihan: 10, tongsodong: 0, tongsotrang: 1 });
  const [boLoc, setBoLoc] = useState({
    timkiem: "",
    trangthai: "",
    danhmuc_id: danhmucIdTuUrl,
    tonkho: "",
    sanpham: "",
    giatu: "",
    giaden: "",
    sapxep: "cu_nhat",
    trang: 1,
    gioihan: 10,
  });
  const [moLocNangCao, setMoLocNangCao] = useState(false);
  const [modalMo, setModalMo] = useState(false);
  const [cheDoModal, setCheDoModal] = useState("them");
  const [duLieuSua, setDuLieuSua] = useState(null);
  const [idsDangChon, setIdsDangChon] = useState([]);
  const [modalBulkXoaMo, setModalBulkXoaMo] = useState(false);
  const [modalXoaMo, setModalXoaMo] = useState(false);
  const [sanPhamCanXoa, setSanPhamCanXoa] = useState(null);
  const [modalChiTietMo, setModalChiTietMo] = useState(false);
  const [sanPhamChiTiet, setSanPhamChiTiet] = useState(null);
  const [albumChiTiet, setAlbumChiTiet] = useState([]);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);
  const [modalThungRacMo, setModalThungRacMo] = useState(false);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const inlineInputRef = useRef(null);

  // Inline edit state
  const [suaInline, setSuaInline] = useState(null); // { id, field }
  const [giaTriInline, setGiaTriInline] = useState("");
  const [dangLuuInlineId, setDangLuuInlineId] = useState(null);

  useEffect(() => {
    capNhatTieuDeTrang(
      "Quản lý sản phẩm",
      "Quản lý sản phẩm, giá bán, tồn kho, ảnh và trạng thái hiển thị"
    );
  }, [capNhatTieuDeTrang]);

  const taiDanhMuc = async () => {
    try {
      const ketQua = await layDanhSachDanhMuc({ trang: 1, gioihan: 100, trangthai: "hien_thi" });
      setDanhSachDanhMuc(ketQua.dulieu.danhsach || []);
    } catch {
      toast.error("Không tải được danh mục sản phẩm");
    }
  };

  const taiDanhSach = async (thamSo = boLoc, tuyChon = { hienLoading: true }) => {
    try {
      if (tuyChon.hienLoading) {
        setDangTai(true);
      }

      const params = {
        ...thamSo,
        giatu: thamSo.giatu ? Number(thamSo.giatu) : "",
        giaden: thamSo.giaden ? Number(thamSo.giaden) : "",
      };

      const ketQua = await layDanhSachSanPham(params);

      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được danh sách sản phẩm";

      toast.error(thongBao);
    } finally {
      if (tuyChon.hienLoading) {
        setDangTai(false);
      }
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { taiDanhMuc(); }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      taiDanhSach({ ...boLoc, trang: 1 }, { hienLoading: true });
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    boLoc.timkiem,
    boLoc.trangthai,
    boLoc.danhmuc_id,
    boLoc.tonkho,
    boLoc.sanpham,
    boLoc.giatu,
    boLoc.giaden,
    boLoc.sapxep,
  ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { taiDanhSach(boLoc, { hienLoading: true }); }, [boLoc.trang]);

  const cayDanhMuc = useMemo(() => xayDungCayDanhMuc(danhSachDanhMuc), [danhSachDanhMuc]);

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: value,
      trang: 1,
    }));

    // Sync danhmuc_id vào URL để có thể share link
    if (name === "danhmuc_id") {
      const params = new URLSearchParams(searchParams);
      if (value) {
        params.set("danhmuc_id", value);
      } else {
        params.delete("danhmuc_id");
      }
      setSearchParams(params, { replace: true });
    }
  };

  const xoaBoLoc = () => {
    setBoLoc((cu) => ({
      ...cu,
      timkiem: "",
      trangthai: "",
      danhmuc_id: "",
      tonkho: "",
      sanpham: "",
      giatu: "",
      giaden: "",
      trang: 1,
    }));
    setSearchParams({}, { replace: true });
  };

  const coBoLoc = boLoc.timkiem || boLoc.trangthai || boLoc.danhmuc_id ||
    boLoc.tonkho || boLoc.sanpham || boLoc.giatu || boLoc.giaden;

  const moThem = () => { setCheDoModal("them"); setDuLieuSua(null); setModalMo(true); };
  const moSua = (item) => { setCheDoModal("sua"); setDuLieuSua(item); setModalMo(true); };
  const dongModal = () => { if (dangXuLy) return; setModalMo(false); setDuLieuSua(null); };

  const xemNhanh = async (item) => {
    try {
      setModalChiTietMo(true);
      setDangTaiChiTiet(true);
      setSanPhamChiTiet(null);
      setAlbumChiTiet([]);

      const ketQua = await layChiTietSanPham(item.id);

      setSanPhamChiTiet(ketQua?.dulieu?.sanpham || item);
      setAlbumChiTiet(ketQua?.dulieu?.album || []);
    } catch (loi) {
      toast.error(
        loi?.response?.data?.thongbao || "Không tải được chi tiết sản phẩm"
      );
      setSanPhamChiTiet(item);
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const suaNhanhTuChiTiet = (sanPham) => {
    if (!sanPham) return;

    setModalChiTietMo(false);
    moSua(sanPham);
  };

  const nhanBanSanPham = (sanPham) => {
    if (!sanPham) return;

    setModalChiTietMo(false);

    setCheDoModal("them");
    setDuLieuSua({
      ...sanPham,
      id: undefined,
      madinhdanh: "",
      sku: "",
      barcode: "",
      tensanpham: `${sanPham.tensanpham} - bản sao`,
      hinhanh: "",
    });
    setModalMo(true);
  };

  const luuSanPham = async (duLieu, fileAnh, albumFiles = []) => {
    if (duLieu?.error) {
      toast.error(duLieu.error);
      return;
    }

    try {
      setDangXuLy(true);

      let ketQua;
      let sanPhamID;

      if (cheDoModal === "them") {
        ketQua = await themSanPham(duLieu);
        sanPhamID =
          ketQua?.dulieu?.id ||
          ketQua?.dulieu?.sanpham?.id ||
          ketQua?.dulieu?.sanPham?.id;
        toast.success("Thêm sản phẩm thành công");
      } else {
        ketQua = await capNhatSanPham(duLieuSua.id, duLieu);
        sanPhamID = duLieuSua.id;
        toast.success("Cập nhật sản phẩm thành công");
      }

      if (fileAnh && sanPhamID) {
        await uploadAnhSanPham(sanPhamID, fileAnh);
        toast.success("Upload ảnh chính thành công");
        try {
          const chiTiet = await layChiTietSanPham(sanPhamID);
          const duLieuMoi = chiTiet?.dulieu?.sanpham;
          if (duLieuMoi?.id) {
            setDanhSach((ds) =>
              ds.map((sp) => (sp.id === duLieuMoi.id ? { ...sp, ...duLieuMoi } : sp))
            );
            if (duLieuSua && duLieuSua.id === duLieuMoi.id) {
              setDuLieuSua(duLieuMoi);
            }
          }
        } catch {}
      }

      if (albumFiles.length > 0 && sanPhamID) {
        await uploadAlbumAnhSanPham(sanPhamID, albumFiles);
        toast.success("Upload album ảnh thành công");
        try {
          const chiTiet = await layChiTietSanPham(sanPhamID);
          const duLieuMoi = chiTiet?.dulieu?.sanpham;
          if (duLieuMoi?.id) {
            setDanhSach((ds) =>
              ds.map((sp) => (sp.id === duLieuMoi.id ? { ...sp, ...duLieuMoi } : sp))
            );
            if (duLieuSua && duLieuSua.id === duLieuMoi.id) {
              setDuLieuSua(duLieuMoi);
            }
          }
        } catch {}
      }

      setModalMo(false);
      setDuLieuSua(null);
      await taiDanhSach(boLoc, { hienLoading: false });
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không lưu được sản phẩm");
    } finally {
      setDangXuLy(false);
    }
  };

  const doiTrangThai = async (item) => {
    if (dangDoiTrangThaiId === item.id) {
      return;
    }

    if (item.trangthai === "het_hang" || Number(item.soluongton || 0) <= 0) {
      toast.error("Sản phẩm đã hết hàng, vui lòng cập nhật tồn kho trước");
      return;
    }

    const trangThaiCu = item.trangthai;
    const trangThaiMoi = item.trangthai === "hien_thi" ? "an" : "hien_thi";

    try {
      setDangDoiTrangThaiId(item.id);

      setDanhSach((danhSachCu) =>
        danhSachCu.map((sp) =>
          sp.id === item.id
            ? {
                ...sp,
                trangthai: trangThaiMoi,
              }
            : sp
        )
      );

      const ketQua = await capNhatTrangThaiSanPham(item.id, trangThaiMoi);
      const duLieuMoi = ketQua?.dulieu;

      if (duLieuMoi?.id) {
        setDanhSach((danhSachCu) =>
          danhSachCu.map((sp) =>
            sp.id === duLieuMoi.id
              ? {
                  ...sp,
                  ...duLieuMoi,
                }
              : sp
          )
        );
      }

      toast.success(
        (duLieuMoi?.trangthai || trangThaiMoi) === "hien_thi"
          ? "Đã bật hiển thị sản phẩm"
          : "Đã ẩn sản phẩm"
      );
    } catch (loi) {
      setDanhSach((danhSachCu) =>
        danhSachCu.map((sp) =>
          sp.id === item.id
            ? {
                ...sp,
                trangthai: trangThaiCu,
              }
            : sp
        )
      );

      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được trạng thái";

      toast.error(thongBao);
    } finally {
      setDangDoiTrangThaiId(null);
    }
  };

  const moModalXoa = (item) => {
    setSanPhamCanXoa(item);
    setModalXoaMo(true);
  };

  const dongModalXoa = () => {
    setSanPhamCanXoa(null);
    setModalXoaMo(false);
  };

  const xacNhanXoaSanPham = async () => {
    if (!sanPhamCanXoa) return;

    try {
      setDangXuLy(true);

      await xoaSanPham(sanPhamCanXoa.id);

      toast.success("Xóa sản phẩm thành công");

      dongModalXoa();
      await taiDanhSach(boLoc, { hienLoading: false });
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa được sản phẩm";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const idsCoTheChon = danhSach.map((item) => item.id);

  const daChonTatCa =
    idsCoTheChon.length > 0 &&
    idsCoTheChon.every((id) => idsDangChon.includes(id));

  const batTatChonTatCa = () => {
    if (daChonTatCa) {
      setIdsDangChon((cu) => cu.filter((id) => !idsCoTheChon.includes(id)));
      return;
    }

    setIdsDangChon((cu) => Array.from(new Set([...cu, ...idsCoTheChon])));
  };

  const batTatChonMotDong = (id) => {
    setIdsDangChon((cu) =>
      cu.includes(id) ? cu.filter((item) => item !== id) : [...cu, id]
    );
  };

  const boChonTatCa = () => {
    setIdsDangChon([]);
  };

  const bulkDoiTrangThai = async (trangthai) => {
    if (idsDangChon.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await bulkCapNhatTrangThaiSanPham(idsDangChon, trangthai);

      toast.success(
        trangthai === "hien_thi"
          ? `Đã bật hiển thị ${ketQua.dulieu.thanhcong} sản phẩm`
          : `Đã ẩn ${ketQua.dulieu.thanhcong} sản phẩm`
      );

      setIdsDangChon([]);
      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được sản phẩm đã chọn";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const xacNhanBulkXoa = async () => {
    if (idsDangChon.length === 0) {
      toast.error("Vui lòng chọn ít nhất một sản phẩm");
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await bulkXoaSanPham(idsDangChon);

      if (ketQua.dulieu.thatbai > 0) {
        toast.error(
          `Xóa thành công ${ketQua.dulieu.thanhcong}, thất bại ${ketQua.dulieu.thatbai}`
        );
      } else {
        toast.success(`Đã xóa ${ketQua.dulieu.thanhcong} sản phẩm`);
      }

      setIdsDangChon([]);
      setModalBulkXoaMo(false);

      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa được sản phẩm đã chọn";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyXuatExcel = async () => {
    try {
      setDangXuLy(true);
      toast.loading("Đang xuất file Excel...", { id: "export" });
      const blob = await xuatExcelSanPham(boLoc);
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `sanpham_${new Date().getTime()}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.parentNode.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Xuất file Excel thành công", { id: "export" });
    } catch (loi) {
      console.error("Lỗi xuất file Excel:", loi);
      toast.error("Không thể xuất file Excel", { id: "export" });
    } finally {
      setDangXuLy(false);
    }
  };

  const xuLyNhapExcel = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setDangXuLy(true);
      toast.loading("Đang xử lý file Excel...", { id: "import" });
      
      const ketQua = await nhapExcelSanPham(file);
      const thongKe = ketQua.dulieu;
      
      if (thongKe.thatbai > 0) {
        toast.error(`Nhập thành công ${thongKe.thanhcong}, thất bại ${thongKe.thatbai}`, { id: "import", duration: 5000 });
        console.log("Chi tiết lỗi nhập excel:", thongKe.ketqua.filter(k => !k.thanhcong));
      } else {
        toast.success(`Nhập thành công ${thongKe.thanhcong} sản phẩm`, { id: "import" });
      }
      
      await taiDanhSach({ ...boLoc, trang: 1 }, { hienLoading: false });
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không thể nhập file Excel", { id: "import" });
    } finally {
      setDangXuLy(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const batDauSuaInline = (item, field) => {
    if (dangLuuInlineId) return;
    setSuaInline({ id: item.id, field });
    setGiaTriInline(String(field === "giaban" ? item.giaban : item.soluongton));
    setTimeout(() => inlineInputRef.current?.select(), 0);
  };

  const huyInline = () => {
    setSuaInline(null);
    setGiaTriInline("");
  };

  const luuInline = async (item) => {
    if (!suaInline || suaInline.id !== item.id) return;
    const soMoi = Number(String(giaTriInline).replace(/[^0-9]/g, ""));
    if (isNaN(soMoi) || soMoi < 0) { huyInline(); return; }
    const socu = suaInline.field === "giaban" ? item.giaban : item.soluongton;
    if (soMoi === socu) { huyInline(); return; }
    if (suaInline.field === "giaban" && soMoi === 0) {
      toast.error("Giá bán phải lớn hơn 0");
      return;
    }

    try {
      setDangLuuInlineId(item.id);
      const payload = {
        madinhdanh: item.madinhdanh || "",
        sku: item.sku || "",
        barcode: item.barcode || "",
        tensanpham: item.tensanpham,
        mota: item.mota || "",
        motangan: item.motangan || "",
        motachitiet: item.motachitiet || "",
        thuonghieu: item.thuonghieu || "",
        donvitinh: item.donvitinh || "cái",
        gianhap: item.gianhap || 0,
        giaban: suaInline.field === "giaban" ? soMoi : item.giaban,
        giakhuyenmai: item.giakhuyenmai || null,
        km_bat_dau: item.km_bat_dau || null,
        km_ket_thuc: item.km_ket_thuc || null,
        soluongton: suaInline.field === "soluongton" ? soMoi : item.soluongton,
        nguongcanhbao: item.nguongcanhbao || 0,
        trongluong: item.trongluong || null,
        kichthuoc: item.kichthuoc || "",
        noibat: Boolean(item.noibat),
        banchay: Boolean(item.banchay),
        sanphammoi: Boolean(item.sanphammoi),
        chodattruoc: Boolean(item.chodattruoc),
        trangthai: item.trangthai,
        danhmuc_id: item.danhmuc_id || null,
        thuoctinh: item.thuoctinh || "",
        bienthe: item.bienthe || "",
        danhsachbienthe: [],
      };

      await capNhatSanPham(item.id, payload);

      setDanhSach((ds) =>
        ds.map((sp) =>
          sp.id === item.id ? { ...sp, [suaInline.field]: soMoi } : sp
        )
      );
      toast.success(
        suaInline.field === "giaban"
          ? "Đã cập nhật giá bán"
          : "Đã cập nhật tồn kho"
      );
      huyInline();
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không cập nhật được");
    } finally {
      setDangLuuInlineId(null);
    }
  };

  const chuyenTrang = (trangMoi) => {
    if (trangMoi < 1 || trangMoi > phanTrang.tongsotrang) return;

    setBoLoc((cu) => ({
      ...cu,
      trang: trangMoi,
    }));
  };

  return (
    <div className="trang-san-pham-admin">
      <div className="breadcrumb-san-pham">
        <span className="breadcrumb-link" onClick={() => navigate("/admin")}>Trang chủ</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-hientai">Quản lý sản phẩm</span>
      </div>

      <div className="dau-trang-san-pham">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>Quản lý thông tin sản phẩm, giá bán, tồn kho và trạng thái hiển thị.</p>
        </div>
        <div className="hanh-dong-dau-trang-san-pham">
          <button
            type="button"
            className="nut-phu-san-pham xuat-excel"
            onClick={xuLyXuatExcel}
            disabled={dangXuLy}
          >
            <Download size={16} />
            <span>Xuất Excel</span>
          </button>

          <button
            type="button"
            className="nut-phu-san-pham nhap-excel"
            onClick={() => fileInputRef.current?.click()}
            disabled={dangXuLy}
          >
            <Upload size={16} />
            <span>Nhập Excel</span>
          </button>
          <input 
            type="file" 
            accept=".xlsx, .xls" 
            style={{ display: "none" }} 
            ref={fileInputRef}
            onChange={xuLyNhapExcel}
          />

          <button
            type="button"
            className="nut-phu-san-pham"
            onClick={() => setModalThungRacMo(true)}
            disabled={dangXuLy}
            style={{ backgroundColor: "#ef4444", color: "white", borderColor: "#ef4444" }}
          >
            <Trash2 size={16} />
            <span>Thùng rác</span>
          </button>
        </div>
      </div>

      <div className="thanh-san-pham">
        <div className="bo-loc-card-san-pham">
          <div className="hang-loc-chinh-san-pham">
            <div className="o-tim-san-pham-admin">
              <Search size={18} />
              <input
                name="timkiem"
                value={boLoc.timkiem}
                onChange={capNhatBoLoc}
                placeholder="Tìm tên, mã, SKU hoặc barcode..."
              />
            </div>

            <div className="select-san-pham-wrap">
              <select
                name="danhmuc_id"
                value={boLoc.danhmuc_id}
                onChange={capNhatBoLoc}
              >
                <option value="">Tất cả danh mục</option>
                {cayDanhMuc
                  .filter((item) => item._laCon)
                  .map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.tendanhmuc}
                    </option>
                  ))}
              </select>
            </div>

            <div className="select-san-pham-wrap">
              <select
                name="trangthai"
                value={boLoc.trangthai}
                onChange={capNhatBoLoc}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="hien_thi">Hiển thị</option>
                <option value="an">Đang ẩn</option>
                <option value="het_hang">Hết hàng</option>
              </select>
            </div>

            <button
              type="button"
              className={`nut-loc-nang-cao-san-pham ${moLocNangCao ? "dang-mo" : ""}`}
              onClick={() => setMoLocNangCao((cu) => !cu)}
            >
              <SlidersHorizontal size={16} />
              <span>Nâng cao</span>
            </button>

            {coBoLoc && (
              <button
                type="button"
                className="nut-loc-nang-cao-san-pham"
                onClick={xoaBoLoc}
                title="Xóa tất cả bộ lọc"
              >
                <span>✕ Xóa lọc</span>
              </button>
            )}

            <button
              type="button"
              className="nut-them-san-pham-trong-loc"
              onClick={moThem}
            >
              <Plus size={18} />
              <span>Thêm sản phẩm</span>
            </button>
          </div>

          {moLocNangCao && (
            <div className="hang-loc-nang-cao-san-pham">
              <div className="select-san-pham-wrap">
                <select name="tonkho" value={boLoc.tonkho} onChange={capNhatBoLoc}>
                  <option value="">Tất cả tồn kho</option>
                  <option value="con_hang">Còn hàng</option>
                  <option value="sap_het">Sắp hết</option>
                  <option value="het_hang">Hết hàng</option>
                </select>
              </div>

              <div className="select-san-pham-wrap">
                <select name="sanpham" value={boLoc.sanpham} onChange={capNhatBoLoc}>
                  <option value="">Tất cả sản phẩm</option>
                  <option value="noibat">Nổi bật</option>
                  <option value="banchay">Bán chạy</option>
                  <option value="khuyenmai">Khuyến mãi</option>
                </select>
              </div>

              <input
                className="input-gia-loc"
                name="giatu"
                value={boLoc.giatu}
                onChange={capNhatBoLoc}
                placeholder="Giá từ"
                inputMode="numeric"
              />

              <input
                className="input-gia-loc"
                name="giaden"
                value={boLoc.giaden}
                onChange={capNhatBoLoc}
                placeholder="Giá đến"
                inputMode="numeric"
              />

              <div className="select-san-pham-wrap">
                <select name="sapxep" value={boLoc.sapxep} onChange={capNhatBoLoc}>
                  <option value="cu_nhat">Tạo cũ trước</option>
                  <option value="moi_nhat">Tạo mới trước</option>
                  <option value="gia_tang">Giá tăng dần</option>
                  <option value="gia_giam">Giá giảm dần</option>
                  <option value="ton_kho_thap">Tồn kho thấp</option>
                  <option value="luot_ban">Lượt bán</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {idsDangChon.length > 0 && (
        <div className="thanh-bulk-san-pham">
          <div>
            Đã chọn <strong>{idsDangChon.length}</strong> sản phẩm
          </div>

          <div className="hanh-dong-bulk-san-pham">
            <button
              type="button"
              className="nut-bulk"
              disabled={dangXuLy}
              onClick={() => bulkDoiTrangThai("hien_thi")}
            >
              Bật hiển thị
            </button>

            <button
              type="button"
              className="nut-bulk"
              disabled={dangXuLy}
              onClick={() => bulkDoiTrangThai("an")}
            >
              Ẩn sản phẩm
            </button>

            <button
              type="button"
              className="nut-bulk nguy-hiem"
              disabled={dangXuLy}
              onClick={() => setModalBulkXoaMo(true)}
            >
              Xóa đã chọn
            </button>

            <button
              type="button"
              className="nut-bulk phu"
              disabled={dangXuLy}
              onClick={boChonTatCa}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}
      {dangTai && <DangTai noidung="Đang tải danh sách sản phẩm..." />}
      {!dangTai && danhSach.length === 0 && (
        <TrangRong
          tieude="Chưa có sản phẩm"
          mota="Hãy thêm sản phẩm đầu tiên để bắt đầu bán hàng."
          nut="Thêm sản phẩm"
          onClick={moThem}
        />
      )}
      {!dangTai && danhSach.length > 0 && (
        <div className="khung-bang">
          <div className="bang-responsive">
            <table className="bang-du-lieu bang-san-pham">
              <thead>
                <tr>
                  <th style={{ width: 42 }}>
                    <input
                      type="checkbox"
                      checked={daChonTatCa}
                      onChange={batTatChonTatCa}
                    />
                  </th>
                  <th style={{ width: 60 }}>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th style={{ width: 130 }}>Danh mục</th>
                  <th style={{ width: 140 }}>Giá bán</th>
                  <th style={{ width: 110 }}>Tồn kho</th>
                  <th style={{ width: 80 }}>Đã bán</th>
                  <th style={{ width: 100 }}>Trạng thái</th>
                  <th style={{ width: 110 }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {danhSach.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={idsDangChon.includes(item.id)}
                        onChange={() => batTatChonMotDong(item.id)}
                      />
                    </td>
                    <td>
                      {item.hinhanh ? (
                        <img
                          className="anh-san-pham-bang"
                          src={layUrlAnh(item.hinhanh)}
                          alt={item.tensanpham}
                        />
                      ) : (
                        <div className="anh-san-pham-trong">
                          <ImageOff size={18} />
                        </div>
                      )}
                    </td>
                    <td>
                      <div className="cot-ten-san-pham">
                        <strong>{item.tensanpham}</strong>
                        <span className="ma-san-pham">#{item.madinhdanh}</span>
                      </div>
                    </td>
                    <td>
                      {item.tendanhmuc ? (
                        <span className="chip-danh-muc">{item.tendanhmuc}</span>
                      ) : (
                        <span className="chip-danh-muc chip-mac-dinh">Chưa phân loại</span>
                      )}
                    </td>
                    <td
                      className={`ie-cell ${suaInline?.id === item.id && suaInline.field === "giaban" ? "ie-dang-sua" : ""}`}
                      onClick={() => suaInline?.id !== item.id && batDauSuaInline(item, "giaban")}
                    >
                      {suaInline?.id === item.id && suaInline.field === "giaban" ? (
                        <div className="ie-nhom">
                          <input
                            ref={inlineInputRef}
                            className="ie-input"
                            type="text"
                            inputMode="numeric"
                            value={giaTriInline}
                            onChange={(e) => setGiaTriInline(e.target.value.replace(/[^0-9]/g, ""))}
                            onBlur={() => luuInline(item)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { e.preventDefault(); luuInline(item); }
                              if (e.key === "Escape") huyInline();
                            }}
                            disabled={dangLuuInlineId === item.id}
                          />
                          <button className="ie-nut ie-luu" type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => luuInline(item)}>
                            <Check size={12} />
                          </button>
                          <button className="ie-nut ie-huy" type="button" onMouseDown={(e) => e.preventDefault()} onClick={huyInline}>
                            <XIcon size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="ie-hien-thi">
                          <div className="cot-gia-san-pham">
                            {item.giakhuyenmai ? (
                              <>
                                <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                                  <strong>{formatTienVietNam(item.giakhuyenmai)}</strong>
                                  {item.km_dang_hoat_dong
                                    ? <span className="km-badge km-badge--active">Đang KM</span>
                                    : item.km_ket_thuc && new Date(item.km_ket_thuc) < new Date()
                                      ? <span className="km-badge km-badge--het">Hết KM</span>
                                      : item.km_bat_dau && new Date(item.km_bat_dau) > new Date()
                                        ? <span className="km-badge km-badge--sap">Sắp KM</span>
                                        : null}
                                </div>
                                <span>{formatTienVietNam(item.giaban)}</span>
                              </>
                            ) : (
                              <strong>{formatTienVietNam(item.giaban)}</strong>
                            )}
                          </div>
                          <Pencil size={11} className="ie-icon-pencil" />
                        </div>
                      )}
                    </td>
                    <td
                      className={`ie-cell ${suaInline?.id === item.id && suaInline.field === "soluongton" ? "ie-dang-sua" : ""}`}
                      onClick={() => suaInline?.id !== item.id && batDauSuaInline(item, "soluongton")}
                    >
                      {suaInline?.id === item.id && suaInline.field === "soluongton" ? (
                        <div className="ie-nhom">
                          <input
                            ref={inlineInputRef}
                            className="ie-input"
                            type="text"
                            inputMode="numeric"
                            value={giaTriInline}
                            onChange={(e) => setGiaTriInline(e.target.value.replace(/[^0-9]/g, ""))}
                            onBlur={() => luuInline(item)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") { e.preventDefault(); luuInline(item); }
                              if (e.key === "Escape") huyInline();
                            }}
                            disabled={dangLuuInlineId === item.id}
                          />
                          <button className="ie-nut ie-luu" type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => luuInline(item)}>
                            <Check size={12} />
                          </button>
                          <button className="ie-nut ie-huy" type="button" onMouseDown={(e) => e.preventDefault()} onClick={huyInline}>
                            <XIcon size={12} />
                          </button>
                        </div>
                      ) : (
                        <div className="ie-hien-thi">
                          <span className={`chip-ton-kho ${
                            item.soluongton === 0 ? "het" :
                            item.soluongton <= 3 ? "sap-het" :
                            item.soluongton <= 10 ? "it" : "con"
                          }`}>
                            {item.soluongton === 0 ? "Hết hàng" : `${item.soluongton} còn lại`}
                          </span>
                          <Pencil size={11} className="ie-icon-pencil" />
                        </div>
                      )}
                    </td>
                    <td>
                      <span className="so-da-ban">
                        <strong>{item.luotban || 0}</strong>
                        <span>đơn</span>
                      </span>
                    </td>
                    <td className="trang-thai-col">
                      <div className="khung-toggle">
                        <button
                          type="button"
                          className={`nut-toggle-trang-thai ${
                            item.trangthai === "hien_thi" ? "bat" : "tat"
                          } ${item.trangthai === "het_hang" ? "het-hang" : ""} ${
                            dangDoiTrangThaiId === item.id ? "dang-doi" : ""
                          }`}
                          title={
                            item.trangthai === "het_hang"
                              ? "Hết hàng"
                              : item.trangthai === "hien_thi"
                              ? "Đang hiển thị"
                              : "Đang ẩn"
                          }
                          disabled={dangDoiTrangThaiId === item.id}
                          onClick={() => doiTrangThai(item)}
                        >
                          <span className="toggle-thumb"></span>
                        </button>
                      </div>
                    </td>
                    <td>
                      <div className="nhom-nut-thao-tac">
                        <button
                          type="button"
                          className="nut-hanh-dong nut-xem"
                          title="Xem chi tiết sản phẩm"
                          onClick={() => xemNhanh(item)}
                        >
                          <Eye size={13} />
                        </button>

                        <button
                          type="button"
                          className="nut-hanh-dong nut-sua"
                          title="Sửa sản phẩm"
                          onClick={() => moSua(item)}
                        >
                          <Pencil size={13} />
                        </button>

                        <button
                          type="button"
                          className="nut-hanh-dong nut-xoa"
                          title="Xóa sản phẩm"
                          onClick={() => moModalXoa(item)}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {phanTrang.tongsodong > phanTrang.gioihan && (
            <div className="phan-trang">
              <div className="thong-tin-phan-trang">
                Hiển thị <strong>{(phanTrang.trang - 1) * phanTrang.gioihan + 1}–{Math.min(phanTrang.trang * phanTrang.gioihan, phanTrang.tongsodong)}</strong> trong <strong>{phanTrang.tongsodong}</strong> sản phẩm
              </div>

              <div className="nut-phan-trang">
                <button
                  className="nut-trang nut-truoc"
                  disabled={phanTrang.trang <= 1}
                  onClick={() => chuyenTrang(phanTrang.trang - 1)}
                >
                  ‹
                </button>

                {Array.from({ length: phanTrang.tongsotrang }, (_, i) => i + 1).map((soTrang) => (
                  <button
                    key={soTrang}
                    className={`nut-trang nut-so ${phanTrang.trang === soTrang ? "dang-chon" : ""}`}
                    onClick={() => chuyenTrang(soTrang)}
                  >
                    {soTrang}
                  </button>
                ))}

                <button
                  className="nut-trang nut-sau"
                  disabled={phanTrang.trang >= phanTrang.tongsotrang}
                  onClick={() => chuyenTrang(phanTrang.trang + 1)}
                >
                  ›
                </button>
              </div>
            </div>
          )}
        </div>
      )}
      <SanPhamModal
        mo={modalMo}
        cheDo={cheDoModal}
        duLieuSua={duLieuSua}
        danhSachDanhMuc={danhSachDanhMuc}
        dangXuLy={dangXuLy}
        onDong={dongModal}
        onLuu={luuSanPham}
      />

      <XacNhanModal
        mo={modalXoaMo}
        tieuDe="Xóa sản phẩm"
        moTa={`Bạn có chắc muốn xóa sản phẩm "${
          sanPhamCanXoa?.tensanpham || ""
        }" không?`}
        noiDung="Sản phẩm sẽ được xóa khỏi danh sách quản trị. Bạn nên kiểm tra kỹ trước khi thao tác."
        tenNutXacNhan="Xóa sản phẩm"
        dangXuLy={dangXuLy}
        onDong={dongModalXoa}
        onXacNhan={xacNhanXoaSanPham}
      />

      <XacNhanModal
        mo={modalBulkXoaMo}
        tieuDe="Xóa nhiều sản phẩm"
        moTa={`Bạn có chắc muốn xóa ${idsDangChon.length} sản phẩm đã chọn không?`}
        noiDung="Các sản phẩm sẽ được xóa mềm khỏi danh sách quản trị. Bạn nên kiểm tra kỹ trước khi thao tác."
        tenNutXacNhan="Xóa đã chọn"
        dangXuLy={dangXuLy}
        onDong={() => setModalBulkXoaMo(false)}
        onXacNhan={xacNhanBulkXoa}
      />

      <ChiTietSanPhamModal
        mo={modalChiTietMo}
        sanPham={sanPhamChiTiet}
        album={albumChiTiet}
        dangTai={dangTaiChiTiet}
        onDong={() => setModalChiTietMo(false)}
        onSuaNhanh={suaNhanhTuChiTiet}
        onNhanBan={nhanBanSanPham}
      />

      <ThungRacSanPham
        mo={modalThungRacMo}
        onDong={() => setModalThungRacMo(false)}
        onKhoiPhucXong={taiDanhSach}
      />
    </div>
  );
}
