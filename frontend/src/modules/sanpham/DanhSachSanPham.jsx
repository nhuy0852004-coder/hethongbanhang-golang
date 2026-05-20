import { useEffect, useState } from "react";
import { Edit, ImageOff, Plus, Power, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import NutBam from "../../components/ui/NutBam";
import TheTrangThai from "../../components/ui/TheTrangThai";
import useGiaoDienStore from "../../stores/giaodienStore";
import { formatTienVietNam } from "../../utils/dinhtien";
import { layDanhSachDanhMuc } from "../../api/danhmucApi";
import SanPhamModal from "./SanPhamModal";
import { capNhatSanPham, capNhatTrangThaiSanPham, layDanhSachSanPham, themSanPham, uploadAnhSanPham, xoaSanPham } from "../../api/sanphamApi";

export default function DanhSachSanPham() {
  const capNhatTieuDeTrang = useGiaoDienStore((state) => state.capNhatTieuDeTrang);
  const [dangTai, setDangTai] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [danhSach, setDanhSach] = useState([]);
  const [danhSachDanhMuc, setDanhSachDanhMuc] = useState([]);
  const [phanTrang, setPhanTrang] = useState({ trang: 1, gioihan: 10, tongsodong: 0, tongsotrang: 1 });
  const [boLoc, setBoLoc] = useState({ timkiem: "", trangthai: "", danhmuc_id: "", trang: 1, gioihan: 10 });
  const [modalMo, setModalMo] = useState(false);
  const [cheDoModal, setCheDoModal] = useState("them");
  const [duLieuSua, setDuLieuSua] = useState(null);

  useEffect(() => { capNhatTieuDeTrang("Quản lý sản phẩm", "Quản lý sản phẩm, giá bán, tồn kho, ảnh và trạng thái hiển thị"); }, [capNhatTieuDeTrang]);
  useEffect(() => { taiDanhMuc(); }, []);
  useEffect(() => { taiDanhSach(boLoc); }, [boLoc.trang, boLoc.trangthai, boLoc.danhmuc_id]);

  const taiDanhMuc = async () => {
    try {
      const ketQua = await layDanhSachDanhMuc({ trang: 1, gioihan: 100, trangthai: "hien_thi" });
      setDanhSachDanhMuc(ketQua.dulieu.danhsach || []);
    } catch {
      toast.error("Không tải được danh mục sản phẩm");
    }
  };

  const taiDanhSach = async (thamSo = boLoc) => {
    try {
      setDangTai(true);
      const ketQua = await layDanhSachSanPham(thamSo);
      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không tải được danh sách sản phẩm");
    } finally { setDangTai(false); }
  };

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;
    setBoLoc((cu) => ({ ...cu, [name]: value, trang: 1 }));
  };

  const timKiem = (event) => { event.preventDefault(); const locMoi = { ...boLoc, trang: 1 }; setBoLoc(locMoi); taiDanhSach(locMoi); };
  const moThem = () => { setCheDoModal("them"); setDuLieuSua(null); setModalMo(true); };
  const moSua = (item) => { setCheDoModal("sua"); setDuLieuSua(item); setModalMo(true); };
  const dongModal = () => { if (dangXuLy) return; setModalMo(false); setDuLieuSua(null); };

  const luuSanPham = async (duLieu, fileAnh) => {
    if (duLieu?.error) { toast.error(duLieu.error); return; }
    try {
      setDangXuLy(true);
      let ketQua;
      if (cheDoModal === "them") { ketQua = await themSanPham(duLieu); toast.success("Thêm sản phẩm thành công"); }
      else { ketQua = await capNhatSanPham(duLieuSua.id, duLieu); toast.success("Cập nhật sản phẩm thành công"); }
      const idSanPham = ketQua?.dulieu?.id || duLieuSua?.id;
      if (fileAnh && idSanPham) { await uploadAnhSanPham(idSanPham, fileAnh); toast.success("Upload ảnh sản phẩm thành công"); }
      dongModal(); await taiDanhSach(boLoc);
    } catch (loi) { toast.error(loi?.response?.data?.thongbao || "Không lưu được sản phẩm"); } finally { setDangXuLy(false); }
  };

  const doiTrangThai = async (item) => {
    const trangThaiMoi = item.trangthai === "hien_thi" ? "an" : "hien_thi";
    try { await capNhatTrangThaiSanPham(item.id, trangThaiMoi); toast.success("Cập nhật trạng thái thành công"); await taiDanhSach(boLoc); } catch (loi) { toast.error(loi?.response?.data?.thongbao || "Không cập nhật được trạng thái"); }
  };

  const xoa = async (item) => {
    if (!window.confirm(`Bạn có chắc muốn xóa sản phẩm "${item.tensanpham}" không?`)) return;
    try { await xoaSanPham(item.id); toast.success("Xóa sản phẩm thành công"); await taiDanhSach(boLoc); } catch (loi) { toast.error(loi?.response?.data?.thongbao || "Không xóa được sản phẩm"); }
  };

  const chuyenTrang = (trangMoi) => { if (trangMoi < 1 || trangMoi > phanTrang.tongsotrang) return; setBoLoc((cu) => ({ ...cu, trang: trangMoi })); };

  return (
    <div className="trang-san-pham-admin">
      <div className="thanh-cong-cu-trang">
        <form className="bo-loc-san-pham" onSubmit={timKiem}>
          <div className="o-tim-kiem-bang">
            <Search size={18} />
            <input
              name="timkiem"
              value={boLoc.timkiem}
              onChange={capNhatBoLoc}
              placeholder="Tìm theo tên sản phẩm hoặc mã định danh..."
            />
          </div>
          <select name="danhmuc_id" value={boLoc.danhmuc_id} onChange={capNhatBoLoc}>
            <option value="">Tất cả danh mục</option>
            {danhSachDanhMuc.map((item) => (
              <option key={item.id} value={item.id}>
                {item.tendanhmuc}
              </option>
            ))}
          </select>
          <select name="trangthai" value={boLoc.trangthai} onChange={capNhatBoLoc}>
            <option value="">Tất cả trạng thái</option>
            <option value="hien_thi">Hiển thị</option>
            <option value="an">Đang ẩn</option>
            <option value="het_hang">Hết hàng</option>
          </select>
          <NutBam type="submit" bienThe="phu">
            Tìm kiếm
          </NutBam>
        </form>
        <NutBam icon={Plus} onClick={moThem}>
          Thêm sản phẩm
        </NutBam>
      </div>
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
                    <td>
                      <TheTrangThai trangthai={item.trangthai} />
                    </td>
                    <td>
                      <div className="nhom-nut-thao-tac">
                        <button
                          type="button"
                          className="nut-icon"
                          title="Bật/tắt trạng thái"
                          onClick={() => doiTrangThai(item)}
                        >
                          <Power size={16} />
                        </button>
                        <button
                          type="button"
                          className="nut-icon"
                          title="Sửa sản phẩm"
                          onClick={() => moSua(item)}
                        >
                          <Edit size={16} />
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
          <div className="phan-trang">
            <div>
              Hiển thị <strong>{danhSach.length}</strong> trên <strong>{phanTrang.tongsodong}</strong> sản phẩm
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
                Trang {phanTrang.trang} / {phanTrang.tongsotrang}
              </span>
              <button
                type="button"
                disabled={phanTrang.trang >= phanTrang.tongsotrang}
                onClick={() => chuyenTrang(phanTrang.trang + 1)}
              >
                Sau
              </button>
            </div>
          </div>
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
    </div>
  );
}
