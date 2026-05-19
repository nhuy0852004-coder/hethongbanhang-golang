package donhang

import (
	"database/sql"
	"errors"
)

type DonHangRepository struct {
	db *sql.DB
}

func TaoDonHangRepository(db *sql.DB) *DonHangRepository {
	return &DonHangRepository{
		db: db,
	}
}

func (r *DonHangRepository) TaoDonHang(request TaoDonHangRequest, madonhang string) (*DonHang, error) {
	tx, loi := r.db.Begin()
	if loi != nil {
		return nil, loi
	}

	defer func() {
		if recover() != nil {
			tx.Rollback()
		}
	}()

	khachhangID, loi := r.taoHoacCapNhatKhachHang(tx, request)
	if loi != nil {
		tx.Rollback()
		return nil, loi
	}

	chiTiet := []ChiTietDonHang{}
	var tongTien uint64 = 0

	for _, item := range request.SanPham {
		sanpham, loi := r.laySanPhamKhoaDong(tx, item.SanPhamID)
		if loi != nil {
			tx.Rollback()
			return nil, loi
		}

		if sanpham.TrangThai != "hien_thi" {
			tx.Rollback()
			return nil, errors.New("sản phẩm " + sanpham.TenSanPham + " hiện không thể đặt hàng")
		}

		if sanpham.SoLuongTon < item.SoLuong {
			tx.Rollback()
			return nil, errors.New("sản phẩm " + sanpham.TenSanPham + " không đủ tồn kho")
		}

		donGia := sanpham.GiaBan
		if sanpham.GiaKhuyenMai != nil && *sanpham.GiaKhuyenMai > 0 {
			donGia = *sanpham.GiaKhuyenMai
		}

		thanhTien := donGia * uint64(item.SoLuong)
		tongTien += thanhTien

		chiTiet = append(chiTiet, ChiTietDonHang{
			SanPhamID: sanpham.ID,
			TenSanPham: sanpham.TenSanPham,
			HinhAnh: sanpham.HinhAnh,
			SoLuong: item.SoLuong,
			DonGia: donGia,
			ThanhTien: thanhTien,
		})
	}

	ketQua, loi := tx.Exec(`
		INSERT INTO donhang (
			madonhang,
			khachhang_id,
			hoten,
			sodienthoai,
			email,
			diachi,
			tongtien,
			trangthai,
			ghichu
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
	`,
		madonhang,
		khachhangID,
		request.HoTen,
		request.SoDienThoai,
		request.Email,
		request.DiaChi,
		tongTien,
		"cho_xac_nhan",
		request.GhiChu,
	)

	if loi != nil {
		tx.Rollback()
		return nil, loi
	}

	donhangIDRaw, loi := ketQua.LastInsertId()
	if loi != nil {
		tx.Rollback()
		return nil, loi
	}

	donhangID := uint64(donhangIDRaw)

	for index := range chiTiet {
		chiTiet[index].DonHangID = donhangID

		ketQuaChiTiet, loi := tx.Exec(`
			INSERT INTO chitietdonhang (
				donhang_id,
				sanpham_id,
				tensanpham,
				hinhanh,
				soluong,
				dongia,
				thanhtien
			)
			VALUES (?, ?, ?, ?, ?, ?, ?)
		`,
			donhangID,
			chiTiet[index].SanPhamID,
			chiTiet[index].TenSanPham,
			chiTiet[index].HinhAnh,
			chiTiet[index].SoLuong,
			chiTiet[index].DonGia,
			chiTiet[index].ThanhTien,
		)

		if loi != nil {
			tx.Rollback()
			return nil, loi
		}

		chiTietID, _ := ketQuaChiTiet.LastInsertId()
		chiTiet[index].ID = uint64(chiTietID)

		_, loi = tx.Exec(`
			UPDATE sanpham
			SET 
				soluongton = soluongton - ?,
				trangthai = CASE 
					WHEN soluongton - ? <= 0 THEN 'het_hang'
					ELSE trangthai
				END
			WHERE id = ?
			AND deleted_at IS NULL
		`,
			chiTiet[index].SoLuong,
			chiTiet[index].SoLuong,
			chiTiet[index].SanPhamID,
		)

		if loi != nil {
			tx.Rollback()
			return nil, loi
		}
	}

	if loi := tx.Commit(); loi != nil {
		return nil, loi
	}

	donhang := &DonHang{
		ID:          donhangID,
		MaDonHang:   madonhang,
		KhachHangID: khachhangID,
		HoTen:       request.HoTen,
		SoDienThoai: request.SoDienThoai,
		Email:       request.Email,
		DiaChi:      request.DiaChi,
		TongTien:    tongTien,
		TrangThai:   "cho_xac_nhan",
		GhiChu:      request.GhiChu,
		ChiTiet:     chiTiet,
	}

	return donhang, nil
}

func (r *DonHangRepository) taoHoacCapNhatKhachHang(tx *sql.Tx, request TaoDonHangRequest) (*uint64, error) {
	var id uint64

	loi := tx.QueryRow(`
		SELECT id
		FROM khachhang
		WHERE sodienthoai = ?
		LIMIT 1
	`, request.SoDienThoai).Scan(&id)

	if loi == nil {
		_, loi = tx.Exec(`
			UPDATE khachhang
			SET hoten = ?, email = ?, diachi = ?, trangthai = 'hoat_dong'
			WHERE id = ?
		`, request.HoTen, request.Email, request.DiaChi, id)

		if loi != nil {
			return nil, loi
		}

		return &id, nil
	}

	if !errors.Is(loi, sql.ErrNoRows) {
		return nil, loi
	}

	ketQua, loi := tx.Exec(`
		INSERT INTO khachhang (
			hoten,
			sodienthoai,
			email,
			diachi,
			trangthai
		)
		VALUES (?, ?, ?, ?, ?)
	`,
		request.HoTen,
		request.SoDienThoai,
		request.Email,
		request.DiaChi,
		"hoat_dong",
	)

	if loi != nil {
		return nil, loi
	}

	idRaw, loi := ketQua.LastInsertId()
	if loi != nil {
		return nil, loi
	}

	id = uint64(idRaw)

	return &id, nil
}

func (r *DonHangRepository) laySanPhamKhoaDong(tx *sql.Tx, id uint64) (*SanPhamTrongGiaoDich, error) {
	cauLenh := `
		SELECT
			id,
			tensanpham,
			COALESCE(hinhanh, '') AS hinhanh,
			giaban,
			giakhuyenmai,
			soluongton,
			trangthai
		FROM sanpham
		WHERE id = ?
		AND deleted_at IS NULL
		LIMIT 1
		FOR UPDATE
	`

	var sanpham SanPhamTrongGiaoDich
	var giaKhuyenMai sql.NullInt64

	loi := tx.QueryRow(cauLenh, id).Scan(
		&sanpham.ID,
		&sanpham.TenSanPham,
		&sanpham.HinhAnh,
		&sanpham.GiaBan,
		&giaKhuyenMai,
		&sanpham.SoLuongTon,
		&sanpham.TrangThai,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("sản phẩm không tồn tại")
		}

		return nil, loi
	}

	if giaKhuyenMai.Valid {
		gia := uint64(giaKhuyenMai.Int64)
		sanpham.GiaKhuyenMai = &gia
	}

	return &sanpham, nil
}