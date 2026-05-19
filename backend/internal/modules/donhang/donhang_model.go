package donhang

import "time"

type DonHang struct {
	ID          uint64           `json:"id"`
	MaDonHang   string           `json:"madonhang"`
	KhachHangID *uint64          `json:"khachhang_id"`
	HoTen       string           `json:"hoten"`
	SoDienThoai string           `json:"sodienthoai"`
	Email       string           `json:"email"`
	DiaChi      string           `json:"diachi"`
	TongTien    uint64           `json:"tongtien"`
	TrangThai   string           `json:"trangthai"`
	GhiChu      string           `json:"ghichu"`
	ChiTiet     []ChiTietDonHang `json:"chitiet"`
	CreatedAt   time.Time        `json:"created_at"`
	UpdatedAt   time.Time        `json:"updated_at"`
}

type ChiTietDonHang struct {
	ID         uint64 `json:"id"`
	DonHangID  uint64 `json:"donhang_id"`
	SanPhamID  uint64 `json:"sanpham_id"`
	TenSanPham string `json:"tensanpham"`
	HinhAnh    string `json:"hinhanh"`
	SoLuong    int    `json:"soluong"`
	DonGia     uint64 `json:"dongia"`
	ThanhTien  uint64 `json:"thanhtien"`
}

type SanPhamTrongGiaoDich struct {
	ID           uint64
	TenSanPham   string
	HinhAnh      string
	GiaBan       uint64
	GiaKhuyenMai *uint64
	SoLuongTon   int
	TrangThai    string
}