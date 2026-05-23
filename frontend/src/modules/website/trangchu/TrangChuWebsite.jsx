import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  CalendarCheck,
  Headphones,
  ImageOff,
  MapPin,
  Package,
  PackageCheck,
  Search,
  ShieldCheck,
  ShoppingBag,
  Star,
  Truck,
  WalletCards,
} from "lucide-react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import DangTai from "../../../components/DangTai";
import TrangRong from "../../../components/TrangRong";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";
import { layDanhSachSanPham } from "../../../api/sanphamApi";
import { layDanhSachDanhMuc } from "../../../api/danhmucApi";
import TheSanPhamWebsite from "../sanpham/TheSanPhamWebsite";

const API_URL = "http://localhost:8080";

function layAnhSanPham(sanPham) {
  if (!sanPham?.hinhanh) return "";
  if (sanPham.hinhanh.startsWith("http")) return sanPham.hinhanh;
  return `${API_URL}${sanPham.hinhanh}`;
}

function taoLinkSanPham(params = {}) {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      query.set(key, value);
    }
  });

  const chuoiQuery = query.toString();
  return chuoiQuery ? `/sanpham?${chuoiQuery}` : "/sanpham";
}

export default function TrangChuWebsite() {
  useTieuDeTrang("Trang chủ");

  const [dangTai, setDangTai] = useState(true);
  const [sanPhamMoi, setSanPhamMoi] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);

  const [boLocNhanh, setBoLocNhanh] = useState({
    timkiem: "",
    danhmuc_id: "",
    sapxep: "moi_nhat",
  });

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

  const sanPhamHero = useMemo(() => {
    return sanPhamMoi.find((item) => item.hinhanh) || sanPhamMoi[0] || null;
  }, [sanPhamMoi]);

  const linkTimKiemNhanh = useMemo(() => {
    return taoLinkSanPham({
      timkiem: boLocNhanh.timkiem.trim(),
      danhmuc_id: boLocNhanh.danhmuc_id,
      sapxep: boLocNhanh.sapxep,
    });
  }, [boLocNhanh]);

  const capNhatBoLocNhanh = (event) => {
    const { name, value } = event.target;

    setBoLocNhanh((duLieuCu) => ({
      ...duLieuCu,
      [name]: value,
    }));
  };

  return (
    <div className="trang-chu-website">
      <section className="hero-website hero-website-moi">
        <div className="container-website">
          <div className="hero-grid hero-grid-moi">
            <div className="hero-noi-dung">
              <span className="nhan-hero">Cửa hàng trực tuyến</span>

              <h1>Mua sắm dễ dàng, chọn sản phẩm nhanh chóng</h1>

              <p>
                Sản phẩm được cập nhật trực tiếp từ hệ thống quản trị. Giá hiển
                thị bằng Việt Nam Đồng, tồn kho rõ ràng và đặt hàng nhanh chóng.
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

            <div className="hero-anh-lon">
              {sanPhamHero?.hinhanh ? (
                <img src={layAnhSanPham(sanPhamHero)} alt={sanPhamHero.tensanpham} />
              ) : (
                <div>
                  <ImageOff size={88} />
                  <span>Ảnh sản phẩm nổi bật</span>
                </div>
              )}
            </div>
          </div>

          <div className="hop-tim-kiem-trang-chu">
            <div className="o-tim-trang-chu">
              <Search size={18} />
              <input
                name="timkiem"
                value={boLocNhanh.timkiem}
                onChange={capNhatBoLocNhanh}
                placeholder="Tìm kiếm sản phẩm..."
              />
            </div>

            <select
              name="danhmuc_id"
              value={boLocNhanh.danhmuc_id}
              onChange={capNhatBoLocNhanh}
            >
              <option value="">Tất cả danh mục</option>

              {danhMuc.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.tendanhmuc}
                </option>
              ))}
            </select>

            <select
              name="sapxep"
              value={boLocNhanh.sapxep}
              onChange={capNhatBoLocNhanh}
            >
              <option value="moi_nhat">Mới nhất</option>
              <option value="gia_tang">Giá tăng dần</option>
              <option value="gia_giam">Giá giảm dần</option>
              <option value="luot_ban">Bán chạy</option>
            </select>

            <Link to={linkTimKiemNhanh}>Tìm kiếm</Link>
          </div>
        </div>
      </section>

      <section className="container-website">
        <div className="loi-ich-grid loi-ich-grid-moi">
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

      <section className="container-website khoi-website khoi-quy-trinh-web">
        <div className="tieu-de-khoi-web can-giua">
          <div>
            <h2>Mua hàng đơn giản hơn</h2>
            <p>Chọn sản phẩm, thêm vào giỏ và đặt hàng chỉ trong vài bước.</p>
          </div>
        </div>

        <div className="quy-trinh-mua-hang-grid">
          <div className="quy-trinh-item-web">
            <div>
              <MapPin size={28} />
            </div>
            <h3>Chọn sản phẩm</h3>
            <p>Tìm sản phẩm theo danh mục, giá bán hoặc từ khóa.</p>
          </div>

          <div className="quy-trinh-item-web">
            <div>
              <ShoppingBag size={28} />
            </div>
            <h3>Thêm vào giỏ</h3>
            <p>Kiểm tra số lượng, giá tiền và tình trạng tồn kho.</p>
          </div>

          <div className="quy-trinh-item-web">
            <div>
              <CalendarCheck size={28} />
            </div>
            <h3>Xác nhận đơn</h3>
            <p>Điền thông tin nhận hàng và gửi đơn để cửa hàng xử lý.</p>
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
          <TrangRong
            tieude="Chưa có danh mục"
            mota="Admin cần thêm danh mục để hiển thị tại đây."
          />
        ) : (
          <div className="danh-muc-web-grid danh-muc-web-grid-moi">
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
                <span>{item.sosanpham || 0} sản phẩm</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="khoi-san-pham-trang-chu">
        <div className="container-website khoi-website">
          <div className="tieu-de-khoi-web can-giua">
            <div>
              <h2>Sản phẩm mới</h2>
              <p>Các sản phẩm mới nhất đang được hiển thị</p>
            </div>
          </div>

          <div className="tab-san-pham-trang-chu">
            <Link to="/sanpham" className="dang-chon">
              Phổ biến
            </Link>
            <Link to="/sanpham?sapxep=moi_nhat">Mới nhất</Link>
            <Link to="/sanpham?sanpham=khuyenmai">Khuyến mãi</Link>
            <Link to="/sanpham?sapxep=luot_ban">Bán chạy</Link>
          </div>

          {dangTai ? (
            <DangTai noidung="Đang tải sản phẩm..." />
          ) : sanPhamMoi.length === 0 ? (
            <TrangRong
              tieude="Chưa có sản phẩm"
              mota="Admin cần thêm sản phẩm để hiển thị trên website."
            />
          ) : (
            <div className="san-pham-web-grid san-pham-web-grid-moi">
              {sanPhamMoi.map((item) => (
                <TheSanPhamWebsite key={item.id} sanpham={item} />
              ))}
            </div>
          )}

          <div className="xem-them-trang-chu">
            <Link to="/sanpham">
              Xem thêm sản phẩm
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      <section className="container-website khoi-website khoi-loi-ich-lon">
        <div className="loi-ich-lon-grid">
          <div className="loi-ich-lon-anh">
            {sanPhamHero?.hinhanh ? (
              <img src={layAnhSanPham(sanPhamHero)} alt={sanPhamHero.tensanpham} />
            ) : (
              <ImageOff size={78} />
            )}
          </div>

          <div className="loi-ich-lon-noi-dung">
            <div className="tieu-de-khoi-web">
              <div>
                <h2>Lý do khách hàng chọn cửa hàng</h2>
                <p>
                  Trải nghiệm mua sắm rõ ràng, thông tin minh bạch và hỗ trợ
                  nhanh chóng.
                </p>
              </div>
            </div>

            <div className="danh-sach-loi-ich-lon">
              <div>
                <Headphones size={22} />
                <div>
                  <strong>Hỗ trợ khách hàng</strong>
                  <span>Cửa hàng liên hệ xác nhận đơn và hỗ trợ khi cần.</span>
                </div>
              </div>

              <div>
                <PackageCheck size={22} />
                <div>
                  <strong>Sản phẩm rõ ràng</strong>
                  <span>Giá bán, tồn kho và trạng thái được hiển thị rõ.</span>
                </div>
              </div>

              <div>
                <ShieldCheck size={22} />
                <div>
                  <strong>Mua hàng an tâm</strong>
                  <span>Quy trình đặt hàng đơn giản, phù hợp cả điện thoại.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="khoi-danh-gia-trang-chu">
        <div className="container-website khoi-website">
          <div className="tieu-de-khoi-web can-giua">
            <div>
              <h2>Khách hàng tin tưởng cửa hàng</h2>
              <p>Những phản hồi tích cực từ khách hàng đã mua sản phẩm.</p>
            </div>
          </div>

          <div className="danh-gia-grid-trang-chu">
            {["Minh Anh", "Việt Hoàng", "Thanh Huyền"].map((ten) => (
              <div className="danh-gia-card-trang-chu" key={ten}>
                <div className="danh-gia-dau">
                  <div className="avatar-danh-gia"></div>
                  <div>
                    <strong>{ten}</strong>
                    <div>
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={13} />
                      ))}
                    </div>
                  </div>
                </div>

                <p>
                  Sản phẩm đúng mô tả, đặt hàng nhanh và cửa hàng hỗ trợ rất
                  nhiệt tình.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}