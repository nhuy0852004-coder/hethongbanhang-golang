package danhmuc

type TaoDanhMucRequest struct {
	TenDanhMuc   string  `json:"tendanhmuc"`
	MoTa         string  `json:"mota"`
	ThuTu        int     `json:"thutu"`
	TrangThai    string  `json:"trangthai"`
	DanhMucChaID *uint64 `json:"danhmuccha_id"`
}

type CapNhatDanhMucRequest struct {
	TenDanhMuc   string  `json:"tendanhmuc"`
	MoTa         string  `json:"mota"`
	ThuTu        int     `json:"thutu"`
	TrangThai    string  `json:"trangthai"`
	DanhMucChaID *uint64 `json:"danhmuccha_id"`
}

type CapNhatTrangThaiRequest struct {
	TrangThai string `json:"trangthai"`
}
