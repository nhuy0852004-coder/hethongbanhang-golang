package giohang

type GioHangService struct {
	repository *GioHangRepository
}

func TaoGioHangService(repository *GioHangRepository) *GioHangService {
	return &GioHangService{
		repository: repository,
	}
}

func (s *GioHangService) KiemTra(request KiemTraGioHangRequest) (*KetQuaKiemTraGioHang, error) {
	if loi := request.KiemTra(); loi != nil {
		return nil, loi
	}

	ketQua := &KetQuaKiemTraGioHang{
		HopLe:     true,
		ThongBao:  "Giỏ hàng hợp lệ",
		DanhSach:  []SanPhamGioHangDaKiemTra{},
		TongTien:  0,
		CoThayDoi: false,
	}

	for _, item := range request.SanPham {
		sanpham, loi := s.repository.LaySanPham(item.SanPhamID)

		if loi != nil {
			ketQua.HopLe = false
			ketQua.CoThayDoi = true
			ketQua.DanhSach = append(ketQua.DanhSach, SanPhamGioHangDaKiemTra{
				ID:       item.SanPhamID,
				SoLuong: item.SoLuong,
				HopLe:   false,
				ThongBao: loi.Error(),
			})
			continue
		}

		soLuongHopLe := item.SoLuong
		hopLe := true
		thongBao := "Sản phẩm hợp lệ"

		if sanpham.TrangThai != "hien_thi" {
			hopLe = false
			ketQua.HopLe = false
			ketQua.CoThayDoi = true
			thongBao = "Sản phẩm đang bị ẩn hoặc không thể đặt hàng"
		}

		if sanpham.SoLuongTon <= 0 {
			hopLe = false
			ketQua.HopLe = false
			ketQua.CoThayDoi = true
			thongBao = "Sản phẩm đã hết hàng"
		}

		if item.SoLuong > sanpham.SoLuongTon {
			soLuongHopLe = sanpham.SoLuongTon
			ketQua.HopLe = false
			ketQua.CoThayDoi = true
			thongBao = "Số lượng đã được điều chỉnh theo tồn kho hiện tại"
		}

		giaHienTai := sanpham.GiaBan
		if sanpham.GiaKhuyenMai != nil && *sanpham.GiaKhuyenMai > 0 {
			giaHienTai = *sanpham.GiaKhuyenMai
		}

		if item.GiaBan > 0 && item.GiaBan != giaHienTai {
			ketQua.CoThayDoi = true
			thongBao = "Giá sản phẩm đã thay đổi"
		}

		if hopLe && soLuongHopLe > 0 {
			ketQua.TongTien += giaHienTai * uint64(soLuongHopLe)
		}

		ketQua.DanhSach = append(ketQua.DanhSach, SanPhamGioHangDaKiemTra{
			ID:           sanpham.ID,
			MaDinhDanh:   sanpham.MaDinhDanh,
			TenSanPham:   sanpham.TenSanPham,
			HinhAnh:      sanpham.HinhAnh,
			GiaBan:       sanpham.GiaBan,
			GiaKhuyenMai: sanpham.GiaKhuyenMai,
			SoLuongTon:   sanpham.SoLuongTon,
			TrangThai:    sanpham.TrangThai,
			TenDanhMuc:   sanpham.TenDanhMuc,
			SoLuong:      soLuongHopLe,
			HopLe:        hopLe,
			ThongBao:     thongBao,
		})
	}

	if !ketQua.HopLe {
		ketQua.ThongBao = "Giỏ hàng có sản phẩm cần kiểm tra lại"
	}

	if ketQua.CoThayDoi && ketQua.HopLe {
		ketQua.ThongBao = "Giỏ hàng đã được cập nhật theo dữ liệu mới nhất"
	}

	return ketQua, nil
}