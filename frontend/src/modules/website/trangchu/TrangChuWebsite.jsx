import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  ImageOff,
  Package,
  Share2,
  Truck,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DangTai from "../../../components/DangTai";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";
import { layDanhSachSanPham } from "../../../api/sanphamApi";
import { layDanhSachDanhMuc } from "../../../api/danhmucApi";
import { formatTienVietNam } from "../../../utils/dinhtien";
import useGioHangStore from "../../../stores/giohangStore";
import heroBannerVideo from "../../../assets/hero-banner.mp4";

import { layUrlAnh } from "../../../api/ketnoiapi";

function layAnhSanPham(sanPham) {
  if (!sanPham?.hinhanh) return "";
  return layUrlAnh(sanPham.hinhanh);
}

export default function TrangChuWebsite() {
  useTieuDeTrang("Trang chủ");

  const [dangTai, setDangTai] = useState(true);
  const [sanPhamMoi, setSanPhamMoi] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);
  const [viTriCarousel, setViTriCarousel] = useState(0);
  const carouselRef = useRef(null);
  const themVaoGio = useGioHangStore((state) => state.themVaoGio);

  const taiDuLieu = async () => {
    try {
      setDangTai(true);
      const [ketQuaSanPham, ketQuaDanhMuc] = await Promise.all([
        layDanhSachSanPham({
          trang: 1,
          gioihan: 8,
          trangthai: "hien_thi",
          sapxep: "moi_nhat",
        }),
        layDanhSachDanhMuc({
          trang: 1,
          gioihan: 8,
          trangthai: "hien_thi",
        }),
      ]);
      setSanPhamMoi(ketQuaSanPham?.dulieu?.danhsach || []);
      setDanhMuc(ketQuaDanhMuc?.dulieu?.danhsach || []);
    } catch {
      toast.error("Không tải được dữ liệu trang chủ");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  const cuonCarousel = (huong) => {
    if (!carouselRef.current) return;
    const cardWidth = 348;
    const maxVi = Math.max(0, sanPhamMoi.length - 4);
    const viTriMoi = Math.max(0, Math.min(viTriCarousel + huong, maxVi));
    setViTriCarousel(viTriMoi);
    carouselRef.current.style.transform = `translateX(-${viTriMoi * cardWidth}px)`;
  };

  const xuLyThemGio = (sanpham) => {
    if (sanpham.soluongton <= 0 || sanpham.trangthai === "het_hang") {
      toast.error("Sản phẩm đã hết hàng");
      return;
    }
    themVaoGio(sanpham, 1);
    toast.success("Đã thêm vào giỏ hàng");
  };

  const sanPhamNoiBat = sanPhamMoi.length > 0 ? sanPhamMoi[0] : null;

  return (
    <div className="mu-trangchu">
      {/* Hero Video Banner - full width, no text overlay */}
      <section className="mu-hero-banner">
        <video autoPlay muted loop playsInline className="mu-hero-video">
          <source src={heroBannerVideo} type="video/mp4" />
        </video>
      </section>

      {/* Sản phẩm mới - Carousel */}
      <section className="mu-section-sanpham">
        <div className="mu-container">
          <div className="mu-section-header">
            <h2>Sản phẩm mới nhất</h2>
            <div className="mu-section-header-right">
              <Link to="/sanpham" className="mu-viewall">Xem tất cả</Link>
              <div className="mu-carousel-nav">
                <button
                  onClick={() => cuonCarousel(-1)}
                  disabled={viTriCarousel === 0}
                  className="mu-carousel-btn"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => cuonCarousel(1)}
                  disabled={viTriCarousel >= sanPhamMoi.length - 4}
                  className="mu-carousel-btn"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>

          {dangTai ? (
            <DangTai noidung="Đang tải sản phẩm..." />
          ) : sanPhamMoi.length === 0 ? (
            <div className="mu-trong">
              <Package size={48} />
              <p>Chưa có sản phẩm nào</p>
            </div>
          ) : (
            <div className="mu-carousel-wrapper">
              <div className="mu-carousel-track" ref={carouselRef}>
                {sanPhamMoi.map((sp) => {
                  const coKhuyenMai = sp.giakhuyenmai && sp.giakhuyenmai > 0;
                  return (
                    <div key={sp.id} className="mu-card-sp">
                      <Link to={`/sanpham/${sp.id}`} className="mu-card-anh">
                        {sp.hinhanh ? (
                          <img src={layAnhSanPham(sp)} alt={sp.tensanpham} />
                        ) : (
                          <div className="mu-card-anh-trong">
                            <ImageOff size={36} />
                          </div>
                        )}
                        <div className="mu-card-nhan">
                          <span className="mu-nhan mu-nhan-moi">Mới</span>
                          {coKhuyenMai && (
                            <span className="mu-nhan mu-nhan-km">Giảm giá</span>
                          )}
                        </div>
                      </Link>
                      <div className="mu-card-thongtin">
                        <span className="mu-card-gia">
                          {formatTienVietNam(coKhuyenMai ? sp.giakhuyenmai : sp.giaban)}
                        </span>
                        <Link to={`/sanpham/${sp.id}`} className="mu-card-ten">
                          {sp.tensanpham}
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured - Sản phẩm nổi bật */}
      {sanPhamNoiBat && (
        <section className="mu-featured-section">
          <div className="mu-container">
            <div className="mu-featured-wrap">
              <div className="mu-featured-img">
                {sanPhamNoiBat.hinhanh ? (
                  <img src={layAnhSanPham(sanPhamNoiBat)} alt={sanPhamNoiBat.tensanpham} />
                ) : (
                  <div className="mu-featured-img-trong">
                    <ImageOff size={64} />
                  </div>
                )}
              </div>
              <div className="mu-featured-info">
                <div className="mu-featured-title-row">
                  <h2>
                    Hãy tùy chỉnh sản phẩm của bạn ngay bây giờ!
                  </h2>
                  <button className="mu-share-btn" title="Chia sẻ">
                    <Share2 size={16} />
                  </button>
                </div>

                <p className="mu-featured-dm-label">Danh mục: {sanPhamNoiBat.tendanhmuc || "Chưa phân loại"}</p>

                <div className="mu-featured-thumbs">
                  {sanPhamMoi.slice(0, 2).map((sp) => (
                    <Link key={sp.id} to={`/sanpham/${sp.id}`} className="mu-featured-thumb">
                      {sp.hinhanh ? (
                        <img src={layAnhSanPham(sp)} alt={sp.tensanpham} />
                      ) : (
                        <ImageOff size={20} />
                      )}
                    </Link>
                  ))}
                </div>

                <p className="mu-featured-chon-label">CHỌN MỘT SẢN PHẨM</p>
                <div className="mu-featured-dropdown">
                  <select>
                    {sanPhamMoi.slice(0, 4).map((sp) => (
                      <option key={sp.id} value={sp.id}>{sp.tensanpham}</option>
                    ))}
                  </select>
                  <ChevronRight size={16} className="mu-dropdown-icon" />
                </div>

                <Link to={`/sanpham/${sanPhamNoiBat.id}`} className="mu-btn-tuychinh">
                  XEM CHI TIẾT
                </Link>
                <button className="mu-btn-themgio" onClick={() => xuLyThemGio(sanPhamNoiBat)}>
                  THÊM VÀO GIỎ HÀNG
                </button>

                <div className="mu-shipping-note">
                  <Truck size={14} />
                  <span>Có dịch vụ giao hàng tiêu chuẩn và giao hàng nhanh.</span>
                </div>

                <div className="mu-disclaimer">
                  Vui lòng chờ thêm vài ngày để các mặt hàng được cá nhân hóa được gửi đi.
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Shop by Category - Danh mục */}
      <section className="mu-category-section">
        <div className="mu-container">
          <h2>Danh mục sản phẩm</h2>

          {dangTai ? (
            <DangTai noidung="Đang tải danh mục..." />
          ) : danhMuc.length === 0 ? (
            <div className="mu-trong">
              <Package size={48} />
              <p>Chưa có danh mục nào</p>
            </div>
          ) : (
            <div className="mu-category-grid">
              {danhMuc.map((dm) => (
                <Link
                  key={dm.id}
                  to={`/sanpham?danhmuc_id=${dm.id}`}
                  className="mu-category-card"
                >
                  <span className="mu-category-letter">
                    {dm.tendanhmuc.charAt(0).toUpperCase()}
                  </span>
                  <div className="mu-category-line" />
                  <strong>{dm.tendanhmuc}</strong>
                  <span className="mu-category-link">Xem ngay →</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Campaign Banner - Bộ sưu tập */}
      <section className="mu-campaign-section">
        <div className="mu-container">
          <div className="mu-campaign-grid">
            <div className="mu-campaign-text">
              <span className="mu-campaign-label">BỘ SƯU TẬP ĐẶC BIỆT</span>
              <h2>Khám phá bộ sưu tập sản phẩm mới nhất của chúng tôi.</h2>
              <p>
                Những sản phẩm chất lượng, được chọn lọc kỹ lưỡng để mang đến trải nghiệm tốt nhất cho khách hàng.
              </p>
              <Link to="/sanpham" className="mu-campaign-btn">
                MUA NGAY
              </Link>
            </div>
            <div className="mu-campaign-cards">
              {danhMuc.slice(0, 2).map((dm) => (
                <Link key={dm.id} to={`/sanpham?danhmuc_id=${dm.id}`} className="mu-campaign-card-item">
                  <span className="mu-campaign-card-letter">
                    {dm.tendanhmuc.charAt(0).toUpperCase()}
                  </span>
                  <span>{dm.tendanhmuc}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mu-newsletter-section">
        <div className="mu-container mu-newsletter-inner">
          <div className="mu-newsletter-left">
            <h3>ĐĂNG KÝ NHẬN ƯU ĐÃI ĐỘC QUYỀN</h3>
            <p>Nhận thông tin sản phẩm mới và ưu đãi đặc biệt sớm nhất</p>
          </div>
          <div className="mu-newsletter-form">
            <input type="email" placeholder="Nhập email của bạn" />
            <button>ĐĂNG KÝ</button>
          </div>
        </div>
      </section>
    </div>
  );
}
