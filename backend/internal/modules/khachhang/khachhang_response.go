package khachhang

type DanhSachKhachHangResponse struct {
	DanhSach  []KhachHang      `json:"danhsach"`
	PhanTrang PhanTrangResponse `json:"phantrang"`
}

type PhanTrangResponse struct {
	Trang       int   `json:"trang"`
	GioiHan     int   `json:"gioihan"`
	TongSoDong  int64 `json:"tongsodong"`
	TongSoTrang int   `json:"tongsotrang"`
}

type ChiTietKhachHangResponse struct {
	KhachHang KhachHang        `json:"khachhang"`
	DonHang   []DonHangKhachHang `json:"donhang"`
}