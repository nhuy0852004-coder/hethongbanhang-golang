import { Bell, LogOut, Menu, Search } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import useTaiKhoanStore from "../../stores/taikhoanStore";
import useGiaoDienStore from "../../stores/giaodienStore";
import useRealtimeAdmin from "../../hooks/useRealtimeAdmin";
import useThongBaoStore from "../../stores/thongbaoStore";

export default function DauTrangAdmin() {
  const navigate = useNavigate();

  const [moThongBao, setMoThongBao] = useState(false);

  const taikhoan = useTaiKhoanStore((state) => state.taikhoan);
  const dangXuat = useTaiKhoanStore((state) => state.dangXuat);

  const moSidebarMobile = useGiaoDienStore((state) => state.moSidebarMobile);

  const danhsachThongBao = useThongBaoStore((state) => state.danhsach);
  const soChuaDoc = useThongBaoStore((state) => state.soChuaDoc);
  const taiThongBao = useThongBaoStore((state) => state.taiThongBao);
  const taiSoChuaDoc = useThongBaoStore((state) => state.taiSoChuaDoc);
  const themThongBaoMoi = useThongBaoStore((state) => state.themThongBaoMoi);
  const capNhatDaDoc = useThongBaoStore((state) => state.capNhatDaDoc);
  const danhDauTatCaDaDoc = useThongBaoStore(
    (state) => state.danhDauTatCaDaDoc
  );

  useEffect(() => {
    if (taikhoan) {
      taiThongBao({ trang: 1, gioihan: 8 });
      taiSoChuaDoc();
    }
  }, [taikhoan, taiThongBao, taiSoChuaDoc]);

  const { daKetNoi } = useRealtimeAdmin({
    bat: Boolean(taikhoan),
    onThongBaoMoi: (thongbao) => {
      themThongBaoMoi(thongbao);
    },
  });

  const xuLyDangXuat = () => {
    dangXuat();
    toast.success("Đã đăng xuất");
    navigate("/admin/dangnhap", { replace: true });
  };

  const xuLyDocThongBao = async (item) => {
    if (!item.dadoc) {
      await capNhatDaDoc(item.id, true);
    }

    const donhangID = item.dulieu?.donhang_id;

    if (donhangID) {
      navigate("/admin/donhang");
      setMoThongBao(false);
    }
  };

  const xuLyDanhDauTatCa = async () => {
    await danhDauTatCaDaDoc();
    toast.success("Đã đánh dấu tất cả là đã đọc");
  };

  return (
    <header className="header-admin">
      <div className="header-trai">
        <button className="nut-menu-mobile" onClick={moSidebarMobile}>
          <Menu size={21} />
        </button>
      </div>

      <div className="header-giua">
        <div className="o-tim-kiem-header">
          <Search size={18} />
          <input placeholder="Tìm kiếm sản phẩm, đơn hàng, khách hàng..." />
        </div>
      </div>

      <div className="header-phai">
        <div
          className={
            daKetNoi
              ? "trang-thai-realtime ket-noi"
              : "trang-thai-realtime mat-ket-noi"
          }
        >
          {daKetNoi ? "Realtime" : "Mất kết nối"}
        </div>

        <div className="cum-thong-bao-header">
          <button
            className="nut-chuong"
            onClick={() => setMoThongBao((cu) => !cu)}
          >
            <Bell size={19} />
            <span>{soChuaDoc > 99 ? "99+" : soChuaDoc}</span>
          </button>

          {moThongBao && (
            <div className="dropdown-thong-bao">
              <div className="dau-dropdown-thong-bao">
                <div>
                  <strong>Thông báo</strong>
                  <span>{soChuaDoc} chưa đọc</span>
                </div>

                <button onClick={xuLyDanhDauTatCa}>Đọc tất cả</button>
              </div>

              <div className="ds-dropdown-thong-bao">
                {danhsachThongBao.length === 0 ? (
                  <div className="dropdown-rong">Chưa có thông báo</div>
                ) : (
                  danhsachThongBao.map((item) => (
                    <button
                      key={item.id}
                      className={
                        item.dadoc
                          ? "item-thong-bao"
                          : "item-thong-bao chua-doc"
                      }
                      onClick={() => xuLyDocThongBao(item)}
                    >
                      <strong>{item.tieude}</strong>
                      <span>{item.noidung}</span>
                    </button>
                  ))
                )}
              </div>

              <Link
                to="/admin/thongbao"
                className="link-xem-tat-ca-thong-bao"
                onClick={() => setMoThongBao(false)}
              >
                Xem tất cả thông báo
              </Link>
            </div>
          )}
        </div>

        <div className="tai-khoan-admin">
          <div className="avatar-admin">
            {(taikhoan?.hoten || "Q").charAt(0).toUpperCase()}
          </div>

          <div className="thong-tin-admin">
            <strong>{taikhoan?.hoten || "Quản trị viên"}</strong>
            <span>
              {taikhoan?.vaitro === "quantri" ? "Quản trị" : "Nhân viên"}
            </span>
          </div>

          <button className="nut-dang-xuat-admin" onClick={xuLyDangXuat}>
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
}