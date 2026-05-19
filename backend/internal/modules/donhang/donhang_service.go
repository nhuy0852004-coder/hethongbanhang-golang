package donhang

import (
	"errors"
	"fmt"
	"math"
	"time"

	"hethongbanhang/backend/internal/thoigianthuc"
)

type DonHangService struct {
	repository *DonHangRepository
	realtime   *thoigianthuc.TrungTamRealtime
}

func TaoDonHangService(repository *DonHangRepository, realtime *thoigianthuc.TrungTamRealtime) *DonHangService {
	return &DonHangService{
		repository: repository,
		realtime:   realtime,
	}
}

func (s *DonHangService) DanhSach(timkiem string, trangthai string, tungay string, denngay string, trang int, gioihan int) (*DanhSachDonHangResponse, error) {
	if trang < 1 {
		trang = 1
	}

	if gioihan < 1 {
		gioihan = 10
	}

	if gioihan > 100 {
		gioihan = 100
	}

	if trangthai != "" {
		request := CapNhatTrangThaiDonHangRequest{TrangThai: trangthai}
		if loi := request.KiemTra(); loi != nil {
			return nil, errors.New("trạng thái lọc không hợp lệ")
		}
	}

	danhSach, tongSoDong, loi := s.repository.DanhSach(timkiem, trangthai, tungay, denngay, trang, gioihan)
	if loi != nil {
		return nil, loi
	}

	tongSoTrang := int(math.Ceil(float64(tongSoDong) / float64(gioihan)))
	if tongSoTrang < 1 {
		tongSoTrang = 1
	}

	return &DanhSachDonHangResponse{
		DanhSach: danhSach,
		PhanTrang: PhanTrangResponse{
			Trang:       trang,
			GioiHan:     gioihan,
			TongSoDong:  tongSoDong,
			TongSoTrang: tongSoTrang,
		},
	}, nil
}

func (s *DonHangService) ChiTiet(id uint64) (*DonHang, error) {
	if id == 0 {
		return nil, errors.New("id đơn hàng không hợp lệ")
	}

	return s.repository.ChiTiet(id)
}

func (s *DonHangService) TaoDonHang(request TaoDonHangRequest) (*DonHang, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	madonhang := taoMaDonHang()

	duLieu, loi := s.repository.TaoDonHang(request, madonhang)
	if loi != nil {
		return nil, loi
	}

	if s.realtime != nil {
		s.realtime.GuiChoAdmin("don_hang_moi", duLieu)
		s.realtime.GuiChoAdmin("thong_bao_moi", map[string]interface{}{
			"tieude":  "Đơn hàng mới",
			"noidung": "Bạn có đơn hàng mới từ " + duLieu.HoTen,
			"donhang": duLieu,
		})
	}

	return duLieu, nil
}

func (s *DonHangService) CapNhatTrangThai(id uint64, request CapNhatTrangThaiDonHangRequest) (*DonHang, error) {
	if id == 0 {
		return nil, errors.New("id đơn hàng không hợp lệ")
	}

	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	if loi := s.repository.CapNhatTrangThai(id, request.TrangThai); loi != nil {
		return nil, loi
	}

	duLieu, loi := s.repository.ChiTiet(id)
	if loi != nil {
		return nil, loi
	}

	if s.realtime != nil {
		s.realtime.GuiChoAdmin("cap_nhat_trang_thai_don_hang", duLieu)
		s.realtime.GuiTheoDonHang(duLieu.MaDonHang, "cap_nhat_trang_thai_don_hang", duLieu)
	}

	return duLieu, nil
}

func (s *DonHangService) Xoa(id uint64) error {
	if id == 0 {
		return errors.New("id đơn hàng không hợp lệ")
	}

	return s.repository.Xoa(id)
}

func taoMaDonHang() string {
	hienTai := time.Now()

	return fmt.Sprintf(
		"DH%s%03d",
		hienTai.Format("20060102150405"),
		hienTai.Nanosecond()%1000,
	)
}