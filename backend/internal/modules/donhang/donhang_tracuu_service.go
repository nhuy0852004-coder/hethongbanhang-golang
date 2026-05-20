package donhang

func (s *DonHangService) TraCuu(request TraCuuDonHangRequest) (*DonHang, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	return s.repository.TraCuu(request)
}