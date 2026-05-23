import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, ClipboardCheck, CreditCard, FileText, X } from "lucide-react";

const DANH_SACH_TRANG_THAI = {
  cho_xac_nhan: "Chờ xác nhận",
  da_xac_nhan: "Đã xác nhận",
  dang_chuan_bi: "Đang chuẩn bị",
  dang_giao: "Đang giao",
  dang_giao_hang: "Đang giao",
  hoan_thanh: "Hoàn thành",
  da_huy: "Đã hủy",
};

const DANH_SACH_THANH_TOAN = {
  chua_thanh_toan: "Chưa thanh toán",
  da_thanh_toan: "Đã thanh toán",
  hoan_tien: "Hoàn tiền",
};

const LUONG_TRANG_THAI = {
  cho_xac_nhan: ["cho_xac_nhan", "da_xac_nhan"],
  da_xac_nhan: ["da_xac_nhan", "dang_giao_hang"],
  dang_giao_hang: ["dang_giao_hang", "hoan_thanh"],
  hoan_thanh: ["hoan_thanh"],
  da_huy: ["da_huy"],
};

function chuanHoaTrangThai(value) {
  const trangThai = value || "cho_xac_nhan";

  const map = {
    cho_xuly: "cho_xac_nhan",
    choxacnhan: "cho_xac_nhan",
    daxacnhan: "da_xac_nhan",
    dangchuanbi: "dang_chuan_bi",
    danggiao: "dang_giao_hang",
    dang_giao: "dang_giao_hang",
  };

  return map[trangThai] || trangThai;
}

function chuanHoaThanhToan(value) {
  const trangThai = value || "chua_thanh_toan";

  const map = {
    chuathanhtoan: "chua_thanh_toan",
    dathanhtoan: "da_thanh_toan",
    hoantien: "hoan_tien",
  };

  return map[trangThai] || trangThai;
}

function layMaDonHang(item) {
  return (
    item?.madonhang ||
    item?.madon ||
    item?.ma_don_hang ||
    `DH${String(item?.id || 0).padStart(6, "0")}`
  );
}

export default function XuLyDonHangModal({
  mo,
  donHang,
  dangXuLy = false,
  onDong,
  onLuu,
}) {
  const [duLieu, setDuLieu] = useState({
    trangthai: "cho_xac_nhan",
    trangthaithanhtoan: "chua_thanh_toan",
    ghichuxuly: "",
    lydohuy: "",
  });

  useEffect(() => {
    if (!mo) return;

    setDuLieu({
      trangthai: chuanHoaTrangThai(
        donHang?.trangthai || donHang?.trangthaidonhang
      ),
      trangthaithanhtoan: chuanHoaThanhToan(
        donHang?.trangthaithanhtoan || donHang?.trang_thai_thanh_toan
      ),
      ghichuxuly: "",
      lydohuy: "",
    });
  }, [mo, donHang]);

  const trangThaiHienTai = useMemo(() => {
    return chuanHoaTrangThai(
      donHang?.trangthai || donHang?.trangthaidonhang
    );
  }, [donHang]);

  const danhSachTrangThaiChoPhep = useMemo(() => {
    return LUONG_TRANG_THAI[trangThaiHienTai] || LUONG_TRANG_THAI.cho_xac_nhan;
  }, [trangThaiHienTai]);

  if (!mo) return null;

  const capNhatDuLieu = (event) => {
    const { name, value } = event.target;

    setDuLieu((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const xuLyLuu = () => {
    if (duLieu.trangthai === "da_huy" && !duLieu.lydohuy.trim()) {
      return;
    }

    onLuu?.({
      trangthai: duLieu.trangthai,
      trangthaithanhtoan: duLieu.trangthaithanhtoan,
      ghichuxuly: duLieu.ghichuxuly.trim(),
      lydohuy: duLieu.lydohuy.trim(),
    });
  };

  const dangHuyDon = duLieu.trangthai === "da_huy";
  const donDaKetThuc =
    trangThaiHienTai === "hoan_thanh" || trangThaiHienTai === "da_huy";

  return (
    <div className="modal-phu">
      <div className="nen-modal" onClick={dangXuLy ? undefined : onDong} />

      <div className="hop-modal hop-modal-xu-ly-don-hang">
        <div className="dau-modal dau-modal-xu-ly-don">
          <div>
            <span className="nhan-modal-don-hang">Xử lý đơn hàng</span>
            <h3>#{layMaDonHang(donHang)}</h3>
            <p>Cập nhật trạng thái xử lý, thanh toán và ghi chú nội bộ.</p>
          </div>

          <button
            type="button"
            className="nut-dong-modal"
            disabled={dangXuLy}
            onClick={onDong}
          >
            <X size={20} />
          </button>
        </div>

        <div className="noi-dung-modal noi-dung-xu-ly-don">
          {donDaKetThuc && (
            <div className="canh-bao-xu-ly-don">
              <AlertTriangle size={18} />
              <span>
                Đơn hàng đã kết thúc. Bạn nên hạn chế thay đổi trạng thái để giữ
                lịch sử xử lý chính xác.
              </span>
            </div>
          )}

          <div className="form-xu-ly-don">
            <label>
              <span>
                <ClipboardCheck size={16} />
                Trạng thái đơn hàng
              </span>

              <select
                name="trangthai"
                value={duLieu.trangthai}
                disabled={dangXuLy || donDaKetThuc}
                onChange={capNhatDuLieu}
              >
                {danhSachTrangThaiChoPhep.map((key) => (
                  <option key={key} value={key}>
                    {DANH_SACH_TRANG_THAI[key]}
                  </option>
                ))}
              </select>
            </label>

            <label>
              <span>
                <CreditCard size={16} />
                Trạng thái thanh toán
              </span>

              <select
                name="trangthaithanhtoan"
                value={duLieu.trangthaithanhtoan}
                disabled={dangXuLy}
                onChange={capNhatDuLieu}
              >
                {Object.entries(DANH_SACH_THANH_TOAN).map(([key, ten]) => (
                  <option key={key} value={key}>
                    {ten}
                  </option>
                ))}
              </select>
            </label>

            {dangHuyDon && (
              <label className="label-full-xu-ly-don">
                <span>
                  <AlertTriangle size={16} />
                  Lý do hủy đơn
                </span>

                <textarea
                  name="lydohuy"
                  value={duLieu.lydohuy}
                  disabled={dangXuLy}
                  onChange={capNhatDuLieu}
                  placeholder="Nhập lý do hủy đơn hàng..."
                  rows={3}
                />
              </label>
            )}

            <label className="label-full-xu-ly-don">
              <span>
                <FileText size={16} />
                Ghi chú xử lý
              </span>

              <textarea
                name="ghichuxuly"
                value={duLieu.ghichuxuly}
                disabled={dangXuLy}
                onChange={capNhatDuLieu}
                placeholder="Ví dụ: Đã gọi khách xác nhận đơn, khách hẹn giao buổi chiều..."
                rows={4}
              />
            </label>
          </div>
        </div>

        <div className="chan-modal chan-modal-xu-ly-don">
          <button
            type="button"
            className="nut-modal-phu"
            disabled={dangXuLy}
            onClick={onDong}
          >
            Hủy
          </button>

          <button
            type="button"
            className="nut-modal-chinh"
            disabled={dangXuLy || (dangHuyDon && !duLieu.lydohuy.trim())}
            onClick={xuLyLuu}
          >
            {dangXuLy ? "Đang lưu..." : "Lưu xử lý"}
          </button>
        </div>
      </div>
    </div>
  );
}