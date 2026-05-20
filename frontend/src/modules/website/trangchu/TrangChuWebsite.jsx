import { useEffect, useState } from "react";
import { ArrowRight, Package, ShieldCheck, Truck, WalletCards } from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DangTai from "../../../components/DangTai";
import TrangRong from "../../../components/TrangRong";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";
import { layDanhSachSanPham } from "../../../api/sanphamApi";
import { layDanhSachDanhMuc } from "../../../api/danhmucApi";
import TheSanPhamWebsite from "../sanpham/TheSanPhamWebsite";

export default function TrangChuWebsite() {
  useTieuDeTrang("Trang chủ");
  const [dangTai, setDangTai] = useState(true);
  const [sanPhamMoi, setSanPhamMoi] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);

  const taiDuLieu = async () => {
    try {
      setDangTai(true);

      const [ketQuaSanPham, ketQuaDanhMuc] = await Promise.all([
        layDanhSachSanPham({
          trang: 1,
          gioihan: 8,
          trangthai: "hien_thi",
        }),
        layDanhSachDanhMuc({
          trang: 1,
          gioihan: 8,
          trangthai: "hien_thi",
        }),
      ]);

      setSanPhamMoi(ketQuaSanPham.dulieu.danhsach || []);
      setDanhMuc(ketQuaDanhMuc.dulieu.danhsach || []);
    } catch {
      toast.error("Không tải được dữ liệu trang chủ");
    } finally {
      setDangTai(false);
    }
  };

  useEffect(() => {
    taiDuLieu();
  }, []);

  return (
    <div className="trang-chu-website">
      <section className="hero-website">
        <div className="container-website hero-grid">
          <div className="hero-noi-dung">
            <span className="nhan-hero">Cửa hàng trực tuyến</span>

            <h1>Mua sắm dễ dàng, quản lý đơn hàng rõ ràng</h1>

            <p>
              Sản phẩm được cập nhật trực tiếp từ hệ thống quản trị. Giá hiển thị
              bằng Việt Nam Đồng, tồn kho rõ ràng và đặt hàng nhanh chóng.
            </p>

            <div className="hero-actions">
              <Link to="/sanpham" className="nut-web-chinh">
                Xem sản phẩm
                <ArrowRight size={18} />
              </Link>

              <Link to="/tra-cuu-don-hang" className="nut-web-phu">
                Tra cứu đơn hàng
              </Link>
            </div>
          </div>

          <div className="hero-card">
            <div className="hero-card-top">
              <Package size={34} />
              <span>Hàng mới hôm nay</span>
            </div>

            <strong>{sanPhamMoi.length}</strong>
            <p>Sản phẩm đang hiển thị trên website</p>
          </div>
        </div>
      </section>

      <section className="container-website">
        <div className="loi-ich-grid">
          <div className="loi-ich-item">
            <Truck size={24} />
            <div>
              <strong>Giao hàng toàn quốc</strong>
              <span>Thông tin rõ ràng, dễ theo dõi</span>
            </div>
          </div>

          <div className="loi-ich-item">
            <WalletCards size={24} />
            <div>
              <strong>Giá Việt Nam Đồng</strong>
              <span>Hiển thị đúng định dạng 120.000 ₫</span>
            </div>
          </div>

          <div className="loi-ich-item">
            <ShieldCheck size={24} />
            <div>
              <strong>Sản phẩm rõ tồn kho</strong>
              <span>Không đặt quá số lượng còn lại</span>
            </div>
          </div>
        </div>
      </section>

      <section className="container-website khoi-website">
        <div className="tieu-de-khoi-web">
          <div>
            <h2>Danh mục nổi bật</h2>
            <p>Chọn nhanh nhóm sản phẩm bạn muốn xem</p>
          </div>

          <Link to="/sanpham">Xem tất cả</Link>
        </div>

        {dangTai ? (
          <DangTai noidung="Đang tải danh mục..." />
        ) : danhMuc.length === 0 ? (
          <TrangRong tieude="Chưa có danh mục" mota="Admin cần thêm danh mục để hiển thị tại đây." />
        ) : (
          <div className="danh-muc-web-grid">
            {danhMuc.map((item) => (
              <Link
                key={item.id}
                to={`/sanpham?danhmuc_id=${item.id}`}
                className="danh-muc-web-item"
              >
                <div>
                  <Package size={24} />
                </div>

                <strong>{item.tendanhmuc}</strong>
                <span>{item.sosanpham} sản phẩm</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="container-website khoi-website">
        <div className="tieu-de-khoi-web">
          <div>
            <h2>Sản phẩm mới</h2>
            <p>Các sản phẩm mới nhất đang được hiển thị</p>
          </div>

          <Link to="/sanpham">Xem thêm</Link>
        </div>

        {dangTai ? (
          <DangTai noidung="Đang tải sản phẩm..." />
        ) : sanPhamMoi.length === 0 ? (
          <TrangRong tieude="Chưa có sản phẩm" mota="Admin cần thêm sản phẩm để hiển thị trên website." />
        ) : (
          <div className="san-pham-web-grid">
            {sanPhamMoi.map((item) => (
              <TheSanPhamWebsite key={item.id} sanpham={item} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
