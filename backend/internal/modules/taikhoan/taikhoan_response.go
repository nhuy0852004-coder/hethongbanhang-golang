package taikhoan

type ThongTinTaiKhoanResponse struct {
	ID          uint64 `json:"id"`
	HoTen      string `json:"hoten"`
	Email      string `json:"email"`
	SoDienThoai string `json:"sodienthoai"`
	VaiTro      string `json:"vaitro"`
	TrangThai   string `json:"trangthai"`
}

type DangNhapResponse struct {
	Token    string                  `json:"token"`
	TaiKhoan ThongTinTaiKhoanResponse `json:"taikhoan"`
}

func TaoThongTinTaiKhoanResponse(nguoidung NguoiDung) ThongTinTaiKhoanResponse {
	return ThongTinTaiKhoanResponse{
		ID:          nguoidung.ID,
		HoTen:      nguoidung.HoTen,
		Email:      nguoidung.Email,
		SoDienThoai: nguoidung.SoDienThoai,
		VaiTro:      nguoidung.VaiTro,
		TrangThai:   nguoidung.TrangThai,
	}
}