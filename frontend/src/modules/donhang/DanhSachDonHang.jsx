import { useEffect, useState } from "react";
import { Eye, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import NutBam from "../../components/ui/NutBam";
import TheTrangThai from "../../components/ui/TheTrangThai";
import useGiaoDienStore from "../../stores/giaodienStore";
import { formatTienVietNam } from "../../utils/dinhtien";
import ChiTietDonHangModal from "./ChiTietDonHangModal";
import {
  capNhatTrangThaiDonHang,
  layChiTietDonHang,
  layDanhSachDonHang,
  xoaDonHang,
} from "../../api/donhangApi";

const trangThaiOptions = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "cho_xac_nhan", label: "Chờ xác nhận" },
  { value: "da_xac_nhan", label: "Đã xác nhận" },
  { value: "dang_giao_hang", label: "Đang giao hàng" },
  { value: "hoan_thanh", label: "Hoàn thành" },
  { value: "da_huy", label: "Đã hủy" },
];

export default function DanhSachDonHang() {
  const capNhatTieuDeTrang = useGiaoDienStore(
    (state) => state.capNhatTieuDeTrang
  );

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
    tungay: "",
    denngay: "",
    trang: 1,
    gioihan: 10,
  });

  const [modalMo, setModalMo] = useState(false);
  const [donHangDangXem, setDonHangDangXem] = useState(null);

  useEffect(() => {
    capNhatTieuDeTrang(
      "Quản lý đơn hàng",
      "Theo dõi đơn hàng, xem chi tiết và cập nhật trạng thái xử lý"
    );
  }, [capNhatTieuDeTrang]);

  useEffect(() => {
    taiDanhSach();
  }, [boLoc.trang, boLoc.trangthai]);

  const taiDanhSach = async (thamSo = boLoc) => {
    try {
      setDangTai(true);

      const ketQua = await layDanhSachDonHang(thamSo);

      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được danh sách đơn hàng";

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

      const ketQua = await layChiTietDonHang(item.id);

      setDonHangDangXem(ketQua.dulieu);
      setModalMo(true);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được chi tiết đơn hàng";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const capNhatTrangThai = async (donHang, trangthai) => {
    if (donHang.trangthai === trangthai) {
      return;
    }

    const dongY = window.confirm("Bạn có chắc muốn cập nhật trạng thái đơn hàng này không?");

    if (!dongY) {
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await capNhatTrangThaiDonHang(donHang.id, trangthai);

      setDonHangDangXem(ketQua.dulieu);
      toast.success("Cập nhật trạng thái đơn hàng thành công");

      await taiDanhSach();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được trạng thái đơn hàng";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const xoa = async (item) => {
    const dongY = window.confirm(
      `Bạn có chắc muốn xóa đơn hàng "${item.madonhang}" không?`
    );

    if (!dongY) {
      return;
    }

    try {
      await xoaDonHang(item.id);
      toast.success("Xóa đơn hàng thành công");
      await taiDanhSach();
    } catch (loi) {
      const thongBao = loi?.response?.data?.thongbao || "Không xóa được đơn hàng";

      toast.error(thongBao);
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
    <div className="trang-don-hang-admin">
      <div className="thanh-cong-cu-trang">
        <form className="bo-loc-don-hang" onSubmit={timKiem}>
          <div className="o-tim-kiem-bang">
            <Search size={18} />
            <input
              name="timkiem"
              value={boLoc.timkiem}
              onChange={capNhatBoLoc}
              placeholder="Tìm mã đơn, tên khách, số điện thoại..."
            />
          </div>

          <select
            name="trangthai"
            value={boLoc.trangthai}
            onChange={capNhatBoLoc}
          >
            {trangThaiOptions.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>

          <input
            type="date"
            name="tungay"
            value={boLoc.tungay}
            onChange={capNhatBoLoc}
          />

          <input
            type="date"
            name="denngay"
            value={boLoc.denngay}
            onChange={capNhatBoLoc}
          />

          <NutBam type="submit" bienThe="phu">
            Tìm kiếm
          </NutBam>
        </form>
      </div>

      {dangTai && <DangTai noidung="Đang tải danh sách đơn hàng..." />}

      {!dangTai && danhSach.length === 0 && (
        <TrangRong
          tieude="Chưa có đơn hàng"
          mota="Khi khách đặt hàng trên website, đơn hàng sẽ hiển thị tại đây."
        />
      )}

      {!dangTai && danhSach.length > 0 && (
        <div className="khung-bang">
          <div className="bang-responsive">
            <table className="bang-du-lieu bang-don-hang">
              <thead>
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th style={{ width: 150 }}>Tổng tiền</th>
                  <th style={{ width: 150 }}>Trạng thái</th>
                  <th style={{ width: 150 }}>Ngày đặt</th>
                  <th style={{ width: 130 }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSach.map((item) => (
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

                    <td>
                      {new Date(item.created_at).toLocaleDateString("vi-VN")}
                    </td>

                    <td>
                      <div className="nhom-nut-thao-tac">
                        <button
                          className="nut-icon"
                          title="Xem chi tiết"
                          onClick={() => xemChiTiet(item)}
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          className="nut-icon nguy-hiem"
                          title="Xóa đơn hàng"
                          onClick={() => xoa(item)}
                        >
                          <Trash2 size={16} />
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
              <strong>{phanTrang.tongsodong}</strong> đơn hàng
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

      <ChiTietDonHangModal
        mo={modalMo}
        donHang={donHangDangXem}
        dangXuLy={dangXuLy}
        onDong={() => setModalMo(false)}
        onCapNhatTrangThai={capNhatTrangThai}
      />
    </div>
  );
}