package khachhang

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

type KhachHangRepository struct {
	db *sql.DB
}

func TaoKhachHangRepository(db *sql.DB) *KhachHangRepository {
	return &KhachHangRepository{
		db: db,
	}
}

func (r *KhachHangRepository) DanhSach(timkiem string, trangthai string, trang int, gioihan int) ([]KhachHang, int64, error) {
	dieuKien := []string{"1 = 1"}
	thamSo := []interface{}{}

	if strings.TrimSpace(timkiem) != "" {
		dieuKien = append(dieuKien, "(kh.hoten LIKE ? OR kh.sodienthoai LIKE ? OR kh.email LIKE ?)")
		tuKhoa := "%" + strings.TrimSpace(timkiem) + "%"
		thamSo = append(thamSo, tuKhoa, tuKhoa, tuKhoa)
	}

	if strings.TrimSpace(trangthai) != "" {
		dieuKien = append(dieuKien, "kh.trangthai = ?")
		thamSo = append(thamSo, trangthai)
	}

	chuoiDieuKien := strings.Join(dieuKien, " AND ")

	cauDem := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM khachhang kh
		WHERE %s
	`, chuoiDieuKien)

	var tongSoDong int64

	if loi := r.db.QueryRow(cauDem, thamSo...).Scan(&tongSoDong); loi != nil {
		return nil, 0, loi
	}

	offset := (trang - 1) * gioihan

	cauLenh := fmt.Sprintf(`
		SELECT
			kh.id,
			kh.hoten,
			kh.sodienthoai,
			COALESCE(kh.email, '') AS email,
			COALESCE(kh.diachi, '') AS diachi,
			kh.trangthai,
			kh.created_at,
			kh.updated_at,
			COUNT(dh.id) AS tongdonhang,
			COALESCE(SUM(CASE WHEN dh.trangthai != 'da_huy' THEN dh.tongtien ELSE 0 END), 0) AS tongchitieu,
			COALESCE(DATE_FORMAT(MAX(dh.created_at), '%%d/%%m/%%Y %%H:%%i'), '') AS dongannhat
		FROM khachhang kh
		LEFT JOIN donhang dh 
			ON dh.khachhang_id = kh.id
			AND dh.deleted_at IS NULL
		WHERE %s
		GROUP BY 
			kh.id,
			kh.hoten,
			kh.sodienthoai,
			kh.email,
			kh.diachi,
			kh.trangthai,
			kh.created_at,
			kh.updated_at
		ORDER BY kh.id DESC
		LIMIT ? OFFSET ?
	`, chuoiDieuKien)

	thamSoDanhSach := append(thamSo, gioihan, offset)

	rows, loi := r.db.Query(cauLenh, thamSoDanhSach...)
	if loi != nil {
		return nil, 0, loi
	}
	defer rows.Close()

	danhSach := []KhachHang{}

	for rows.Next() {
		var item KhachHang

		loi := rows.Scan(
			&item.ID,
			&item.HoTen,
			&item.SoDienThoai,
			&item.Email,
			&item.DiaChi,
			&item.TrangThai,
			&item.CreatedAt,
			&item.UpdatedAt,
			&item.TongDonHang,
			&item.TongChiTieu,
			&item.DonGanNhat,
		)

		if loi != nil {
			return nil, 0, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, tongSoDong, nil
}

func (r *KhachHangRepository) ChiTiet(id uint64) (*KhachHang, error) {
	cauLenh := `
		SELECT
			kh.id,
			kh.hoten,
			kh.sodienthoai,
			COALESCE(kh.email, '') AS email,
			COALESCE(kh.diachi, '') AS diachi,
			kh.trangthai,
			kh.created_at,
			kh.updated_at,
			COUNT(dh.id) AS tongdonhang,
			COALESCE(SUM(CASE WHEN dh.trangthai != 'da_huy' THEN dh.tongtien ELSE 0 END), 0) AS tongchitieu,
			COALESCE(DATE_FORMAT(MAX(dh.created_at), '%d/%m/%Y %H:%i'), '') AS dongannhat
		FROM khachhang kh
		LEFT JOIN donhang dh 
			ON dh.khachhang_id = kh.id
			AND dh.deleted_at IS NULL
		WHERE kh.id = ?
		GROUP BY 
			kh.id,
			kh.hoten,
			kh.sodienthoai,
			kh.email,
			kh.diachi,
			kh.trangthai,
			kh.created_at,
			kh.updated_at
		LIMIT 1
	`

	var item KhachHang

	loi := r.db.QueryRow(cauLenh, id).Scan(
		&item.ID,
		&item.HoTen,
		&item.SoDienThoai,
		&item.Email,
		&item.DiaChi,
		&item.TrangThai,
		&item.CreatedAt,
		&item.UpdatedAt,
		&item.TongDonHang,
		&item.TongChiTieu,
		&item.DonGanNhat,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("khách hàng không tồn tại")
		}

		return nil, loi
	}

	return &item, nil
}

func (r *KhachHangRepository) DonHangCuaKhachHang(id uint64) ([]DonHangKhachHang, error) {
	rows, loi := r.db.Query(`
		SELECT
			id,
			madonhang,
			tongtien,
			trangthai,
			COALESCE(ghichu, '') AS ghichu,
			DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS created_at
		FROM donhang
		WHERE khachhang_id = ?
		AND deleted_at IS NULL
		ORDER BY id DESC
		LIMIT 20
	`, id)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []DonHangKhachHang{}

	for rows.Next() {
		var item DonHangKhachHang

		loi := rows.Scan(
			&item.ID,
			&item.MaDonHang,
			&item.TongTien,
			&item.TrangThai,
			&item.GhiChu,
			&item.CreatedAt,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, nil
}