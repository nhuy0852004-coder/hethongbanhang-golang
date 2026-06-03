import {
  AlertTriangle,
  Boxes,
  CheckCircle2,
  Clock,
  Eye,
  Package,
  RefreshCw,
  ShoppingCart,
  TrendingUp,
  Users,
  XCircle,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import clsx from "clsx";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import TheTrangThai from "../../components/ui/TheTrangThai";
import { layTongQuan } from "../../api/tongquanApi";
import { formatTienVietNam } from "../../utils/dinhtien";
import useGiaoDienStore from "../../stores/giaodienStore";

const DS_KHOANG_NGAY = [
  { key: "homnay", ten: "Hôm nay" },
  { key: "7ngay", ten: "7 ngày" },
  { key: "30ngay", ten: "30 ngày" },
  { key: "thangnay", ten: "Tháng này" },
];

export default function DashboardAdmin() {
  const capNhatTieuDeTrang = useGiaoDienStore(
    (state) => state.capNhatTieuDeTrang
  );

  const [dangTai, setDangTai] = useState(true);
  const [dangRefresh, setDangRefresh] = useState(false);
  const [duLieu, setDuLieu] = useState(null);
  const [khoangNgay, setKhoangNgay] = useState("7ngay");
  const [khoangNgayChart, setKhoangNgayChart] = useState("7ngay");
  const [duLieuChart, setDuLieuChart] = useState(null);
  const [dangTaiChart, setDangTaiChart] = useState(false);

  useEffect(() => {
    capNhatTieuDeTrang("", "");
  }, [capNhatTieuDeTrang]);

  const taiDuLieu = useCallback(async (khoang) => {
    try {
      setDangTai(true);
      const ketQua = await layTongQuan(khoang);
      setDuLieu(ketQua.dulieu);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được dữ liệu tổng quan";
      toast.error(thongBao);
    } finally {
      setDangTai(false);
    }
  }, []);

  const taiDuLieuChart = useCallback(async (khoang) => {
    try {
      setDangTaiChart(true);
      const ketQua = await layTongQuan(khoang);
      setDuLieuChart(ketQua.dulieu);
    } catch {
      toast.error("Không tải được dữ liệu biểu đồ");
    } finally {
      setDangTaiChart(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => taiDuLieu(khoangNgay));
  }, [khoangNgay, taiDuLieu]);

  useEffect(() => {
    queueMicrotask(() => taiDuLieuChart(khoangNgayChart));
  }, [khoangNgayChart, taiDuLieuChart]);

  const xuLyRefresh = useCallback(async () => {
    setDangRefresh(true);
    try {
      const ketQua = await layTongQuan(khoangNgay);
      setDuLieu(ketQua.dulieu);
      toast.success("Đã cập nhật dữ liệu");
      if (khoangNgay === khoangNgayChart) {
        setDuLieuChart(ketQua.dulieu);
      }
    } catch {
      toast.error("Không thể cập nhật dữ liệu");
    } finally {
      setDangRefresh(false);
    }
  }, [khoangNgay, khoangNgayChart]);

  const doiKhoangNgay = (key) => {
    if (key !== khoangNgay) {
      setKhoangNgay(key);
    }
  };

  const doiKhoangNgayChart = (key) => {
    if (key !== khoangNgayChart) {
      setKhoangNgayChart(key);
    }
  };

  const doanhThuChart = useMemo(
    () => duLieuChart?.doanhthubayngay || duLieu?.doanhthubayngay || [],
    [duLieu, duLieuChart]
  );

  const doanhThuLonNhat = useMemo(() => {
    if (!doanhThuChart?.length) return 0;
    return Math.max(
      ...doanhThuChart.map((item) => item.doanhthu || 0)
    );
  }, [doanhThuChart]);

  const tongDoanhThu7Ngay = useMemo(() => {
    if (!doanhThuChart?.length) return 0;
    return doanhThuChart.reduce(
      (sum, item) => sum + (item.doanhthu || 0),
      0
    );
  }, [doanhThuChart]);

  const tongDon7Ngay = useMemo(() => {
    if (!doanhThuChart?.length) return 0;
    return doanhThuChart.reduce(
      (sum, item) => sum + (item.donhang || 0),
      0
    );
  }, [doanhThuChart]);

  const donHangLonNhat = useMemo(() => {
    if (!doanhThuChart?.length) return 0;
    return Math.max(
      ...doanhThuChart.map((item) => item.donhang || 0)
    );
  }, [doanhThuChart]);

  if (dangTai) {
    return <DangTai noidung="Đang tải dữ liệu tổng quan..." />;
  }

  if (!duLieu) {
    return (
      <TrangRong
        tieude="Không có dữ liệu tổng quan"
        mota="Vui lòng kiểm tra backend hoặc cơ sở dữ liệu."
      />
    );
  }

  const thongKe = duLieu.thongke || {};
  const trangThai = duLieu.trangthadon || {};
  const sanPhamBanChay = duLieu.sanphambanchay || [];
  const sanPhamSapHet = duLieu.sanphamsaphethang || [];
  const donHangMoi = duLieu.donhangmoinhat || [];
  const tyLeHoanThanh = Math.round(thongKe.tylehoanthanh || 0);
  const tbNgay = doanhThuChart.length > 0
    ? Math.round(tongDoanhThu7Ngay / doanhThuChart.length)
    : 0;

  const maxDoanhThuBanChay = sanPhamBanChay.length > 0
    ? Math.max(...sanPhamBanChay.map((sp) => sp.doanhthu || 0))
    : 0;

  return (
    <div className="dashboard-admin">
      {/* ===== TIÊU ĐỀ + BỘ LỌC NGÀY ===== */}
      <div className="db-page-header">
        <div className="db-page-title">
          <div className="db-page-breadcrumb">
            <span>Trang chủ</span>
            <span className="db-breadcrumb-separator">/</span>
            <span className="db-breadcrumb-current">Tổng quan</span>
          </div>
          <h1>Tổng quan</h1>
          <p>Theo dõi doanh thu, đơn hàng và các cảnh báo quan trọng trong hệ thống.</p>
        </div>
        <div className="db-page-actions">
          <div className="db-date-tabs">
            {DS_KHOANG_NGAY.map((item) => (
              <button
                key={item.key}
                className={clsx("db-date-tab", khoangNgay === item.key && "active")}
                onClick={() => doiKhoangNgay(item.key)}
              >
                {item.ten}
              </button>
            ))}
          </div>
          <button
            className={clsx("db-refresh-btn", dangRefresh && "dang-quay")}
            onClick={xuLyRefresh}
            disabled={dangRefresh}
            title="Làm mới dữ liệu"
          >
            <RefreshCw size={12} />
          </button>
        </div>
      </div>

      {/* ===== 8 STAT CARDS - 2 hàng x 4 cột ===== */}
      <div className="db-stat-grid">
        <StatCard
          icon={<TrendingUp size={15} />}
          mauIcon="xanh-la"
          tieuDe="Doanh thu hôm nay"
          giaTri={formatTienVietNam(thongKe.doanhthuhomnay || 0)}
          moTa="Tính đơn đã hoàn thành"
          phu="+12% so với hôm qua"
          mauPhu="xanh-la"
        />
        <StatCard
          icon={<ShoppingCart size={15} />}
          mauIcon="xanh-duong"
          tieuDe="Đơn hàng hôm nay"
          giaTri={thongKe.donhanghomnay || 0}
          moTa="Tất cả trạng thái"
          phu={`+${thongKe.donhanghomnay || 0} đơn mới`}
          mauPhu="xanh-duong"
        />
        <StatCard
          icon={<Clock size={15} />}
          mauIcon="cam"
          tieuDe="Đơn chờ xác nhận"
          giaTri={thongKe.donchoxacnhan || 0}
          moTa="Cần xử lý sớm"
          badge="Ưu tiên"
          mauBadge="cam"
        />
        <StatCard
          icon={<Package size={15} />}
          mauIcon="tim"
          tieuDe="Sản phẩm đang bán"
          giaTri={thongKe.sanphamdangban || 0}
          moTa="Sản phẩm đang hiển thị"
        />
        <StatCard
          icon={<Users size={15} />}
          mauIcon="xanh-duong"
          tieuDe="Khách hàng mới"
          giaTri={thongKe.khachhangmoi || 0}
          moTa="Khách đã đặt hàng"
        />
        <StatCard
          icon={<AlertTriangle size={15} />}
          mauIcon="vang"
          tieuDe="Sản phẩm sắp hết"
          giaTri={thongKe.sanphamsaphet || 0}
          moTa="Tồn kho dưới 5"
          badge="Cảnh báo"
          mauBadge="do"
        />
        <StatCard
          icon={<XCircle size={15} />}
          mauIcon="do"
          tieuDe="Đơn đã hủy"
          giaTri={thongKe.dondahuy || 0}
          moTa="Trong hôm nay"
        />
        <StatCard
          icon={<CheckCircle2 size={15} />}
          mauIcon="xanh-la"
          tieuDe="Tỷ lệ hoàn thành"
          giaTri={`${tyLeHoanThanh}%`}
          moTa="Đơn hoàn thành / tổng đơn"
          progressBar={tyLeHoanThanh}
        />
      </div>

      {/* ===== BIỂU ĐỒ DOANH THU + TRẠNG THÁI ĐƠN HÀNG ===== */}
      <div className="db-chart-row">
        <div className="db-box db-chart-box">
          <div className="db-box-header db-chart-header">
            <div>
              <h2>Doanh thu {khoangNgayChart === "30ngay" ? "30 ngày" : "7 ngày"}</h2>
              <p>Thống kê doanh thu từ các đơn hàng không bị hủy</p>
            </div>
            <div className="db-chart-header-tools">
              <div className="db-chart-legend">
                <span className="db-legend-item">
                  <span className="db-legend-dot xanh-duong" />
                  Doanh thu
                </span>
                <span className="db-legend-item">
                  <span className="db-legend-line" />
                  Đơn hàng
                </span>
              </div>
              <div className="db-chart-filter">
                <select
                  id="chart-range"
                  value={khoangNgayChart}
                  onChange={(e) => doiKhoangNgayChart(e.target.value)}
                  disabled={dangTaiChart}
                >
                  <option value="7ngay">7 ngày</option>
                  <option value="30ngay">30 ngày</option>
                </select>
              </div>
            </div>
          </div>

          <div className="db-chart-summary">
            <div className="db-summary-item">
              <span>Tổng doanh thu</span>
              <strong>{formatTienVietNam(tongDoanhThu7Ngay)}</strong>
            </div>
            <div className="db-summary-divider" />
            <div className="db-summary-item">
              <span>Tăng trưởng</span>
              <strong className="mau-xanh-la">+18%</strong>
            </div>
            <div className="db-summary-divider" />
            <div className="db-summary-item">
              <span>TB / ngày</span>
              <strong>{formatTienVietNam(tbNgay)}</strong>
            </div>
            <div className="db-summary-divider" />
            <div className="db-summary-item">
              <span>Tổng đơn</span>
              <strong>{tongDon7Ngay}</strong>
            </div>
          </div>

          <div className="db-barchart">
            <div className="db-barchart-y">
              {[...Array(5)].map((_, i) => {
                const val = doanhThuLonNhat > 0
                  ? ((4 - i) / 4 * doanhThuLonNhat / 1000000).toFixed(1) + "tr"
                  : "0";
                return <span key={i}>{val}</span>;
              })}
            </div>
            <div className="db-barchart-area">
              <div className="db-barchart-grid">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="db-grid-line" />
                ))}
              </div>
              <div className="db-barchart-bars">
                {doanhThuChart.map((item) => {
                  const chieuCao =
                    doanhThuLonNhat > 0
                      ? Math.max(4, Math.round((item.doanhthu / doanhThuLonNhat) * 112))
                      : 4;
                  return (
                    <div className="db-bar-col" key={item.ngay}>
                      <div
                        className="db-bar"
                        style={{ height: `${chieuCao}px` }}
                      />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="db-barchart-y db-barchart-y-right">
              {[...Array(5)].map((_, i) => {
                const val = donHangLonNhat > 0
                  ? Math.round((4 - i) / 4 * donHangLonNhat)
                  : 0;
                return <span key={i}>{val}</span>;
              })}
            </div>
          </div>
          <div className="db-barchart-x">
            {doanhThuChart.map((item) => (
              <span key={item.ngay}>
                {new Date(item.ngay).toLocaleDateString("vi-VN", {
                  day: "2-digit",
                  month: "2-digit",
                })}
              </span>
            ))}
          </div>
        </div>

        <div className="db-box db-status-box">
          <h2>Trạng thái đơn hàng</h2>
          <p>Tỷ lệ xử lý đơn trong ngày</p>

          <div className="db-status-list">
            <StatusBar label="Chờ xác nhận" value={trangThai.choxacnhan || 0} total={trangThai.tongdon || 1} color="#f59e0b" />
            <StatusBar label="Đã xác nhận" value={trangThai.daxacnhan || 0} total={trangThai.tongdon || 1} color="#3b82f6" />
            <StatusBar label="Đang giao" value={trangThai.danggiao || 0} total={trangThai.tongdon || 1} color="#8b5cf6" />
            <StatusBar label="Hoàn thành" value={trangThai.hoanthanh || 0} total={trangThai.tongdon || 1} color="#22c55e" />
            <StatusBar label="Đã hủy" value={trangThai.dahuy || 0} total={trangThai.tongdon || 1} color="#ef4444" />
          </div>

          <div className="db-status-footer">
            <div className="db-status-stacked-bar">
              {trangThai.tongdon > 0 && (
                <>
                  <div style={{ flex: trangThai.choxacnhan || 0, background: "#f59e0b" }} />
                  <div style={{ flex: trangThai.daxacnhan || 0, background: "#3b82f6" }} />
                  <div style={{ flex: trangThai.danggiao || 0, background: "#8b5cf6" }} />
                  <div style={{ flex: trangThai.hoanthanh || 0, background: "#22c55e" }} />
                  <div style={{ flex: trangThai.dahuy || 0, background: "#ef4444" }} />
                </>
              )}
            </div>
            <span>Tổng {trangThai.tongdon || 0} đơn trong ngày</span>
          </div>
        </div>
      </div>

      {/* ===== 3 CARD HÀNG NGANG ===== */}
      <div className="db-three-col">
        {/* Sản phẩm sắp hết hàng */}
        <div className="db-box">
          <div className="db-box-header">
            <div className="db-box-header-icon">
              <AlertTriangle size={13} className="mau-vang-icon" />
              <h2>Sản phẩm sắp hết hàng</h2>
            </div>
          </div>
          <p className="db-box-desc">Tồn kho dưới 5 sản phẩm</p>

          <div className="db-product-list">
            {sanPhamSapHet.length === 0 ? (
              <div className="db-empty-mini">
                <Boxes size={24} />
                <span>Chưa có sản phẩm sắp hết hàng</span>
              </div>
            ) : (
              sanPhamSapHet.map((item) => (
                <div className="db-product-item" key={item.id}>
                  <div className="db-product-img">
                    {item.hinhanh ? (
                      <img
                        src={`http://localhost:8080${item.hinhanh}`}
                        alt={item.tensanpham}
                      />
                    ) : (
                      <div className="db-img-placeholder" />
                    )}
                  </div>
                  <div className="db-product-info">
                    <strong>{item.tensanpham}</strong>
                    <span>{item.tendanhmuc || "Chưa phân loại"}</span>
                  </div>
                  <span className="db-stock-badge">còn {item.soluongton}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Việc cần xử lý */}
        <div className="db-box">
          <h2>Việc cần xử lý</h2>
          <p className="db-box-desc">
            Các tác vụ quan trọng cần kiểm tra hôm nay
          </p>

          <div className="db-todo-list">
            <TodoItem color="#ef4444" text={`${thongKe.donchoxacnhan || 0} đơn hàng đang chờ xác nhận`} />
            <TodoItem color="#f59e0b" text={`${thongKe.sanphamsaphet || 0} sản phẩm sắp hết hàng`} />
            <TodoItem color="#ef4444" text={`${thongKe.dondahuy || 0} đơn hàng bị hủy cần kiểm tra`} />
            <TodoItem color="#3b82f6" text={`${thongKe.khachhangmoi || 0} khách hàng mới chưa được chăm sóc`} />
          </div>

          <button className="db-btn-all">Xem tất cả công việc</button>
        </div>

        {/* Sản phẩm bán chạy */}
        <div className="db-box">
          <h2>Sản phẩm bán chạy</h2>
          <p className="db-box-desc">
            Top sản phẩm doanh thu cao nhất 7 ngày
          </p>

          <div className="db-bestseller-list">
            {sanPhamBanChay.length === 0 ? (
              <div className="db-empty-mini">
                <Package size={24} />
                <span>Chưa có dữ liệu</span>
              </div>
            ) : (
              sanPhamBanChay.map((item, idx) => (
                <div className="db-bestseller-item" key={idx}>
                  <div className="db-bestseller-top">
                    <strong>{item.tensanpham}</strong>
                    <span>{item.sodon} đơn</span>
                  </div>
                  <div className="db-bestseller-bar-row">
                    <div className="db-bestseller-bar">
                      <div
                        className="db-bestseller-bar-fill"
                        style={{
                          width: maxDoanhThuBanChay > 0
                            ? `${Math.max(5, (item.doanhthu / maxDoanhThuBanChay) * 100)}%`
                            : "5%",
                        }}
                      />
                    </div>
                    <span>{formatTienVietNam(item.doanhthu)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ===== BẢNG ĐƠN HÀNG MỚI NHẤT ===== */}
      <div className="db-box db-orders-box">
        <div className="db-box-header">
          <div>
            <h2>Đơn hàng mới nhất</h2>
            <p>Các đơn hàng vừa được tạo trên hệ thống</p>
          </div>
          <button className="db-btn-viewall">Xem tất cả →</button>
        </div>

        {donHangMoi.length === 0 ? (
          <div className="db-orders-empty">
            <div className="db-orders-empty-icon">
              <ShoppingCart size={28} />
            </div>
            <h3>Chưa có đơn hàng nào</h3>
            <p>Khi khách hàng đặt hàng trên website, đơn mới sẽ hiển thị tại đây.</p>
          </div>
        ) : (
          <div className="db-table-wrap">
            <table className="db-table">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Số điện thoại</th>
                  <th>Tổng tiền</th>
                  <th>Thanh toán</th>
                  <th>Trạng thái</th>
                  <th>Thời gian</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {donHangMoi.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <span className="db-order-code">{item.madonhang}</span>
                    </td>
                    <td>{item.hoten}</td>
                    <td className="db-cell-muted">{item.sodienthoai}</td>
                    <td>
                      <strong>{formatTienVietNam(item.tongtien)}</strong>
                    </td>
                    <td className="db-cell-muted">
                      {item.thanhtoan || "COD"}
                    </td>
                    <td>
                      <TheTrangThai trangthai={item.trangthai} />
                    </td>
                    <td className="db-cell-muted">{item.created_at}</td>
                    <td>
                      <button className="db-btn-action" title="Xem chi tiết">
                        <Eye size={12} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ icon, mauIcon, tieuDe, giaTri, moTa, phu, mauPhu, badge, mauBadge, progressBar }) {
  return (
    <div className="db-stat-card">
      <div className={`db-stat-icon ${mauIcon}`}>{icon}</div>
      <div className="db-stat-content">
        <span className="db-stat-label">{tieuDe}</span>
        <strong className="db-stat-value">{giaTri}</strong>
        <span className="db-stat-desc">{moTa}</span>
        {phu && (
          <span className={`db-stat-extra ${mauPhu || ""}`}>{phu}</span>
        )}
        {badge && (
          <span className={`db-stat-badge ${mauBadge || ""}`}>{badge}</span>
        )}
        {progressBar !== undefined && (
          <div className="db-stat-progress">
            <div
              className="db-stat-progress-fill"
              style={{ width: `${Math.min(progressBar, 100)}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function StatusBar({ label, value, total, color }) {
  const width = total > 0 ? Math.max(2, (value / total) * 100) : 0;
  return (
    <div className="db-status-row">
      <div className="db-status-label">
        <span className="db-status-dot" style={{ background: color }} />
        <span>{label}</span>
      </div>
      <div className="db-status-progress" aria-hidden="true">
        <div
          className="db-status-progress-fill"
          style={{ width: `${width}%`, background: color }}
        />
      </div>
      <span className="db-status-value">{value}</span>
    </div>
  );
}

function TodoItem({ color, text }) {
  return (
    <div className="db-todo-item">
      <span className="db-todo-dot" style={{ background: color }} />
      <span>{text}</span>
    </div>
  );
}
