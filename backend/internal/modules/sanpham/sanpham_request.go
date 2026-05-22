package sanpham

import (
	"errors"
	"strings"
)

type TaoSanPhamRequest struct {
	MaDinhDanh    string   `json:"madinhdanh"`
	SKU           string   `json:"sku"`
	Barcode       string   `json:"barcode"`
	TenSanPham    string   `json:"tensanpham"`
	MoTa          string   `json:"mota"`
	MoTaNgan      string   `json:"motangan"`
	MoTaChiTiet   string   `json:"motachitiet"`
	ThuongHieu    string   `json:"thuonghieu"`
	DonViTinh     string   `json:"donvitinh"`
	GiaNhap       uint64   `json:"gianhap"`
	GiaBan        uint64   `json:"giaban"`
	GiaKhuyenMai  *uint64  `json:"giakhuyenmai"`
	SoLuongTon    int      `json:"soluongton"`
	NguongCanhBao int      `json:"nguongcanhbao"`
	TrongLuong    *float64 `json:"trongluong"`
	KichThuoc     string   `json:"kichthuoc"`
	NoiBat        bool     `json:"noibat"`
	BanChay       bool     `json:"banchay"`
	SanPhamMoi    bool     `json:"sanphammoi"`
	ChoDatTruoc   bool     `json:"chodattruoc"`
	ThuocTinh     string   `json:"thuoctinh"`
	BienThe       string   `json:"bienthe"`
	TrangThai     string   `json:"trangthai"`
	DanhMucID     *uint64  `json:"danhmuc_id"`
}

type CapNhatSanPhamRequest struct {
	MaDinhDanh    string   `json:"madinhdanh"`
	SKU           string   `json:"sku"`
	Barcode       string   `json:"barcode"`
	TenSanPham    string   `json:"tensanpham"`
	MoTa          string   `json:"mota"`
	MoTaNgan      string   `json:"motangan"`
	MoTaChiTiet   string   `json:"motachitiet"`
	ThuongHieu    string   `json:"thuonghieu"`
	DonViTinh     string   `json:"donvitinh"`
	GiaNhap       uint64   `json:"gianhap"`
	GiaBan        uint64   `json:"giaban"`
	GiaKhuyenMai  *uint64  `json:"giakhuyenmai"`
	SoLuongTon    int      `json:"soluongton"`
	NguongCanhBao int      `json:"nguongcanhbao"`
	TrongLuong    *float64 `json:"trongluong"`
	KichThuoc     string   `json:"kichthuoc"`
	NoiBat        bool     `json:"noibat"`
	BanChay       bool     `json:"banchay"`
	SanPhamMoi    bool     `json:"sanphammoi"`
	ChoDatTruoc   bool     `json:"chodattruoc"`
	ThuocTinh     string   `json:"thuoctinh"`
	BienThe       string   `json:"bienthe"`
	TrangThai     string   `json:"trangthai"`
	DanhMucID     *uint64  `json:"danhmuc_id"`
}

type CapNhatTrangThaiSanPhamRequest struct {
	TrangThai string `json:"trangthai"`
}

func (r *TaoSanPhamRequest) KiemTra() error {
	return kiemTraSanPham(
		&r.MaDinhDanh,
		&r.SKU,
		&r.Barcode,
		&r.TenSanPham,
		&r.MoTa,
		&r.MoTaNgan,
		&r.MoTaChiTiet,
		&r.ThuongHieu,
		&r.DonViTinh,
		r.GiaNhap,
		r.GiaBan,
		r.GiaKhuyenMai,
		r.SoLuongTon,
		r.NguongCanhBao,
		r.TrongLuong,
		&r.KichThuoc,
		&r.TrangThai,
	)
}

func (r *CapNhatSanPhamRequest) KiemTra() error {
	return kiemTraSanPham(
		&r.MaDinhDanh,
		&r.SKU,
		&r.Barcode,
		&r.TenSanPham,
		&r.MoTa,
		&r.MoTaNgan,
		&r.MoTaChiTiet,
		&r.ThuongHieu,
		&r.DonViTinh,
		r.GiaNhap,
		r.GiaBan,
		r.GiaKhuyenMai,
		r.SoLuongTon,
		r.NguongCanhBao,
		r.TrongLuong,
		&r.KichThuoc,
		&r.TrangThai,
	)
}

