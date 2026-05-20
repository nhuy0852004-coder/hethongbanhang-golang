package danhmuc

import (
	"errors"
	"fmt"
	"math"
	"regexp"
	"strings"
)

type DanhMucService struct {
	repository *DanhMucRepository
}

func TaoDanhMucService(repository *DanhMucRepository) *DanhMucService {
	return &DanhMucService{
		repository: repository,
	}
}

func (s *DanhMucService) DanhSach(timkiem string, trangthai string, hienthixoa bool, trang int, gioihan int) (*DanhSachDanhMucResponse, error) {
	if trang < 1 {
		trang = 1
	}

	if gioihan < 1 {
		gioihan = 10
	}

	if gioihan > 100 {
		gioihan = 100
	}

	if trangthai != "" && trangthai != "hien_thi" && trangthai != "an" {
		return nil, errors.New("trạng thái lọc không hợp lệ")
	}

	danhSach, tongSoDong, loi := s.repository.DanhSach(timkiem, trangthai, hienthixoa, trang, gioihan)
	if loi != nil {
		return nil, loi
	}

	tongSoTrang := int(math.Ceil(float64(tongSoDong) / float64(gioihan)))
	if tongSoTrang < 1 {
		tongSoTrang = 1
	}

	return &DanhSachDanhMucResponse{
		DanhSach: danhSach,
		PhanTrang: PhanTrangResponse{
			Trang:       trang,
			GioiHan:     gioihan,
			TongSoDong:  tongSoDong,
			TongSoTrang: tongSoTrang,
		},
	}, nil
}

func (s *DanhMucService) ChiTiet(id uint64) (*DanhMuc, error) {
	return s.repository.ChiTiet(id, false)
}

func (s *DanhMucService) Tao(request TaoDanhMucRequest) (*DanhMuc, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	tenTonTai, loi := s.repository.TenDaTonTai(request.TenDanhMuc, 0)
	if loi != nil {
		return nil, loi
	}

	if tenTonTai {
		return nil, errors.New("tên danh mục đã tồn tại")
	}

	if request.DanhMucChaID != nil {
		trangThaiCha, loi := s.repository.LayTrangThai(*request.DanhMucChaID)
		if loi != nil {
			return nil, loi
		}

		if request.TrangThai == "hien_thi" && trangThaiCha != "hien_thi" {
			return nil, errors.New("không thể hiển thị danh mục con khi danh mục cha đang ẩn")
		}
	}

	duongdan, loi := s.taoDuongDanKhongTrung(request.TenDanhMuc, 0)
	if loi != nil {
		return nil, loi
	}

	id, loi := s.repository.Tao(request, duongdan)
	if loi != nil {
		return nil, loi
	}

	return s.repository.ChiTiet(id, false)
}

func (s *DanhMucService) CapNhat(id uint64, request CapNhatDanhMucRequest) (*DanhMuc, error) {
	if id == 0 {
		return nil, errors.New("id danh mục không hợp lệ")
	}

	if _, loi := s.repository.ChiTiet(id, false); loi != nil {
		return nil, loi
	}

	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	tenTonTai, loi := s.repository.TenDaTonTai(request.TenDanhMuc, id)
	if loi != nil {
		return nil, loi
	}

	if tenTonTai {
		return nil, errors.New("tên danh mục đã tồn tại")
	}

	if request.DanhMucChaID != nil {
		if *request.DanhMucChaID == id {
			return nil, errors.New("danh mục cha không được trùng với chính danh mục hiện tại")
		}

		coVongLap, loi := s.repository.KiemTraVongLap(id, request.DanhMucChaID)
		if loi != nil {
			return nil, loi
		}

		if coVongLap {
			return nil, errors.New("không thể chọn danh mục con làm danh mục cha vì sẽ tạo vòng lặp")
		}

		trangThaiCha, loi := s.repository.LayTrangThai(*request.DanhMucChaID)
		if loi != nil {
			return nil, loi
		}

		if request.TrangThai == "hien_thi" && trangThaiCha != "hien_thi" {
			return nil, errors.New("không thể hiển thị danh mục con khi danh mục cha đang ẩn")
		}
	}

	duongdan, loi := s.taoDuongDanKhongTrung(request.TenDanhMuc, id)
	if loi != nil {
		return nil, loi
	}

	if loi := s.repository.CapNhat(id, request, duongdan); loi != nil {
		return nil, loi
	}

	return s.repository.ChiTiet(id, false)
}

func (s *DanhMucService) Xoa(id uint64) error {
	if id == 0 {
		return errors.New("id danh mục không hợp lệ")
	}

	item, loi := s.repository.ChiTiet(id, false)
	if loi != nil {
		return loi
	}

	danhSachID, loi := s.repository.LayTatCaIDCon(id)
	if loi != nil {
		return loi
	}

	soSanPham, loi := s.repository.DemSanPhamTrongDanhMucVaCon(danhSachID)
	if loi != nil {
		return loi
	}

	if soSanPham > 0 {
		return fmt.Errorf("không thể xóa danh mục %s vì đang có %d sản phẩm trong danh mục hoặc danh mục con", item.TenDanhMuc, soSanPham)
	}

	return s.repository.XoaNhieuID(danhSachID)
}

