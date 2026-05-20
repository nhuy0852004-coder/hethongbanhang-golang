import { Mail, MapPin, Phone, Store } from "lucide-react";
import useCaiDatStore from "../../stores/caidatStore";

export default function ThongTinCuaHang() {
  const caidat = useCaiDatStore((state) => state.caidat);

  const tenCuaHang = caidat?.tencuahang || "Cửa Hàng Việt";
  const logo = caidat?.logo || "";
  const sodienthoai = caidat?.sodienthoai || "0901234567";
  const email = caidat?.email || "cuahang@example.com";
  const diachi = caidat?.diachi || "Việt Nam";

  return (
    <div className="thong-tin-cua-hang-box">
      <div className="thong-tin-cua-hang-brand">
        <div className="logo-website-icon">
          {logo ? (
            <img src={`http://localhost:8080${logo}`} alt={tenCuaHang} />
          ) : (
            <Store size={22} />
          )}
        </div>

        <div>
          <strong>{tenCuaHang}</strong>
          <span>Thông tin cửa hàng</span>
        </div>
      </div>

      <div className="ds-thong-tin-cua-hang">
        <div>
          <Phone size={17} />
          <span>{sodienthoai}</span>
        </div>

        <div>
          <Mail size={17} />
          <span>{email}</span>
        </div>

        <div>
          <MapPin size={17} />
          <span>{diachi}</span>
        </div>
      </div>
    </div>
  );
}