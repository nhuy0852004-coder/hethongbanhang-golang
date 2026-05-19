package thongbao

type DanhSachThongBaoResponse struct {
	DanhSach  []ThongBao       `json:"danhsach"`
	PhanTrang PhanTrangResponse `json:"phantrang"`
}

type PhanTrangResponse struct {
	Trang       int   `json:"trang"`
	GioiHan     int   `json:"gioihan"`
	TongSoDong  int64 `json:"tongsodong"`
	TongSoTrang int   `json:"tongsotrang"`
}

type DemChuaDocResponse struct {
	SoChuaDoc int64 `json:"sochuadoc"`
}