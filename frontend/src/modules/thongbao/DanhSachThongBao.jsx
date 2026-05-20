import { CheckCheck, Eye, EyeOff, Search, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import DangTai from "../../components/DangTai";
import TrangRong from "../../components/TrangRong";
import NutBam from "../../components/ui/NutBam";
import useGiaoDienStore from "../../stores/giaodienStore";
import useThongBaoStore from "../../stores/thongbaoStore";

export default function DanhSachThongBao() {
  const capNhatTieuDeTrang = useGiaoDienStore(
    (state) => state.capNhatTieuDeTrang
  );

  const taiThongBao = useThongBaoStore((state) => state.taiThongBao);
  const capNhatDaDoc = useThongBaoStore((state) => state.capNhatDaDoc);
  const danhDauTatCaDaDoc = useThongBaoStore(
    (state) => state.danhDauTatCaDaDoc
  );
  const xoaThongBao = useThongBaoStore((state) => state.xoaThongBao);
  const dangTai = useThongBaoStore((state) => state.dangTai);
  const danhSach = useThongBaoStore((state) => state.danhsach);

  const [boLoc, setBoLoc] = useState({
    timkiem: "",
    dadoc: "",
    trang: 1,
    gioihan: 8,
  });

  useEffect(() => {
    capNhatTieuDeTrang("Thông báo", "Theo dõi các thông báo mới của hệ thống");
    taiThongBao(boLoc).catch((loi) => {
      toast.error(loi?.response?.data?.thongbao || "Không tải được thông báo");
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const timKiem = async (event) => {
    event.preventDefault();

    try {
      await taiThongBao({
        ...boLoc,
        trang: 1,
      });
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không tải được thông báo");
    }
  };

  const xemTrangThai = async (item) => {
    try {
      if (!item.dadoc) {
        await capNhatDaDoc(item.id, true);
      }
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không cập nhật được thông báo");
    }
  };

  const xuLyXoa = async (item) => {
    const dongY = window.confirm(`Bạn có chắc muốn xóa thông báo này không?`);
    if (!dongY) return;

    try {
      await xoaThongBao(item.id);
      toast.success("Xóa thông báo thành công");
      await taiThongBao(boLoc);
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không xóa được thông báo");
    }
  };

  const xuLyDanhDauTatCa = async () => {
    try {
      await danhDauTatCaDaDoc();
      toast.success("Đã đánh dấu tất cả là đã đọc");
      await taiThongBao(boLoc);
    } catch (loi) {
      toast.error(loi?.response?.data?.thongbao || "Không thực hiện được");
    }
  };

  return (
    <div className="trang-thong-bao-admin">
      <form className="thanh-thong-bao" onSubmit={timKiem}>
        <div className="bo-loc-card-thong-bao">
          <div className="select-thong-bao-wrap">
            <select name="dadoc" value={boLoc.dadoc} onChange={capNhatBoLoc}>
              <option value="">Tất cả trạng thái</option>
              <option value="0">Chưa đọc</option>
              <option value="1">Đã đọc</option>
            </select>
          </div>

          <div className="select-thong-bao-wrap">
            <select name="loai" value={boLoc.loai} onChange={capNhatBoLoc}>
              <option value="">Tất cả loại</option>
              <option value="don_hang_moi">Đơn hàng mới</option>
              <option value="he_thong">Hệ thống</option>
            </select>
          </div>

          <button type="submit" className="nut-loc-thong-bao">
            Lọc
          </button>
        </div>

        <button type="button" className="nut-doc-tat-ca" onClick={xuLyDanhDauTatCa}>
          Đọc tất cả
        </button>
      </form>

      {dangTai && <DangTai noidung="Đang tải thông báo..." />}

      {!dangTai && danhSach.length === 0 && (
        <TrangRong
          tieude="Chưa có thông báo"
          mota="Thông báo từ hệ thống sẽ hiển thị ở đây."
        />
      )}

      {!dangTai && danhSach.length > 0 && (
        <div className="khung-bang">
          <div className="bang-responsive">
            <table className="bang-du-lieu">
              <thead>
                <tr>
                  <th>Tiêu đề</th>
                  <th>Nội dung</th>
                  <th>Loại</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {danhSach.map((item) => (
                  <tr key={item.id}>
                    <td><strong>{item.tieude}</strong></td>
                    <td>{item.noidung}</td>
                    <td>{item.loai}</td>
                    <td>{item.dadoc ? "Đã đọc" : "Chưa đọc"}</td>
                    <td>{item.created_at ? new Date(item.created_at).toLocaleString("vi-VN") : ""}</td>
                    <td>
                      <div className="nhom-nut-thao-tac">
                        <button
                          className="nut-icon"
                          title={item.dadoc ? "Đã đọc" : "Đánh dấu đã đọc"}
                          onClick={() => xemTrangThai(item)}
                          type="button"
                        >
                          {item.dadoc ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                        <button
                          className="nut-icon nguy-hiem"
                          title="Xóa thông báo"
                          onClick={() => xuLyXoa(item)}
                          type="button"
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
        </div>
      )}
    </div>
  );
}
