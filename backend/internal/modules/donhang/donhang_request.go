package donhang

import (
	"errors"
	"regexp"
	"strings"
)

type TaoDonHangRequest struct {
	HoTen       string                   `json:"hoten"`
	SoDienThoai string                   `json:"sodienthoai"`
	Email       string                   `json:"email"`
	DiaChi      string                   `json:"diachi"`
	GhiChu      string                   `json:"ghichu"`
	SanPham     []ChiTietDonHangRequest  `json:"sanpham"`
}

type ChiTietDonHangRequest struct {
	SanPhamID uint64 `json:"sanpham_id"`
	SoLuong   int    `json:"soluong"`
}

func (r *TaoDonHangRequest) KiemTra() error {
	r.HoTen = strings.TrimSpace(r.HoTen)
	r.SoDienThoai = strings.TrimSpace(r.SoDienThoai)
	r.Email = strings.TrimSpace(r.Email)
	r.DiaChi = strings.TrimSpace(r.DiaChi)
	r.GhiChu = strings.TrimSpace(r.GhiChu)

	if r.HoTen == "" {
		return errors.New("họ tên không được để trống")
	}

	if len(r.HoTen) < 2 {
		return errors.New("họ tên phải có ít nhất 2 ký tự")
	}

	if r.SoDienThoai == "" {
		return errors.New("số điện thoại không được để trống")
	}

	bieuThucSoDienThoai := regexp.MustCompile(`^(03|05|07|08|09)[0-9]{8}$`)
	if !bieuThucSoDienThoai.MatchString(r.SoDienThoai) {
		return errors.New("số điện thoại Việt Nam không hợp lệ")
	}

	if r.Email != "" {
		bieuThucEmail := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
		if !bieuThucEmail.MatchString(r.Email) {
			return errors.New("email không đúng định dạng")
		}
	}

	if r.DiaChi == "" {
		return errors.New("địa chỉ giao hàng không được để trống")
	}

	if len(r.DiaChi) < 8 {
		return errors.New("địa chỉ giao hàng cần nhập rõ hơn")
	}

	if len(r.SanPham) == 0 {
		return errors.New("giỏ hàng đang trống")
	}

	for _, item := range r.SanPham {
		if item.SanPhamID == 0 {
			return errors.New("sản phẩm trong giỏ hàng không hợp lệ")
		}

		if item.SoLuong <= 0 {
			return errors.New("số lượng sản phẩm phải lớn hơn 0")
		}
	}

	return nil
}