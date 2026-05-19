package thongbao

import (
	"errors"
	"strings"
)

type TaoThongBaoRequest struct {
	TieuDe  string      `json:"tieude"`
	NoiDung string      `json:"noidung"`
	Loai    string      `json:"loai"`
	DuLieu  interface{} `json:"dulieu"`
}

type CapNhatDaDocRequest struct {
	DaDoc bool `json:"dadoc"`
}

func (r *TaoThongBaoRequest) KiemTra() error {
	r.TieuDe = strings.TrimSpace(r.TieuDe)
	r.NoiDung = strings.TrimSpace(r.NoiDung)
	r.Loai = strings.TrimSpace(r.Loai)

	if r.TieuDe == "" {
		return errors.New("tiêu đề thông báo không được để trống")
	}

	if r.NoiDung == "" {
		return errors.New("nội dung thông báo không được để trống")
	}

	if r.Loai == "" {
		r.Loai = "he_thong"
	}

	return nil
}