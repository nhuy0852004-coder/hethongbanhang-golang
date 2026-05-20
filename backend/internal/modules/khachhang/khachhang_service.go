package khachhang

import (
	"errors"
	"math"
)

type KhachHangService struct {
	repository *KhachHangRepository
}

func TaoKhachHangService(repository *KhachHangRepository) *KhachHangService {
	return &KhachHangService{
		repository: repository,
	}
}

func (s *KhachHangService) DanhSach(timkiem string, trangthai string, trang int, gioihan int) (*DanhSachKhachHangResponse, error) {
	if trang < 1 {
		trang = 1
	}

	if gioihan < 1 {
		gioihan = 10
	}

	if gioihan > 100 {
		gioihan = 100
	}

	if trangthai != "" && trangthai != "hoat_dong" && trangthai != "tam_khoa" {
		return nil, errors.New("trạng thái khách hàng không hợp lệ")
	}

	danhSach, tongSoDong, loi := s.repository.DanhSach(timkiem, trangthai, trang, gioihan)
	if loi != nil {
		return nil, loi
	}

	tongSoTrang := int(math.Ceil(float64(tongSoDong) / float64(gioihan)))
	if tongSoTrang < 1 {
		tongSoTrang = 1
	}

	return &DanhSachKhachHangResponse{
		DanhSach: danhSach,
		PhanTrang: PhanTrangResponse{
			Trang:       trang,
			GioiHan:     gioihan,
			TongSoDong:  tongSoDong,
			TongSoTrang: tongSoTrang,
		},
	}, nil
}

func (s *KhachHangService) ChiTiet(id uint64) (*ChiTietKhachHangResponse, error) {
	if id == 0 {
		return nil, errors.New("id khách hàng không hợp lệ")
	}

	khachhang, loi := s.repository.ChiTiet(id)
	if loi != nil {
		return nil, loi
	}

	donhang, loi := s.repository.DonHangCuaKhachHang(id)
	if loi != nil {
		return nil, loi
	}

	return &ChiTietKhachHangResponse{
		KhachHang: *khachhang,
		DonHang:   donhang,
	}, nil
}

func (s *KhachHangService) DonHangCuaKhachHang(id uint64) ([]DonHangKhachHang, error) {
	if id == 0 {
		return nil, errors.New("id khách hàng không hợp lệ")
	}

	return s.repository.DonHangCuaKhachHang(id)
}