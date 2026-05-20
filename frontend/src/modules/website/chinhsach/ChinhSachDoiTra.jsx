import useCaiDatStore from "../../../stores/caidatStore";
import ThongTinCuaHang from "../../../components/website/ThongTinCuaHang";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";

export default function ChinhSachDoiTra() {
  useTieuDeTrang("Chính sách đổi trả");

  const caidat = useCaiDatStore((state) => state.caidat);

  const noiDung =
    caidat?.chinhsachdoitra ||
    "Cửa hàng hỗ trợ đổi trả trong trường hợp sản phẩm lỗi, sai mẫu hoặc phát sinh vấn đề trong quá trình giao hàng.";

  return (
    <div className="container-website trang-chinh-sach-web">
      <div className="dau-trang-web">
        <h1>Chính sách đổi trả</h1>
        <p>Thông tin đổi trả được cập nhật từ cài đặt cửa hàng.</p>
      </div>

      <div className="chinh-sach-grid">
        <div className="noi-dung-chinh-sach">
          <h2>Thông tin đổi trả</h2>
          <p>{noiDung}</p>
        </div>

        <ThongTinCuaHang />
      </div>
    </div>
  );
}