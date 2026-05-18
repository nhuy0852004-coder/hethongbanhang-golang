package danhmuc

import (
	"errors"
	"fmt"
	"strings"
)

type DanhMucService struct {
	repository *DanhMucRepository
}

func TaoDanhMucService(repository *DanhMucRepository) *DanhMucService {
	return &DanhMucService{repository: repository}
}

func (s *DanhMucService) DanhSach(timkiem string, trangthai string, trang int, gioihan int) (map[string]interface{}, error) {
	if trang < 1 {
		trang = 1
	}
	if gioihan < 1 {
		gioihan = 10
	}

	danhSach, tongSoDong, loi := s.repository.DanhSach(timkiem, trangthai, trang, gioihan)
	if loi != nil {
		return nil, loi
	}

	tongSoTrang := int((tongSoDong + int64(gioihan) - 1) / int64(gioihan))
	if tongSoTrang < 1 {
		tongSoTrang = 1
	}

	return map[string]interface{}{
		"danhsach": danhSach,
		"phantrang": map[string]interface{}{
			"trang":       trang,
			"gioihan":     gioihan,
			"tongsodong":  tongSoDong,
			"tongsotrang": tongSoTrang,
		},
	}, nil
}

func (s *DanhMucService) ChiTiet(id uint64) (*DanhMucResponse, error) {
	item, loi := s.repository.ChiTiet(id)
	if loi != nil {
		return nil, loi
	}
	return ChuyenSangResponse(item), nil
}

func (s *DanhMucService) Tao(request TaoDanhMucRequest) (*DanhMucResponse, error) {
	request.TenDanhMuc = strings.TrimSpace(request.TenDanhMuc)
	request.MoTa = strings.TrimSpace(request.MoTa)
	request.TrangThai = strings.TrimSpace(request.TrangThai)

	if request.TenDanhMuc == "" {
		return nil, errors.New("vui lòng nhập tên danh mục")
	}
	if request.TrangThai == "" {
		request.TrangThai = "hien_thi"
	}

	duongdan := TaoDuongDan(request.TenDanhMuc)
	tonTai, loi := s.repository.DuongDanDaTonTai(duongdan, 0)
	if loi != nil {
		return nil, loi
	}
	if tonTai {
		duongdan = TaoDuongDanKhac(duongdan)
	}

	id, loi := s.repository.Tao(request, duongdan)
	if loi != nil {
		return nil, loi
	}

	item, loi := s.repository.ChiTiet(id)
	if loi != nil {
		return nil, loi
	}

	return ChuyenSangResponse(item), nil
}

func (s *DanhMucService) CapNhat(id uint64, request CapNhatDanhMucRequest) (*DanhMucResponse, error) {
	request.TenDanhMuc = strings.TrimSpace(request.TenDanhMuc)
	request.MoTa = strings.TrimSpace(request.MoTa)
	request.TrangThai = strings.TrimSpace(request.TrangThai)

	if request.TenDanhMuc == "" {
		return nil, errors.New("vui lòng nhập tên danh mục")
	}
	if request.TrangThai == "" {
		request.TrangThai = "hien_thi"
	}

	duongdan := TaoDuongDan(request.TenDanhMuc)
	tonTai, loi := s.repository.DuongDanDaTonTai(duongdan, id)
	if loi != nil {
		return nil, loi
	}
	if tonTai {
		return nil, fmt.Errorf("đường dẫn '%s' đã tồn tại", duongdan)
	}

	if loi := s.repository.CapNhat(id, request, duongdan); loi != nil {
		return nil, loi
	}

	item, loi := s.repository.ChiTiet(id)
	if loi != nil {
		return nil, loi
	}

	return ChuyenSangResponse(item), nil
}

func (s *DanhMucService) Xoa(id uint64) error {
	return s.repository.Xoa(id)
}

func (s *DanhMucService) CapNhatTrangThai(id uint64, request CapNhatTrangThaiRequest) (*DanhMucResponse, error) {
	request.TrangThai = strings.TrimSpace(request.TrangThai)
	if request.TrangThai != "hien_thi" && request.TrangThai != "an" {
		return nil, errors.New("trạng thái không hợp lệ")
	}

	if loi := s.repository.CapNhatTrangThai(id, request.TrangThai); loi != nil {
		return nil, loi
	}

	item, loi := s.repository.ChiTiet(id)
	if loi != nil {
		return nil, loi
	}

	return ChuyenSangResponse(item), nil
}

func TaoDuongDan(ten string) string {
	duongdan := strings.ToLower(strings.TrimSpace(ten))
	duongdan = strings.ReplaceAll(duongdan, " ", "-")
	duongdan = strings.ReplaceAll(duongdan, "--", "-")
	return duongdan
}

func TaoDuongDanKhac(duongdan string) string {
	return fmt.Sprintf("%s-%d", duongdan, 1)
}
