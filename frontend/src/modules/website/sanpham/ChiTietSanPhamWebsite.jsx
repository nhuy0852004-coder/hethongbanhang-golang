import { useEffect, useState } from "react";
import { ArrowLeft, ImageOff, Minus, Plus, ShoppingCart } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import DangTai from "../../../components/DangTai";
import TrangRong from "../../../components/TrangRong";
import { layChiTietSanPham, layDanhSachSanPham } from "../../../api/sanphamApi";
import { formatTienVietNam } from "../../../utils/dinhtien";
import TheSanPhamWebsite from "./TheSanPhamWebsite";
import useGioHangStore from "../../../stores/giohangStore";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";

export default function ChiTietSanPhamWebsite() {
  const { id } = useParams();
  const themVaoGio = useGioHangStore((state) => state.themVaoGio);

  const [dangTai, setDangTai] = useState(true);
  const [sanPham, setSanPham] = useState(null);
  const [sanPhamLienQuan, setSanPhamLienQuan] = useState([]);
  const [soLuong, setSoLuong] = useState(1);

  useTieuDeTrang(sanPham?.tensanpham || "Chi tiết sản phẩm");

  useEffect(() => {
    taiChiTiet();
  }, [id]);

  const taiChiTiet = async () => {
    try {
      setDangTai(true);

      const ketQua = await layChiTietSanPham(id);
      const duLieuSanPham = ketQua.dulieu;

      setSanPham(duLieuSanPham);
      setSoLuong(1);

      const ketQuaLienQuan = await layDanhSachSanPham({
        trang: 1,
        gioihan: 4,
        trangthai: "hien_thi",
        danhmuc_id: duLieuSanPham.danhmuc_id || "",
      });

      setSanPhamLienQuan(
        (ketQuaLienQuan.dulieu.danhsach || []).filter(
          (item) => Number(item.id) !== Number(id)
        )
      );
    } catch {
      toast.error("Không tải được chi tiết sản phẩm");
      setSanPham(null);
    } finally {
      setDangTai(false);
    }
  };

  const tangSoLuong = () => {
    if (!sanPham) return;

    if (soLuong >= sanPham.soluongton) {
      toast.error("Số lượng không được vượt quá tồn kho");
      return;
    }

    setSoLuong((cu) => cu + 1);
  };

  const giamSoLuong = () => {
    if (soLuong <= 1) return;
    setSoLuong((cu) => cu - 1);
  };

  const themSanPhamVaoGio = () => {
    if (!sanPham) return;

    if (sanPham.soluongton <= 0 || sanPham.trangthai === "het_hang") {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }

    themVaoGio(sanPham, soLuong);
    toast.success("Đã thêm sản phẩm vào giỏ hàng");
  };

  if (dangTai) {
    return (
      <div className="container-website">
        <DangTai noidung="Đang tải chi tiết sản phẩm..." />
      </div>
    );
  }

  if (!sanPham) {
    return (
      <div className="container-website">
        <TrangRong
          tieude="Không tìm thấy sản phẩm"
          mota="Sản phẩm có thể đã bị ẩn hoặc không tồn tại."
        />
      </div>
    );
  }

  const coKhuyenMai = sanPham.giakhuyenmai && sanPham.giakhuyenmai > 0;
  const giaHienThi = coKhuyenMai ? sanPham.giakhuyenmai : sanPham.giaban;

  return (
    <div className="container-website trang-chi-tiet-san-pham-web">
      <Link to="/sanpham" className="link-quay-lai-web">
        <ArrowLeft size={18} />
        Quay lại sản phẩm
      </Link>

      <div className="chi-tiet-san-pham-grid">
        <div className="anh-chi-tiet-san-pham">
          {sanPham.hinhanh ? (
            <img
              src={`http://localhost:8080${sanPham.hinhanh}`}
              alt={sanPham.tensanpham}
            />
          ) : (
            <div>
              <ImageOff size={46} />
              <span>Chưa có ảnh sản phẩm</span>
            </div>
          )}
        </div>

        <div className="thong-tin-chi-tiet-san-pham">
          <span className="breadcrumb-san-pham">
            {sanPham.tendanhmuc || "Chưa phân loại"}
          </span>

          <h1>{sanPham.tensanpham}</h1>

          <div className="ma-san-pham-web">
            Mã sản phẩm: <strong>{sanPham.madinhdanh}</strong>
          </div>

          <div className="gia-chi-tiet-web">
            <strong>{formatTienVietNam(giaHienThi)}</strong>

            {coKhuyenMai && <span>{formatTienVietNam(sanPham.giaban)}</span>}
          </div>

          <div className="ton-kho-web">
            Còn hàng: <strong>{sanPham.soluongton}</strong> sản phẩm
          </div>

          <div className="mo-ta-san-pham-web">
            <h3>Mô tả sản phẩm</h3>
            <p>{sanPham.mota || "Sản phẩm chưa có mô tả chi tiết."}</p>
          </div>

          <div className="chon-so-luong-web">
            <span>Số lượng</span>

            <div>
              <button onClick={giamSoLuong}>
                <Minus size={16} />
              </button>

              <strong>{soLuong}</strong>

              <button onClick={tangSoLuong}>
                <Plus size={16} />
              </button>
            </div>
          </div>

          <button
            className="nut-them-gio-web"
            disabled={sanPham.soluongton <= 0}
            onClick={themSanPhamVaoGio}
          >
            <ShoppingCart size={19} />
            {sanPham.soluongton <= 0 ? "Hết hàng" : "Thêm vào giỏ hàng"}
          </button>
        </div>
      </div>

      {sanPhamLienQuan.length > 0 && (
        <section className="khoi-website">
          <div className="tieu-de-khoi-web">
            <div>
              <h2>Sản phẩm liên quan</h2>
              <p>Các sản phẩm cùng danh mục</p>
            </div>
          </div>

          <div className="san-pham-web-grid">
            {sanPhamLienQuan.map((item) => (
              <TheSanPhamWebsite key={item.id} sanpham={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}