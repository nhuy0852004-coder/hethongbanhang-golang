import { useEffect, useState } from "react";
import { Pencil, Plus, RefreshCw, Search, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import NutBam from "../../components/ui/NutBam";
import BangDangTai from "../../components/ui/BangDangTai";
import BangTrong from "../../components/ui/BangTrong";
import XacNhanModal from "../../components/ui/XacNhanModal";
import DanhMucModal from "./DanhMucModal";
import {
  bulkCapNhatTrangThaiDanhMuc,
  bulkXoaDanhMuc,
  capNhatDanhMuc,
  capNhatTrangThaiDanhMuc,
  layDanhSachDanhMuc,
  themDanhMuc,
  xoaDanhMuc,
} from "../../api/danhmucApi";

export default function DanhSachDanhMuc() {
  const [dangTai, setDangTai] = useState(false);
  const [dangXuLy, setDangXuLy] = useState(false);
  const [dangDoiTrangThaiId, setDangDoiTrangThaiId] = useState(null);

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
  const [modalXoaMo, setModalXoaMo] = useState(false);
  const [danhMucDangXoa, setDanhMucDangXoa] = useState(null);
  const [idsDangChon, setIdsDangChon] = useState([]);
  const [modalBulkXoaMo, setModalBulkXoaMo] = useState(false);

  useEffect(() => {
    taiDanhSach();
  }, [boLoc.trang, boLoc.trangthai, boLoc.hienthixoa]);

  useEffect(() => {
    const timer = setTimeout(() => {
      taiDanhSach({
        ...boLoc,
        trang: 1,
      });
    }, 350);

    return () => clearTimeout(timer);
  }, [boLoc.timkiem, boLoc.trangthai, boLoc.hienthixoa]);

  const taiDanhSach = async (thamSo = boLoc, tuyChon = { hienLoading: true }) => {
    try {
      if (tuyChon.hienLoading) {
        setDangTai(true);
      }

      const ketQua = await layDanhSachDanhMuc({
        ...thamSo,
        hienthixoa: thamSo.hienthixoa ? 1 : 0,
      });

      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không tải được danh sách danh mục";

      toast.error(thongBao);
    } finally {
      if (tuyChon.hienLoading) {
        setDangTai(false);
      }
    }
  };

  const capNhatBoLoc = (event) => {
    const { name, value, type, checked } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: type === "checkbox" ? checked : value,
      trang: 1,
    }));
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

    if (dangDoiTrangThaiId === item.id) {
      return;
    }

    const trangThaiCu = item.trangthai;
    const trangThaiMoi = item.trangthai === "hien_thi" ? "an" : "hien_thi";

    try {
      setDangDoiTrangThaiId(item.id);

      // Đổi trước trên UI để switch nhảy ngay
      setDanhSach((danhSachCu) =>
        danhSachCu.map((dm) =>
          dm.id === item.id
            ? {
                ...dm,
                trangthai: trangThaiMoi,
              }
            : dm
        )
      );

      const ketQua = await capNhatTrangThaiDanhMuc(item.id, trangThaiMoi);

      const duLieuMoi = ketQua?.dulieu;

      // Lấy trạng thái thật backend trả về để set lại cho chắc
      if (duLieuMoi?.id) {
        setDanhSach((danhSachCu) =>
          danhSachCu.map((dm) =>
            dm.id === duLieuMoi.id
              ? {
                  ...dm,
                  ...duLieuMoi,
                }
              : dm
          )
        );
      }

      toast.success(
        (duLieuMoi?.trangthai || trangThaiMoi) === "hien_thi"
          ? "Đã bật hiển thị danh mục"
          : "Đã ẩn danh mục"
      );
    } catch (loi) {
      // Nếu lỗi thì trả về trạng thái cũ
      setDanhSach((danhSachCu) =>
        danhSachCu.map((dm) =>
          dm.id === item.id
            ? {
                ...dm,
                trangthai: trangThaiCu,
              }
            : dm
        )
      );

      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được trạng thái";

      toast.error(thongBao);
    } finally {
      setDangDoiTrangThaiId(null);
    }
  };

  const moXoa = (item) => {
    setDanhMucDangXoa(item);
    setModalXoaMo(true);
  };

  const dongModalXoa = () => {
    if (dangXuLy) return;

    setDanhMucDangXoa(null);
    setModalXoaMo(false);
  };

  const xacNhanXoa = async () => {
    if (!danhMucDangXoa) return;

    try {
      setDangXuLy(true);

      await xoaDanhMuc(danhMucDangXoa.id);

      toast.success("Xóa danh mục thành công");

      dongModalXoa();
      await taiDanhSach();
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa được danh mục";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const lamMoiDuLieu = async () => {
    await taiDanhSach();
    toast.success("Đã làm mới dữ liệu danh mục");
  };

  const chuyenTrang = (trangMoi) => {
    if (trangMoi < 1 || trangMoi > phanTrang.tongsotrang) return;

    setBoLoc((cu) => ({
      ...cu,
      trang: trangMoi,
    }));
  };

  const boChonTatCa = () => {
    setIdsDangChon([]);
  };

  const bulkDoiTrangThai = async (trangthai) => {
    if (idsDangChon.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await bulkCapNhatTrangThaiDanhMuc(idsDangChon, trangthai);

      toast.success(
        trangthai === "hien_thi"
          ? `Đã bật hiển thị ${ketQua.dulieu.thanhcong} danh mục`
          : `Đã ẩn ${ketQua.dulieu.thanhcong} danh mục`
      );

      setIdsDangChon([]);
      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không cập nhật được danh mục đã chọn";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const xacNhanBulkXoa = async () => {
    if (idsDangChon.length === 0) {
      toast.error("Vui lòng chọn ít nhất một danh mục");
      return;
    }

    try {
      setDangXuLy(true);

      const ketQua = await bulkXoaDanhMuc(idsDangChon);

      if (ketQua.dulieu.thatbai > 0) {
        toast.error(
          `Xóa thành công ${ketQua.dulieu.thanhcong}, thất bại ${ketQua.dulieu.thatbai}`
        );
      } else {
        toast.success(`Đã xóa ${ketQua.dulieu.thanhcong} danh mục`);
      }

      setIdsDangChon([]);
      setModalBulkXoaMo(false);

      await taiDanhSach(boLoc);
    } catch (loi) {
      const thongBao =
        loi?.response?.data?.thongbao || "Không xóa được danh mục đã chọn";

      toast.error(thongBao);
    } finally {
      setDangXuLy(false);
    }
  };

  const idsCoTheChon = danhSach
    .filter((item) => !item.daxoa)
    .map((item) => item.id);

  const daChonTatCa =
    idsCoTheChon.length > 0 &&
    idsCoTheChon.every((id) => idsDangChon.includes(id));

  const batTatChonTatCa = () => {
    if (daChonTatCa) {
      setIdsDangChon((cu) => cu.filter((id) => !idsCoTheChon.includes(id)));
      return;
    }

    setIdsDangChon((cu) => Array.from(new Set([...cu, ...idsCoTheChon])));
  };

  const batTatChonMotDong = (itemId) => {
    setIdsDangChon((cu) =>
      cu.includes(itemId)
        ? cu.filter((id) => id !== itemId)
        : [...cu, itemId]
    );
  };

  return (
    <div className="trang-danh-muc-admin">
      <div className="dau-trang-danh-muc">
        <div>
          <h1>Quản lý danh mục</h1>
          <p>Quản lý nhóm sản phẩm, trạng thái và thứ tự sản phẩm</p>
        </div>
      </div>
      <div className="thanh-danh-muc">
        <div className="bo-loc-card-danh-muc">
          <div className="o-tim-danh-muc">
            <Search size={18} />
            <input
              name="timkiem"
              value={boLoc.timkiem}
              onChange={capNhatBoLoc}
              placeholder="Tìm theo tên danh mục hoặc đường dẫn..."
            />
          </div>

          <div className="cum-loc-danh-muc">
            <div className="select-loc-wrap">
              <select
                name="trangthai"
                value={boLoc.trangthai}
                onChange={capNhatBoLoc}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="hien_thi">Hiển thị</option>
                <option value="an">Đang ẩn</option>
              </select>
            </div>

            <label className="checkbox-xoa-mem-moi">
              <input
                type="checkbox"
                name="hienthixoa"
                checked={boLoc.hienthixoa}
                onChange={capNhatBoLoc}
              />
              <span>Hiển thị đã xóa</span>
            </label>

            <button
              type="button"
              className="nut-lam-moi-danh-muc"
              onClick={lamMoiDuLieu}
            >
              <RefreshCw size={16} />
              <span>Làm mới</span>
            </button>
          </div>
        </div>

        <button
          type="button"
          className="nut-them-danh-muc-moi"
          onClick={moThem}
        >
          <Plus size={18} />
          <span>Thêm danh mục</span>
        </button>
      </div>

      {idsDangChon.length > 0 && (
        <div className="thanh-bulk-danh-muc">
          <div>
            Đã chọn <strong>{idsDangChon.length}</strong> danh mục
          </div>

          <div className="hanh-dong-bulk-danh-muc">
            <button
              type="button"
              className="nut-bulk"
              disabled={dangXuLy}
              onClick={() => bulkDoiTrangThai("hien_thi")}
            >
              Bật hiển thị
            </button>

            <button
              type="button"
              className="nut-bulk"
              disabled={dangXuLy}
              onClick={() => bulkDoiTrangThai("an")}
            >
              Ẩn danh mục
            </button>

            <button
              type="button"
              className="nut-bulk nguy-hiem"
              disabled={dangXuLy}
              onClick={() => setModalBulkXoaMo(true)}
            >
              Xóa đã chọn
            </button>

            <button
              type="button"
              className="nut-bulk phu"
              disabled={dangXuLy}
              onClick={boChonTatCa}
            >
              Bỏ chọn
            </button>
          </div>
        </div>
      )}

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
                <th style={{ width: 48 }}>
                  <input
                    type="checkbox"
                    checked={daChonTatCa}
                    onChange={batTatChonTatCa}
                  />
                </th>

                <th>Tên danh mục</th>
                <th style={{ width: 170 }}>Đường dẫn</th>
                <th style={{ width: 150 }}>Danh mục cha</th>
                <th style={{ width: 130 }}>Sản phẩm</th>
                <th style={{ width: 130 }}>Mục con</th>
                <th className="trang-thai-col" style={{ width: 110 }}>
                  Trạng thái
                </th>
                <th style={{ width: 110 }}>Xóa mềm</th>
                <th style={{ width: 100 }}>Thao tác</th>
              </tr>
            </thead>

            <tbody>
              {danhSach.map((item) => (
                <tr key={item.id}>
                  <td>
                    <input
                      type="checkbox"
                      disabled={item.daxoa}
                      checked={idsDangChon.includes(item.id)}
                      onChange={() => batTatChonMotDong(item.id)}
                    />
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
                    <div className="can-giua-o-bang">
                      <button
                        type="button"
                        className={`nut-toggle-trang-thai ${
                          item.trangthai === "hien_thi" ? "bat" : "tat"
                        } ${dangDoiTrangThaiId === item.id ? "dang-doi" : ""}`}
                        title={
                          item.trangthai === "hien_thi"
                            ? "Đang hiển thị"
                            : "Đang ẩn"
                        }
                        disabled={item.daxoa || dangDoiTrangThaiId === item.id}
                        onClick={() => doiTrangThai(item)}
                      >
                        <span className="toggle-thumb"></span>
                      </button>
                    </div>
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
                        onClick={() => moXoa(item)}
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

      <XacNhanModal
        mo={modalXoaMo}
        tieuDe="Xóa danh mục"
        moTa={`Bạn có chắc muốn xóa danh mục "${
          danhMucDangXoa?.tendanhmuc || ""
        }" không?`}
        noiDung={
          danhMucDangXoa
            ? `Danh mục này hiện có ${danhMucDangXoa.sosanpham} sản phẩm và ${danhMucDangXoa.sodanhmuccon} danh mục con. Nếu còn dữ liệu liên quan, hệ thống sẽ không cho xóa.`
            : ""
        }
        tenNutXacNhan="Xóa danh mục"
        dangXuLy={dangXuLy}
        onDong={dongModalXoa}
        onXacNhan={xacNhanXoa}
      />

       <XacNhanModal
        mo={modalBulkXoaMo}
        tieuDe="Xóa nhiều danh mục"
        moTa={`Bạn có chắc muốn xóa ${idsDangChon.length} danh mục đã chọn không?`}
        noiDung="Nếu danh mục đang có sản phẩm hoặc danh mục con, hệ thống sẽ không cho xóa danh mục đó."
        tenNutXacNhan="Xóa đã chọn"
        dangXuLy={dangXuLy}
        onDong={() => setModalBulkXoaMo(false)}
        onXacNhan={xacNhanBulkXoa}
       />
    </div>
  );
}
