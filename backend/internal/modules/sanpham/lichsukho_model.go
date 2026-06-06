package sanpham

import "time"

type LichSuKho struct {
	ID              uint64    `json:"id"`
	SanPhamID       uint64    `json:"sanpham_id"`
	LyDo            string    `json:"lydo"`
	SoLuongTruoc    int       `json:"soluongtruoc"`
	SoLuongThayDoi  int       `json:"soluongthaydoi"`
	SoLuongSau      int       `json:"soluongsau"`
	GhiChu          string    `json:"ghichu"`
	ThamChieu       string    `json:"thamchieu"`
	CreatedAt       time.Time `json:"created_at"`
}

type DanhSachLichSuKhoResponse struct {
	DanhSach  []LichSuKho    `json:"danhsach"`
	PhanTrang PhanTrangResponse `json:"phantrang"`
}

// NhanLyDo trả về tên hiển thị của lý do thay đổi kho
func NhanLyDo(lydo string) string {
	switch lydo {
	case "khoi_tao":
		return "Khởi tạo"
	case "sua_tay":
		return "Sửa thủ công"
	case "ban_hang":
		return "Bán hàng"
	case "huy_don":
		return "Hủy đơn"
	case "nhap_them":
		return "Nhập thêm"
	default:
		return lydo
	}
}
