package sanpham

import (
	"database/sql"
	"math"
)

type LichSuKhoRepository struct {
	db *sql.DB
}

func TaoLichSuKhoRepository(db *sql.DB) *LichSuKhoRepository {
	return &LichSuKhoRepository{db: db}
}

func (r *LichSuKhoRepository) GhiLog(sanphamID uint64, lydo string, soLuongTruoc int, soLuongThayDoi int, ghichu string, thamchieu string) error {
	soLuongSau := soLuongTruoc + soLuongThayDoi
	_, loi := r.db.Exec(`
		INSERT INTO lichsukho (sanpham_id, ly_do, so_luong_truoc, so_luong_thay_doi, so_luong_sau, ghi_chu, tham_chieu)
		VALUES (?, ?, ?, ?, ?, ?, ?)
	`, sanphamID, lydo, soLuongTruoc, soLuongThayDoi, soLuongSau, ghichu, thamchieu)
	return loi
}

func (r *LichSuKhoRepository) DanhSach(sanphamID uint64, trang int, gioihan int) ([]LichSuKho, int64, error) {
	vitri := (trang - 1) * gioihan

	var tongSoDong int64
	loi := r.db.QueryRow(`SELECT COUNT(*) FROM lichsukho WHERE sanpham_id = ?`, sanphamID).Scan(&tongSoDong)
	if loi != nil {
		return nil, 0, loi
	}

	rows, loi := r.db.Query(`
		SELECT id, sanpham_id, ly_do, so_luong_truoc, so_luong_thay_doi, so_luong_sau,
		       COALESCE(ghi_chu, ''), COALESCE(tham_chieu, ''), created_at
		FROM lichsukho
		WHERE sanpham_id = ?
		ORDER BY created_at DESC
		LIMIT ? OFFSET ?
	`, sanphamID, gioihan, vitri)
	if loi != nil {
		return nil, 0, loi
	}
	defer rows.Close()

	danhSach := []LichSuKho{}
	for rows.Next() {
		var item LichSuKho
		if loi = rows.Scan(
			&item.ID, &item.SanPhamID, &item.LyDo,
			&item.SoLuongTruoc, &item.SoLuongThayDoi, &item.SoLuongSau,
			&item.GhiChu, &item.ThamChieu, &item.CreatedAt,
		); loi != nil {
			return nil, 0, loi
		}
		danhSach = append(danhSach, item)
	}

	return danhSach, tongSoDong, nil
}

func tinhTongSoTrang(tongSoDong int64, gioiHan int) int {
	t := int(math.Ceil(float64(tongSoDong) / float64(gioiHan)))
	if t < 1 {
		return 1
	}
	return t
}
