package sanpham

import (
	"errors"
	"fmt"
	"math"
	"strings"
	"time"
)

type SanPhamService struct {
	repository *SanPhamRepository
}

func TaoSanPhamService(repository *SanPhamRepository) *SanPhamService {
	return &SanPhamService{repository: repository}
}

func (s *SanPhamService) DanhSach(loc LocSanPhamRequest) (*DanhSachSanPhamResponse, error) {
	if loc.Trang < 1 {
		loc.Trang = 1
	}

	if loc.GioiHan < 1 {
		loc.GioiHan = 10
	}

	if loc.GioiHan > 100 {
		loc.GioiHan = 100
	}

	if loc.TrangThai != "" &&
		loc.TrangThai != "hien_thi" &&
		loc.TrangThai != "an" &&
		loc.TrangThai != "het_hang" {
		return nil, errors.New("trạng thái lọc không hợp lệ")
	}

	danhSach, tongSoDong, loi := s.repository.DanhSach(loc)
	if loi != nil {
		return nil, loi
	}

	tongSoTrang := int(math.Ceil(float64(tongSoDong) / float64(loc.GioiHan)))
	if tongSoTrang < 1 {
		tongSoTrang = 1
	}

	return &DanhSachSanPhamResponse{
		DanhSach: danhSach,
		PhanTrang: PhanTrangResponse{
			Trang:       loc.Trang,
			GioiHan:     loc.GioiHan,
			TongSoDong:  tongSoDong,
			TongSoTrang: tongSoTrang,
		},
	}, nil
}

func (s *SanPhamService) ChiTiet(id uint64) (*SanPham, error) {
	if id == 0 {
		return nil, errors.New("id sản phẩm không hợp lệ")
	}
	return s.repository.ChiTiet(id)
}

func (s *SanPhamService) Tao(request TaoSanPhamRequest) (*SanPham, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	madinhdanh, loi := s.taoMaDinhDanhKhongTrung(request.MaDinhDanh, 0)
	if loi != nil {
		return nil, loi
	}

	id, loi := s.repository.Tao(request, madinhdanh)
	if loi != nil {
		return nil, loi
	}

	return s.repository.ChiTiet(id)
}

func (s *SanPhamService) CapNhat(id uint64, request CapNhatSanPhamRequest) (*SanPham, error) {
	if id == 0 {
		return nil, errors.New("id sản phẩm không hợp lệ")
	}
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	madinhdanh, loi := s.taoMaDinhDanhKhongTrung(request.MaDinhDanh, id)
	if loi != nil {
		return nil, loi
	}

	if loi := s.repository.CapNhat(id, request, madinhdanh); loi != nil {
		return nil, loi
	}

	return s.repository.ChiTiet(id)
}

func (s *SanPhamService) Xoa(id uint64) error {
	if id == 0 {
		return errors.New("id sản phẩm không hợp lệ")
	}
	return s.repository.Xoa(id)
}

func (s *SanPhamService) CapNhatTrangThai(id uint64, request CapNhatTrangThaiSanPhamRequest) (*SanPham, error) {
	if id == 0 {
		return nil, errors.New("id sản phẩm không hợp lệ")
	}
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}
	if loi := s.repository.CapNhatTrangThai(id, request.TrangThai); loi != nil {
		return nil, loi
	}
	return s.repository.ChiTiet(id)
}

func (s *SanPhamService) CapNhatHinhAnh(id uint64, duongdan string) (*SanPham, error) {
	if id == 0 {
		return nil, errors.New("id sản phẩm không hợp lệ")
	}
	if strings.TrimSpace(duongdan) == "" {
		return nil, errors.New("đường dẫn ảnh không hợp lệ")
	}
	if loi := s.repository.CapNhatHinhAnh(id, duongdan); loi != nil {
		return nil, loi
	}
	return s.repository.ChiTiet(id)
}

func (s *SanPhamService) taoMaDinhDanhKhongTrung(maNhap string, boQuaID uint64) (string, error) {
	maGoc := strings.TrimSpace(maNhap)
	if maGoc == "" {
		maGoc = "SP" + time.Now().Format("20060102150405")
	}

	maGoc = strings.ToUpper(strings.ReplaceAll(maGoc, " ", "-"))
	maHienTai := maGoc

	for i := 0; i <= 50; i++ {
		daTonTai, loi := s.repository.MaDinhDanhDaTonTai(maHienTai, boQuaID)
		if loi != nil {
			return "", loi
		}
		if !daTonTai {
			return maHienTai, nil
		}
		maHienTai = fmt.Sprintf("%s-%d", maGoc, i+1)
	}

	return "", errors.New("mã định danh sản phẩm đã tồn tại")
}
