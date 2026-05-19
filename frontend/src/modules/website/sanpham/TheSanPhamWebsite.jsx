import { Link } from "react-router-dom";
import { ImageOff, ShoppingCart } from "lucide-react";
import { formatTienVietNam } from "../../../utils/dinhtien";

export default function TheSanPhamWebsite({ sanpham }) {
  const coKhuyenMai = sanpham.giakhuyenmai && sanpham.giakhuyenmai > 0;

  return (
    <div className="the-san-pham-website">
      <Link to={`/sanpham/${sanpham.id}`} className="anh-the-san-pham">
        {sanpham.hinhanh ? (
          <img
            src={`http://localhost:8080${sanpham.hinhanh}`}
            alt={sanpham.tensanpham}
          />
        ) : (
          <div className="anh-san-pham-website-trong">
            <ImageOff size={30} />
          </div>
        )}

        {coKhuyenMai && <span className="nhan-giam-gia">Giảm giá</span>}
      </Link>

      <div className="noi-dung-the-san-pham">
        <Link to={`/sanpham/${sanpham.id}`} className="ten-san-pham-web">
          {sanpham.tensanpham}
        </Link>

        <p>{sanpham.tendanhmuc || "Chưa phân loại"}</p>

        <div className="gia-san-pham-web">
          <strong>
            {formatTienVietNam(coKhuyenMai ? sanpham.giakhuyenmai : sanpham.giaban)}
          </strong>

          {coKhuyenMai && <span>{formatTienVietNam(sanpham.giaban)}</span>}
        </div>

        <div className="chan-the-san-pham">
          <span>Còn {sanpham.soluongton} sản phẩm</span>

          <button>
            <ShoppingCart size={17} />
          </button>
        </div>
      </div>
    </div>
  );
}
