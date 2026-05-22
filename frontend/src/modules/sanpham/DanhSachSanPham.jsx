import { useEffect, useState } from "react";
import {
  ImageOff,
  Pencil,
  Plus,
  Search,
  SlidersHorizontal,
  Trash2,
} from "lucide-react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import NutBam from "../../components/ui/NutBam";
import useGiaoDienStore from "../../stores/giaodienStore";
import { formatTienVietNam } from "../../utils/dinhtien";
import { layDanhSachDanhMuc } from "../../api/danhmucApi";
import SanPhamModal from "./SanPhamModal";
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
} from "../../api/sanphamApi";

export default function DanhSachSanPham() {
  const capNhatTieuDeTrang = useGiaoDienStore((state) => state.capNhatTieuDeTrang);
  const [dangTai, setDangTai] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [dangDoiTrangThaiId, setDangDoiTrangThaiId] = useState(null);
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [phanTrang, setPhanTrang] = useState({ trang: 1, gioihan: 10, tongsodong: 0, tongsotrang: 1 });
  const [boLoc, setBoLoc] = useState({
    timkiem: "",
    trangthai: "",
    danhmuc_id: "",
    tonkho: "",
    sanpham: "",
    giatu: "",
    giaden: "",
    sapxep: "moi_nhat",
    trang: 1,
    gioihan: 10,
  });
  const [moLocNangCao, setMoLocNangCao] = useState(false);
  const [modalMo, setModalMo] = useState(false);
  const [cheDoModal, setCheDoModal] = useState("them");
  const [duLieuSua, setDuLieuSua] = useState(null);
  const [idsDangChon, setIdsDangChon] = useState([]);
  const [modalBulkXoaMo, setModalBulkXoaMo] = useState(false);

  useEffect(() => {
    capNhatTieuDeTrang(
      "Quản lý sản phẩm",
      "Quản lý sản phẩm, giá bán, tồn kho, ảnh và trạng thái hiển thị"
    );
  }, [capNhatTieuDeTrang]);
  useEffect(() => { taiDanhMuc(); }, []);
  useEffect(() => {
    const timer = setTimeout(() => {
      taiDanhSach(
        {
          ...boLoc,
          trang: 1,
        },
        { hienLoading: true }
      );
    }, 350);

    return () => clearTimeout(timer);
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

  useEffect(() => {
    taiDanhSach(boLoc, { hienLoading: true });
  }, [boLoc.trang]);

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

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: value,
      trang: 1,
    }));
  };

  const moThem = () => { setCheDoModal("them"); setDuLieuSua(null); setModalMo(true); };
  const moSua = (item) => { setCheDoModal("sua"); setDuLieuSua(item); setModalMo(true); };
  const dongModal = () => { if (dangXuLy) return; setModalMo(false); setDuLieuSua(null); };

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
          const duLieuMoi = chiTiet?.dulieu;
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
          const duLieuMoi = chiTiet?.dulieu;
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

  const xoa = async (item) => {
    const dongY = window.confirm(
      `Bạn có chắc muốn xóa sản phẩm "${item.tensanpham}" không?`
    );

    if (!dongY) return;

    try {
      await xoaSanPham(item.id);
      toast.success("Xóa sản phẩm thành công");
      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa được sản phẩm";

      toast.error(thongBao);
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

  const chuyenTrang = (trangMoi) => {
    if (trangMoi < 1 || trangMoi > phanTrang.tongsotrang) return;

    setBoLoc((cu) => ({
      ...cu,
      trang: trangMoi,
    }));
  };

  return (
    <div className="trang-san-pham-admin">
      <div className="dau-trang-san-pham">
        <div>
          <h1>Quản lý sản phẩm</h1>
          <p>Quản lý thông tin sản phẩm, giá bán, tồn kho và trạng thái hiển thị.</p>
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
                {danhSachDanhMuc.map((item) => (
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
              className={`nut-loc-nang-cao-san-pham ${
                moLocNangCao ? "dang-mo" : ""
              }`}
              onClick={() => setMoLocNangCao((cu) => !cu)}
            >
              <SlidersHorizontal size={16} />
              <span>Nâng cao</span>
            </button>

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
                  <option value="moi_nhat">Mới nhất</option>
                  <option value="cu_nhat">Cũ nhất</option>
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
                  <th style={{ width: 48 }}>
                    <input
                      type="checkbox"
                      checked={daChonTatCa}
                      onChange={batTatChonTatCa}
                    />
                  </th>
                  <th style={{ width: 80 }}>Ảnh</th>
                  <th>Sản phẩm</th>
                  <th style={{ width: 170 }}>Danh mục</th>
                  <th style={{ width: 160 }}>Giá bán</th>
                  <th style={{ width: 110 }}>Tồn kho</th>
                  <th style={{ width: 130 }}>Trạng thái</th>
                  <th style={{ width: 160 }}>Thao tác</th>
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
                          src={`http://localhost:8080${item.hinhanh}`}
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
                        <span>{item.madinhdanh}</span>
                      </div>
                    </td>
                    <td>
                      {item.tendanhmuc ? (
                        item.tendanhmuc
                      ) : (
                        <span className="chu-phu">Chưa phân loại</span>
                      )}
                    </td>
                    <td>
                      <div className="cot-gia-san-pham">
                        {item.giakhuyenmai ? (
                          <>
                            <strong>{formatTienVietNam(item.giakhuyenmai)}</strong>
                            <span>{formatTienVietNam(item.giaban)}</span>
                          </>
                        ) : (
                          <strong>{formatTienVietNam(item.giaban)}</strong>
                        )}
                      </div>
                    </td>
                    <td>
                      <div className="ton-kho">
                        <strong>{item.soluongton}</strong>
                        <span>sản phẩm</span>
                      </div>
                    </td>
                    <td className="trang-thai-col">
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
                    </td>
                    <td>
                      <div className="nhom-nut-thao-tac">
                        <button
                          type="button"
                          className="nut-icon"
                          title="Sửa sản phẩm"
                          onClick={() => moSua(item)}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="nut-icon nguy-hiem"
                          title="Xóa sản phẩm"
                          onClick={() => xoa(item)}
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
          {phanTrang.tongsodong > 10 && (
            <div className="phan-trang">
              <div>
                Hiển thị <strong>{danhSach.length}</strong> trên{" "} 
                <strong>{phanTrang.tongsodong}</strong> sản phẩm
              </div>

              <div className="nut-phan-trang">
                <button
                  disabled={phanTrang.trang <= 1}
                  onClick={() => chuyenTrang(phanTrang.trang - 1)}
                >
                  Trước
                </button>

                <span>
                  Trang {phanTrang.trang} / {phanTrang.tongsotrang}
                </span>

                <button
                  disabled={phanTrang.trang >= phanTrang.tongsotrang}
                  onClick={() => chuyenTrang(phanTrang.trang + 1)}
                >
                  Sau
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
        mo={modalBulkXoaMo}
        tieuDe="Xóa nhiều sản phẩm"
        moTa={`Bạn có chắc muốn xóa ${idsDangChon.length} sản phẩm đã chọn không?`}
        noiDung="Các sản phẩm sẽ được xóa mềm khỏi danh sách quản trị. Bạn nên kiểm tra kỹ trước khi thao tác."
        tenNutXacNhan="Xóa đã chọn"
        dangXuLy={dangXuLy}
        onDong={() => setModalBulkXoaMo(false)}
        onXacNhan={xacNhanBulkXoa}
      />
    </div>
  );
}
