import { useEffect, useState } from "react";
import { CheckCircle2, Database, Server } from "lucide-react";
import toast from "react-hot-toast";
import ketNoiApi from "../api/ketnoiapi";
import DangTai from "../components/DangTai";
import { formatTienVietNam } from "../utils/dinhtien";

export default function TrangKiemTra() {
  const [dangTai, setDangTai] = useState(true);
  const [duLieu, setDuLieu] = useState(null);
  const [loi, setLoi] = useState("");

  useEffect(() => {
    async function kiemTraKetNoi() {
      try {
        setDangTai(true);
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
      <div className="tieu-de-trang">
        <div>
          <h2>Ngày 1 - Kiểm tra hệ thống</h2>
          <p>Frontend React gọi API Golang và kiểm tra kết nối MySQL XAMPP.</p>
        </div>
      </div>

      {dangTai && <DangTai noidung="Đang kiểm tra kết nối backend..." />}

      {!dangTai && loi && (
        <div className="alert alert-danger mb-0">
          {loi}
        </div>
      )}

      {!dangTai && duLieu && (
        <div className="luoi-card">
          <div className="card-thong-tin">
            <div className="icon-card thanh-cong">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <p>Trạng thái API</p>
              <h3>Hoạt động</h3>
              <span>{duLieu.thongbao}</span>
            </div>
          </div>

          <div className="card-thong-tin">
            <div className="icon-card">
              <Database size={24} />
            </div>
            <div>
              <p>Cơ sở dữ liệu</p>
              <h3>{duLieu.dulieu?.cosodulieu}</h3>
              <span>MySQL chạy bằng XAMPP</span>
            </div>
          </div>

          <div className="card-thong-tin">
            <div className="icon-card">
              <Server size={24} />
            </div>
            <div>
              <p>Demo tiền Việt Nam</p>
              <h3>{formatTienVietNam(120000)}</h3>
              <span>Backend lưu số nguyên, frontend format VNĐ</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
