package giohang

type SanPhamGioHang struct {
	ID           uint64  `json:"id"`
	MaDinhDanh   string  `json:"madinhdanh"`
	TenSanPham   string  `json:"tensanpham"`
	HinhAnh      string  `json:"hinhanh"`
	GiaBan       uint64  `json:"giaban"`
	GiaKhuyenMai *uint64 `json:"giakhuyenmai"`
	SoLuongTon   int     `json:"soluongton"`
	TrangThai    string  `json:"trangthai"`
	TenDanhMuc   string  `json:"tendanhmuc"`
}

type SanPhamGioHangDaKiemTra struct {
	ID           uint64  `json:"id"`
	MaDinhDanh   string  `json:"madinhdanh"`
	TenSanPham   string  `json:"tensanpham"`
	HinhAnh      string  `json:"hinhanh"`
	GiaBan       uint64  `json:"giaban"`
	GiaKhuyenMai *uint64 `json:"giakhuyenmai"`
	SoLuongTon   int     `json:"soluongton"`
	TrangThai    string  `json:"trangthai"`
	TenDanhMuc   string  `json:"tendanhmuc"`
	SoLuong      int     `json:"soluong"`
	HopLe        bool    `json:"hople"`
	ThongBao     string  `json:"thongbao"`
}

type KetQuaKiemTraGioHang struct {
	HopLe       bool                      `json:"hople"`
	ThongBao    string                    `json:"thongbao"`
	DanhSach    []SanPhamGioHangDaKiemTra `json:"danhsach"`
	TongTien    uint64                    `json:"tongtien"`
	CoThayDoi   bool                      `json:"cothaydoi"`
}