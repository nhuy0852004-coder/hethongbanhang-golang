package taikhoan

import (
	"errors"
	"regexp"
	"strings"
)

type DangNhapRequest struct {
	Email   string `json:"email"`
	MatKhau string `json:"matkhau"`
}

func (r DangNhapRequest) KiemTra() error {
	r.Email = strings.TrimSpace(r.Email)
	r.MatKhau = strings.TrimSpace(r.MatKhau)

	if r.Email == "" {
		return errors.New("email không được để trống")
	}

	if r.MatKhau == "" {
		return errors.New("mật khẩu không được để trống")
	}

	bieuThucEmail := regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`)
	if !bieuThucEmail.MatchString(r.Email) {
		return errors.New("email không đúng định dạng")
	}

	if len(r.MatKhau) < 6 {
		return errors.New("mật khẩu phải có ít nhất 6 ký tự")
	}

	return nil
}