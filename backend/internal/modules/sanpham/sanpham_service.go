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

func (s *SanPhamService) DanhSach(timkiem string, trangthai string, danhmucID uint64, trang int, gioihan int) (*DanhSachSanPhamResponse, error) {
	if trang < 1 {
		trang = 1
	}
	if gioihan < 1 {
		gioihan = 10
	}
	if gioihan > 100 {
		gioihan = 100
	}
	if trangthai != "" && trangthai != "hien_thi" && trangthai != "an" && trangthai != "het_hang" {
		return nil, errors.New("trạng thái lọc không hợp lệ")
	}

	danhSach, tongSoDong, loi := s.repository.DanhSach(timkiem, trangthai, danhmucID, trang, gioihan)
	if loi != nil {
		return nil, loi
	}

	tongSoTrang := int(math.Ceil(float64(tongSoDong) / float64(gioihan)))
	if tongSoTrang < 1 {
		tongSoTrang = 1
	}

	return &DanhSachSanPhamResponse{
		DanhSach: danhSach,
		PhanTrang: PhanTrangResponse{Trang: trang, GioiHan: gioihan, TongSoDong: tongSoDong, TongSoTrang: tongSoTrang},
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
