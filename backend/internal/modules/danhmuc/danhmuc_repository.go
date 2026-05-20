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

func (r *DanhMucRepository) DanhSach(timkiem string, trangthai string, hienthixoa bool, trang int, gioihan int) ([]DanhMuc, int64, error) {
	dieuKien := []string{"1 = 1"}
	thamSo := []interface{}{}

	if !hienthixoa {
		dieuKien = append(dieuKien, "d.deleted_at IS NULL")
	}

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
			IF(d.deleted_at IS NULL, 0, 1) AS daxoa,
			COALESCE(DATE_FORMAT(d.deleted_at, '%%d/%%m/%%Y %%H:%%i'), '') AS deleted_at,
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
		ORDER BY d.deleted_at IS NOT NULL ASC, d.thutu ASC, d.id DESC
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
		var daXoa int

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
			&daXoa,
			&item.DeletedAt,
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

		item.DaXoa = daXoa == 1

		danhSach = append(danhSach, item)
	}

	return danhSach, tongSoDong, nil
}

func (r *DanhMucRepository) ChiTiet(id uint64, baoGomDaXoa bool) (*DanhMuc, error) {
	dieuKienXoa := "AND d.deleted_at IS NULL"
	if baoGomDaXoa {
		dieuKienXoa = ""
	}

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
			IF(d.deleted_at IS NULL, 0, 1) AS daxoa,
			COALESCE(DATE_FORMAT(d.deleted_at, '%%d/%%m/%%Y %%H:%%i'), '') AS deleted_at,
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
		%s
		LIMIT 1
	`, dieuKienXoa)

	var item DanhMuc
	var danhMucChaID sql.NullInt64
	var daXoa int

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
		&daXoa,
		&item.DeletedAt,
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

	item.DaXoa = daXoa == 1

	return &item, nil
}

func (r *DanhMucRepository) Tao(request TaoDanhMucRequest, duongdan string) (uint64, error) {
	ketQua, loi := r.db.Exec(`
		INSERT INTO danhmuc (
			tendanhmuc,
			duongdan,
			mota,
			danhmuccha_id,
			thutu,
			trangthai
		)
		VALUES (?, ?, ?, ?, ?, ?)
	`,
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
	ketQua, loi := r.db.Exec(`
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
	`,
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
		return errors.New("danh mục không tồn tại hoặc đã bị xóa")
	}

	return nil
}

func (r *DanhMucRepository) Xoa(id uint64) error {
	ketQua, loi := r.db.Exec(`
		UPDATE danhmuc
		SET deleted_at = NOW(), trangthai = 'an'
		WHERE id = ?
		AND deleted_at IS NULL
	`, id)

	if loi != nil {
		return loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("danh mục không tồn tại hoặc đã bị xóa")
	}

	return nil
}

func (r *DanhMucRepository) CapNhatTrangThai(id uint64, trangthai string) error {
	_, loi := r.db.Exec(`
		UPDATE danhmuc
		SET trangthai = ?
		WHERE id = ?
		AND deleted_at IS NULL
	`, trangthai, id)

	return loi
}

func (r *DanhMucRepository) CapNhatTrangThaiNhieuID(ids []uint64, trangthai string) error {
	if len(ids) == 0 {
		return nil
	}

	placeholder := strings.TrimRight(strings.Repeat("?,", len(ids)), ",")

	cauLenh := fmt.Sprintf(`
		UPDATE danhmuc
		SET trangthai = ?
		WHERE id IN (%s)
		AND deleted_at IS NULL
	`, placeholder)

	thamSo := []interface{}{trangthai}

	for _, id := range ids {
		thamSo = append(thamSo, id)
	}

	_, loi := r.db.Exec(cauLenh, thamSo...)

	return loi
}

func (r *DanhMucRepository) TenDaTonTai(tendanhmuc string, boQuaID uint64) (bool, error) {
	var soLuong int

	loi := r.db.QueryRow(`
		SELECT COUNT(*)
		FROM danhmuc
		WHERE LOWER(TRIM(tendanhmuc)) = LOWER(TRIM(?))
		AND deleted_at IS NULL
		AND id != ?
	`, tendanhmuc, boQuaID).Scan(&soLuong)

	if loi != nil {
		return false, loi
	}

	return soLuong > 0, nil
}

func (r *DanhMucRepository) DuongDanDaTonTai(duongdan string, boQuaID uint64) (bool, error) {
	var soLuong int

	loi := r.db.QueryRow(`
		SELECT COUNT(*)
		FROM danhmuc
		WHERE duongdan = ?
		AND deleted_at IS NULL
		AND id != ?
	`, duongdan, boQuaID).Scan(&soLuong)

	if loi != nil {
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

func (r *DanhMucRepository) DemSanPhamTrongDanhMucVaCon(ids []uint64) (int, error) {
	if len(ids) == 0 {
		return 0, nil
	}

	placeholder := strings.TrimRight(strings.Repeat("?,", len(ids)), ",")
	cauLenh := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM sanpham
		WHERE danhmuc_id IN (%s)
		AND deleted_at IS NULL
	`, placeholder)

	thamSo := make([]interface{}, len(ids))
	for i, id := range ids {
		thamSo[i] = id
	}

	var soLuong int
	loi := r.db.QueryRow(cauLenh, thamSo...).Scan(&soLuong)
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