func (r *CapNhatTrangThaiSanPhamRequest) KiemTra() error {
	r.TrangThai = strings.TrimSpace(r.TrangThai)

	if r.TrangThai != "hien_thi" && r.TrangThai != "an" && r.TrangThai != "het_hang" {
		return errors.New("trạng thái sản phẩm không hợp lệ")
	}

	return nil
}

func kiemTraSanPham(
	maDinhDanh *string,
	sku *string,
	barcode *string,
	tenSanPham *string,
	mota *string,
	motaNgan *string,
	motaChiTiet *string,
	thuongHieu *string,
	donViTinh *string,
	giaNhap uint64,
	giaBan uint64,
	giaKhuyenMai *uint64,
	soLuongTon int,
	nguongCanhBao int,
	trongLuong *float64,
	kichThuoc *string,
	trangThai *string,
) error {
	*maDinhDanh = strings.TrimSpace(*maDinhDanh)
	*sku = strings.TrimSpace(*sku)
	*barcode = strings.TrimSpace(*barcode)
	*tenSanPham = strings.TrimSpace(*tenSanPham)
	*mota = strings.TrimSpace(*mota)
	*motaNgan = strings.TrimSpace(*motaNgan)
	*motaChiTiet = strings.TrimSpace(*motaChiTiet)
	*thuongHieu = strings.TrimSpace(*thuongHieu)
	*donViTinh = strings.TrimSpace(*donViTinh)
	*kichThuoc = strings.TrimSpace(*kichThuoc)
	*trangThai = strings.TrimSpace(*trangThai)

	if *tenSanPham == "" {
		return errors.New("tên sản phẩm không được để trống")
	}

	if len(*tenSanPham) < 2 {
		return errors.New("tên sản phẩm phải có ít nhất 2 ký tự")
	}


	if *donViTinh == "" {
		*donViTinh = "cái"
	}

	if giaBan == 0 {
		return errors.New("giá bán phải lớn hơn 0")
	}

	if giaNhap > 0 && giaBan < giaNhap {
		return errors.New("giá bán không được nhỏ hơn giá nhập")
	}

	if giaKhuyenMai != nil && *giaKhuyenMai > 0 && *giaKhuyenMai >= giaBan {
		return errors.New("giá khuyến mãi phải nhỏ hơn giá bán")
	}

	if soLuongTon < 0 {
		return errors.New("số lượng tồn không được âm")
	}

	if nguongCanhBao < 0 {
		return errors.New("ngưỡng cảnh báo tồn kho không được âm")
	}

	if trongLuong != nil && *trongLuong < 0 {
		return errors.New("trọng lượng không được âm")
	}

	if *trangThai == "" {
		*trangThai = "hien_thi"
	}

	if soLuongTon <= 0 {
		*trangThai = "het_hang"
	}

	if *trangThai != "hien_thi" && *trangThai != "an" && *trangThai != "het_hang" {
		return errors.New("trạng thái sản phẩm không hợp lệ")
	}

	return nil
}

type LocSanPhamRequest struct {
	TimKiem   string
	TrangThai string
	TonKho    string
	SanPham   string
	SapXep    string
	DanhMucID uint64
	GiaTu     uint64
	GiaDen    uint64
	Trang     int
	GioiHan   int
}

type BulkCapNhatTrangThaiSanPhamRequest struct {
	IDs       []uint64 `json:"ids"`
	TrangThai string   `json:"trangthai"`
}

type BulkXoaSanPhamRequest struct {
	IDs []uint64 `json:"ids"`
}

func (r *BulkCapNhatTrangThaiSanPhamRequest) KiemTra() error {
	if len(r.IDs) == 0 {
		return errors.New("vui lòng chọn ít nhất một sản phẩm")
	}

	r.TrangThai = strings.TrimSpace(r.TrangThai)

	if r.TrangThai != "hien_thi" && r.TrangThai != "an" && r.TrangThai != "het_hang" {
		return errors.New("trạng thái sản phẩm không hợp lệ")
	}

	for _, id := range r.IDs {
		if id == 0 {
			return errors.New("id sản phẩm không hợp lệ")
		}
	}

	return nil
}

func (r *BulkXoaSanPhamRequest) KiemTra() error {
	if len(r.IDs) == 0 {
		return errors.New("vui lòng chọn ít nhất một sản phẩm")
	}

	for _, id := range r.IDs {
		if id == 0 {
			return errors.New("id sản phẩm không hợp lệ")
		}
	}

	return nil
}