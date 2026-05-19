package sanpham

import (
	"errors"
	"strings"
)

type TaoSanPhamRequest struct {
	MaDinhDanh   string  `json:"madinhdanh"`
	TenSanPham   string  `json:"tensanpham"`
	MoTa         string  `json:"mota"`
	GiaBan       uint64  `json:"giaban"`
	GiaKhuyenMai *uint64 `json:"giakhuyenmai"`
	SoLuongTon   int     `json:"soluongton"`
	TrangThai    string  `json:"trangthai"`
	DanhMucID    *uint64 `json:"danhmuc_id"`
}

type CapNhatSanPhamRequest struct {
	MaDinhDanh   string  `json:"madinhdanh"`
	TenSanPham   string  `json:"tensanpham"`
	MoTa         string  `json:"mota"`
	GiaBan       uint64  `json:"giaban"`
	GiaKhuyenMai *uint64 `json:"giakhuyenmai"`
	SoLuongTon   int     `json:"soluongton"`
	TrangThai    string  `json:"trangthai"`
	DanhMucID    *uint64 `json:"danhmuc_id"`
}

type CapNhatTrangThaiSanPhamRequest struct {
	TrangThai string `json:"trangthai"`
}

func (r *TaoSanPhamRequest) KiemTra() error {
	return kiemTraChung(r.MaDinhDanh, r.TenSanPham, r.GiaBan, r.GiaKhuyenMai, r.SoLuongTon, &r.TrangThai)
}

func (r *CapNhatSanPhamRequest) KiemTra() error {
	return kiemTraChung(r.MaDinhDanh, r.TenSanPham, r.GiaBan, r.GiaKhuyenMai, r.SoLuongTon, &r.TrangThai)
}

func (r *CapNhatTrangThaiSanPhamRequest) KiemTra() error {
	r.TrangThai = strings.TrimSpace(r.TrangThai)

	if r.TrangThai != "hien_thi" && r.TrangThai != "an" && r.TrangThai != "het_hang" {
		return errors.New("trạng thái sản phẩm không hợp lệ")
	}

	return nil
}

func kiemTraChung(maDinhDanh string, tenSanPham string, giaBan uint64, giaKhuyenMai *uint64, soLuongTon int, trangThai *string) error {
	maDinhDanh = strings.TrimSpace(maDinhDanh)
	tenSanPham = strings.TrimSpace(tenSanPham)
	if trangThai != nil {
		*trangThai = strings.TrimSpace(*trangThai)
	}

	if tenSanPham == "" {
		return errors.New("tên sản phẩm không được để trống")
	}

	if len(tenSanPham) < 2 {
		return errors.New("tên sản phẩm phải có ít nhất 2 ký tự")
	}

	if giaBan == 0 {
		return errors.New("giá bán phải lớn hơn 0")
	}

	if giaKhuyenMai != nil && *giaKhuyenMai > 0 && *giaKhuyenMai >= giaBan {
		return errors.New("giá khuyến mãi phải nhỏ hơn giá bán")
	}

	if soLuongTon < 0 {
		return errors.New("số lượng tồn không được âm")
	}

	if trangThai != nil {
		if *trangThai == "" {
			*trangThai = "hien_thi"
		}

		if *trangThai != "hien_thi" && *trangThai != "an" && *trangThai != "het_hang" {
			return errors.New("trạng thái sản phẩm không hợp lệ")
		}
	}

	return nil
}
