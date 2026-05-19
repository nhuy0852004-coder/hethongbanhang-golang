package donhang

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

type DonHangRepository struct {
	db *sql.DB
}

func TaoDonHangRepository(db *sql.DB) *DonHangRepository {
	return &DonHangRepository{
		db: db,
	}
}

func (r *DonHangRepository) DanhSach(timkiem string, trangthai string, tungay string, denngay string, trang int, gioihan int) ([]DonHang, int64, error) {
	dieuKien := []string{
		"dh.deleted_at IS NULL",
	}
	thamSo := []interface{}{}

	if strings.TrimSpace(timkiem) != "" {
		dieuKien = append(dieuKien, "(dh.madonhang LIKE ? OR dh.hoten LIKE ? OR dh.sodienthoai LIKE ?)")
		tuKhoa := "%" + strings.TrimSpace(timkiem) + "%"
		thamSo = append(thamSo, tuKhoa, tuKhoa, tuKhoa)
	}

	if strings.TrimSpace(trangthai) != "" {
		dieuKien = append(dieuKien, "dh.trangthai = ?")
		thamSo = append(thamSo, trangthai)
	}

	if strings.TrimSpace(tungay) != "" {
		dieuKien = append(dieuKien, "DATE(dh.created_at) >= ?")
		thamSo = append(thamSo, tungay)
	}

	if strings.TrimSpace(denngay) != "" {
		dieuKien = append(dieuKien, "DATE(dh.created_at) <= ?")
		thamSo = append(thamSo, denngay)
	}

	chuoiDieuKien := strings.Join(dieuKien, " AND ")

	cauDem := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM donhang dh
		WHERE %s
	`, chuoiDieuKien)

	var tongSoDong int64

	if loi := r.db.QueryRow(cauDem, thamSo...).Scan(&tongSoDong); loi != nil {
		return nil, 0, loi
	}

	offset := (trang - 1) * gioihan

	cauLenh := fmt.Sprintf(`
		SELECT
			dh.id,
			dh.madonhang,
			dh.khachhang_id,
			dh.hoten,
			dh.sodienthoai,
			COALESCE(dh.email, '') AS email,
			dh.diachi,
			dh.tongtien,
			dh.trangthai,
			COALESCE(dh.ghichu, '') AS ghichu,
			dh.created_at,
			dh.updated_at
		FROM donhang dh
		WHERE %s
		ORDER BY dh.id DESC
		LIMIT ? OFFSET ?
	`, chuoiDieuKien)

	thamSoDanhSach := append(thamSo, gioihan, offset)

	rows, loi := r.db.Query(cauLenh, thamSoDanhSach...)
	if loi != nil {
		return nil, 0, loi
	}
	defer rows.Close()

	danhSach := []DonHang{}

	for rows.Next() {
		var item DonHang
		var khachHangID sql.NullInt64

		loi := rows.Scan(
			&item.ID,
			&item.MaDonHang,
			&khachHangID,
			&item.HoTen,
			&item.SoDienThoai,
			&item.Email,
			&item.DiaChi,
			&item.TongTien,
			&item.TrangThai,
			&item.GhiChu,
			&item.CreatedAt,
			&item.UpdatedAt,
		)

		if loi != nil {
			return nil, 0, loi
		}

		if khachHangID.Valid {
			id := uint64(khachHangID.Int64)
			item.KhachHangID = &id
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, tongSoDong, nil
}

func (r *DonHangRepository) ChiTiet(id uint64) (*DonHang, error) {
	cauLenh := `
		SELECT
			dh.id,
			dh.madonhang,
			dh.khachhang_id,
			dh.hoten,
			dh.sodienthoai,
			COALESCE(dh.email, '') AS email,
			dh.diachi,
			dh.tongtien,
			dh.trangthai,
			COALESCE(dh.ghichu, '') AS ghichu,
			dh.created_at,
			dh.updated_at
		FROM donhang dh
		WHERE dh.id = ?
		AND dh.deleted_at IS NULL
		LIMIT 1
	`

	var donhang DonHang
	var khachHangID sql.NullInt64

	loi := r.db.QueryRow(cauLenh, id).Scan(
		&donhang.ID,
		&donhang.MaDonHang,
		&khachHangID,
		&donhang.HoTen,
		&donhang.SoDienThoai,
		&donhang.Email,
		&donhang.DiaChi,
		&donhang.TongTien,
		&donhang.TrangThai,
		&donhang.GhiChu,
		&donhang.CreatedAt,
		&donhang.UpdatedAt,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("đơn hàng không tồn tại")
		}

		return nil, loi
	}

	if khachHangID.Valid {
		idKhachHang := uint64(khachHangID.Int64)
		donhang.KhachHangID = &idKhachHang
	}

	chiTiet, loi := r.LayChiTietDonHang(id)
	if loi != nil {
		return nil, loi
	}

	donhang.ChiTiet = chiTiet

	return &donhang, nil
}

func (r *DonHangRepository) LayChiTietDonHang(donhangID uint64) ([]ChiTietDonHang, error) {
	rows, loi := r.db.Query(`
		SELECT
			id,
			donhang_id,
			COALESCE(sanpham_id, 0) AS sanpham_id,
			tensanpham,
			COALESCE(hinhanh, '') AS hinhanh,
			soluong,
			dongia,
			thanhtien
		FROM chitietdonhang
		WHERE donhang_id = ?
		ORDER BY id ASC
	`, donhangID)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []ChiTietDonHang{}

	for rows.Next() {
		var item ChiTietDonHang

		loi := rows.Scan(
			&item.ID,
			&item.DonHangID,
			&item.SanPhamID,
			&item.TenSanPham,
			&item.HinhAnh,
			&item.SoLuong,
			&item.DonGia,
			&item.ThanhTien,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, nil
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
			return nil, errors.New("sản phẩm "+sanpham.TenSanPham+" hiện không thể đặt hàng")
		}

		if sanpham.SoLuongTon < item.SoLuong {
			tx.Rollback()
			return nil, errors.New("sản phẩm "+sanpham.TenSanPham+" không đủ tồn kho")
		}

		donGia := sanpham.GiaBan
		if sanpham.GiaKhuyenMai != nil && *sanpham.GiaKhuyenMai > 0 {
			donGia = *sanpham.GiaKhuyenMai
		}

		thanhTien := donGia * uint64(item.SoLuong)
		tongTien += thanhTien

		chiTiet = append(chiTiet, ChiTietDonHang{
			SanPhamID:  sanpham.ID,
			TenSanPham: sanpham.TenSanPham,
			HinhAnh:    sanpham.HinhAnh,
			SoLuong:    item.SoLuong,
			DonGia:     donGia,
			ThanhTien:  thanhTien,
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

func (r *DonHangRepository) CapNhatTrangThai(id uint64, trangthaiMoi string) error {
	tx, loi := r.db.Begin()
	if loi != nil {
		return loi
	}

	var trangthaiCu string

	loi = tx.QueryRow(`
		SELECT trangthai
		FROM donhang
		WHERE id = ?
		AND deleted_at IS NULL
		LIMIT 1
		FOR UPDATE
	`, id).Scan(&trangthaiCu)

	if loi != nil {
		tx.Rollback()

		if errors.Is(loi, sql.ErrNoRows) {
			return errors.New("đơn hàng không tồn tại")
		}

		return loi
	}

	if trangthaiCu == trangthaiMoi {
		tx.Rollback()
		return nil
	}

	chiTiet, loi := r.layChiTietDonHangTrongTx(tx, id)
	if loi != nil {
		tx.Rollback()
		return loi
	}

	if trangthaiMoi == "da_huy" && trangthaiCu != "da_huy" {
		for _, item := range chiTiet {
			_, loi = tx.Exec(`
				UPDATE sanpham
				SET 
					soluongton = soluongton + ?,
					trangthai = CASE
						WHEN trangthai = 'het_hang' THEN 'hien_thi'
						ELSE trangthai
					END
				WHERE id = ?
				AND deleted_at IS NULL
			`, item.SoLuong, item.SanPhamID)

			if loi != nil {
				tx.Rollback()
				return loi
			}
		}
	}

	if trangthaiCu == "da_huy" && trangthaiMoi != "da_huy" {
		for _, item := range chiTiet {
			var soluongton int
			var tensanpham string

			loi = tx.QueryRow(`
				SELECT soluongton, tensanpham
				FROM sanpham
				WHERE id = ?
				AND deleted_at IS NULL
				LIMIT 1
				FOR UPDATE
			`, item.SanPhamID).Scan(&soluongton, &tensanpham)

			if loi != nil {
				tx.Rollback()
				return loi
			}

			if soluongton < item.SoLuong {
				tx.Rollback()
				return errors.New("sản phẩm " + tensanpham + " không đủ tồn kho để khôi phục đơn hàng")
			}

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
			`, item.SoLuong, item.SoLuong, item.SanPhamID)

			if loi != nil {
				tx.Rollback()
				return loi
			}
		}
	}

	_, loi = tx.Exec(`
		UPDATE donhang
		SET trangthai = ?
		WHERE id = ?
		AND deleted_at IS NULL
	`, trangthaiMoi, id)

	if loi != nil {
		tx.Rollback()
		return loi
	}

	return tx.Commit()
}

func (r *DonHangRepository) Xoa(id uint64) error {
	ketQua, loi := r.db.Exec(`
		UPDATE donhang
		SET deleted_at = NOW()
		WHERE id = ?
		AND deleted_at IS NULL
	`, id)

	if loi != nil {
		return loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("đơn hàng không tồn tại")
	}

	return nil
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

func (r *DonHangRepository) layChiTietDonHangTrongTx(tx *sql.Tx, donhangID uint64) ([]ChiTietDonHang, error) {
	rows, loi := tx.Query(`
		SELECT
			id,
			donhang_id,
			COALESCE(sanpham_id, 0) AS sanpham_id,
			tensanpham,
			COALESCE(hinhanh, '') AS hinhanh,
			soluong,
			dongia,
			thanhtien
		FROM chitietdonhang
		WHERE donhang_id = ?
		ORDER BY id ASC
	`, donhangID)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []ChiTietDonHang{}

	for rows.Next() {
		var item ChiTietDonHang

		loi := rows.Scan(
			&item.ID,
			&item.DonHangID,
			&item.SanPhamID,
			&item.TenSanPham,
			&item.HinhAnh,
			&item.SoLuong,
			&item.DonGia,
			&item.ThanhTien,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, nil
}