import { ImageOff, Minus, Plus, RefreshCw, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import TrangRong from "../../../components/TrangRong";
import useGioHangStore from "../../../stores/giohangStore";
import { formatTienVietNam } from "../../../utils/dinhtien";

export default function GioHangWebsite() {
  const danhSach = useGioHangStore((state) => state.danhsach);
  const capNhatSoLuong = useGioHangStore((state) => state.capNhatSoLuong);
  const xoaKhoiGio = useGioHangStore((state) => state.xoaKhoiGio);
  const xoaTatCa = useGioHangStore((state) => state.xoaTatCa);
  const dongBoVoiServer = useGioHangStore((state) => state.dongBoVoiServer);
  const tongTien = useGioHangStore((state) => state.tongTien);

  const [dangDongBo, setDangDongBo] = useState(false);

  const xuLyGiam = (item) => {
    if (item.soluong <= 1) {
      return;
    }

    capNhatSoLuong(item.id, item.soluong - 1);
  };

  const xuLyTang = (item) => {
    if (item.soluong >= item.soluongton) {
      toast.error("Số lượng không được vượt quá tồn kho");
      return;
    }

    capNhatSoLuong(item.id, item.soluong + 1);
  };

  const xuLyNhapSoLuong = (item, value) => {
    const soLuongMoi = Number(value || 1);

    if (soLuongMoi > item.soluongton) {
      toast.error("Số lượng không được vượt quá tồn kho");
    }

    capNhatSoLuong(item.id, soLuongMoi);
  };

  const xuLyXoa = (item) => {
    const dongY = window.confirm(`Bạn có chắc muốn xóa "${item.tensanpham}" khỏi giỏ hàng không?`);

    if (!dongY) {
      return;
    }

    xoaKhoiGio(item.id);
    toast.success("Đã xóa sản phẩm khỏi giỏ hàng");
  };

  const xuLyXoaTatCa = () => {
    const dongY = window.confirm("Bạn có chắc muốn xóa toàn bộ giỏ hàng không?");

    if (!dongY) {
      return;
    }

    xoaTatCa();
    toast.success("Đã xóa toàn bộ giỏ hàng");
  };

  const xuLyDongBo = async () => {
    try {
      setDangDongBo(true);

      const ketQua = await dongBoVoiServer();

      if (ketQua.cothaydoi) {
        toast.success("Giỏ hàng đã được cập nhật theo dữ liệu mới nhất");
      } else {
        toast.success("Giỏ hàng đang là dữ liệu mới nhất");
      }
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không kiểm tra được giỏ hàng";

      toast.error(thongBao);
    } finally {
      setDangDongBo(false);
    }
  };

  if (danhSach.length === 0) {
    return (
      <div className="container-website trang-gio-hang-web">
        <TrangRong
          tieude="Giỏ hàng đang trống"
          mota="Hãy chọn sản phẩm yêu thích và thêm vào giỏ hàng để tiếp tục mua sắm."
          nut="Xem sản phẩm"
          onClick={() => {
            window.location.href = "/sanpham";
          }}
        />
      </div>
    );
  }

  return (
    <div className="container-website trang-gio-hang-web">
      <div className="dau-trang-web gio-hang-header">
        <div>
          <h1>Giỏ hàng</h1>
          <p>Kiểm tra sản phẩm, số lượng và tổng tiền trước khi thanh toán</p>
        </div>

        <div className="nhom-nut-gio-hang">
          <button className="nut-cap-nhat-gio" onClick={xuLyDongBo} disabled={dangDongBo}>
            <RefreshCw size={17} />
            {dangDongBo ? "Đang cập nhật..." : "Cập nhật giỏ hàng"}
          </button>

          <button className="nut-xoa-gio" onClick={xuLyXoaTatCa}>
            <Trash2 size={17} />
            Xóa tất cả
          </button>
        </div>
      </div>

      <div className="gio-hang-grid">
        <div className="khung-gio-hang">
          {danhSach.map((item) => {
            const giaHienThi =
              item.giakhuyenmai && item.giakhuyenmai > 0 ? item.giakhuyenmai : item.giaban;

            return (
              <div className="dong-gio-hang" key={item.id}>
                <Link to={`/sanpham/${item.id}`} className="anh-gio-hang">
                  {item.hinhanh ? (
                    <img src={`http://localhost:8080${item.hinhanh}`} alt={item.tensanpham} />
                  ) : (
                    <ImageOff size={24} />
                  )}
                </Link>

                <div className="thong-tin-gio-hang">
                  <Link to={`/sanpham/${item.id}`}>{item.tensanpham}</Link>
                  <span>{item.tendanhmuc || "Chưa phân loại"}</span>
                  <small>Mã: {item.madinhdanh}</small>
                </div>

                <div className="gia-gio-hang">
                  <strong>{formatTienVietNam(giaHienThi)}</strong>

                  {item.giakhuyenmai && item.giakhuyenmai > 0 && (
                    <span>{formatTienVietNam(item.giaban)}</span>
                  )}
                </div>

                <div className="cap-nhat-so-luong">
                  <button onClick={() => xuLyGiam(item)}>
                    <Minus size={15} />
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={item.soluongton}
                    value={item.soluong}
                    onChange={(event) => xuLyNhapSoLuong(item, event.target.value)}
                  />

                  <button onClick={() => xuLyTang(item)}>
                    <Plus size={15} />
                  </button>

                  <small>Còn {item.soluongton}</small>
                </div>

                <div className="tam-tinh-gio-hang">
                  <strong>{formatTienVietNam(giaHienThi * item.soluong)}</strong>
                </div>

                <button className="nut-xoa-san-pham-gio" onClick={() => xuLyXoa(item)}>
                  <Trash2 size={17} />
                </button>
              </div>
            );
          })}
        </div>

        <aside className="tom-tat-gio-hang">
          <div className="tom-tat-card">
            <div className="tom-tat-icon">
              <ShoppingBag size={26} />
            </div>

            <h2>Tóm tắt đơn hàng</h2>

            <div className="dong-tom-tat">
              <span>Số loại sản phẩm</span>
              <strong>{danhSach.length}</strong>
            </div>

            <div className="dong-tom-tat">
              <span>Tổng số lượng</span>
              <strong>{danhSach.reduce((tong, item) => tong + item.soluong, 0)}</strong>
            </div>

            <div className="dong-tom-tat">
              <span>Tạm tính</span>
              <strong>{formatTienVietNam(tongTien())}</strong>
            </div>

            <div className="dong-tong-cong">
              <span>Tổng tiền</span>
              <strong>{formatTienVietNam(tongTien())}</strong>
            </div>

            <Link to="/thanhtoan" className="nut-thanh-toan-web">
              Tiến hành thanh toán
            </Link>

            <Link to="/sanpham" className="link-tiep-tuc-mua">
              Tiếp tục mua sắm
            </Link>

            <p className="ghi-chu-gio-hang">
              Phí vận chuyển và thông tin giao hàng sẽ được nhập ở bước thanh toán.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}