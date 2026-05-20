package baocao

type DoanhThuItem struct {
	Ngay     string `json:"ngay"`
	DoanhThu uint64 `json:"doanhthu"`
	DonHang  int64  `json:"donhang"`
}

type TopSanPhamItem struct {
	ID          uint64 `json:"id"`
	TenSanPham  string `json:"tensanpham"`
	HinhAnh     string `json:"hinhanh"`
	SoLuongBan  int64  `json:"soluongban"`
	DoanhThu    uint64 `json:"doanhthu"`
}

type ThongKeDonHang struct {
	TongDonHang     int64  `json:"tongdonhang"`
	DonHoanThanh   int64  `json:"donhoanthanh"`
	DonDaHuy       int64  `json:"dondahuy"`
	DonChoXuLy     int64  `json:"donchoxuly"`
	TongDoanhThu   uint64 `json:"tongdoanhthu"`
	DoanhThuBiHuy  uint64 `json:"doanhthubihuy"`
}