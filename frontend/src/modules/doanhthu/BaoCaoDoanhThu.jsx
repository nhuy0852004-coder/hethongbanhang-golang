import { BarChart3, Package, ShoppingCart, TrendingUp, XCircle } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import useGiaoDienStore from "../../stores/giaodienStore";
import { formatTienVietNam } from "../../utils/dinhtien";
import {
  layBaoCaoDoanhThu,
  layBaoCaoDonHang,
  layTopSanPham,
} from "../../api/baocaoApi";

function layNgayMacDinh(soNgayLui) {
  const ngay = new Date();
  ngay.setDate(ngay.getDate() - soNgayLui);
  return ngay.toISOString().slice(0, 10);
}

export default function BaoCaoDoanhThu() {
  const capNhatTieuDeTrang = useGiaoDienStore((state) => state.capNhatTieuDeTrang);

  const [dangTai, setDangTai] = useState(true);

  const [boLoc, setBoLoc] = useState({
    tungay: layNgayMacDinh(6),
    denngay: layNgayMacDinh(0),
  });

  const [doanhThu, setDoanhThu] = useState([]);
  const [topSanPham, setTopSanPham] = useState([]);
  const [donHang, setDonHang] = useState(null);

  useEffect(() => {
    capNhatTieuDeTrang(
      "Báo cáo doanh thu",
      "Theo dõi doanh thu, đơn hàng và sản phẩm bán chạy theo khoảng ngày"
    );
  }, [capNhatTieuDeTrang]);

  useEffect(() => {
    taiBaoCao();
  }, []);

  const tongDoanhThuBieuDo = useMemo(() => {
    return doanhThu.reduce((tong, item) => tong + Number(item.doanhthu || 0), 0);
  }, [doanhThu]);

  const doanhThuLonNhat = useMemo(() => {
    if (!doanhThu.length) return 0;
    return Math.max(...doanhThu.map((item) => Number(item.doanhthu || 0)));
  }, [doanhThu]);

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const taiBaoCao = async (event) => {
    event?.preventDefault();

    try {
      setDangTai(true);

      const [kqDoanhThu, kqTopSanPham, kqDonHang] = await Promise.all([
        layBaoCaoDoanhThu(boLoc),
        layTopSanPham(boLoc),
        layBaoCaoDonHang(boLoc),
      ]);

      setDoanhThu(kqDoanhThu.dulieu || []);
      setTopSanPham(kqTopSanPham.dulieu || []);
      setDonHang(kqDonHang.dulieu || null);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được báo cáo doanh thu";

      toast.error(thongBao);
    } finally {
      setDangTai(false);
    }
  };

  return (
    <div className="trang-doanh-thu-admin">
      <form className="bo-loc-bao-cao" onSubmit={taiBaoCao}>
        <div className="nhom-loc-bao-cao">
          <label>Từ ngày</label>
          <input
            type="date"
            name="tungay"
            value={boLoc.tungay}
            onChange={capNhatBoLoc}
          />
        </div>

        <div className="nhom-loc-bao-cao">
          <label>Đến ngày</label>
          <input
            type="date"
            name="denngay"
            value={boLoc.denngay}
            onChange={capNhatBoLoc}
          />
        </div>

        <button type="submit">Lọc báo cáo</button>
      </form>

      {dangTai ? (
        <DangTai noidung="Đang tải báo cáo..." />
      ) : (
        <>
          <div className="dashboard-grid-card mt-3">
            <div className="dashboard-card">
              <div className="dashboard-card-icon xanh">
                <TrendingUp size={24} />
              </div>
              <div>
                <span>Tổng doanh thu</span>
                <strong>{formatTienVietNam(donHang?.tongdoanhthu || 0)}</strong>
                <p>Tất cả đơn, trừ đơn đã hủy</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon duong">
                <ShoppingCart size={24} />
              </div>
              <div>
                <span>Tổng đơn hàng</span>
                <strong>{donHang?.tongdonhang || 0}</strong>
                <p>Trong khoảng ngày đã chọn</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon tim">
                <BarChart3 size={24} />
              </div>
              <div>
                <span>Đơn hoàn thành</span>
                <strong>{donHang?.donhoanthanh || 0}</strong>
                <p>Đã hoàn tất xử lý</p>
              </div>
            </div>

            <div className="dashboard-card">
              <div className="dashboard-card-icon cam">
                <XCircle size={24} />
              </div>
              <div>
                <span>Đơn đã hủy</span>
                <strong>{donHang?.dondahuy || 0}</strong>
                <p>{formatTienVietNam(donHang?.doanhthubihuy || 0)}</p>
              </div>
            </div>
          </div>

          <div className="dashboard-grid-chinh mt-3">
            <div className="dashboard-box">
              <div className="dashboard-box-title">
                <div>
                  <h2>Biểu đồ doanh thu</h2>
                  <p>Đơn vừa đặt sẽ cộng doanh thu, đơn hủy sẽ tự trừ lại</p>
                </div>
              </div>

              {doanhThu.length === 0 ? (
                <TrangRong tieude="Chưa có doanh thu" mota="Chưa có đơn hàng trong khoảng ngày này." />
              ) : (
                <div className="bieu-do-doanh-thu">
                  {doanhThu.map((item) => {
                    const chieuCao =
                      doanhThuLonNhat > 0
                        ? Math.max(8, Math.round((item.doanhthu / doanhThuLonNhat) * 160))
                        : 8;

                    return (
                      <div className="cot-bieu-do" key={item.ngay}>
                        <div className="cot-gia-tri">
                          <span>{item.doanhthu > 0 ? formatTienVietNam(item.doanhthu) : "0 ₫"}</span>
                          <div style={{ height: `${chieuCao}px` }} />
                        </div>
                        <small>{item.ngay?.split("-").reverse().slice(0, 2).join("/")}</small>
                      </div>
                    );
                  })}
                </div>
              )}

              <div className="tong-bao-cao-duoi-bieu-do">
                Tổng doanh thu biểu đồ: <strong>{formatTienVietNam(tongDoanhThuBieuDo)}</strong>
              </div>
            </div>

            <div className="dashboard-box">
              <div className="dashboard-box-title">
                <div>
                  <h2>Top sản phẩm bán chạy</h2>
                  <p>Top 10 sản phẩm theo số lượng bán</p>
                </div>
                <Package size={22} />
              </div>

              {topSanPham.length === 0 ? (
                <TrangRong tieude="Chưa có sản phẩm bán chạy" mota="Chưa có dữ liệu bán hàng trong khoảng ngày này." />
              ) : (
                <div className="ds-san-pham-sap-het">
                  {topSanPham.map((item, index) => (
                    <div className="item-san-pham-sap-het" key={`${item.id}-${index}`}>
                      {item.hinhanh ? (
                        <img src={`http://localhost:8080${item.hinhanh}`} alt={item.tensanpham} />
                      ) : (
                        <div className="anh-sap-het-trong">Ảnh</div>
                      )}

                      <div>
                        <strong>{item.tensanpham}</strong>
                        <span>{item.soluongban} sản phẩm • {formatTienVietNam(item.doanhthu)}</span>
                      </div>

                      <b>{index + 1}</b>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}