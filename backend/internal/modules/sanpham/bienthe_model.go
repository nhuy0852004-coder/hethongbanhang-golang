package sanpham

import "time"

type BienTheSanPham struct {
	ID               uint64    `json:"id"`
	SanPhamID        uint64    `json:"sanpham_id"`
	SKU              string    `json:"sku"`
	TenThuocTinh1    string    `json:"tenthuoctinh1"`
	GiaTriThuocTinh1 string    `json:"giatrithuoctinh1"`
	TenThuocTinh2    string    `json:"tenthuoctinh2"`
	GiaTriThuocTinh2 string    `json:"giatrithuoctinh2"`
	GiaBan           *uint64   `json:"giaban"`
	SoLuongTon       int       `json:"soluongton"`
	HinhAnh          string    `json:"hinhanh"`
	CreatedAt        time.Time `json:"created_at"`
	UpdatedAt        time.Time `json:"updated_at"`
}
