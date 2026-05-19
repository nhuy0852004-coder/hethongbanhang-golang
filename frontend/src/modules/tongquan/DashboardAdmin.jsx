import {
    AlertTriangle,
    Boxes,
    Package,
    ShoppingCart,
    TrendingUp,
    Users,
  } from "lucide-react";
  import { useEffect, useMemo, useState } from "react";
  import toast from "react-hot-toast";
  import DangTai from "../../components/DangTai";
  import TrangRong from "../../components/TrangRong";
  import TheTrangThai from "../../components/ui/TheTrangThai";
  import { layTongQuan } from "../../api/tongquanApi";
  import { formatTienVietNam } from "../../utils/dinhtien";
  import useGiaoDienStore from "../../stores/giaodienStore";
  
  export default function DashboardAdmin() {
    const capNhatTieuDeTrang = useGiaoDienStore((state) => state.capNhatTieuDeTrang);
  
    const [dangTai, setDangTai] = useState(true);
    const [duLieu, setDuLieu] = useState(null);
  
    useEffect(() => {
      capNhatTieuDeTrang(
        "Tổng quan",
        "Theo dõi doanh thu, đơn hàng, sản phẩm và cảnh báo tồn kho"
      );
    }, [capNhatTieuDeTrang]);
  
    useEffect(() => {
      taiDuLieu();
    }, []);
  
    const taiDuLieu = async () => {
      try {
        setDangTai(true);
  
        const ketQua = await layTongQuan();
  
        setDuLieu(ketQua.dulieu);
      } catch (loi) {
        const thongBao =
          loi?.response?.data?.thongbao || "Không tải được dữ liệu tổng quan";
  
        toast.error(thongBao);
      } finally {
        setDangTai(false);
      }
    };
  
    const doanhThuLonNhat = useMemo(() => {
      if (!duLieu?.doanhthubayngay?.length) return 0;
  
      return Math.max(...duLieu.doanhthubayngay.map((item) => item.doanhthu || 0));
    }, [duLieu]);
  
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
  
    return (
      <div className="dashboard-admin">
        <div className="dashboard-grid-card">
          <div className="dashboard-card">
            <div className="dashboard-card-icon xanh">
              <TrendingUp size={24} />
            </div>
  
            <div>
              <span>Doanh thu hôm nay</span>
              <strong>{formatTienVietNam(thongKe.doanhthuhomnay || 0)}</strong>
              <p>Tính đơn đã hoàn thành</p>
            </div>
          </div>
  
          <div className="dashboard-card">
            <div className="dashboard-card-icon duong">
              <ShoppingCart size={24} />
            </div>
  
            <div>
              <span>Đơn hàng hôm nay</span>
              <strong>{thongKe.donhanghomnay || 0}</strong>
              <p>Tất cả trạng thái</p>
            </div>
          </div>
  
          <div className="dashboard-card">
            <div className="dashboard-card-icon tim">
              <Package size={24} />
            </div>
  
            <div>
              <span>Tổng sản phẩm</span>
              <strong>{thongKe.tongsanpham || 0}</strong>
              <p>Sản phẩm đang quản lý</p>
            </div>
          </div>
  
          <div className="dashboard-card">
            <div className="dashboard-card-icon cam">
              <Users size={24} />
            </div>
  
            <div>
              <span>Tổng khách hàng</span>
              <strong>{thongKe.tongkhachhang || 0}</strong>
              <p>Khách đã đặt hàng</p>
            </div>
          </div>
        </div>
  
        <div className="dashboard-grid-chinh">
          <div className="dashboard-box">
            <div className="dashboard-box-title">
              <div>
                <h2>Doanh thu 7 ngày</h2>
                <p>Chỉ tính các đơn hàng đã hoàn thành</p>
              </div>
            </div>
  
            <div className="bieu-do-doanh-thu">
              {(duLieu.doanhthubayngay || []).map((item) => {
                const chieuCao =
                  doanhThuLonNhat > 0
                    ? Math.max(8, Math.round((item.doanhthu / doanhThuLonNhat) * 160))
                    : 8;
  
                return (
                  <div className="cot-bieu-do" key={item.ngay}>
                    <div className="cot-gia-tri">
                      <span>{formatTienVietNam(item.doanhthu)}</span>
                      <div style={{ height: `${chieuCao}px` }} />
                    </div>
  
                    <small>
                      {new Date(item.ngay).toLocaleDateString("vi-VN", {
                        day: "2-digit",
                        month: "2-digit",
                      })}
                    </small>
                  </div>
                );
              })}
            </div>
          </div>
  
          <div className="dashboard-box">
            <div className="dashboard-box-title">
              <div>
                <h2>Sản phẩm sắp hết hàng</h2>
                <p>Cảnh báo sản phẩm còn từ 5 trở xuống</p>
              </div>
  
              <AlertTriangle size={22} />
            </div>
  
            {(duLieu.sanphamsaphethang || []).length === 0 ? (
              <div className="dashboard-empty-mini">
                <Boxes size={28} />
                <span>Chưa có sản phẩm sắp hết hàng</span>
              </div>
            ) : (
              <div className="ds-san-pham-sap-het">
                {duLieu.sanphamsaphethang.map((item) => (
                  <div className="item-san-pham-sap-het" key={item.id}>
                    {item.hinhanh ? (
                      <img src={`http://localhost:8080${item.hinhanh}`} alt={item.tensanpham} />
                    ) : (
                      <div className="anh-sap-het-trong">Ảnh</div>
                    )}
  
                    <div>
                      <strong>{item.tensanpham}</strong>
                      <span>{item.tendanhmuc || "Chưa phân loại"}</span>
                    </div>
  
                    <b>{item.soluongton}</b>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
  
        <div className="dashboard-box mt-3">
          <div className="dashboard-box-title">
            <div>
              <h2>Đơn hàng mới nhất</h2>
              <p>Các đơn hàng vừa được tạo trên website</p>
            </div>
          </div>
  
          {(duLieu.donhangmoinhat || []).length === 0 ? (
            <TrangRong
              tieude="Chưa có đơn hàng"
              mota="Khi khách đặt hàng, đơn mới sẽ hiển thị tại đây."
            />
          ) : (
            <div className="bang-responsive">
              <table className="bang-du-lieu bang-dashboard-don">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th style={{ width: 150 }}>Tổng tiền</th>
                    <th style={{ width: 150 }}>Trạng thái</th>
                    <th style={{ width: 160 }}>Thời gian</th>
                  </tr>
                </thead>
  
                <tbody>
                  {duLieu.donhangmoinhat.map((item) => (
                    <tr key={item.id}>
                      <td>
                        <div className="ma-don-hang">
                          <strong>{item.madonhang}</strong>
                          <span>#{item.id}</span>
                        </div>
                      </td>
  
                      <td>
                        <div className="khach-don-hang">
                          <strong>{item.hoten}</strong>
                          <span>{item.sodienthoai}</span>
                        </div>
                      </td>
  
                      <td>
                        <strong>{formatTienVietNam(item.tongtien)}</strong>
                      </td>
  
                      <td>
                        <TheTrangThai trangthai={item.trangthai} />
                      </td>
  
                      <td>{item.created_at}</td>
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