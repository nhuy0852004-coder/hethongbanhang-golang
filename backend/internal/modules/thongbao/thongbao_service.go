package thongbao

import (
	"errors"
	"math"
)

type ThongBaoService struct {
	repository *ThongBaoRepository
}

func TaoThongBaoService(repository *ThongBaoRepository) *ThongBaoService {
	return &ThongBaoService{
		repository: repository,
	}
}

func (s *ThongBaoService) DanhSach(dadoc string, loai string, trang int, gioihan int) (*DanhSachThongBaoResponse, error) {
	if trang < 1 {
		trang = 1
	}

	if gioihan < 1 {
		gioihan = 10
	}

	if gioihan > 100 {
		gioihan = 100
	}

	danhSach, tongSoDong, loi := s.repository.DanhSach(dadoc, loai, trang, gioihan)
	if loi != nil {
		return nil, loi
	}

	tongSoTrang := int(math.Ceil(float64(tongSoDong) / float64(gioihan)))
	if tongSoTrang < 1 {
		tongSoTrang = 1
	}

	return &DanhSachThongBaoResponse{
		DanhSach: danhSach,
		PhanTrang: PhanTrangResponse{
			Trang:       trang,
			GioiHan:     gioihan,
			TongSoDong:  tongSoDong,
			TongSoTrang: tongSoTrang,
		},
	}, nil
}

func (s *ThongBaoService) Tao(request TaoThongBaoRequest) (*ThongBao, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	return s.repository.Tao(request)
}

func (s *ThongBaoService) TaoThongBaoDonHangMoi(donhangID uint64, madonhang string, hoten string, tongtien uint64) (*ThongBao, error) {
	request := TaoThongBaoRequest{
		TieuDe:  "Đơn hàng mới",
		NoiDung: "Bạn có đơn hàng mới từ " + hoten,
		Loai:    "don_hang_moi",
		DuLieu: map[string]interface{}{
			"donhang_id": donhangID,
			"madonhang": madonhang,
			"hoten":     hoten,
			"tongtien":  tongtien,
		},
	}

	return s.Tao(request)
}

func (s *ThongBaoService) CapNhatDaDoc(id uint64, dadoc bool) (*ThongBao, error) {
	if id == 0 {
		return nil, errors.New("id thông báo không hợp lệ")
	}

	return s.repository.CapNhatDaDoc(id, dadoc)
}

func (s *ThongBaoService) DanhDauTatCaDaDoc() error {
	return s.repository.DanhDauTatCaDaDoc()
}

func (s *ThongBaoService) Xoa(id uint64) error {
	if id == 0 {
		return errors.New("id thông báo không hợp lệ")
	}

	return s.repository.Xoa(id)
}

func (s *ThongBaoService) DemChuaDoc() (*DemChuaDocResponse, error) {
	soLuong, loi := s.repository.DemChuaDoc()
	if loi != nil {
		return nil, loi
	}

	return &DemChuaDocResponse{
		SoChuaDoc: soLuong,
	}, nil
}