import { useCallback, useEffect, useState } from "react";
import {
  Eye,
  Pencil,
  Printer,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import useGiaoDienStore from "../../stores/giaodienStore";

import ChiTietDonHangModal from "./ChiTietDonHangModal";
import XuLyDonHangModal from "./XuLyDonHangModal";
import {
  capNhatXuLyDonHang,
  layChiTietDonHang,
  layDanhSachDonHang,
} from "../../api/donhangApi";
import {
  chuyenTienNhapThanhSo,
  formatTienNhap,
} from "../../utils/tienviet";


export default function DanhSachDonHang() {
  const capNhatTieuDeTrang = useGiaoDienStore(
    (state) => state.capNhatTieuDeTrang
  );

  const [dangTai, setDangTai] = useState(false);
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
  trangthaithanhtoan: "",
  tungay: "",
  denngay: "",
  tongtientu: "",
  tongtienden: "",
  phuongthucthanhtoan: "",
  sapxep: "moi_nhat",
  trang: 1,
  gioihan: 10,
});

  const [moLocNangCao, setMoLocNangCao] = useState(false);

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;

    setBoLoc((duLieuCu) => ({
      ...duLieuCu,
      [name]:
        name === "tongtientu" || name === "tongtienden"
          ? formatTienNhap(value)
          : value,
      trang: 1,
    }));
  };

  const [modalChiTietMo, setModalChiTietMo] = useState(false);
  const [donHangChiTiet, setDonHangChiTiet] = useState(null);
  const [chiTietDonHang, setChiTietDonHang] = useState([]);
  const [dangTaiChiTiet, setDangTaiChiTiet] = useState(false);

  const [modalXuLyMo, setModalXuLyMo] = useState(false);
  const [donHangDangXuLy, setDonHangDangXuLy] = useState(null);
  const [dangLuuXuLyDon, setDangLuuXuLyDon] = useState(false);

  const taiDanhSach = useCallback(async (
    thamSo = boLoc,
    tuyChon = {
      hienLoading: true,
    }
  ) => {
    try {
      if (tuyChon.hienLoading) {
        setDangTai(true);
      }

      const params = {
        ...thamSo,
        tongtientu: thamSo.tongtientu
          ? chuyenTienNhapThanhSo(thamSo.tongtientu)
          : "",
        tongtienden: thamSo.tongtienden
          ? chuyenTienNhapThanhSo(thamSo.tongtienden)
          : "",
      };

      const ketQua = await layDanhSachDonHang(params);

      setDanhSach(ketQua?.dulieu?.danhsach || []);
      setPhanTrang(
        ketQua?.dulieu?.phantrang || {
          trang: 1,
          gioihan: 10,
          tongsodong: 0,
          tongsotrang: 1,
        }
      );
    } catch (loi) {
      toast.error(
        loi?.response?.data?.thongbao || "Không tải được danh sách đơn hàng"
      );
    } finally {
      if (tuyChon.hienLoading) {
        setDangTai(false);
      }
    }
  }, [boLoc]);

  useEffect(() => {
    capNhatTieuDeTrang(
      "Quản lý đơn hàng",
      "Theo dõi đơn hàng, xem chi tiết và cập nhật trạng thái xử lý"
    );
  }, [capNhatTieuDeTrang]);

  useEffect(() => {
    const timer = setTimeout(() => {
      taiDanhSach(boLoc, {
        hienLoading: true,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [
    boLoc.timkiem,
    boLoc.trangthai,
    boLoc.trangthaithanhtoan,
    boLoc.tungay,
    boLoc.denngay,
    boLoc.tongtientu,
    boLoc.tongtienden,
    boLoc.phuongthucthanhtoan,
    boLoc.sapxep,
    boLoc.trang,
    taiDanhSach,
    boLoc,
  ]);

  


  const moChiTietDonHang = async (item) => {
    try {
      setModalChiTietMo(true);
      setDangTaiChiTiet(true);
      setDonHangChiTiet(item);
      setChiTietDonHang([]);

      const ketQua = await layChiTietDonHang(item.id);

      const duLieu = ketQua?.dulieu || {};
      const donHang =
        duLieu?.donhang ||
        duLieu?.donHang ||
        duLieu?.thongtin ||
        duLieu ||
        item;

      const chiTiet =
        duLieu?.chitiet ||
        duLieu?.chiTiet ||
        duLieu?.chitietdonhang ||
        duLieu?.sanpham ||
        duLieu?.danhsachsanpham ||
        donHang?.chitiet ||
        [];

      setDonHangChiTiet(donHang);
      setChiTietDonHang(Array.isArray(chiTiet) ? chiTiet : []);
    } catch (loi) {
      setDonHangChiTiet(item);
      setChiTietDonHang([]);

      toast.error(
        loi?.response?.data?.thongbao ||
          "Chưa tải được chi tiết đầy đủ, đang hiển thị thông tin cơ bản"
      );
    } finally {
      setDangTaiChiTiet(false);
    }
  };

  const dongChiTietDonHang = () => {
    setModalChiTietMo(false);
    setDonHangChiTiet(null);
    setChiTietDonHang([]);
  };

  const inDonHang = () => {
    window.print();
  };

  const formatTien = (value) => {
    const so = Number(value || 0);

    return so.toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    });
  };

  const formatNgay = (value) => {
    if (!value) return "Chưa có";

    const ngay = new Date(value);

    if (Number.isNaN(ngay.getTime())) {
      return "Chưa có";
    }

    return ngay.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const layMaDonHang = (item) => {
    return (
      item.madonhang ||
      item.madon ||
      item.ma_don_hang ||
      `DH${String(item.id || 0).padStart(6, "0")}`
    );
  };

  const layTenKhachHang = (item) => {
    return (
      item.tenkhachhang ||
      item.hoten ||
      item.tennguoinhan ||
      item.khachhang?.hoten ||
      "Khách lẻ"
    );
  };

  const laySoDienThoai = (item) => {
    return (
      item.sodienthoai ||
      item.sdt ||
      item.sodienthoainguoinhan ||
      item.khachhang?.sodienthoai ||
      "Chưa có"
    );
  };

  const laySoSanPham = (item) => {
    return (
      item.sosanpham ||
      item.tongsanpham ||
      item.chitiet?.length ||
      item.chitietdonhang?.length ||
      0
    );
  };

  const layTongTien = (item) => {
    return item.tongtien || item.tongthanhtoan || item.thanhtien || 0;
  };

  const layNgayDat = (item) => {
    return item.ngaydat || item.created_at || item.ngaytao || item.CreatedAt;
  };

  const hienThiTrangThaiDon = (trangThai) => {
    const danhSach = {
      cho_xac_nhan: "Chờ xác nhận",
      cho_xuly: "Chờ xác nhận",
      choxacnhan: "Chờ xác nhận",

      da_xac_nhan: "Đã xác nhận",
      daxacnhan: "Đã xác nhận",

      dang_chuan_bi: "Đang chuẩn bị",
      dangchuanbi: "Đang chuẩn bị",

      dang_giao: "Đang giao",
      dang_giao_hang: "Đang giao",
      danggiao: "Đang giao",

      hoan_thanh: "Hoàn thành",
      hoanthanh: "Hoàn thành",

      da_huy: "Đã hủy",
      dahuy: "Đã hủy",
    };

    return danhSach[trangThai] || "Chờ xác nhận";
  };

  const layTrangThaiDonHang = (item) => {
    return item.trangthai || item.trangthaidonhang || item.trang_thai || "cho_xac_nhan";
  };

  const hienThiThanhToan = (trangThai) => {
    const danhSach = {
      chua_thanh_toan: "Chưa thanh toán",
      da_thanh_toan: "Đã thanh toán",
      hoan_tien: "Hoàn tiền",
    };

    return danhSach[trangThai] || "Chưa thanh toán";
  };

  const moXuLyDonHang = (item) => {
    setDonHangDangXuLy(item);
    setModalXuLyMo(true);
  };

  const dongXuLyDonHang = () => {
    if (dangLuuXuLyDon) return;

    setModalXuLyMo(false);
    setDonHangDangXuLy(null);
  };

  const luuXuLyDonHang = async (duLieuGui) => {
    if (!donHangDangXuLy?.id) return;

    try {
      setDangLuuXuLyDon(true);

      await capNhatXuLyDonHang(donHangDangXuLy.id, duLieuGui);

      toast.success("Cập nhật xử lý đơn hàng thành công");

      setModalXuLyMo(false);
      setDonHangDangXuLy(null);

      await taiDanhSach(boLoc, {
        hienLoading: false,
      });

      if (modalChiTietMo && donHangChiTiet?.id === donHangDangXuLy.id) {
        await moChiTietDonHang(donHangDangXuLy);
      }
    } catch (loi) {
      toast.error(
        loi?.response?.data?.thongbao || "Không cập nhật được đơn hàng"
      );
    } finally {
      setDangLuuXuLyDon(false);
    }
  };

  const chuyenTrang = (trangMoi) => {
    if (trangMoi < 1 || trangMoi > (phanTrang.tongsotrang || 1)) return;

    setBoLoc((duLieuCu) => ({
      ...duLieuCu,
      trang: trangMoi,
    }));
  };

  return (
    <div className="trang-don-hang-admin">
      <div className="dau-trang-don-hang-admin">
        <div>
          <h1>Quản lý đơn hàng</h1>
          <p>Theo dõi đơn hàng, thanh toán, giao hàng và trạng thái xử lý.</p>
        </div>
      </div>

      <div className="thanh-don-hang">
        <div className="bo-loc-card-don-hang">
          <div className="hang-loc-chinh-don-hang">
            <div className="o-tim-don-hang-admin">
              <Search size={18} />
              <input
                name="timkiem"
                value={boLoc.timkiem}
                onChange={capNhatBoLoc}
                placeholder="Tìm mã đơn, tên khách, số điện thoại..."
              />
            </div>

            <div className="select-don-hang-wrap">
              <select
                name="trangthai"
                value={boLoc.trangthai}
                onChange={capNhatBoLoc}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="cho_xac_nhan">Chờ xác nhận</option>
                <option value="da_xac_nhan">Đã xác nhận</option>
                <option value="dang_chuan_bi">Đang chuẩn bị</option>
                <option value="dang_giao">Đang giao</option>
                <option value="hoan_thanh">Hoàn thành</option>
                <option value="da_huy">Đã hủy</option>
              </select>
            </div>

            <div className="select-don-hang-wrap">
              <select
                name="trangthaithanhtoan"
                value={boLoc.trangthaithanhtoan}
                onChange={capNhatBoLoc}
              >
                <option value="">Tất cả thanh toán</option>
                <option value="chua_thanh_toan">Chưa thanh toán</option>
                <option value="da_thanh_toan">Đã thanh toán</option>
                <option value="hoan_tien">Hoàn tiền</option>
              </select>
            </div>

            <button
              type="button"
              className={`nut-loc-nang-cao-don-hang ${
                moLocNangCao ? "dang-mo" : ""
              }`}
              onClick={() => setMoLocNangCao((cu) => !cu)}
            >
              <SlidersHorizontal size={16} />
              <span>Nâng cao</span>
            </button>
          </div>

          {moLocNangCao && (
            <div className="hang-loc-nang-cao-don-hang">
              <input
                type="date"
                name="tungay"
                value={boLoc.tungay}
                onChange={capNhatBoLoc}
                className="input-loc-don-hang"
              />

              <input
                type="date"
                name="denngay"
                value={boLoc.denngay}
                onChange={capNhatBoLoc}
                className="input-loc-don-hang"
              />

              <input
                name="tongtientu"
                value={boLoc.tongtientu}
                onChange={capNhatBoLoc}
                className="input-loc-don-hang"
                placeholder="Tổng tiền từ"
                inputMode="numeric"
              />

              <input
                name="tongtienden"
                value={boLoc.tongtienden}
                onChange={capNhatBoLoc}
                className="input-loc-don-hang"
                placeholder="Tổng tiền đến"
                inputMode="numeric"
              />

              <div className="select-don-hang-wrap">
                <select
                  name="phuongthucthanhtoan"
                  value={boLoc.phuongthucthanhtoan}
                  onChange={capNhatBoLoc}
                >
                  <option value="">Tất cả phương thức</option>
                  <option value="cod">COD</option>
                  <option value="chuyen_khoan">Chuyển khoản</option>
                </select>
              </div>

              <div className="select-don-hang-wrap">
                <select
                  name="sapxep"
                  value={boLoc.sapxep}
                  onChange={capNhatBoLoc}
                >
                  <option value="moi_nhat">Mới nhất</option>
                  <option value="cu_nhat">Cũ nhất</option>
                  <option value="tong_tien_giam">Tổng tiền giảm dần</option>
                  <option value="tong_tien_tang">Tổng tiền tăng dần</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="card-bang-don-hang-admin">
        {dangTai ? (
          <DangTai noidung="Đang tải danh sách đơn hàng..." />
        ) : danhSach.length === 0 ? (
          <TrangRong
            tieude="Chưa có đơn hàng"
            mota="Khi khách đặt hàng trên website, đơn hàng sẽ hiển thị tại đây."
          />
        ) : (
          <div className="bang-responsive-admin">
            <table className="bang-don-hang-admin">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái đơn</th>
                  <th>Ngày đặt</th>
                  <th className="cot-thao-tac">Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSach.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="cot-ma-don-hang">
                        <strong>#{layMaDonHang(item)}</strong>
                        <span>{laySoSanPham(item)} sản phẩm</span>
                      </div>
                    </td>

                    <td>
                      <div className="cot-khach-hang-don">
                        <strong>{layTenKhachHang(item)}</strong>
                        <span>{item.khachhang_id ? "Tài khoản" : "Khách lẻ"}</span>
                      </div>
                    </td>

                    <td>
                      <span className="chu-bang-phu">{laySoDienThoai(item)}</span>
                    </td>

                    <td>
                      <strong className="tong-tien-don-hang">{formatTien(layTongTien(item))}</strong>
                    </td>

                    <td>
                      <span className={`badge-thanh-toan-don-hang ${item.trangthaithanhtoan || "chua_thanh_toan"}`}>
                        {hienThiThanhToan(item.trangthaithanhtoan)}
                      </span>
                    </td>

                    <td>
                      <span className={`badge-trang-thai-don-hang ${layTrangThaiDonHang(item)}`}>
                        {hienThiTrangThaiDon(layTrangThaiDonHang(item))}
                      </span>
                    </td>

                    <td>
                      <span className="chu-bang-phu">{formatNgay(layNgayDat(item))}</span>
                    </td>

                    <td className="cot-thao-tac">
                      <div className="nhom-thao-tac-don-hang">
                        <button type="button" className="nut-icon-don-hang" title="Xem chi tiết" onClick={() => moChiTietDonHang(item)}>
                          <Eye size={16} />
                        </button>

                        <button type="button" className="nut-icon-don-hang" title="Xử lý đơn hàng" onClick={() => moXuLyDonHang?.(item)}>
                          <Pencil size={16} />
                        </button>

                        <button type="button" className="nut-icon-don-hang" title="In đơn hàng" onClick={() => window.print()}>
                          <Printer size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="chan-bang-don-hang-admin">
              <p>
                Hiển thị <strong>{danhSach.length}</strong> trên {" "}
                <strong>{phanTrang.tongsodong || danhSach.length}</strong> đơn hàng
              </p>

              <div className="phan-trang-don-hang-admin">
                <button
                  type="button"
                  disabled={boLoc.trang <= 1}
                  onClick={() => chuyenTrang(boLoc.trang - 1)}
                >
                  Trước
                </button>

                <span>
                  Trang <strong>{boLoc.trang}</strong> / {phanTrang.tongsotrang || 1}
                </span>

                <button
                  type="button"
                  disabled={boLoc.trang >= (phanTrang.tongsotrang || 1)}
                  onClick={() => chuyenTrang(boLoc.trang + 1)}
                >
                  Sau
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <ChiTietDonHangModal
        mo={modalChiTietMo}
        dangTai={dangTaiChiTiet}
        donHang={donHangChiTiet}
        chiTiet={chiTietDonHang}
        onDong={dongChiTietDonHang}
        onXuLyDon={moXuLyDonHang}
        onInDon={inDonHang}
      />

      <XuLyDonHangModal
        mo={modalXuLyMo}
        donHang={donHangDangXuLy}
        dangXuLy={dangLuuXuLyDon}
        onDong={dongXuLyDonHang}
        onLuu={luuXuLyDonHang}
      />
    </div>
  );
}