func (s *DanhMucService) CapNhatTrangThai(id uint64, request CapNhatTrangThaiRequest) (*DanhMuc, error) {
	if id == 0 {
		return nil, errors.New("id danh mục không hợp lệ")
	}

	item, loi := s.repository.ChiTiet(id, false)
	if loi != nil {
		return nil, loi
	}

	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	if request.TrangThai == "hien_thi" && item.DanhMucChaID != nil {
		trangThaiCha, loi := s.repository.LayTrangThai(*item.DanhMucChaID)
		if loi != nil {
			return nil, loi
		}

		if trangThaiCha != "hien_thi" {
			return nil, errors.New("không thể bật danh mục con khi danh mục cha đang ẩn")
		}
	}

	if request.TrangThai == "an" {
		danhSachID, loi := s.repository.LayTatCaIDCon(id)
		if loi != nil {
			return nil, loi
		}

		if loi := s.repository.CapNhatTrangThaiNhieuID(danhSachID, "an"); loi != nil {
			return nil, loi
		}

		return s.repository.ChiTiet(id, false)
	}

	if loi := s.repository.CapNhatTrangThai(id, request.TrangThai); loi != nil {
		return nil, loi
	}

	return s.repository.ChiTiet(id, false)
}

func (s *DanhMucService) taoDuongDanKhongTrung(ten string, boQuaID uint64) (string, error) {
	duongdanGoc := taoDuongDan(ten)
	duongdan := duongdanGoc

	for i := 1; i <= 50; i++ {
		daTonTai, loi := s.repository.DuongDanDaTonTai(duongdan, boQuaID)
		if loi != nil {
			return "", loi
		}

		if !daTonTai {
			return duongdan, nil
		}

		duongdan = fmt.Sprintf("%s-%d", duongdanGoc, i)
	}

	return "", errors.New("không thể tạo đường dẫn danh mục không trùng")
}

func taoDuongDan(chuoi string) string {
	chuoi = strings.ToLower(strings.TrimSpace(chuoi))

	boDau := strings.NewReplacer(
		"à", "a", "á", "a", "ạ", "a", "ả", "a", "ã", "a",
		"â", "a", "ầ", "a", "ấ", "a", "ậ", "a", "ẩ", "a", "ẫ", "a",
		"ă", "a", "ằ", "a", "ắ", "a", "ặ", "a", "ẳ", "a", "ẵ", "a",
		"è", "e", "é", "e", "ẹ", "e", "ẻ", "e", "ẽ", "e",
		"ê", "e", "ề", "e", "ế", "e", "ệ", "e", "ể", "e", "ễ", "e",
		"ì", "i", "í", "i", "ị", "i", "ỉ", "i", "ĩ", "i",
		"ò", "o", "ó", "o", "ọ", "o", "ỏ", "o", "õ", "o",
		"ô", "o", "ồ", "o", "ố", "o", "ộ", "o", "ổ", "o", "ỗ", "o",
		"ơ", "o", "ờ", "o", "ớ", "o", "ợ", "o", "ở", "o", "ỡ", "o",
		"ù", "u", "ú", "u", "ụ", "u", "ủ", "u", "ũ", "u",
		"ư", "u", "ừ", "u", "ứ", "u", "ự", "u", "ử", "u", "ữ", "u",
		"ỳ", "y", "ý", "y", "ỵ", "y", "ỷ", "y", "ỹ", "y",
		"đ", "d",
	)

	chuoi = boDau.Replace(chuoi)

	bieuThucKhongHopLe := regexp.MustCompile(`[^a-z0-9]+`)
	chuoi = bieuThucKhongHopLe.ReplaceAllString(chuoi, "-")
	chuoi = strings.Trim(chuoi, "-")

	if chuoi == "" {
		return "danh-muc"
	}

	return chuoi
}

func (s *DanhMucService) BulkCapNhatTrangThai(request BulkCapNhatTrangThaiRequest) (*BulkKetQuaResponse, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	response := &BulkKetQuaResponse{
		TongSo: len(request.IDs),
		KetQua: []BulkKetQuaItem{},
	}

	for _, id := range request.IDs {
		_, loi := s.CapNhatTrangThai(id, CapNhatTrangThaiRequest{
			TrangThai: request.TrangThai,
		})

		if loi != nil {
			response.ThatBai++
			response.KetQua = append(response.KetQua, BulkKetQuaItem{
				ID:       id,
				ThanhCong: false,
				ThongBao:  loi.Error(),
			})
			continue
		}

		response.ThanhCong++
		response.KetQua = append(response.KetQua, BulkKetQuaItem{
			ID:       id,
			ThanhCong: true,
			ThongBao:  "Cập nhật trạng thái thành công",
		})
	}

	return response, nil
}

func (s *DanhMucService) BulkXoa(request BulkXoaDanhMucRequest) (*BulkKetQuaResponse, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	response := &BulkKetQuaResponse{
		TongSo: len(request.IDs),
		KetQua: []BulkKetQuaItem{},
	}

	for _, id := range request.IDs {
		loi := s.Xoa(id)

		if loi != nil {
			response.ThatBai++
			response.KetQua = append(response.KetQua, BulkKetQuaItem{
				ID:       id,
				ThanhCong: false,
				ThongBao:  loi.Error(),
			})
			continue
		}

		response.ThanhCong++
		response.KetQua = append(response.KetQua, BulkKetQuaItem{
			ID:       id,
			ThanhCong: true,
			ThongBao:  "Xóa danh mục thành công",
		})
	}

	return response, nil
}