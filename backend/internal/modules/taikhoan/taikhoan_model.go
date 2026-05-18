package taikhoan

import "time"

type NguoiDung struct {
	ID          uint64    `json:"id"`
	HoTen      string    `json:"hoten"`
	Email      string    `json:"email"`
	MatKhau     string    `json:"-"`
	SoDienThoai string    `json:"sodienthoai"`
	VaiTro      string    `json:"vaitro"`
	TrangThai   string    `json:"trangthai"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}