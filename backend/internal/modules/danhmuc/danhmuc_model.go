package danhmuc

import "time"

type DanhMuc struct {
	ID            uint64    `json:"id"`
	TenDanhMuc    string    `json:"tendanhmuc"`
	DuongDan      string    `json:"duongdan"`
	MoTa          string    `json:"mota"`
	HinhAnh       string    `json:"hinhanh"`
	DanhMucChaID  *uint64   `json:"danhmuccha_id"`
	TenDanhMucCha string    `json:"tendanhmuccha"`
	ThuTu         int       `json:"thutu"`
	TrangThai     string    `json:"trangthai"`
	SoSanPham      int       `json:"sosanpham"`
	SoDanhMucCon   int       `json:"sodanhmuccon"`
	DaXoa          bool      `json:"daxoa"`
	DeletedAt      string    `json:"deleted_at"`
	CreatedAt      time.Time `json:"created_at"`
	UpdatedAt      time.Time `json:"updated_at"`
}