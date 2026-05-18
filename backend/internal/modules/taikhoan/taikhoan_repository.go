package taikhoan

import (
	"database/sql"
	"errors"
)

type TaiKhoanRepository struct {
	db *sql.DB
}

func TaoTaiKhoanRepository(db *sql.DB) *TaiKhoanRepository {
	return &TaiKhoanRepository{
		db: db,
	}
}

func (r *TaiKhoanRepository) TimTheoEmail(email string) (*NguoiDung, error) {
	cauLenh := `
		SELECT 
			nguoidung.id,
			nguoidung.hoten,
			nguoidung.email,
			nguoidung.matkhau,
			COALESCE(nguoidung.sodienthoai, '') AS sodienthoai,
			vaitro.tenvaitro AS vaitro,
			nguoidung.trangthai,
			nguoidung.created_at,
			nguoidung.updated_at
		FROM nguoidung
		INNER JOIN vaitro ON vaitro.id = nguoidung.vaitro_id
		WHERE nguoidung.email = ?
		LIMIT 1
	`

	var nguoidung NguoiDung

	loi := r.db.QueryRow(cauLenh, email).Scan(
		&nguoidung.ID,
		&nguoidung.HoTen,
		&nguoidung.Email,
		&nguoidung.MatKhau,
		&nguoidung.SoDienThoai,
		&nguoidung.VaiTro,
		&nguoidung.TrangThai,
		&nguoidung.CreatedAt,
		&nguoidung.UpdatedAt,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("tài khoản không tồn tại")
		}

		return nil, loi
	}

	return &nguoidung, nil
}

func (r *TaiKhoanRepository) TimTheoID(id uint64) (*NguoiDung, error) {
	cauLenh := `
		SELECT 
			nguoidung.id,
			nguoidung.hoten,
			nguoidung.email,
			nguoidung.matkhau,
			COALESCE(nguoidung.sodienthoai, '') AS sodienthoai,
			vaitro.tenvaitro AS vaitro,
			nguoidung.trangthai,
			nguoidung.created_at,
			nguoidung.updated_at
		FROM nguoidung
		INNER JOIN vaitro ON vaitro.id = nguoidung.vaitro_id
		WHERE nguoidung.id = ?
		LIMIT 1
	`

	var nguoidung NguoiDung

	loi := r.db.QueryRow(cauLenh, id).Scan(
		&nguoidung.ID,
		&nguoidung.HoTen,
		&nguoidung.Email,
		&nguoidung.MatKhau,
		&nguoidung.SoDienThoai,
		&nguoidung.VaiTro,
		&nguoidung.TrangThai,
		&nguoidung.CreatedAt,
		&nguoidung.UpdatedAt,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("tài khoản không tồn tại")
		}

		return nil, loi
	}

	return &nguoidung, nil
}