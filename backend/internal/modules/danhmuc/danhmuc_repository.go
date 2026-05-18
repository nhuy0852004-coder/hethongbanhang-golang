package danhmuc

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

type DanhMucRepository struct {
	db *sql.DB
}

func TaoDanhMucRepository(db *sql.DB) *DanhMucRepository {
	return &DanhMucRepository{
		db: db,
	}
}

func (r *DanhMucRepository) DanhSach(timkiem string, trangthai string, trang int, gioihan int) ([]DanhMuc, int64, error) {
	dieuKien := []string{
		"d.deleted_at IS NULL",
	}
	thamSo := []interface{}{}

	if strings.TrimSpace(timkiem) != "" {
		dieuKien = append(dieuKien, "(d.tendanhmuc LIKE ? OR d.duongdan LIKE ?)")
		tuKhoa := "%" + strings.TrimSpace(timkiem) + "%"
		thamSo = append(thamSo, tuKhoa, tuKhoa)
	}

	if strings.TrimSpace(trangthai) != "" {
		dieuKien = append(dieuKien, "d.trangthai = ?")
		thamSo = append(thamSo, trangthai)
	}

	chuoiDieuKien := strings.Join(dieuKien, " AND ")

	cauDem := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM danhmuc d
		WHERE %s
	`, chuoiDieuKien)

	var tongSoDong int64

	if loi := r.db.QueryRow(cauDem, thamSo...).Scan(&tongSoDong); loi != nil {
		return nil, 0, loi
	}

	offset := (trang - 1) * gioihan

	cauLenh := fmt.Sprintf(`
		SELECT
			d.id,
			d.tendanhmuc,
			d.duongdan,
			COALESCE(d.mota, '') AS mota,
			COALESCE(d.hinhanh, '') AS hinhanh,
			d.danhmuccha_id,
			COALESCE(dmcha.tendanhmuc, '') AS tendanhmuccha,
			d.thutu,
			d.trangthai,
			d.created_at,
			d.updated_at,
			(
				SELECT COUNT(*)
				FROM sanpham sp
				WHERE sp.danhmuc_id = d.id
				AND sp.deleted_at IS NULL
			) AS sosanpham,
			(
				SELECT COUNT(*)
				FROM danhmuc dmcon
				WHERE dmcon.danhmuccha_id = d.id
				AND dmcon.deleted_at IS NULL
			) AS sodanhmuccon
		FROM danhmuc d
		LEFT JOIN danhmuc dmcha ON dmcha.id = d.danhmuccha_id
		WHERE %s
		ORDER BY d.thutu ASC, d.id DESC
		LIMIT ? OFFSET ?
	`, chuoiDieuKien)

	thamSoDanhSach := append(thamSo, gioihan, offset)

	rows, loi := r.db.Query(cauLenh, thamSoDanhSach...)
	if loi != nil {
		return nil, 0, loi
	}
	defer rows.Close()

	danhSach := []DanhMuc{}

	for rows.Next() {
		var item DanhMuc
		var danhMucChaID sql.NullInt64

		loi := rows.Scan(
			&item.ID,
			&item.TenDanhMuc,
			&item.DuongDan,
			&item.MoTa,
			&item.HinhAnh,
			&danhMucChaID,
			&item.TenDanhMucCha,
			&item.ThuTu,
			&item.TrangThai,
			&item.CreatedAt,
			&item.UpdatedAt,
			&item.SoSanPham,
			&item.SoDanhMucCon,
		)

		if loi != nil {
			return nil, 0, loi
		}

		if danhMucChaID.Valid {
			id := uint64(danhMucChaID.Int64)
			item.DanhMucChaID = &id
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, tongSoDong, nil
}

func (r *DanhMucRepository) ChiTiet(id uint64) (*DanhMuc, error) {
	cauLenh := `
		SELECT
			d.id,
			d.tendanhmuc,
			d.duongdan,
			COALESCE(d.mota, '') AS mota,
			COALESCE(d.hinhanh, '') AS hinhanh,
			d.danhmuccha_id,
			COALESCE(dmcha.tendanhmuc, '') AS tendanhmuccha,
			d.thutu,
			d.trangthai,
			d.created_at,
			d.updated_at,
			(
				SELECT COUNT(*)
				FROM sanpham sp
				WHERE sp.danhmuc_id = d.id
				AND sp.deleted_at IS NULL
			) AS sosanpham,
			(
				SELECT COUNT(*)
				FROM danhmuc dmcon
				WHERE dmcon.danhmuccha_id = d.id
				AND dmcon.deleted_at IS NULL
			) AS sodanhmuccon
		FROM danhmuc d
		LEFT JOIN danhmuc dmcha ON dmcha.id = d.danhmuccha_id
		WHERE d.id = ?
		AND d.deleted_at IS NULL
		LIMIT 1
	`

	var item DanhMuc
	var danhMucChaID sql.NullInt64

	loi := r.db.QueryRow(cauLenh, id).Scan(
		&item.ID,
		&item.TenDanhMuc,
		&item.DuongDan,
		&item.MoTa,
		&item.HinhAnh,
		&danhMucChaID,
		&item.TenDanhMucCha,
		&item.ThuTu,
		&item.TrangThai,
		&item.CreatedAt,
		&item.UpdatedAt,
		&item.SoSanPham,
		&item.SoDanhMucCon,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("danh mục không tồn tại")
		}

		return nil, loi
	}

	if danhMucChaID.Valid {
		idCha := uint64(danhMucChaID.Int64)
		item.DanhMucChaID = &idCha
	}

	return &item, nil
}

func (r *DanhMucRepository) Tao(request TaoDanhMucRequest, duongdan string) (uint64, error) {
	cauLenh := `
		INSERT INTO danhmuc (
			tendanhmuc,
			duongdan,
			mota,
			danhmuccha_id,
			thutu,
			trangthai
		)
		VALUES (?, ?, ?, ?, ?, ?)
	`

	ketQua, loi := r.db.Exec(
		cauLenh,
		request.TenDanhMuc,
		duongdan,
		request.MoTa,
		request.DanhMucChaID,
		request.ThuTu,
		request.TrangThai,
	)

	if loi != nil {
		return 0, loi
	}

	id, loi := ketQua.LastInsertId()
	if loi != nil {
		return 0, loi
	}

	return uint64(id), nil
}

func (r *DanhMucRepository) CapNhat(id uint64, request CapNhatDanhMucRequest, duongdan string) error {
	cauLenh := `
		UPDATE danhmuc
		SET
			tendanhmuc = ?,
			duongdan = ?,
			mota = ?,
			danhmuccha_id = ?,
			thutu = ?,
			trangthai = ?
		WHERE id = ?
		AND deleted_at IS NULL
	`

	ketQua, loi := r.db.Exec(
		cauLenh,
		request.TenDanhMuc,
		duongdan,
		request.MoTa,
		request.DanhMucChaID,
		request.ThuTu,
		request.TrangThai,
		id,
	)

	if loi != nil {
		return loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("danh mục không tồn tại")
	}

	return nil
}

func (r *DanhMucRepository) Xoa(id uint64) error {
	cauLenh := `
		UPDATE danhmuc
		SET deleted_at = NOW()
		WHERE id = ?
		AND deleted_at IS NULL
	`

	ketQua, loi := r.db.Exec(cauLenh, id)
	if loi != nil {
		return loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("danh mục không tồn tại")
	}

	return nil
}

func (r *DanhMucRepository) CapNhatTrangThai(id uint64, trangthai string) error {
	cauLenh := `
		UPDATE danhmuc
		SET trangthai = ?
		WHERE id = ?
		AND deleted_at IS NULL
	`

	ketQua, loi := r.db.Exec(cauLenh, trangthai, id)
	if loi != nil {
		return loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("danh mục không tồn tại")
	}

	return nil
}

func (r *DanhMucRepository) DuongDanDaTonTai(duongdan string, boQuaID uint64) (bool, error) {
	cauLenh := `
		SELECT COUNT(*)
		FROM danhmuc
		WHERE duongdan = ?
		AND deleted_at IS NULL
		AND id != ?
	`

	var soLuong int

	if loi := r.db.QueryRow(cauLenh, duongdan, boQuaID).Scan(&soLuong); loi != nil {
		return false, loi
	}

	return soLuong > 0, nil
}

func (r *DanhMucRepository) DemSanPham(id uint64) (int, error) {
	var soLuong int

	loi := r.db.QueryRow(`
		SELECT COUNT(*)
		FROM sanpham
		WHERE danhmuc_id = ?
		AND deleted_at IS NULL
	`, id).Scan(&soLuong)

	return soLuong, loi
}

func (r *DanhMucRepository) DemDanhMucCon(id uint64) (int, error) {
	var soLuong int

	loi := r.db.QueryRow(`
		SELECT COUNT(*)
		FROM danhmuc
		WHERE danhmuccha_id = ?
		AND deleted_at IS NULL
	`, id).Scan(&soLuong)

	return soLuong, loi
}