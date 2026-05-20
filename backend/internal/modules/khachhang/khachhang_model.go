package khachhang

import "time"

type KhachHang struct {
	ID          uint64    `json:"id"`
	HoTen       string    `json:"hoten"`
	SoDienThoai string    `json:"sodienthoai"`
	Email       string    `json:"email"`
	DiaChi      string    `json:"diachi"`
	TrangThai   string    `json:"trangthai"`
	TongDonHang int64     `json:"tongdonhang"`
	TongChiTieu uint64	  `json:"tongchitieu"`
	DonGanNhat  string    `json:"dongannhat"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type DonHangKhachHang struct {
	ID          uint64    `json:"id"`
	MaDonHang   string    `json:"madonhang"`
	TongTien    uint64    `json:"tongtien"`
	TrangThai   string    `json:"trangthai"`
	GhiChu      string    `json:"ghichu"`
	CreatedAt   string    `json:"created_at"`
}