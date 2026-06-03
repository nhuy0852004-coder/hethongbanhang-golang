package tongquan

import "time"

type TongQuanService struct {
	repository *TongQuanRepository
}

func TaoTongQuanService(repository *TongQuanRepository) *TongQuanService {
	return &TongQuanService{
		repository: repository,
	}
}

func tinhKhoangNgay(khoangNgay string) (time.Time, time.Time) {
	homNay := time.Now()
	ketThuc := homNay

	switch khoangNgay {
	case "homnay":
		return time.Date(homNay.Year(), homNay.Month(), homNay.Day(), 0, 0, 0, 0, homNay.Location()), ketThuc
	case "7ngay":
		return homNay.AddDate(0, 0, -6), ketThuc
	case "30ngay":
		return homNay.AddDate(0, 0, -29), ketThuc
	case "thangnay":
		return time.Date(homNay.Year(), homNay.Month(), 1, 0, 0, 0, 0, homNay.Location()), ketThuc
	default:
		return homNay.AddDate(0, 0, -6), ketThuc
	}
}

func (s *TongQuanService) LayTongQuan(khoangNgay string) (*TongQuanResponse, error) {
	batDau, ketThuc := tinhKhoangNgay(khoangNgay)
	ngayBatDau := batDau.Format("2006-01-02")
	ngayKetThuc := ketThuc.Format("2006-01-02")

	thongKe, loi := s.repository.LayThongKe()
	if loi != nil {
		return nil, loi
	}

	doanhThuTheoNgay, loi := s.repository.LayDoanhThuTheoKhoang(ngayBatDau, ngayKetThuc)
	if loi != nil {
		return nil, loi
	}

	donHangMoiNhat, loi := s.repository.LayDonHangMoiNhat()
	if loi != nil {
		return nil, loi
	}

	sanPhamSapHet, loi := s.repository.LaySanPhamSapHet()
	if loi != nil {
		return nil, loi
	}

	trangThaiDon, loi := s.repository.LayTrangThaiDonHang()
	if loi != nil {
		return nil, loi
	}

	sanPhamBanChay, loi := s.repository.LaySanPhamBanChay()
	if loi != nil {
		return nil, loi
	}

	return &TongQuanResponse{
		ThongKe:          thongKe,
		DoanhThuBayNgay:  doanhThuTheoNgay,
		DonHangMoiNhat:   donHangMoiNhat,
		SanPhamSapHetDS:  sanPhamSapHet,
		TrangThaiDon:     trangThaiDon,
		SanPhamBanChayDS: sanPhamBanChay,
	}, nil
}
