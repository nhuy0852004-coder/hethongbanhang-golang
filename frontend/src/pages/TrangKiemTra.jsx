import { useEffect, useState } from "react";
import { CheckCircle2, Database, Server } from "lucide-react";
import toast from "react-hot-toast";
import ketNoiApi from "../api/ketnoiapi";
import DangTai from "../components/DangTai";
import { formatTienVietNam } from "../utils/dinhtien";
import useGiaoDienStore from "../stores/giaodienStore";
import TheTrangThai from "../components/ui/TheTrangThai";
import KhungNoiDung from "../components/ui/KhungNoiDung";

export default function TrangKiemTra() {
  const capNhatTieuDeTrang = useGiaoDienStore(
    (state) => state.capNhatTieuDeTrang
  );

  const [dangTai, setDangTai] = useState(true);
  const [duLieu, setDuLieu] = useState(null);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    capNhatTieuDeTrang(
      "Tổng quan hệ thống",
      "Kiểm tra kết nối frontend, backend và cơ sở dữ liệu"
    );
  }, [capNhatTieuDeTrang]);

  useEffect(() => {
    async function kiemTraKetNoi() {
      try {
        setDangTai(true);
        setLoi("");

        const phanhoi = await ketNoiApi.get("/kiemtra");

        setDuLieu(phanhoi.data);
        toast.success("Kết nối backend thành công");
      } catch (error) {
        setLoi("Không kết nối được backend. Hãy kiểm tra Golang server và MySQL XAMPP.");
        toast.error("Kết nối thất bại");
      } finally {
        setDangTai(false);
      }
    }

    kiemTraKetNoi();
  }, []);

  return (
    <div className="trang-kiem-tra">
      {dangTai && <DangTai noidung="Đang kiểm tra kết nối backend..." />}

      {!dangTai && loi && <div className="alert alert-danger mb-0">{loi}</div>}

      {!dangTai && duLieu && (
        <>
          <div className="luoi-card">
            <div className="card-thong-tin-moi">
              <div className="icon-card thanh-cong">
                <CheckCircle2 size={24} />
              </div>

              <div>
                <p>Trạng thái API</p>
                <h3>Hoạt động</h3>
                <TheTrangThai trangthai="hoat_dong" />
              </div>
            </div>

            <div className="card-thong-tin-moi">
              <div className="icon-card">
                <Database size={24} />
              </div>

              <div>
                <p>Cơ sở dữ liệu</p>
                <h3>{duLieu.dulieu?.cosodulieu}</h3>
                <span>MySQL chạy bằng XAMPP</span>
              </div>
            </div>

            <div className="card-thong-tin-moi">
              <div className="icon-card">
                <Server size={24} />
              </div>

              <div>
                <p>Demo tiền Việt Nam</p>
                <h3>{formatTienVietNam(120000)}</h3>
                <span>Định dạng tiền VNĐ chuẩn</span>
              </div>
            </div>
          </div>

          <KhungNoiDung className="mt-3">
            <div className="dong-thong-tin">
              <span>Ứng dụng</span>
              <strong>{duLieu.dulieu?.ungdung}</strong>
            </div>

            <div className="dong-thong-tin">
              <span>Thời gian hệ thống</span>
              <strong>{duLieu.dulieu?.thoigian}</strong>
            </div>

            <div className="dong-thong-tin">
              <span>Ghi chú</span>
              <strong>Ngày 3 đã hoàn thiện layout admin nền tảng</strong>
            </div>
          </KhungNoiDung>
        </>
      )}
    </div>
  );
}