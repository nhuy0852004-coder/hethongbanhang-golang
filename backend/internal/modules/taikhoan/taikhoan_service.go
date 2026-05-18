package taikhoan

import (
	"errors"

	"hethongbanhang/backend/internal/baomat"

	"golang.org/x/crypto/bcrypt"
)

type TaiKhoanService struct {
	repository *TaiKhoanRepository
	jwtBiMat   string
}

func TaoTaiKhoanService(repository *TaiKhoanRepository, jwtBiMat string) *TaiKhoanService {
	return &TaiKhoanService{
		repository: repository,
		jwtBiMat:   jwtBiMat,
	}
}

func (s *TaiKhoanService) DangNhap(request DangNhapRequest) (*DangNhapResponse, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	nguoidung, loi := s.repository.TimTheoEmail(request.Email)
	if loi != nil {
		return nil, errors.New("email hoặc mật khẩu không đúng")
	}

	if nguoidung.TrangThai != "hoat_dong" {
		return nil, errors.New("tài khoản đang bị khóa")
	}

	loi = bcrypt.CompareHashAndPassword([]byte(nguoidung.MatKhau), []byte(request.MatKhau))
	if loi != nil {
		return nil, errors.New("email hoặc mật khẩu không đúng")
	}

	token, loi := baomat.TaoToken(nguoidung.ID, nguoidung.Email, nguoidung.VaiTro, s.jwtBiMat)
	if loi != nil {
		return nil, errors.New("không thể tạo token đăng nhập")
	}

	return &DangNhapResponse{
		Token:    token,
		TaiKhoan: TaoThongTinTaiKhoanResponse(*nguoidung),
	}, nil
}

func (s *TaiKhoanService) LayThongTinTaiKhoan(id uint64) (*ThongTinTaiKhoanResponse, error) {
	nguoidung, loi := s.repository.TimTheoID(id)
	if loi != nil {
		return nil, loi
	}

	thongTin := TaoThongTinTaiKhoanResponse(*nguoidung)

	return &thongTin, nil
}