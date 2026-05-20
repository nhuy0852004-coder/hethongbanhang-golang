import { useEffect, useState } from "react";
import { Pencil, Plus, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import useGiaoDienStore from "../../stores/giaodienStore";
import NutBam from "../../components/ui/NutBam";
import TheTrangThai from "../../components/ui/TheTrangThai";
import DanhMucModal from "./DanhMucModal";
import BangDangTai from "../../components/ui/BangDangTai";
import BangTrong from "../../components/ui/BangTrong";
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
    if (item.daxoa) {
      toast.error("Danh mục đã xóa mềm, không thể đổi trạng thái");
      return;
    }

    const trangThaiMoi = item.trangthai === "hien_thi" ? "an" : "hien_thi";

    try {
      await capNhatTrangThaiDanhMuc(item.id, trangThaiMoi);

      toast.success(
        trangThaiMoi === "hien_thi"
          ? "Đã bật hiển thị danh mục"
          : "Đã ẩn danh mục"
      );

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

      {dangTai ? (
        <BangDangTai soCot={9} soDong={6} />
      ) : danhSach.length === 0 ? (
        <BangTrong
          tieuDe="Chưa có danh mục nào"
          moTa="Hãy tạo danh mục đầu tiên cho hệ thống bán hàng."
        />
      ) : (
        <div className="bang-responsive">
          <table className="bang-du-lieu">
            <thead>
              <tr>
                <th style={{ width: 50 }}>
                  <input type="checkbox" />
                </th>

                <th>Tên danh mục</th>

                <th style={{ width: 170 }}>Đường dẫn</th>

                <th style={{ width: 130 }}>Danh mục cha</th>

                <th style={{ width: 100 }}>Sản phẩm</th>

                <th style={{ width: 100 }}>Danh mục con</th>

                <th style={{ width: 120 }}>Trạng thái</th>

                <th style={{ width: 130 }}>Xóa mềm</th>

                <th style={{ width: 180 }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {danhSach.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input type="checkbox" />
                  </td>

                  <td>
                    <div className="o-ten-danh-muc">
                      <strong>{item.tendanhmuc}</strong>

                      <div className="meta-danh-muc">
                        <span>Thứ tự: {item.thutu}</span>

                        {item.created_at && (
                          <span>
                            Tạo: {new Date(item.created_at).toLocaleDateString("vi-VN")}
                          </span>
                        )}
                      </div>
                    </div>
                  </td>

                  <td>
                    <code className="duong-dan-chip">/{item.duongdan}</code>
                  </td>

                  <td>
                    {item.tendanhmuccha || (
                      <span className="text-muted">Danh mục gốc</span>
                    )}
                  </td>

                  <td>
                    <span className="so-lieu-text">
                      {item.sosanpham} sản phẩm
                    </span>
                  </td>

                  <td>
                    <span className="so-lieu-text">
                      {item.sodanhmuccon} mục con
                    </span>
                  </td>

                  <td>
                    <button
                      type="button"
                      className={`nut-toggle-trang-thai ${
                        item.trangthai === "hien_thi" ? "bat" : "tat"
                      }`}
                      title={item.trangthai === "hien_thi" ? "Đang hiển thị" : "Đang ẩn"}
                      disabled={item.daxoa}
                      onClick={() => doiTrangThai(item)}
                    >
                      <span className="toggle-thumb"></span>
                    </button>
                  </td>

                  <td>
                  <span className={item.daxoa ? "chu-xoa-mem da-xoa" : "chu-xoa-mem dang-dung"}>
                    {item.daxoa ? "Đã xóa" : "Đang dùng"}
                  </span>
                  </td>

                  <td>
                    <div className="nhom-thao-tac-icon">
                      <button
                        type="button"
                        className="nut-icon-tron"
                        title="Sửa danh mục"
                        disabled={item.daxoa}
                        onClick={() => moSua(item)}
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className="nut-icon-tron nguy-hiem"
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
