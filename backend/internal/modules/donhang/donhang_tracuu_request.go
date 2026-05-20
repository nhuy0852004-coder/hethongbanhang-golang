package donhang

import (
	"errors"
	"regexp"
	"strings"
)

type TraCuuDonHangRequest struct {
	MaDonHang   string `json:"madonhang"`
	SoDienThoai string `json:"sodienthoai"`
}

func (r *TraCuuDonHangRequest) KiemTra() error {
	r.MaDonHang = strings.TrimSpace(r.MaDonHang)
	r.SoDienThoai = strings.TrimSpace(r.SoDienThoai)

	if r.MaDonHang == "" && r.SoDienThoai == "" {
		return errors.New("vui lòng nhập mã đơn hàng hoặc số điện thoại")
	}

	if r.SoDienThoai != "" {
		bieuThucSoDienThoai := regexp.MustCompile(`^(03|05|07|08|09)[0-9]{8}$`)
		if !bieuThucSoDienThoai.MatchString(r.SoDienThoai) {
			return errors.New("số điện thoại Việt Nam không hợp lệ")
		}
	}

	return nil
}