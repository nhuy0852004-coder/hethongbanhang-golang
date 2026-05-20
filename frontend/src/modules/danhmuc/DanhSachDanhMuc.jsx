import { useEffect, useState } from "react";
import { Edit, Plus, Power, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useGiaoDienStore from "../../stores/giaodienStore";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import NutBam from "../../components/ui/NutBam";
import TheTrangThai from "../../components/ui/TheTrangThai";
import DanhMucModal from "./DanhMucModal";
import {
  capNhatDanhMuc,
  capNhatTrangThaiDanhMuc,
  layDanhSachDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
} from "../../api/danhmucApi";

export default function DanhSachDanhMuc() {
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
    hienthixoa: false,
    trang: 1,
    gioihan: 10,
  });

  const [modalMo, setModalMo] = useState(false);
  const [cheDoModal, setCheDoModal] = useState("them");
  const [duLieuSua, setDuLieuSua] = useState(null);

  useEffect(() => {
    capNhatTieuDeTrang(
      "Quản lý danh mục",
      "Quản lý nhóm sản phẩm, trạng thái hiển thị và thứ tự sắp xếp"
    );
  }, [capNhatTieuDeTrang]);

  useEffect(() => {
    taiDanhSach();
  }, [boLoc.trang, boLoc.trangthai, boLoc.hienthixoa]);

  const taiDanhSach = async () => {
    try {
      setDangTai(true);

      const ketQua = await layDanhSachDanhMuc({
        ...boLoc,
        hienthixoa: boLoc.hienthixoa ? 1 : 0,
      });

      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được danh sách danh mục";

      toast.error(thongBao);
    } finally {
      setDangTai(false);
    }
  };

  const capNhatBoLoc = (event) => {
    const { name, value, type, checked } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const timKiem = (event) => {
    event.preventDefault();

    setBoLoc((cu) => ({
      ...cu,
      trang: 1,
    }));

    setTimeout(() => {
      taiDanhSach();
    }, 0);
  };

  const moThem = () => {
    setCheDoModal("them");
    setDuLieuSua(null);
    setModalMo(true);
  };

  const moSua = (item) => {
    setCheDoModal("sua");
    setDuLieuSua(item);
    setModalMo(true);
  };

  const dongModal = () => {
    if (dangXuLy) return;

    setModalMo(false);
    setDuLieuSua(null);
  };

  const luuDanhMuc = async (duLieu) => {
    if (!duLieu.tendanhmuc) {
      toast.error("Vui lòng nhập tên danh mục");
      return;
    }

    try {
      setDangXuLy(true);

      if (cheDoModal === "them") {
        await themDanhMuc(duLieu);
        toast.success("Thêm danh mục thành công");
      } else {
        await capNhatDanhMuc(duLieuSua.id, duLieu);
        toast.success("Cập nhật danh mục thành công");
      }

      dongModal();
      await taiDanhSach();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không lưu được danh mục";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const doiTrangThai = async (item) => {
    const trangThaiMoi = item.trangthai === "hien_thi" ? "an" : "hien_thi";

    let noiDungXacNhan =
      trangThaiMoi === "an"
        ? `Ẩn danh mục "${item.tendanhmuc}"?\n\nNếu danh mục này có danh mục con, hệ thống sẽ ẩn luôn các danh mục con.`
        : `Hiển thị lại danh mục "${item.tendanhmuc}"?\n\nNếu danh mục cha đang ẩn, hệ thống sẽ không cho bật.`;

    const dongY = window.confirm(noiDungXacNhan);

    if (!dongY) return;

    try {
      await capNhatTrangThaiDanhMuc(item.id, trangThaiMoi);
      toast.success("Cập nhật trạng thái thành công");
      await taiDanhSach();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được trạng thái";

      toast.error(thongBao);
    }
  };

  const xoa = async (item) => {
    const dongY = window.confirm(
      `Bạn có chắc muốn xóa danh mục "${item.tendanhmuc}" không?\n\n` +
        `Sản phẩm đang thuộc danh mục: ${item.sosanpham}\n` +
        `Danh mục con: ${item.sodanhmuccon}\n\n` +
        `Nếu danh mục còn sản phẩm hoặc danh mục con, hệ thống sẽ không cho xóa.`
    );

    if (!dongY) return;

    try {
      await xoaDanhMuc(item.id);
      toast.success("Xóa danh mục thành công");
      await taiDanhSach();
    } catch (loi) {
      const thongBao = loi?.response?.data?.thongbao || "Không xóa được danh mục";
      toast.error(thongBao);
    }
  };

  const chuyenTrang = (trangMoi) => {
    if (trangMoi < 1 || trangMoi > phanTrang.tongsotrang) return;

    setBoLoc((cu) => ({
      ...cu,
      trang: trangMoi,
    }));
  };

  return (
    <div>
      <div className="thanh-cong-cu-trang">
        <form className="bo-loc-danh-muc" onSubmit={timKiem}>
          <div className="o-tim-kiem-bang">
            <Search size={18} />
            <input
              name="timkiem"
              value={boLoc.timkiem}
              onChange={capNhatBoLoc}
              placeholder="Tìm theo tên danh mục hoặc đường dẫn..."
            />
          </div>

          <select
            name="trangthai"
            value={boLoc.trangthai}
            onChange={capNhatBoLoc}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="hien_thi">Hiển thị</option>
            <option value="an">Đang ẩn</option>
          </select>

          <label className="checkbox-hien-xoa">
            <input
              type="checkbox"
              name="hienthixoa"
              checked={boLoc.hienthixoa}
              onChange={capNhatBoLoc}
            />
            Hiển thị danh mục đã xóa mềm
          </label>

          <NutBam type="submit" bienThe="phu">
            Tìm kiếm
          </NutBam>
        </form>

        <NutBam icon={Plus} onClick={moThem}>
          Thêm danh mục
        </NutBam>
      </div>

      {dangTai && <DangTai noidung="Đang tải danh sách danh mục..." />}

      {!dangTai && danhSach.length === 0 && (
        <TrangRong
          tieude="Chưa có danh mục"
          mota="Hãy thêm danh mục đầu tiên để bắt đầu quản lý sản phẩm."
          nut="Thêm danh mục"
          onClick={moThem}
        />
      )}

      {!dangTai && danhSach.length > 0 && (
        <div className="khung-bang">
          <div className="bang-responsive">
            <table className="bang-du-lieu">
              <thead>
                <tr>
                  <th style={{ width: 70 }}>ID</th>
                  <th>Tên danh mục</th>
                  <th>Danh mục cha</th>
                  <th style={{ width: 120 }}>Sản phẩm</th>
                  <th style={{ width: 130 }}>Trạng thái</th>
                  <th style={{ width: 130 }}>Xóa mềm</th>
                  <th style={{ width: 90 }}>Thứ tự</th>
                  <th style={{ width: 160 }}>Thao tác</th>
                </tr>
              </thead>

              <tbody>
                {danhSach.map((item) => (
                  <tr key={item.id}>
                    <td>#{item.id}</td>

                    <td>
                      <div className="cot-ten-danh-muc">
                        <strong>{item.tendanhmuc}</strong>
                        <span>{item.duongdan}</span>
                      </div>
                    </td>

                    <td>
                      {item.tendanhmuccha ? (
                        item.tendanhmuccha
                      ) : (
                        <span className="chu-phu">Danh mục gốc</span>
                      )}
                    </td>

                    <td>
                      <div className="so-luong-nho">
                        <strong>{item.sosanpham}</strong>
                        <span>sản phẩm</span>
                      </div>
                    </td>

                    <td>
                      <TheTrangThai trangthai={item.trangthai} />
                    </td>

                    <td>
                      {item.daxoa ? (
                        <span className="nhan-da-xoa">Đã xóa</span>
                      ) : (
                        <span className="nhan-chua-xoa">Đang dùng</span>
                      )}
                    </td>

                    <td>{item.thutu}</td>

                    <td>
                      <div className="nhom-nut-thao-tac">
                        <button
                          type="button"
                          className="nut-icon"
                          title="Bật/tắt trạng thái"
                          disabled={item.daxoa}
                          onClick={() => doiTrangThai(item)}
                        >
                          <Power size={16} />
                        </button>

                        <button
                          type="button"
                          className="nut-icon"
                          title="Sửa danh mục"
                          disabled={item.daxoa}
                          onClick={() => moSua(item)}
                        >
                          <Edit size={16} />
                        </button>

                        <button
                          type="button"
                          className="nut-icon nguy-hiem"
                          title="Xóa danh mục"
                          disabled={item.daxoa}
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
              <strong>{phanTrang.tongsodong}</strong> danh mục
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

      <DanhMucModal
        mo={modalMo}
        cheDo={cheDoModal}
        duLieuSua={duLieuSua}
        danhSachDanhMuc={danhSach}
        dangXuLy={dangXuLy}
        onDong={dongModal}
        onLuu={luuDanhMuc}
      />
    </div>
  );
}
