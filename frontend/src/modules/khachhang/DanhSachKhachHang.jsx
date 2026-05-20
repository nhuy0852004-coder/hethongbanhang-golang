import { Eye, Search } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import NutBam from "../../components/ui/NutBam";
import TheTrangThai from "../../components/ui/TheTrangThai";
import useGiaoDienStore from "../../stores/giaodienStore";
import { formatTienVietNam } from "../../utils/dinhtien";
import { layChiTietKhachHang, layDanhSachKhachHang } from "../../api/khachhangApi";
import ChiTietKhachHangModal from "./ChiTietKhachHangModal";

export default function DanhSachKhachHang() {
  const capNhatTieuDeTrang = useGiaoDienStore((state) => state.capNhatTieuDeTrang);

  const [dangTai, setDangTai] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [danhSach, setDanhSach] = useState([]);

  const [phanTrang, setPhanTrang] = useState({
    trang: 1,
    gioihan: 10,
    tongsodong: 0,
    tongsotrang: 1,
  });

  const [boLoc, setBoLoc] = useState({
    timkiem: "",
    trangthai: "",
    trang: 1,
    gioihan: 10,
  });

  const [modalMo, setModalMo] = useState(false);
  const [duLieuChiTiet, setDuLieuChiTiet] = useState(null);

  useEffect(() => {
    capNhatTieuDeTrang(
      "Quản lý khách hàng",
      "Theo dõi thông tin khách hàng, tổng chi tiêu và lịch sử mua hàng"
    );
  }, [capNhatTieuDeTrang]);

  useEffect(() => {
    taiDanhSach();
  }, [boLoc.trang, boLoc.trangthai]);

  const taiDanhSach = async (thamSo = boLoc) => {
    try {
      setDangTai(true);

      const ketQua = await layDanhSachKhachHang(thamSo);

      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được danh sách khách hàng";

      toast.error(thongBao);
    } finally {
      setDangTai(false);
    }
  };

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const timKiem = (event) => {
    event.preventDefault();

    const locMoi = {
      ...boLoc,
      trang: 1,
    };

    setBoLoc(locMoi);
    taiDanhSach(locMoi);
  };

  const xemChiTiet = async (item) => {
    try {
      setDangXuLy(true);

      const ketQua = await layChiTietKhachHang(item.id);

      setDuLieuChiTiet(ketQua.dulieu);
      setModalMo(true);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được chi tiết khách hàng";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const chuyenTrang = (trangMoi) => {
    if (trangMoi < 1 || trangMoi > phanTrang.tongsotrang) {
      return;
    }

    setBoLoc((cu) => ({
      ...cu,
      trang: trangMoi,
    }));
  };

  return (
    <div className="trang-khach-hang-admin">
      <div className="thanh-cong-cu-trang">
        <form className="bo-loc-khach-hang" onSubmit={timKiem}>
          <div className="o-tim-kiem-bang">
            <Search size={18} />
            <input
              name="timkiem"
              value={boLoc.timkiem}
              onChange={capNhatBoLoc}
              placeholder="Tìm theo tên, số điện thoại hoặc email..."
            />
          </div>

          <select
            name="trangthai"
            value={boLoc.trangthai}
            onChange={capNhatBoLoc}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="hoat_dong">Hoạt động</option>
            <option value="tam_khoa">Tạm khóa</option>
          </select>

          <NutBam type="submit" bienThe="phu">
            Tìm kiếm
          </NutBam>
        </form>
      </div>

      {dangTai && <DangTai noidung="Đang tải danh sách khách hàng..." />}

      {!dangTai && danhSach.length === 0 && (
        <TrangRong
          tieude="Chưa có khách hàng"
          mota="Khi khách đặt hàng trên website, thông tin khách hàng sẽ tự động được lưu tại đây."
        />
      )}

      {!dangTai && danhSach.length > 0 && (
        <div className="khung-bang">
          <div className="bang-responsive">
            <table className="bang-du-lieu bang-khach-hang">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th style={{ width: 160 }}>Liên hệ</th>
                  <th style={{ width: 130 }}>Tổng đơn</th>
                  <th style={{ width: 160 }}>Tổng chi tiêu</th>
                  <th style={{ width: 150 }}>Trạng thái</th>
                  <th style={{ width: 160 }}>Đơn gần nhất</th>
                  <th style={{ width: 100 }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSach.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="cot-khach-hang">
                        <div className="avatar-khach-hang">
                          {(item.hoten || "K").charAt(0).toUpperCase()}
                        </div>

                        <div>
                          <strong>{item.hoten}</strong>
                          <span>{item.diachi || "Chưa có địa chỉ"}</span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div className="lien-he-khach">
                        <strong>{item.sodienthoai}</strong>
                        <span>{item.email || "Không có email"}</span>
                      </div>
                    </td>

                    <td>
                      <strong>{item.tongdonhang}</strong>
                    </td>

                    <td>
                      <strong>{formatTienVietNam(item.tongchitieu)}</strong>
                    </td>

                    <td>
                      <TheTrangThai trangthai={item.trangthai} />
                    </td>

                    <td>{item.dongannhat || "Chưa có"}</td>

                    <td>
                      <div className="nhom-nut-thao-tac">
                        <button
                          className="nut-icon"
                          title="Xem chi tiết"
                          disabled={dangXuLy}
                          onClick={() => xemChiTiet(item)}
                        >
                          <Eye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="phan-trang">
            <div>
              Hiển thị <strong>{danhSach.length}</strong> trên{" "}
              <strong>{phanTrang.tongsodong}</strong> khách hàng
            </div>

            <div className="nut-phan-trang">
              <button
                disabled={phanTrang.trang <= 1}
                onClick={() => chuyenTrang(phanTrang.trang - 1)}
              >
                Trước
              </button>

              <span>
                Trang {phanTrang.trang} / {phanTrang.tongsotrang}
              </span>

              <button
                disabled={phanTrang.trang >= phanTrang.tongsotrang}
                onClick={() => chuyenTrang(phanTrang.trang + 1)}
              >
                Sau
              </button>
            </div>
          </div>
        </div>
      )}

      <ChiTietKhachHangModal
        mo={modalMo}
        duLieu={duLieuChiTiet}
        onDong={() => setModalMo(false)}
      />
    </div>
  );
}