package thongbao

import "time"

type ThongBao struct {
	ID        uint64      `json:"id"`
	TieuDe    string      `json:"tieude"`
	NoiDung   string      `json:"noidung"`
	Loai      string      `json:"loai"`
	DaDoc     bool        `json:"dadoc"`
	DuLieu    interface{} `json:"dulieu,omitempty"`
	CreatedAt time.Time   `json:"created_at"`
	UpdatedAt time.Time   `json:"updated_at"`
}