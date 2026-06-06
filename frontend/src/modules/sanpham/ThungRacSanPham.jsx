import { useEffect, useState } from "react";
import { Search, RotateCcw, Trash2, X, PackageX, AlertTriangle } from "lucide-react";
import toast from "react-hot-toast";
import { layUrlAnh } from "../../api/ketnoiapi";
import XacNhanModal from "../../components/ui/XacNhanModal";
import { formatTienVietNam } from "../../utils/dinhtien";

import {
  layDanhSachSanPhamDaXoa,
  khoiPhucSanPham,
  xoaVinhVienSanPham,
} from "../../api/sanphamApi";

function hienThiNgay(value) {
  if (!value) return "—";
  try {
    return new Date(value).toLocaleString("vi-VN", {
      day: "2-digit", month: "2-digit", year: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  } catch {
    return value;
  }
}

export default function ThungRacSanPham({ mo, onDong, onKhoiPhucXong }) {
  const [dangTai, setDangTai] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [danhSach, setDanhSach] = useState([]);
  const [phanTrang, setPhanTrang] = useState({ trang: 1, gioihan: 10, tongsodong: 0, tongsotrang: 1 });
  const [boLoc, setBoLoc] = useState({ timkiem: "", trang: 1, gioihan: 10 });
  const [modalXoaMo, setModalXoaMo] = useState(false);
  const [modalKhoiPhucMo, setModalKhoiPhucMo] = useState(false);
  const [sanPhamDangChon, setSanPhamDangChon] = useState(null);

  const taiDanhSach = async (thamSo) => {
    try {
      setDangTai(true);
      const ketQua = await layDanhSachSanPhamDaXoa(thamSo);
      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không tải được danh sách");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    if (!mo) return;
    const macDinh = { timkiem: "", trang: 1, gioihan: 10 };
    setBoLoc(macDinh);
    taiDanhSach(macDinh);
  }, [mo]);

  useEffect(() => {
    if (!mo) return;
    const timer = setTimeout(() => taiDanhSach({ ...boLoc, trang: 1 }), 350);
    return () => clearTimeout(timer);
  }, [boLoc.timkiem]);

  useEffect(() => {
    if (!mo) return;
    taiDanhSach(boLoc);
  }, [boLoc.trang]);

  const xacNhanKhoiPhuc = async () => {
    if (!sanPhamDangChon) return;
    try {
      setDangXuLy(true);
      await khoiPhucSanPham(sanPhamDangChon.id);
      toast.success("Đã khôi phục sản phẩm");
      setModalKhoiPhucMo(false);
      setSanPhamDangChon(null);
      await taiDanhSach(boLoc);
      onKhoiPhucXong?.();
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không khôi phục được");
    } finally {
      setDangXuLy(false);
    }
  };

  const xacNhanXoaVinhVien = async () => {
    if (!sanPhamDangChon) return;
    try {
      setDangXuLy(true);
      await xoaVinhVienSanPham(sanPhamDangChon.id);
      toast.success("Đã xóa vĩnh viễn sản phẩm");
      setModalXoaMo(false);
      setSanPhamDangChon(null);
      await taiDanhSach(boLoc);
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không xóa được");
    } finally {
      setDangXuLy(false);
    }
  };

  if (!mo) return null;

  return (
    <>
      <div className="modal-phu">
        <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

        <div className="tr-modal">
          {/* ── Header ── */}
          <div className="tr-header">
            <div className="tr-header-trai">
              <div className="tr-header-icon">
                <Trash2 size={18} />
              </div>
              <div>
                <h3 className="tr-header-tieu-de">Thùng rác sản phẩm</h3>
                <p className="tr-header-mo-ta">Khôi phục hoặc xóa vĩnh viễn sản phẩm đã xóa</p>
              </div>
            </div>
            <button type="button" className="tr-nut-dong" disabled={dangXuLy} onClick={onDong}>
              <X size={18} />
            </button>
          </div>

          {/* ── Toolbar ── */}
          <div className="tr-toolbar">
            <div className="tr-o-tim">
              <Search size={15} />
              <input
                value={boLoc.timkiem}
                onChange={(e) => setBoLoc((cu) => ({ ...cu, timkiem: e.target.value, trang: 1 }))}
                placeholder="Tìm tên, mã sản phẩm..."
              />
            </div>
            {phanTrang.tongsodong > 0 && (
              <span className="tr-dem">{phanTrang.tongsodong} sản phẩm</span>
            )}
          </div>

          {/* ── Body ── */}
          <div className="tr-body">
            {dangTai ? (
              <div className="tr-dang-tai">
                <div className="tr-spinner" />
                <span>Đang tải...</span>
              </div>
            ) : danhSach.length === 0 ? (
              <div className="tr-rong">
                <div className="tr-rong-icon"><PackageX size={40} strokeWidth={1.5} /></div>
                <p className="tr-rong-tieu-de">Thùng rác trống</p>
                <p className="tr-rong-mo-ta">Không có sản phẩm nào trong thùng rác</p>
              </div>
            ) : (
              <table className="tr-bang">
                <thead>
                  <tr>
                    <th>Sản phẩm</th>
                    <th>Giá bán</th>
                    <th>Tồn kho</th>
                    <th>Ngày xóa</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {danhSach.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="tr-sp-info">
                          <div className="tr-sp-anh">
                            {item.hinhanh
                              ? <img src={layUrlAnh(item.hinhanh)} alt={item.tensanpham} />
                              : <span>?</span>
                            }
                          </div>
                          <div className="tr-sp-text">
                            <span className="tr-sp-ten">{item.tensanpham}</span>
                            <span className="tr-sp-ma">#{item.madinhdanh}{item.sku ? ` · ${item.sku}` : ""}</span>
                          </div>
                        </div>
                      </td>
                      <td className="tr-td-gia">{formatTienVietNam(item.giaban)}</td>
                      <td className="tr-td-ton">{item.soluongton}</td>
                      <td className="tr-td-ngay">{hienThiNgay(item.deleted_at)}</td>
                      <td>
                        <div className="tr-nhom-nut">
                          <button
                            type="button"
                            className="tr-nut tr-nut--khoi-phuc"
                            title="Khôi phục"
                            disabled={dangXuLy}
                            onClick={() => { setSanPhamDangChon(item); setModalKhoiPhucMo(true); }}
                          >
                            <RotateCcw size={14} />
                            <span>Khôi phục</span>
                          </button>
                          <button
                            type="button"
                            className="tr-nut tr-nut--xoa"
                            title="Xóa vĩnh viễn"
                            disabled={dangXuLy}
                            onClick={() => { setSanPhamDangChon(item); setModalXoaMo(true); }}
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* ── Phân trang ── */}
          {!dangTai && phanTrang.tongsotrang > 1 && (
            <div className="tr-phan-trang">
              <span className="tr-pt-info">
                {(phanTrang.trang - 1) * phanTrang.gioihan + 1}–{Math.min(phanTrang.trang * phanTrang.gioihan, phanTrang.tongsodong)} / {phanTrang.tongsodong}
              </span>
              <div className="tr-pt-nhom">
                <button className="tr-pt-nut" disabled={phanTrang.trang === 1} onClick={() => setBoLoc(cu => ({ ...cu, trang: cu.trang - 1 }))}>‹</button>
                <span className="tr-pt-trang">Trang {phanTrang.trang} / {phanTrang.tongsotrang}</span>
                <button className="tr-pt-nut" disabled={phanTrang.trang === phanTrang.tongsotrang} onClick={() => setBoLoc(cu => ({ ...cu, trang: cu.trang + 1 }))}>›</button>
              </div>
            </div>
          )}
        </div>
      </div>

      <XacNhanModal
        mo={modalKhoiPhucMo}
        tieuDe="Khôi phục sản phẩm"
        moTa={`Khôi phục "${sanPhamDangChon?.tensanpham}" về danh sách chính?`}
        tenNutXacNhan="Khôi phục"
        bienThe="chinh"
        dangXuLy={dangXuLy}
        onDong={() => { if (!dangXuLy) setModalKhoiPhucMo(false); }}
        onXacNhan={xacNhanKhoiPhuc}
      />

      <XacNhanModal
        mo={modalXoaMo}
        tieuDe="Xóa vĩnh viễn"
        moTa={`Xóa vĩnh viễn "${sanPhamDangChon?.tensanpham}"?`}
        noiDung="Hành động này không thể hoàn tác."
        tenNutXacNhan="Xóa vĩnh viễn"
        dangXuLy={dangXuLy}
        onDong={() => { if (!dangXuLy) setModalXoaMo(false); }}
        onXacNhan={xacNhanXoaVinhVien}
      />
    </>
  );
}
