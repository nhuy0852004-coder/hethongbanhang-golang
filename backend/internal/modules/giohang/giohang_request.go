package giohang

import "errors"

type KiemTraGioHangRequest struct {
	SanPham []SanPhamCanKiemTra `json:"sanpham"`
}

type SanPhamCanKiemTra struct {
	SanPhamID uint64 `json:"sanpham_id"`
	SoLuong   int    `json:"soluong"`
	GiaBan    uint64 `json:"giaban"`
}

func (r *KiemTraGioHangRequest) KiemTra() error {
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