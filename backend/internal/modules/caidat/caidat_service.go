package caidat

import "errors"

type CaiDatService struct {
	repository *CaiDatRepository
}

func TaoCaiDatService(repository *CaiDatRepository) *CaiDatService {
	return &CaiDatService{
		repository: repository,
	}
}

func (s *CaiDatService) LayCaiDat() (*CaiDatCuaHang, error) {
	return s.repository.LayCaiDat()
}

func (s *CaiDatService) CapNhat(request CapNhatCaiDatRequest) (*CaiDatCuaHang, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	return s.repository.CapNhat(request)
}

func (s *CaiDatService) CapNhatLogo(duongdan string) (*CaiDatCuaHang, error) {
	if duongdan == "" {
		return nil, errors.New("đường dẫn logo không hợp lệ")
	}

	return s.repository.CapNhatLogo(duongdan)
}