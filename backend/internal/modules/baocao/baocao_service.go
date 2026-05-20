package baocao

import (
	"errors"
	"time"
)

type BaoCaoService struct {
	repository *BaoCaoRepository
}

func TaoBaoCaoService(repository *BaoCaoRepository) *BaoCaoService {
	return &BaoCaoService{
		repository: repository,
	}
}

func (s *BaoCaoService) chuanHoaNgay(tungay string, denngay string) (string, string) {
	if denngay == "" {
		denngay = time.Now().Format("2006-01-02")
	}

	if tungay == "" {
		tungay = time.Now().AddDate(0, 0, -6).Format("2006-01-02")
	}

	return tungay, denngay
}

func (s *BaoCaoService) kiemTraNgay(tungay string, denngay string) error {
	tu, loi := time.Parse("2006-01-02", tungay)
	if loi != nil {
		return errors.New("từ ngày không hợp lệ")
	}

	den, loi := time.Parse("2006-01-02", denngay)
	if loi != nil {
		return errors.New("đến ngày không hợp lệ")
	}

	if tu.After(den) {
		return errors.New("từ ngày không được lớn hơn đến ngày")
	}

	return nil
}

func (s *BaoCaoService) DoanhThu(tungay string, denngay string) ([]DoanhThuItem, error) {
	tungay, denngay = s.chuanHoaNgay(tungay, denngay)

	if loi := s.kiemTraNgay(tungay, denngay); loi != nil {
		return nil, loi
	}

	return s.repository.DoanhThu(tungay, denngay)
}

func (s *BaoCaoService) TopSanPham(tungay string, denngay string) ([]TopSanPhamItem, error) {
	tungay, denngay = s.chuanHoaNgay(tungay, denngay)

	if loi := s.kiemTraNgay(tungay, denngay); loi != nil {
		return nil, loi
	}

	return s.repository.TopSanPham(tungay, denngay)
}

func (s *BaoCaoService) DonHang(tungay string, denngay string) (*ThongKeDonHang, error) {
	tungay, denngay = s.chuanHoaNgay(tungay, denngay)

	if loi := s.kiemTraNgay(tungay, denngay); loi != nil {
		return nil, loi
	}

	return s.repository.DonHang(tungay, denngay)
}