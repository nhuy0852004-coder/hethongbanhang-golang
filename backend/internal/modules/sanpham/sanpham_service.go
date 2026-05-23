package sanpham

import (
	"errors"
	"fmt"
	"math"
	"math/rand"
	"regexp"
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

func (s *SanPhamService) ChiTiet(id uint64) (*ChiTietSanPhamResponse, error) {
	if id == 0 {
		return nil, errors.New("id sản phẩm không hợp lệ")
	}

	sanPham, loi := s.repository.ChiTiet(id)
	if loi != nil {
		return nil, loi
	}

	album, loi := s.repository.LayAlbumAnh(id)
	if loi != nil {
		return nil, loi
	}

	return &ChiTietSanPhamResponse{
		SanPham: *sanPham,
		Album:   album,
	}, nil
}

func (s *SanPhamService) Tao(request TaoSanPhamRequest) (*SanPham, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	request.MaDinhDanh = strings.TrimSpace(request.MaDinhDanh)
	request.SKU = strings.TrimSpace(request.SKU)

	if request.MaDinhDanh == "" {
		maTuDong, loi := s.taoMaSanPhamDuyNhat(0)
		if loi != nil {
			return nil, loi
		}

		request.MaDinhDanh = maTuDong
	}

	if request.SKU == "" {
		skuTuDong, loi := s.taoSKUDuyNhat(request.TenSanPham, 0)
		if loi != nil {
			return nil, loi
		}

		request.SKU = skuTuDong
	}

	id, loi := s.repository.Tao(request, request.MaDinhDanh)
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

	request.MaDinhDanh = strings.TrimSpace(request.MaDinhDanh)
	request.SKU = strings.TrimSpace(request.SKU)

	if request.MaDinhDanh == "" {
		maTuDong, loi := s.taoMaSanPhamDuyNhat(id)
		if loi != nil {
			return nil, loi
		}

		request.MaDinhDanh = maTuDong
	}

	if request.SKU == "" {
		skuTuDong, loi := s.taoSKUDuyNhat(request.TenSanPham, id)
		if loi != nil {
			return nil, loi
		}

		request.SKU = skuTuDong
	}

	if loi := s.repository.CapNhat(id, request, request.MaDinhDanh); loi != nil {
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

func (s *SanPhamService) ThemAlbumAnh(id uint64, danhSachDuongDan []string) (*SanPham, error) {
	if id == 0 {
		return nil, errors.New("id sản phẩm không hợp lệ")
	}

	danhSachHopLe := []string{}
	for _, duongdan := range danhSachDuongDan {
		duongdan = strings.TrimSpace(duongdan)
		if duongdan != "" {
			danhSachHopLe = append(danhSachHopLe, duongdan)
		}
	}

	if len(danhSachHopLe) == 0 {
		return nil, errors.New("vui lòng chọn ít nhất một ảnh")
	}

	if loi := s.repository.ThemAlbumAnh(id, danhSachHopLe); loi != nil {
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

func (s *SanPhamService) BulkCapNhatTrangThai(request BulkCapNhatTrangThaiSanPhamRequest) (*BulkSanPhamKetQuaResponse, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	response := &BulkSanPhamKetQuaResponse{
		TongSo: len(request.IDs),
		KetQua: []BulkSanPhamKetQuaItem{},
	}

	for _, id := range request.IDs {
		_, loi := s.CapNhatTrangThai(id, CapNhatTrangThaiSanPhamRequest{
			TrangThai: request.TrangThai,
		})

		if loi != nil {
			response.ThatBai++
			response.KetQua = append(response.KetQua, BulkSanPhamKetQuaItem{
				ID:        id,
				ThanhCong: false,
				ThongBao:  loi.Error(),
			})
			continue
		}

		response.ThanhCong++
		response.KetQua = append(response.KetQua, BulkSanPhamKetQuaItem{
			ID:        id,
			ThanhCong: true,
			ThongBao:  "Cập nhật trạng thái thành công",
		})
	}

	return response, nil
}

func (s *SanPhamService) BulkXoa(request BulkXoaSanPhamRequest) (*BulkSanPhamKetQuaResponse, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	response := &BulkSanPhamKetQuaResponse{
		TongSo: len(request.IDs),
		KetQua: []BulkSanPhamKetQuaItem{},
	}

	for _, id := range request.IDs {
		loi := s.Xoa(id)

		if loi != nil {
			response.ThatBai++
			response.KetQua = append(response.KetQua, BulkSanPhamKetQuaItem{
				ID:        id,
				ThanhCong: false,
				ThongBao:  loi.Error(),
			})
			continue
		}

		response.ThanhCong++
		response.KetQua = append(response.KetQua, BulkSanPhamKetQuaItem{
			ID:        id,
			ThanhCong: true,
			ThongBao:  "Xóa sản phẩm thành công",
		})
	}

	return response, nil
}

func taoMaSanPhamTuDong() string {
	return fmt.Sprintf(
		"SP-%s-%06d",
		time.Now().Format("20060102"),
		rand.Intn(999999),
	)
}

func taoSKUTheoTenSanPham(tenSanPham string) string {
	ten := strings.ToUpper(strings.TrimSpace(tenSanPham))

	reg := regexp.MustCompile(`[^A-Z0-9]+`)
	ten = reg.ReplaceAllString(ten, "-")
	ten = strings.Trim(ten, "-")

	if ten == "" {
		ten = "SAN-PHAM"
	}

	if len(ten) > 24 {
		ten = ten[:24]
		ten = strings.Trim(ten, "-")
	}

	return fmt.Sprintf(
		"%s-%06d",
		ten,
		rand.Intn(999999),
	)
}

func (s *SanPhamService) taoMaSanPhamDuyNhat(boQuaID uint64) (string, error) {
	for i := 0; i < 20; i++ {
		ma := taoMaSanPhamTuDong()

		tontai, loi := s.repository.MaDinhDanhDaTonTai(ma, boQuaID)
		if loi != nil {
			return "", loi
		}

		if !tontai {
			return ma, nil
		}
	}

	return "", errors.New("không tạo được mã sản phẩm tự động")
}

func (s *SanPhamService) taoSKUDuyNhat(tenSanPham string, boQuaID uint64) (string, error) {
	for i := 0; i < 20; i++ {
		sku := taoSKUTheoTenSanPham(tenSanPham)

		tontai, loi := s.repository.SKUDaTonTai(sku, boQuaID)
		if loi != nil {
			return "", loi
		}

		if !tontai {
			return sku, nil
		}
	}

	return "", errors.New("không tạo được SKU tự động")
}
