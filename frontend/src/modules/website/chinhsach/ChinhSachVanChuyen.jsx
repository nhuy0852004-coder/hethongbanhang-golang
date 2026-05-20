import useCaiDatStore from "../../../stores/caidatStore";
import ThongTinCuaHang from "../../../components/website/ThongTinCuaHang";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";

export default function ChinhSachVanChuyen() {
  useTieuDeTrang("Chính sách vận chuyển");

  const caidat = useCaiDatStore((state) => state.caidat);

  const noiDung =
    caidat?.chinhsachvanchuyen ||
    "Cửa hàng hỗ trợ giao hàng toàn quốc. Thời gian giao hàng phụ thuộc vào địa chỉ nhận hàng và đơn vị vận chuyển.";

  return (
    <div className="container-website trang-chinh-sach-web">
      <div className="dau-trang-web">
        <h1>Chính sách vận chuyển</h1>
        <p>Thông tin vận chuyển được cập nhật từ cài đặt cửa hàng.</p>
      </div>

      <div className="chinh-sach-grid">
        <div className="noi-dung-chinh-sach">
          <h2>Thông tin vận chuyển</h2>
          <p>{noiDung}</p>
        </div>

        <ThongTinCuaHang />
      </div>
    </div>
  );
}