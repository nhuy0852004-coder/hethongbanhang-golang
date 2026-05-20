package caidat

type CaiDatCuaHang struct {
	ID                  uint64 `json:"id"`
	TenCuaHang          string `json:"tencuahang"`
	Logo                string `json:"logo"`
	SoDienThoai         string `json:"sodienthoai"`
	Email               string `json:"email"`
	DiaChi              string `json:"diachi"`
	ChinhSachVanChuyen  string `json:"chinhsachvanchuyen"`
	ChinhSachDoiTra     string `json:"chinhsachdoitra"`
}