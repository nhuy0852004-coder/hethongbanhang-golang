package donhang

import (
	"fmt"
	"time"
)

type DonHangService struct {
	repository *DonHangRepository
}

func TaoDonHangService(repository *DonHangRepository) *DonHangService {
	return &DonHangService{
		repository: repository,
	}
}

func (s *DonHangService) TaoDonHang(request TaoDonHangRequest) (*DonHang, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	madonhang := taoMaDonHang()

	return s.repository.TaoDonHang(request, madonhang)
}

func taoMaDonHang() string {
	hienTai := time.Now()

	return fmt.Sprintf(
		"DH%s%03d",
		hienTai.Format("20060102150405"),
		hienTai.Nanosecond()%1000,
	)
}