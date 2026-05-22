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

type BulkSanPhamKetQuaItem struct {
	ID        uint64 `json:"id"`
	ThanhCong bool   `json:"thanhcong"`
	ThongBao  string `json:"thongbao"`
}

type BulkSanPhamKetQuaResponse struct {
	TongSo    int                    `json:"tongso"`
	ThanhCong int                   `json:"thanhcong"`
	ThatBai   int                   `json:"thatbai"`
	KetQua    []BulkSanPhamKetQuaItem `json:"ketqua"`
}