package sanpham

type DanhSachSanPhamResponse struct {
	DanhSach []SanPham `json:"danhsach"`
	PhanTrang PhanTrangResponse `json:"phantrang"`
}

type PhanTrangResponse struct {
	Trang         int `json:"trang"`
	GioiHan       int `json:"gioihan"`
	TongSoDong    int64 `json:"tongsodong"`
	TongSoTrang   int `json:"tongsotrang"`
}