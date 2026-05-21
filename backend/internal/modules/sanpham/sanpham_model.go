package sanpham

import "time"

type SanPham struct {
	ID             uint64    `json:"id"`
	MaDinhDanh     string    `json:"madinhdanh"`
	SKU            string    `json:"sku"`
	Barcode        string    `json:"barcode"`
	TenSanPham     string    `json:"tensanpham"`
	MoTa           string    `json:"mota"`
	GiaBan         uint64    `json:"giaban"`
	GiaKhuyenMai   *uint64   `json:"giakhuyenmai"`
	SoLuongTon     int       `json:"soluongton"`
	HinhAnh        string    `json:"hinhanh"`
	NoiBat         bool      `json:"noibat"`
	TrangThai      string    `json:"trangthai"`
	DanhMucID      *uint64   `json:"danhmuc_id"`
	TenDanhMuc     string    `json:"tendanhmuc"`
	LuotBan        int64     `json:"luotban"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}