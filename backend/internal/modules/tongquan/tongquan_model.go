package tongquan

type ThongKeTongQuan struct {
	DoanhThuHomNay uint64 `json:"doanhthuhomnay"`
	DonHangHomNay  int64  `json:"donhanghomnay"`
	TongSanPham    int64  `json:"tongsanpham"`
	TongKhachHang  int64  `json:"tongkhachhang"`
}

type DoanhThuTheoNgay struct {
	Ngay     string `json:"ngay"`
	DoanhThu uint64 `json:"doanhthu"`
	DonHang  int64  `json:"donhang"`
}

type DonHangMoiNhat struct {
	ID          uint64 `json:"id"`
	MaDonHang   string `json:"madonhang"`
	HoTen       string `json:"hoten"`
	SoDienThoai string `json:"sodienthoai"`
	TongTien    uint64 `json:"tongtien"`
	TrangThai   string `json:"trangthai"`
	CreatedAt   string `json:"created_at"`
}

type SanPhamSapHet struct {
	ID          uint64 `json:"id"`
	MaDinhDanh  string `json:"madinhdanh"`
	TenSanPham  string `json:"tensanpham"`
	HinhAnh     string `json:"hinhanh"`
	SoLuongTon  int    `json:"soluongton"`
	TrangThai   string `json:"trangthai"`
	TenDanhMuc  string `json:"tendanhmuc"`
}

type TongQuanResponse struct {
	ThongKe         ThongKeTongQuan  `json:"thongke"`
	DoanhThuBayNgay []DoanhThuTheoNgay `json:"doanhthubayngay"`
	DonHangMoiNhat []DonHangMoiNhat `json:"donhangmoinhat"`
	SanPhamSapHet  []SanPhamSapHet  `json:"sanphamsaphethang"`
}