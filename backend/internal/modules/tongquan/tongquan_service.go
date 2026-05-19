package tongquan

type TongQuanService struct {
	repository *TongQuanRepository
}

func TaoTongQuanService(repository *TongQuanRepository) *TongQuanService {
	return &TongQuanService{
		repository: repository,
	}
}

func (s *TongQuanService) LayTongQuan() (*TongQuanResponse, error) {
	thongKe, loi := s.repository.LayThongKe()
	if loi != nil {
		return nil, loi
	}

	doanhThuBayNgay, loi := s.repository.LayDoanhThuBayNgay()
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

	return &TongQuanResponse{
		ThongKe:         thongKe,
		DoanhThuBayNgay: doanhThuBayNgay,
		DonHangMoiNhat: donHangMoiNhat,
		SanPhamSapHet:  sanPhamSapHet,
	}, nil
}