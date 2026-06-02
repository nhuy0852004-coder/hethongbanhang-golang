package tongquan

type ThongKeTongQuan struct {
	DoanhThuHomNay   uint64 `json:"doanhthuhomnay"`
	DonHangHomNay    int64  `json:"donhanghomnay"`
	DonChoXacNhan    int64  `json:"donchoxacnhan"`
	SanPhamDangBan   int64  `json:"sanphamdangban"`
	KhachHangMoi     int64  `json:"khachhangmoi"`
	SanPhamSapHet    int64  `json:"sanphamsaphet"`
	DonDaHuy         int64  `json:"dondahuy"`
	TyLeHoanThanh    float64 `json:"tylehoanthanh"`
	TongSanPham      int64  `json:"tongsanpham"`
	TongKhachHang    int64  `json:"tongkhachhang"`
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
	ThanhToan   string `json:"thanhtoan"`
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

type TrangThaiDonHang struct {
	ChoXacNhan int64 `json:"choxacnhan"`
	DaXacNhan  int64 `json:"daxacnhan"`
	DangGiao   int64 `json:"danggiao"`
	HoanThanh  int64 `json:"hoanthanh"`
	DaHuy      int64 `json:"dahuy"`
	TongDon    int64 `json:"tongdon"`
}

type SanPhamBanChay struct {
	TenSanPham string `json:"tensanpham"`
	SoDon      int64  `json:"sodon"`
	DoanhThu   uint64 `json:"doanhthu"`
}

type TongQuanResponse struct {
	ThongKe          ThongKeTongQuan    `json:"thongke"`
	DoanhThuBayNgay  []DoanhThuTheoNgay `json:"doanhthubayngay"`
	DonHangMoiNhat   []DonHangMoiNhat   `json:"donhangmoinhat"`
	SanPhamSapHetDS  []SanPhamSapHet    `json:"sanphamsaphethang"`
	TrangThaiDon     TrangThaiDonHang   `json:"trangthadon"`
	SanPhamBanChayDS []SanPhamBanChay   `json:"sanphambanchay"`
}
