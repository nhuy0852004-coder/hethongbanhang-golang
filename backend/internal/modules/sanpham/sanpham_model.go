package sanpham

import "time"

type AnhSanPham struct {
	ID        uint64 `json:"id"`
	SanPhamID uint64 `json:"sanpham_id"`
	DuongDan  string `json:"duongdan"`
	AnhChinh  bool   `json:"anhchinh"`
	ThuTu     int    `json:"thutu"`
}

type SanPham struct {
	ID            uint64       `json:"id"`
	MaDinhDanh    string       `json:"madinhdanh"`
	SKU           string       `json:"sku"`
	Barcode       string       `json:"barcode"`
	TenSanPham    string       `json:"tensanpham"`
	MoTa          string       `json:"mota"`
	MoTaNgan      string       `json:"motangan"`
	MoTaChiTiet   string       `json:"motachitiet"`
	ThuongHieu    string       `json:"thuonghieu"`
	DonViTinh     string       `json:"donvitinh"`
	GiaNhap       uint64       `json:"gianhap"`
	GiaBan        uint64       `json:"giaban"`
	GiaKhuyenMai  *uint64      `json:"giakhuyenmai"`
	SoLuongTon    int          `json:"soluongton"`
	NguongCanhBao int          `json:"nguongcanhbao"`
	TrongLuong    *float64     `json:"trongluong"`
	KichThuoc     string       `json:"kichthuoc"`
	HinhAnh       string       `json:"hinhanh"`
	NoiBat        bool         `json:"noibat"`
	BanChay       bool         `json:"banchay"`
	SanPhamMoi    bool         `json:"sanphammoi"`
	ChoDatTruoc   bool         `json:"chodattruoc"`
	ThuocTinh     string       `json:"thuoctinh"`
	BienThe       string       `json:"bienthe"`
	TrangThai     string       `json:"trangthai"`
	DanhMucID     *uint64      `json:"danhmuc_id"`
	TenDanhMuc    string       `json:"tendanhmuc"`
	LuotBan       int64        `json:"luotban"`
	AlbumAnh      []AnhSanPham `json:"albumanh"`
	CreatedAt     time.Time    `json:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
}
