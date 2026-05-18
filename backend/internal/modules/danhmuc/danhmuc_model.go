package danhmuc

type DanhMuc struct {
	ID            uint64  `json:"id"`
	TenDanhMuc    string  `json:"tendanhmuc"`
	DuongDan      string  `json:"duongdan"`
	MoTa          string  `json:"mota"`
	HinhAnh       string  `json:"hinhanh"`
	DanhMucChaID  *uint64 `json:"danhmuccha_id"`
	TenDanhMucCha string  `json:"tendanhmuccha"`
	ThuTu         int     `json:"thutu"`
	TrangThai     string  `json:"trangthai"`
	CreatedAt     string  `json:"created_at"`
	UpdatedAt     string  `json:"updated_at"`
	SoSanPham     int     `json:"sosanpham"`
	SoDanhMucCon  int     `json:"sodanhmuccon"`
}
