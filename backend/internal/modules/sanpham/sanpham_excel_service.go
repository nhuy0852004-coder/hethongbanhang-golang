package sanpham

import (
	"bytes"
	"errors"
	"fmt"
	"io"
	"strconv"
	"strings"
	"time"

	"github.com/xuri/excelize/v2"
)

func (s *SanPhamService) ExportExcel(loc LocSanPhamRequest) (*bytes.Buffer, string, error) {
	loc.Trang = 1
	loc.GioiHan = 100000 // Get all for export
	danhSach, _, loi := s.repository.DanhSach(loc)
	if loi != nil {
		return nil, "", loi
	}

	f := excelize.NewFile()
	defer f.Close()

	sheet := "Sản Phẩm"
	f.SetSheetName("Sheet1", sheet)

	headers := []string{
		"Mã Sản Phẩm", "Tên Sản Phẩm", "SKU", "Barcode", "Danh Mục", "Thương Hiệu",
		"Đơn Vị Tính", "Giá Nhập", "Giá Bán", "Tồn Kho", "Trạng Thái",
	}

	for i, header := range headers {
		cell, _ := excelize.CoordinatesToCellName(i+1, 1)
		f.SetCellValue(sheet, cell, header)
	}

	for i, sp := range danhSach {
		hang := i + 2
		f.SetCellValue(sheet, fmt.Sprintf("A%d", hang), sp.MaDinhDanh)
		f.SetCellValue(sheet, fmt.Sprintf("B%d", hang), sp.TenSanPham)
		f.SetCellValue(sheet, fmt.Sprintf("C%d", hang), sp.SKU)
		f.SetCellValue(sheet, fmt.Sprintf("D%d", hang), sp.Barcode)
		f.SetCellValue(sheet, fmt.Sprintf("E%d", hang), sp.TenDanhMuc)
		f.SetCellValue(sheet, fmt.Sprintf("F%d", hang), sp.ThuongHieu)
		f.SetCellValue(sheet, fmt.Sprintf("G%d", hang), sp.DonViTinh)
		f.SetCellValue(sheet, fmt.Sprintf("H%d", hang), sp.GiaNhap)
		f.SetCellValue(sheet, fmt.Sprintf("I%d", hang), sp.GiaBan)
		f.SetCellValue(sheet, fmt.Sprintf("J%d", hang), sp.SoLuongTon)
		f.SetCellValue(sheet, fmt.Sprintf("K%d", hang), sp.TrangThai)
	}

	tenFile := fmt.Sprintf("danh_sach_san_pham_%s.xlsx", time.Now().Format("20060102150405"))
	buf, loi := f.WriteToBuffer()
	if loi != nil {
		return nil, "", loi
	}

	return buf, tenFile, nil
}

func (s *SanPhamService) ImportExcel(file io.Reader) (*BulkSanPhamKetQuaResponse, error) {
	f, loi := excelize.OpenReader(file)
	if loi != nil {
		return nil, errors.New("không thể đọc file excel")
	}
	defer f.Close()

	sheets := f.GetSheetList()
	if len(sheets) == 0 {
		return nil, errors.New("file excel trống")
	}
	sheetName := sheets[0]

	rows, loi := f.GetRows(sheetName)
	if loi != nil {
		return nil, loi
	}

	if len(rows) < 2 {
		return nil, errors.New("file excel không có dữ liệu (chỉ có dòng tiêu đề)")
	}

	response := &BulkSanPhamKetQuaResponse{
		TongSo: len(rows) - 1,
		KetQua: []BulkSanPhamKetQuaItem{},
	}

	for i, row := range rows {
		if i == 0 {
			continue // Skip header
		}

		if len(row) < 2 {
			continue
		}

		maDinhDanh := ""
		if len(row) > 0 {
			maDinhDanh = strings.TrimSpace(row[0])
		}
		tenSanPham := ""
		if len(row) > 1 {
			tenSanPham = strings.TrimSpace(row[1])
		}

		if tenSanPham == "" {
			response.ThatBai++
			response.KetQua = append(response.KetQua, BulkSanPhamKetQuaItem{
				ID:        uint64(i + 1),
				ThanhCong: false,
				ThongBao:  fmt.Sprintf("Dòng %d: Tên sản phẩm không được trống", i+1),
			})
			continue
		}

		sku := ""
		if len(row) > 2 {
			sku = strings.TrimSpace(row[2])
		}
		barcode := ""
		if len(row) > 3 {
			barcode = strings.TrimSpace(row[3])
		}
		// Ignore category and brand for simple import right now
		donViTinh := "cái"
		if len(row) > 6 && strings.TrimSpace(row[6]) != "" {
			donViTinh = strings.TrimSpace(row[6])
		}
		giaNhap := uint64(0)
		if len(row) > 7 {
			parsed, _ := strconv.ParseUint(strings.TrimSpace(row[7]), 10, 64)
			giaNhap = parsed
		}
		giaBan := uint64(0)
		if len(row) > 8 {
			parsed, _ := strconv.ParseUint(strings.TrimSpace(row[8]), 10, 64)
			giaBan = parsed
		}
		tonKho := 0
		if len(row) > 9 {
			parsed, _ := strconv.Atoi(strings.TrimSpace(row[9]))
			tonKho = parsed
		}
		trangThai := "hien_thi"
		if len(row) > 10 && strings.TrimSpace(row[10]) != "" {
			trangThai = strings.TrimSpace(row[10])
		}

		request := TaoSanPhamRequest{
			MaDinhDanh:    maDinhDanh,
			TenSanPham:    tenSanPham,
			SKU:           sku,
			Barcode:       barcode,
			DonViTinh:     donViTinh,
			GiaNhap:       giaNhap,
			GiaBan:        giaBan,
			SoLuongTon:    tonKho,
			NguongCanhBao: 5,
			TrangThai:     trangThai,
		}

		// Simple logic: if maDinhDanh exists, we don't update here but we should.
		// For now, let's just create new items or skip.
		// If they provide an ID or Code, it's an update, but we only have Tao.
		// I will just use Tao to create them. If SKU exists, it will fail.
		_, loi = s.Tao(request)
		if loi != nil {
			response.ThatBai++
			response.KetQua = append(response.KetQua, BulkSanPhamKetQuaItem{
				ID:        uint64(i + 1),
				ThanhCong: false,
				ThongBao:  fmt.Sprintf("Dòng %d: %s", i+1, loi.Error()),
			})
		} else {
			response.ThanhCong++
			response.KetQua = append(response.KetQua, BulkSanPhamKetQuaItem{
				ID:        uint64(i + 1),
				ThanhCong: true,
				ThongBao:  fmt.Sprintf("Dòng %d: Thêm thành công", i+1),
			})
		}
	}

	return response, nil
}
