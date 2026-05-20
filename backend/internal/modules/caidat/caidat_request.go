package caidat

import (
	"errors"
	"regexp"
	"strings"
)

type CapNhatCaiDatRequest struct {
	TenCuaHang         string `json:"tencuahang"`
	SoDienThoai        string `json:"sodienthoai"`
	Email              string `json:"email"`
	DiaChi             string `json:"diachi"`
	ChinhSachVanChuyen string `json:"chinhsachvanchuyen"`
	ChinhSachDoiTra    string `json:"chinhsachdoitra"`
}

func (r *CapNhatCaiDatRequest) KiemTra() error {
	r.TenCuaHang = strings.TrimSpace(r.TenCuaHang)
	r.SoDienThoai = strings.TrimSpace(r.SoDienThoai)
	r.Email = strings.TrimSpace(r.Email)
	r.DiaChi = strings.TrimSpace(r.DiaChi)
	r.ChinhSachVanChuyen = strings.TrimSpace(r.ChinhSachVanChuyen)
	r.ChinhSachDoiTra = strings.TrimSpace(r.ChinhSachDoiTra)

	if r.TenCuaHang == "" {
		return errors.New("tên cửa hàng không được để trống")
	}

	if r.SoDienThoai != "" {
		bieuThucSoDienThoai := regexp.MustCompile(`^(03|05|07|08|09)[0-9]{8}$`)
		if !bieuThucSoDienThoai.MatchString(r.SoDienThoai) {
			return errors.New("số điện thoại Việt Nam không hợp lệ")
		}
	}

	if r.Email != "" {
		bieuThucEmail := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
		if !bieuThucEmail.MatchString(r.Email) {
			return errors.New("email không đúng định dạng")
		}
	}

	return nil
}