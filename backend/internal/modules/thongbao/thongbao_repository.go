package thongbao

import (
	"database/sql"
	"encoding/json"
	"errors"
	"fmt"
	"strings"
)

type ThongBaoRepository struct {
	db *sql.DB
}

func TaoThongBaoRepository(db *sql.DB) *ThongBaoRepository {
	return &ThongBaoRepository{
		db: db,
	}
}

func (r *ThongBaoRepository) DanhSach(dadoc string, loai string, trang int, gioihan int) ([]ThongBao, int64, error) {
	dieuKien := []string{"1 = 1"}
	thamSo := []interface{}{}

	if strings.TrimSpace(dadoc) != "" {
		if dadoc == "1" || dadoc == "true" {
			dieuKien = append(dieuKien, "dadoc = 1")
		}

		if dadoc == "0" || dadoc == "false" {
			dieuKien = append(dieuKien, "dadoc = 0")
		}
	}

	if strings.TrimSpace(loai) != "" {
		dieuKien = append(dieuKien, "loai = ?")
		thamSo = append(thamSo, loai)
	}

	chuoiDieuKien := strings.Join(dieuKien, " AND ")

	cauDem := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM thongbao
		WHERE %s
	`, chuoiDieuKien)

	var tongSoDong int64

	if loi := r.db.QueryRow(cauDem, thamSo...).Scan(&tongSoDong); loi != nil {
		return nil, 0, loi
	}

	offset := (trang - 1) * gioihan

	cauLenh := fmt.Sprintf(`
		SELECT
			id,
			tieude,
			noidung,
			loai,
			dadoc,
			dulieu,
			created_at,
			updated_at
		FROM thongbao
		WHERE %s
		ORDER BY id DESC
		LIMIT ? OFFSET ?
	`, chuoiDieuKien)

	thamSoDanhSach := append(thamSo, gioihan, offset)

	rows, loi := r.db.Query(cauLenh, thamSoDanhSach...)
	if loi != nil {
		return nil, 0, loi
	}
	defer rows.Close()

	danhSach := []ThongBao{}

	for rows.Next() {
		var item ThongBao
		var dulieuRaw sql.NullString

		loi := rows.Scan(
			&item.ID,
			&item.TieuDe,
			&item.NoiDung,
			&item.Loai,
			&item.DaDoc,
			&dulieuRaw,
			&item.CreatedAt,
			&item.UpdatedAt,
		)

		if loi != nil {
			return nil, 0, loi
		}

		if dulieuRaw.Valid && dulieuRaw.String != "" {
			var duLieu interface{}
			if json.Unmarshal([]byte(dulieuRaw.String), &duLieu) == nil {
				item.DuLieu = duLieu
			}
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, tongSoDong, nil
}

func (r *ThongBaoRepository) Tao(request TaoThongBaoRequest) (*ThongBao, error) {
	var dulieuJSON interface{} = nil

	if request.DuLieu != nil {
		duLieuByte, loi := json.Marshal(request.DuLieu)
		if loi != nil {
			return nil, loi
		}

		dulieuJSON = string(duLieuByte)
	}

	ketQua, loi := r.db.Exec(`
		INSERT INTO thongbao (
			tieude,
			noidung,
			loai,
			dadoc,
			dulieu
		)
		VALUES (?, ?, ?, 0, ?)
	`,
		request.TieuDe,
		request.NoiDung,
		request.Loai,
		dulieuJSON,
	)

	if loi != nil {
		return nil, loi
	}

	idRaw, loi := ketQua.LastInsertId()
	if loi != nil {
		return nil, loi
	}

	return r.ChiTiet(uint64(idRaw))
}

func (r *ThongBaoRepository) ChiTiet(id uint64) (*ThongBao, error) {
	var item ThongBao
	var dulieuRaw sql.NullString

	loi := r.db.QueryRow(`
		SELECT
			id,
			tieude,
			noidung,
			loai,
			dadoc,
			dulieu,
			created_at,
			updated_at
		FROM thongbao
		WHERE id = ?
		LIMIT 1
	`, id).Scan(
		&item.ID,
		&item.TieuDe,
		&item.NoiDung,
		&item.Loai,
		&item.DaDoc,
		&dulieuRaw,
		&item.CreatedAt,
		&item.UpdatedAt,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("thông báo không tồn tại")
		}

		return nil, loi
	}

	if dulieuRaw.Valid && dulieuRaw.String != "" {
		var duLieu interface{}
		if json.Unmarshal([]byte(dulieuRaw.String), &duLieu) == nil {
			item.DuLieu = duLieu
		}
	}

	return &item, nil
}

func (r *ThongBaoRepository) CapNhatDaDoc(id uint64, dadoc bool) (*ThongBao, error) {
	ketQua, loi := r.db.Exec(`
		UPDATE thongbao
		SET dadoc = ?
		WHERE id = ?
	`, dadoc, id)

	if loi != nil {
		return nil, loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return nil, errors.New("thông báo không tồn tại")
	}

	return r.ChiTiet(id)
}

func (r *ThongBaoRepository) DanhDauTatCaDaDoc() error {
	_, loi := r.db.Exec(`
		UPDATE thongbao
		SET dadoc = 1
		WHERE dadoc = 0
	`)

	return loi
}

func (r *ThongBaoRepository) Xoa(id uint64) error {
	ketQua, loi := r.db.Exec(`
		DELETE FROM thongbao
		WHERE id = ?
	`, id)

	if loi != nil {
		return loi
	}

	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("thông báo không tồn tại")
	}

	return nil
}

func (r *ThongBaoRepository) DemChuaDoc() (int64, error) {
	var soLuong int64

	loi := r.db.QueryRow(`
		SELECT COUNT(*)
		FROM thongbao
		WHERE dadoc = 0
	`).Scan(&soLuong)

	return soLuong, loi
}