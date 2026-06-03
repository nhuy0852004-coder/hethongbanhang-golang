import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronDown, ChevronUp, Pencil, Plus, RefreshCw, RotateCcw, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { layUrlAnh } from "../../api/ketnoiapi";
import BangDangTai from "../../components/ui/BangDangTai";
import BangTrong from "../../components/ui/BangTrong";
import XacNhanModal from "../../components/ui/XacNhanModal";
import KetQuaBulkModal from "../../components/ui/KetQuaBulkModal";
import DanhMucModal from "./DanhMucModal";
import {
  bulkCapNhatTrangThaiDanhMuc,
  bulkXoaDanhMuc,
  capNhatDanhMuc,
  capNhatTrangThaiDanhMuc,
  capNhatThuTuDanhMuc,
  khoiPhucDanhMuc,
  layDanhSachDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
  xoaVinhVienDanhMuc,
  uploadAnhDanhMuc,
} from "../../api/danhmucApi";

export default function DanhSachDanhMuc() {
  const dieuHuong = useNavigate();
  const [dangTai, setDangTai] = useState(true);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [dangDoiTrangThaiId, setDangDoiTrangThaiId] = useState(null);
  const [dangKhoiPhucId, setDangKhoiPhucId] = useState(null);
  const [loiTaiDuLieu, setLoiTaiDuLieu] = useState(null);
  const [ketQuaBulk, setKetQuaBulk] = useState(null);
  const [modalKetQuaBulkMo, setModalKetQuaBulkMo] = useState(false);
  const [danhSachGoc, setDanhSachGoc] = useState([]);

  const [danhSach, setDanhSach] = useState([]);
  const [phanTrang, setPhanTrang] = useState({
    trang: 1,
    gioihan: 10,
    tongsodong: 0,
    tongsotrang: 1,
  });

  const [boLoc, setBoLoc] = useState({
    timkiem: "",
    trangthai: "",
    danhmuccha_id: "",
    hienthixoa: false,
    trang: 1,
    gioihan: 10,
  });

  const [modalMo, setModalMo] = useState(false);
  const [cheDoModal, setCheDoModal] = useState("them");
  const [duLieuSua, setDuLieuSua] = useState(null);
  const [modalXoaMo, setModalXoaMo] = useState(false);
  const [danhMucDangXoa, setDanhMucDangXoa] = useState(null);
  const [modalXoaVinhVienMo, setModalXoaVinhVienMo] = useState(false);
  const [danhMucDangXoaVinhVien, setDanhMucDangXoaVinhVien] = useState(null);
  const [idsDangChon, setIdsDangChon] = useState([]);
  const [modalBulkXoaMo, setModalBulkXoaMo] = useState(false);

  // Inline thutu edit state
  const [thutuDangSuaId, setThutuDangSuaId] = useState(null);
  const [thutuInputGiaTri, setThutuInputGiaTri] = useState("");
  const [thutuDangLuuId, setThutuDangLuuId] = useState(null);

  const buildDanhMucParentMap = (danhSachAll) => {
    const map = new Map(); // id -> parentId
    danhSachAll.forEach((it) => {
      if (it?.id) {
        map.set(it.id, it?.danhmuccha_id ?? null);
      }
    });
    return map;
  };

  const getDepthDanhMuc = (id, danhSachPhanTrang, danhSachGocLocal) => {
    const all = [...(danhSachGocLocal || []), ...(danhSachPhanTrang || [])];
    const parentMap = buildDanhMucParentMap(all);

    let depth = 0;
    let current = parentMap.get(id);
    const max = 20;

    while (current && depth < max) {
      // nếu không tìm được cha trong map thì dừng
      if (!parentMap.has(current)) break;
      depth += 1;
      current = parentMap.get(current);
    }

    // mỗi level lùi 18px
    return depth * 18;
  };

  const taiDanhSach = async (thamSo = boLoc, tuyChon = { hienLoading: true }) => {
    try {
      if (tuyChon.hienLoading) {
        setDangTai(true);
      }

      const ketQua = await layDanhSachDanhMuc({
        ...thamSo,
        hienthixoa: thamSo.hienthixoa ? 1 : 0,
      });

      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
      setLoiTaiDuLieu(null);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được danh sách danh mục";

      setLoiTaiDuLieu(thongBao);
      console.error("[DanhMuc] Lỗi tải danh sách:", loi);
      toast.error(thongBao);
    } finally {
      if (tuyChon.hienLoading) {
        setDangTai(false);
      }
    }
  };

  const taiDanhSachGoc = () => {
    layDanhSachDanhMuc({ trang: 1, gioihan: 200, danhmuccha_id: 0 })
      .then((kq) => setDanhSachGoc(kq.dulieu.danhsach || []))
      .catch(() => {});
  };

  // Tải danh sách danh mục gốc để dùng cho filter toolbar và dropdown chọn cha
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { taiDanhSachGoc(); }, []);

  // eslint-disable-next-line react-hooks/exhaustive-deps, react-hooks/set-state-in-effect
  useEffect(() => { taiDanhSach(boLoc); }, [boLoc.trang, boLoc.trangthai, boLoc.danhmuccha_id, boLoc.hienthixoa]);

  useEffect(() => {
    const timer = setTimeout(() => {
      taiDanhSach({ ...boLoc, trang: 1 });
    }, 350);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [boLoc.timkiem]);

  const capNhatBoLoc = (event) => {
    const { name, value, type, checked } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: type === "checkbox" ? checked : value,
      trang: name === "hienthixoa" ? cu.trang : 1,
    }));
  };

  const moThem = () => {
    setCheDoModal("them");
    setDuLieuSua(null);
    setModalMo(true);
  };

  const moSua = (item) => {
    setCheDoModal("sua");
    setDuLieuSua(item);
    setModalMo(true);
  };

  const dongModal = () => {
    if (dangXuLy) return;

    setModalMo(false);
    setDuLieuSua(null);
  };

  const luuDanhMuc = async (duLieu) => {
    if (!duLieu.tendanhmuc) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    const { fileAnhMoi, ...payload } = duLieu;

    try {
      setDangXuLy(true);

      let ketQuaDm;
      if (cheDoModal === "them") {
        const phanHoi = await themDanhMuc(payload);
        ketQuaDm = phanHoi.dulieu;
        toast.success("Thêm danh mục thành công");
      } else {
        const phanHoi = await capNhatDanhMuc(duLieuSua.id, payload);
        ketQuaDm = phanHoi.dulieu;
        toast.success("Cập nhật danh mục thành công");
      }

      // Upload ảnh nếu có file mới chọn
      if (fileAnhMoi && ketQuaDm?.id) {
        try {
          await uploadAnhDanhMuc(ketQuaDm.id, fileAnhMoi);
          toast.success("Đã tải ảnh danh mục lên");
        } catch (loiUpload) {
          console.error("Lỗi upload ảnh:", loiUpload);
          toast.error("Lưu danh mục thành công nhưng không upload được ảnh");
        }
      }

      dongModal();
      await taiDanhSach();
      taiDanhSachGoc();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không lưu được danh mục";

      console.error("[DanhMuc] Lỗi lưu danh mục:", loi);
      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const doiTrangThai = async (item) => {
    if (item.daxoa) {
      toast.error("Danh mục đã xóa mềm, không thể đổi trạng thái");
      return;
    }

    if (dangDoiTrangThaiId === item.id) {
      return;
    }

    const trangThaiCu = item.trangthai;
    const trangThaiMoi = item.trangthai === "hien_thi" ? "an" : "hien_thi";

    try {
      setDangDoiTrangThaiId(item.id);

      // Đổi trước trên UI để switch nhảy ngay
      setDanhSach((danhSachCu) =>
        danhSachCu.map((dm) =>
          dm.id === item.id
            ? {
                ...dm,
                trangthai: trangThaiMoi,
              }
            : dm
        )
      );

      const ketQua = await capNhatTrangThaiDanhMuc(item.id, trangThaiMoi);

      const duLieuMoi = ketQua?.dulieu;

      // Lấy trạng thái thật backend trả về để set lại cho chắc
      if (duLieuMoi?.id) {
        setDanhSach((danhSachCu) =>
          danhSachCu.map((dm) =>
            dm.id === duLieuMoi.id
              ? {
                  ...dm,
                  ...duLieuMoi,
                }
              : dm
          )
        );
      }

      toast.success(
        (duLieuMoi?.trangthai || trangThaiMoi) === "hien_thi"
          ? "Đã bật hiển thị danh mục"
          : "Đã ẩn danh mục"
      );
    } catch (loi) {
      // Nếu lỗi thì trả về trạng thái cũ
      setDanhSach((danhSachCu) =>
        danhSachCu.map((dm) =>
          dm.id === item.id
            ? {
                ...dm,
                trangthai: trangThaiCu,
              }
            : dm
        )
      );

      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được trạng thái";

      console.error("[DanhMuc] Lỗi đổi trạng thái:", loi);
      toast.error(thongBao);
    } finally {
      setDangDoiTrangThaiId(null);
    }
  };

  const moXoa = (item) => {
    setDanhMucDangXoa(item);
    setModalXoaMo(true);
  };

  const dongModalXoa = () => {
    if (dangXuLy) return;

    setDanhMucDangXoa(null);
    setModalXoaMo(false);
  };

  const xacNhanXoa = async () => {
    if (!danhMucDangXoa) return;

    try {
      setDangXuLy(true);

      await xoaDanhMuc(danhMucDangXoa.id);

      toast.success("Xóa danh mục thành công");

      dongModalXoa();
      await taiDanhSach();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa được danh mục";

      console.error("[DanhMuc] Lỗi xóa danh mục:", loi);
      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const khoiPhuc = async (item) => {
    if (!item?.daxoa || dangKhoiPhucId === item.id) {
      return;
    }

    try {
      setDangKhoiPhucId(item.id);

      await khoiPhucDanhMuc(item.id);

      toast.success("Khôi phục danh mục thành công");
      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không khôi phục được danh mục";

      console.error("[DanhMuc] Lỗi khôi phục danh mục:", loi);
      toast.error(thongBao);
    } finally {
      setDangKhoiPhucId(null);
    }
  };

  const moXoaVinhVien = (item) => {
    if (!item?.daxoa) {
      toast.error("Chỉ có thể xóa vĩnh viễn danh mục đã xóa mềm");
      return;
    }

    setDanhMucDangXoaVinhVien(item);
    setModalXoaVinhVienMo(true);
  };

  const dongModalXoaVinhVien = () => {
    if (dangXuLy) return;

    setDanhMucDangXoaVinhVien(null);
    setModalXoaVinhVienMo(false);
  };

  const xacNhanXoaVinhVien = async () => {
    if (!danhMucDangXoaVinhVien) return;

    try {
      setDangXuLy(true);

      await xoaVinhVienDanhMuc(danhMucDangXoaVinhVien.id);

      toast.success("Xóa vĩnh viễn danh mục thành công");
      dongModalXoaVinhVien();
      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa vĩnh viễn được danh mục";

      console.error("[DanhMuc] Lỗi xóa vĩnh viễn danh mục:", loi);
      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const lamMoiDuLieu = async () => {
    await taiDanhSach();
    toast.success("Đã làm mới dữ liệu danh mục");
  };

  const boChonTatCa = () => {
    setIdsDangChon([]);
  };

  const bulkDoiTrangThai = async (trangthai) => {
    if (idsDangChon.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await bulkCapNhatTrangThaiDanhMuc(idsDangChon, trangthai);

      setKetQuaBulk(ketQua.dulieu);
      setModalKetQuaBulkMo(true);

      setIdsDangChon([]);
      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được danh mục đã chọn";

      console.error("[DanhMuc] Lỗi bulk đổi trạng thái:", loi);
      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const xacNhanBulkXoa = async () => {
    if (idsDangChon.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await bulkXoaDanhMuc(idsDangChon);

      setKetQuaBulk(ketQua.dulieu);
      setModalKetQuaBulkMo(true);

      setIdsDangChon([]);
      setModalBulkXoaMo(false);

      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa được danh mục đã chọn";

      console.error("[DanhMuc] Lỗi bulk xóa:", loi);
      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const idsCoTheChon = danhSach
    .filter((item) => !item.daxoa)
    .map((item) => item.id);

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

  const batTatChonMotDong = (itemId) => {
    setIdsDangChon((cu) =>
      cu.includes(itemId)
        ? cu.filter((id) => id !== itemId)
        : [...cu, itemId]
    );
  };

  const chuyenTrang = (trangMoi) => {
    const tongSoTrang = phanTrang.tongsotrang || 1;

    if (trangMoi < 1 || trangMoi > tongSoTrang || trangMoi === boLoc.trang) {
      return;
    }

    setIdsDangChon([]);
    setBoLoc((cu) => ({
      ...cu,
      trang: trangMoi,
    }));
  };

  // ─── Inline thứ tự ───────────────────────────────────────────────────────────

  const batDauSuaThuTu = (item) => {
    if (item.daxoa) return;
    setThutuDangSuaId(item.id);
    setThutuInputGiaTri(String(item.thutu));
  };

  const huyySuaThuTu = () => {
    setThutuDangSuaId(null);
    setThutuInputGiaTri("");
  };

  const luuThuTu = async (item, giaTri) => {
    const soMoi = parseInt(giaTri, 10);
    if (isNaN(soMoi) || soMoi < 0) {
      toast.error("Thứ tự phải là số nguyên không âm");
      return;
    }
    if (soMoi === item.thutu) {
      huyySuaThuTu();
      return;
    }

    try {
      setThutuDangLuuId(item.id);
      const ketQua = await capNhatThuTuDanhMuc(item.id, soMoi);
      const duLieuMoi = ketQua?.dulieu;

      setDanhSach((cu) =>
        cu.map((dm) =>
          dm.id === item.id ? { ...dm, thutu: duLieuMoi?.thutu ?? soMoi } : dm
        )
      );

      toast.success("Đã cập nhật thứ tự");
      huyySuaThuTu();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được thứ tự";
      toast.error(thongBao);
    } finally {
      setThutuDangLuuId(null);
    }
  };

  const doiThuTuNhanh = async (item, huong) => {
    if (item.daxoa || thutuDangLuuId === item.id) return;
    const soMoi = item.thutu + huong;
    if (soMoi < 0) return;

    try {
      setThutuDangLuuId(item.id);
      const ketQua = await capNhatThuTuDanhMuc(item.id, soMoi);
      const duLieuMoi = ketQua?.dulieu;

      setDanhSach((cu) =>
        cu.map((dm) =>
          dm.id === item.id ? { ...dm, thutu: duLieuMoi?.thutu ?? soMoi } : dm
        )
      );

      // Reload để đúng thứ tự từ backend
      await taiDanhSach(boLoc, { hienLoading: false });
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được thứ tự";
      toast.error(thongBao);
    } finally {
      setThutuDangLuuId(null);
    }
  };

  return (
    <div className="trang-danh-muc-admin">
      <div className="breadcrumb-danh-muc">
        <span className="breadcrumb-link">Trang chủ</span>
        <span className="breadcrumb-sep">/</span>
        <span className="breadcrumb-hientai">Danh mục</span>
      </div>
      <div className="dau-trang-danh-muc">
        <div>
          <h1>Danh mục sản phẩm</h1>
          <p>Quản lý danh mục để phân loại sản phẩm trên website.</p>
        </div>
      </div>
      <div className="thanh-danh-muc">
        <div className="bo-loc-card-danh-muc">
          <div className="o-tim-danh-muc">
            <Search size={18} />
            <input
              name="timkiem"
              value={boLoc.timkiem}
              onChange={capNhatBoLoc}
              placeholder="Tìm theo tên danh mục hoặc đường dẫn..."
            />
          </div>

          <div className="cum-loc-danh-muc">
            <div className="select-loc-wrap">
              <select
                name="danhmuccha_id"
                value={boLoc.danhmuccha_id}
                onChange={capNhatBoLoc}
              >
                <option value="">Tất cả danh mục cha</option>
                <option value="0">Danh mục gốc</option>
                {danhSachGoc.map((dm) => (
                  <option key={dm.id} value={dm.id}>
                    {dm.tendanhmuc}
                  </option>
                ))}
              </select>
            </div>

            <div className="select-loc-wrap">
              <select
                name="trangthai"
                value={boLoc.trangthai}
                onChange={capNhatBoLoc}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="hien_thi">Hiển thị</option>
                <option value="an">Đang ẩn</option>
              </select>
            </div>

            <label className="checkbox-xoa-mem-moi">
              <input
                type="checkbox"
                name="hienthixoa"
                checked={boLoc.hienthixoa}
                onChange={capNhatBoLoc}
              />
              <span>Hiển thị đã xóa</span>
            </label>

            <button
              type="button"
              className="nut-lam-moi-danh-muc"
              onClick={lamMoiDuLieu}
            >
              <RefreshCw size={16} />
              <span>Làm mới</span>
            </button>

            <button
              type="button"
              className="nut-them-danh-muc-moi"
              onClick={moThem}
            >
              <Plus size={18} />
              <span>Thêm danh mục</span>
            </button>
          </div>
        </div>
      </div>

      {idsDangChon.length > 0 && (
        <div className="thanh-bulk-danh-muc">
          <div>
            Đã chọn <strong>{idsDangChon.length}</strong> danh mục
          </div>

          <div className="hanh-dong-bulk-danh-muc">
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
              Ẩn danh mục
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

      {loiTaiDuLieu && (
        <div className="thong-bao-loi-bang">
          <span>Lỗi: {loiTaiDuLieu}</span>
          <button type="button" onClick={lamMoiDuLieu}>Thử lại</button>
        </div>
      )}

      {dangTai ? (
        <BangDangTai soCot={9} soDong={6} />
      ) : danhSach.length === 0 ? (
        <BangTrong
          tieuDe="Chưa có danh mục nào"
          moTa="Hãy tạo danh mục đầu tiên cho hệ thống bán hàng."
        />
      ) : (
        <div className="khung-bang">
          <div className="bang-responsive">
            <table className="bang-du-lieu">
              <thead>
                <tr>
                  <th style={{ width: 48 }}>
                    <input
                      type="checkbox"
                      checked={daChonTatCa}
                      onChange={batTatChonTatCa}
                    />
                  </th>
                  <th style={{ width: 70 }}>STT</th>
                  <th style={{ width: 80 }}>Ảnh</th>
                  <th style={{ width: 160 }}>Tên danh mục</th>
                  <th>Mô tả</th>
                  <th style={{ width: 140 }}>Danh mục cha</th>
                  <th style={{ width: 110 }}>Số sản phẩm</th>
                  <th style={{ width: 80 }}>Thứ tự</th>
                  <th className="trang-thai-col" style={{ width: 110 }}>
                    Trạng thái
                  </th>
                  <th style={{ width: 120 }}>Ngày tạo</th>
                  <th style={{ width: 100 }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSach.map((item, index) => (
                  <tr key={item.id}>
                    <td>
                      <input
                        type="checkbox"
                        disabled={item.daxoa}
                        checked={idsDangChon.includes(item.id)}
                        onChange={() => batTatChonMotDong(item.id)}
                      />
                    </td>
                    <td>
                      {(phanTrang.trang - 1) * phanTrang.gioihan + index + 1}
                    </td>
                    <td>
                      <div className="anh-thumbnail-danhmuc" style={{ width: "40px", height: "40px", borderRadius: "6px", overflow: "hidden", background: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                        {item.hinhanh ? (
                          <img src={layUrlAnh(item.hinhanh)} alt={item.tendanhmuc} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                        ) : (
                          <span style={{ fontSize: "10px", color: "#94a3b8" }}>No img</span>
                        )}
                      </div>
                    </td>

                    <td>
                      <div
                        style={{
                          paddingLeft: `${getDepthDanhMuc(item.id, danhSach, danhSachGoc)}px`,
                        }}
                        className="ten-danh-muc-indent"
                      >
                        <strong>{item.tendanhmuc}</strong>
                      </div>
                    </td>

                    <td className="mo-ta-col">
                      {item.mota || <span className="chu-phu">—</span>}
                    </td>

                    <td>
                      {item.tendanhmuccha || <span className="chu-phu">—</span>}
                    </td>

                    <td>
                      {item.sosanpham > 0 ? (
                        <button
                          type="button"
                          className="so-lieu-text lien-ket-so-sp"
                          onClick={() => dieuHuong(`/admin/sanpham?danhmuc_id=${item.id}`)}
                          title={`Xem ${item.sosanpham} sản phẩm trong "${item.tendanhmuc}"`}
                        >
                          {item.sosanpham}
                        </button>
                      ) : (
                        <span className="so-lieu-text so-lieu-trong">0</span>
                      )}
                    </td>

                    <td className="thutu-col">
                      {thutuDangSuaId === item.id ? (
                        <div className="thutu-inline-edit">
                          <input
                            id={`thutu-input-${item.id}`}
                            type="number"
                            min="0"
                            className="thutu-input"
                            value={thutuInputGiaTri}
                            autoFocus
                            disabled={thutuDangLuuId === item.id}
                            onChange={(e) => setThutuInputGiaTri(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") luuThuTu(item, thutuInputGiaTri);
                              if (e.key === "Escape") huyySuaThuTu();
                            }}
                            onBlur={() => luuThuTu(item, thutuInputGiaTri)}
                          />
                        </div>
                      ) : (
                        <div className="thutu-hien-thi">
                          <div className="thutu-nut-nhom">
                            <button
                              type="button"
                              className="nut-thutu-di-chuyen"
                              title="Tăng thứ tự (xuống dưới)"
                              disabled={item.daxoa || thutuDangLuuId === item.id}
                              onClick={() => doiThuTuNhanh(item, 1)}
                            >
                              <ChevronDown size={13} />
                            </button>
                            <button
                              type="button"
                              className="nut-thutu-di-chuyen"
                              title="Giảm thứ tự (lên trên)"
                              disabled={item.daxoa || item.thutu <= 0 || thutuDangLuuId === item.id}
                              onClick={() => doiThuTuNhanh(item, -1)}
                            >
                              <ChevronUp size={13} />
                            </button>
                          </div>
                          <span
                            className={`thutu-so ${item.daxoa ? "" : "co-the-click"}`}
                            title={item.daxoa ? "" : "Nhấp để chỉnh thứ tự"}
                            onClick={() => !item.daxoa && batDauSuaThuTu(item)}
                          >
                            {thutuDangLuuId === item.id ? "..." : item.thutu}
                          </span>
                        </div>
                      )}
                    </td>

                    <td className="trang-thai-col">
                      <button
                        type="button"
                        className={`nut-toggle-trang-thai ${
                          item.trangthai === "hien_thi" ? "bat" : "tat"
                        } ${dangDoiTrangThaiId === item.id ? "dang-doi" : ""}`}
                        title={item.trangthai === "hien_thi" ? "Đang hiển thị" : "Đang ẩn"}
                        disabled={item.daxoa || dangDoiTrangThaiId === item.id}
                        onClick={() => doiTrangThai(item)}
                      >
                        <span className="toggle-thumb"></span>
                      </button>
                    </td>

                    <td>
                      {item.created_at
                        ? new Date(item.created_at).toLocaleDateString("vi-VN")
                        : "—"}
                    </td>

                    <td>
                      <div className="nhom-thao-tac-icon">
                        {item.daxoa && (
                          <button
                            type="button"
                            className="nut-icon-tron"
                            title="Khôi phục danh mục"
                            disabled={dangKhoiPhucId === item.id || dangXuLy}
                            onClick={() => khoiPhuc(item)}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}

                        {item.daxoa && (
                          <button
                            type="button"
                            className="nut-icon-tron nguy-hiem"
                            title="Xóa vĩnh viễn danh mục"
                            disabled={dangXuLy}
                            onClick={() => moXoaVinhVien(item)}
                          >
                            <Trash2 size={16} />
                          </button>
                        )}

                        <button
                          type="button"
                          className="nut-icon-tron"
                          title="Sửa danh mục"
                          disabled={item.daxoa}
                          onClick={() => moSua(item)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="nut-icon-tron nguy-hiem"
                          title="Xóa danh mục"
                          disabled={item.daxoa}
                          onClick={() => moXoa(item)}
                        >
                          <Trash2 size={16} />
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
              <div>
                Hiển thị <strong>{danhSach.length}</strong> trên{" "}
                <strong>{phanTrang.tongsodong}</strong> danh mục
              </div>

              <div className="nut-phan-trang">
                <button
                  type="button"
                  disabled={phanTrang.trang <= 1}
                  onClick={() => chuyenTrang(phanTrang.trang - 1)}
                >
                  Trước
                </button>

                <span>
                  Trang {phanTrang.trang} / {phanTrang.tongsotrang || 1}
                </span>

                <button
                  type="button"
                  disabled={phanTrang.trang >= (phanTrang.tongsotrang || 1)}
                  onClick={() => chuyenTrang(phanTrang.trang + 1)}
                >
                  Sau
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <DanhMucModal
        mo={modalMo}
        cheDo={cheDoModal}
        duLieuSua={duLieuSua}
        danhSachDanhMuc={danhSachGoc}
        dangXuLy={dangXuLy}
        onDong={dongModal}
        onLuu={luuDanhMuc}
      />

      <XacNhanModal
        mo={modalXoaMo}
        tieuDe="Xóa danh mục"
        moTa={`Bạn có chắc muốn xóa danh mục "${
          danhMucDangXoa?.tendanhmuc || ""
        }" không?`}
        noiDung={
          danhMucDangXoa
            ? `Danh mục này hiện có ${danhMucDangXoa.sosanpham} sản phẩm và ${danhMucDangXoa.sodanhmuccon} danh mục con. Nếu còn dữ liệu liên quan, hệ thống sẽ không cho xóa.`
            : ""
        }
        tenNutXacNhan="Xóa danh mục"
        dangXuLy={dangXuLy}
        onDong={dongModalXoa}
        onXacNhan={xacNhanXoa}
      />

      <XacNhanModal
        mo={modalXoaVinhVienMo}
        tieuDe="Xóa vĩnh viễn danh mục"
        moTa={`Bạn có chắc muốn xóa vĩnh viễn danh mục "${
          danhMucDangXoaVinhVien?.tendanhmuc || ""
        }" không?`}
        noiDung="Thao tác này sẽ xóa thật bản ghi khỏi cơ sở dữ liệu và không thể khôi phục."
        tenNutXacNhan="Xóa vĩnh viễn"
        dangXuLy={dangXuLy}
        onDong={dongModalXoaVinhVien}
        onXacNhan={xacNhanXoaVinhVien}
      />

       <XacNhanModal
        mo={modalBulkXoaMo}
        tieuDe="Xóa nhiều danh mục"
        moTa={`Bạn có chắc muốn xóa ${idsDangChon.length} danh mục đã chọn không?`}
        noiDung="Nếu danh mục đang có sản phẩm hoặc danh mục con, hệ thống sẽ không cho xóa danh mục đó."
        tenNutXacNhan="Xóa đã chọn"
        dangXuLy={dangXuLy}
        onDong={() => setModalBulkXoaMo(false)}
        onXacNhan={xacNhanBulkXoa}
       />

       <KetQuaBulkModal
        mo={modalKetQuaBulkMo}
        ketQua={ketQuaBulk}
        onDong={() => {
          setModalKetQuaBulkMo(false);
          setKetQuaBulk(null);
        }}
       />
    </div>
  );
}