func (r *DanhMucRepository) XoaNhieuID(ids []uint64) error {
	if len(ids) == 0 {
		return nil
	}

	placeholder := strings.TrimRight(strings.Repeat("?,", len(ids)), ",")
	cauLenh := fmt.Sprintf(`
		UPDATE danhmuc
		SET deleted_at = NOW(), trangthai = 'an'
		WHERE id IN (%s)
		AND deleted_at IS NULL
	`, placeholder)

	thamSo := make([]interface{}, len(ids))
	for i, id := range ids {
		thamSo[i] = id
	}

	ketQua, loi := r.db.Exec(cauLenh, thamSo...)
	if loi != nil {
		return loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("danh mục không tồn tại hoặc đã bị xóa")
	}

	return nil
}

func (r *DanhMucRepository) LayTrangThai(id uint64) (string, error) {
	var trangthai string

	loi := r.db.QueryRow(`
		SELECT trangthai
		FROM danhmuc
		WHERE id = ?
		AND deleted_at IS NULL
		LIMIT 1
	`, id).Scan(&trangthai)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return "", errors.New("danh mục cha không tồn tại hoặc đã bị xóa")
		}

		return "", loi
	}

	return trangthai, nil
}

func (r *DanhMucRepository) KiemTraVongLap(id uint64, danhMucChaID *uint64) (bool, error) {
	if danhMucChaID == nil {
		return false, nil
	}

	idHienTai := *danhMucChaID

	for idHienTai > 0 {
		if idHienTai == id {
			return true, nil
		}

		var idCha sql.NullInt64

		loi := r.db.QueryRow(`
			SELECT danhmuccha_id
			FROM danhmuc
			WHERE id = ?
			AND deleted_at IS NULL
			LIMIT 1
		`, idHienTai).Scan(&idCha)

		if loi != nil {
			if errors.Is(loi, sql.ErrNoRows) {
				return false, errors.New("danh mục cha không tồn tại hoặc đã bị xóa")
			}

			return false, loi
		}

		if !idCha.Valid {
			break
		}

		idHienTai = uint64(idCha.Int64)
	}

	return false, nil
}

func (r *DanhMucRepository) LayIDConTrucTiep(id uint64) ([]uint64, error) {
	rows, loi := r.db.Query(`
		SELECT id
		FROM danhmuc
		WHERE danhmuccha_id = ?
		AND deleted_at IS NULL
	`, id)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []uint64{}

	for rows.Next() {
		var idCon uint64

		if loi := rows.Scan(&idCon); loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, idCon)
	}

	return danhSach, nil
}

func (r *DanhMucRepository) LayTatCaIDCon(id uint64) ([]uint64, error) {
	danhSachTatCa := []uint64{}
	hàngĐợi := []uint64{id}

	for len(hàngĐợi) > 0 {
		idHienTai := hàngĐợi[0]
		hàngĐợi = hàngĐợi[1:]

		danhSachTatCa = append(danhSachTatCa, idHienTai)

		danhSachCon, loi := r.LayIDConTrucTiep(idHienTai)
		if loi != nil {
			return nil, loi
		}

		hàngĐợi = append(hàngĐợi, danhSachCon...)
	}

	return danhSachTatCa, nil
}