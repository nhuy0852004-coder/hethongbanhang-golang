package sanpham

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

type SanPhamRepository struct {
	db *sql.DB
}

func TaoSanPhamRepository(db *sql.DB) *SanPhamRepository {
	return &SanPhamRepository{db: db}
}

func (r *SanPhamRepository) DanhSach(timkiem string, trangthai string, danhmucID uint64, trang int, gioihan int) ([]SanPham, int64, error) {
	dieuKien := []string{"sp.deleted_at IS NULL"}
	thamSo := []interface{}{}

	if strings.TrimSpace(timkiem) != "" {
		dieuKien = append(dieuKien, "(sp.tensanpham LIKE ? OR sp.madinhdanh LIKE ?)")
		tuKhoa := "%" + strings.TrimSpace(timkiem) + "%"
		thamSo = append(thamSo, tuKhoa, tuKhoa)
	}

	if strings.TrimSpace(trangthai) != "" {
		dieuKien = append(dieuKien, "sp.trangthai = ?")
		thamSo = append(thamSo, trangthai)
	}

	if danhmucID > 0 {
		dieuKien = append(dieuKien, "sp.danhmuc_id = ?")
		thamSo = append(thamSo, danhmucID)
	}

	chuoiDieuKien := strings.Join(dieuKien, " AND ")
	cauDem := fmt.Sprintf(`SELECT COUNT(*) FROM sanpham sp WHERE %s`, chuoiDieuKien)

	var tongSoDong int64
	if loi := r.db.QueryRow(cauDem, thamSo...).Scan(&tongSoDong); loi != nil {
		return nil, 0, loi
	}

	offset := (trang - 1) * gioihan
	cauLenh := fmt.Sprintf(`
		SELECT
			sp.id,
			sp.madinhdanh,
			sp.tensanpham,
			COALESCE(sp.mota, '') AS mota,
			sp.giaban,
			sp.giakhuyenmai,
			sp.soluongton,
			COALESCE(sp.hinhanh, '') AS hinhanh,
			sp.trangthai,
			sp.danhmuc_id,
			COALESCE(dm.tendanhmuc, '') AS tendanhmuc,
			sp.created_at,
			sp.updated_at
		FROM sanpham sp
		LEFT JOIN danhmuc dm ON dm.id = sp.danhmuc_id
		WHERE %s
		ORDER BY sp.id DESC
		LIMIT ? OFFSET ?
	`, chuoiDieuKien)

	thamSoDanhSach := append(thamSo, gioihan, offset)
	rows, loi := r.db.Query(cauLenh, thamSoDanhSach...)
	if loi != nil {
		return nil, 0, loi
	}
	defer rows.Close()

	danhSach := []SanPham{}
	for rows.Next() {
		var item SanPham
		var giaKhuyenMai sql.NullInt64
		var danhMucID sql.NullInt64
		if loi := rows.Scan(&item.ID, &item.MaDinhDanh, &item.TenSanPham, &item.MoTa, &item.GiaBan, &giaKhuyenMai, &item.SoLuongTon, &item.HinhAnh, &item.TrangThai, &danhMucID, &item.TenDanhMuc, &item.CreatedAt, &item.UpdatedAt); loi != nil {
			return nil, 0, loi
		}
		if giaKhuyenMai.Valid {
			gia := uint64(giaKhuyenMai.Int64)
			item.GiaKhuyenMai = &gia
		}
		if danhMucID.Valid {
			id := uint64(danhMucID.Int64)
			item.DanhMucID = &id
		}
		danhSach = append(danhSach, item)
	}
	return danhSach, tongSoDong, nil
}

func (r *SanPhamRepository) ChiTiet(id uint64) (*SanPham, error) {
	cauLenh := `
		SELECT
			sp.id,
			sp.madinhdanh,
			sp.tensanpham,
			COALESCE(sp.mota, '') AS mota,
			sp.giaban,
			sp.giakhuyenmai,
			sp.soluongton,
			COALESCE(sp.hinhanh, '') AS hinhanh,
			sp.trangthai,
			sp.danhmuc_id,
			COALESCE(dm.tendanhmuc, '') AS tendanhmuc,
			sp.created_at,
			sp.updated_at
		FROM sanpham sp
		LEFT JOIN danhmuc dm ON dm.id = sp.danhmuc_id
		WHERE sp.id = ? AND sp.deleted_at IS NULL
		LIMIT 1
	`

	var item SanPham
	var giaKhuyenMai sql.NullInt64
	var danhMucID sql.NullInt64
	loi := r.db.QueryRow(cauLenh, id).Scan(&item.ID, &item.MaDinhDanh, &item.TenSanPham, &item.MoTa, &item.GiaBan, &giaKhuyenMai, &item.SoLuongTon, &item.HinhAnh, &item.TrangThai, &danhMucID, &item.TenDanhMuc, &item.CreatedAt, &item.UpdatedAt)
	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("sản phẩm không tồn tại")
		}
		return nil, loi
	}
	if giaKhuyenMai.Valid {
		gia := uint64(giaKhuyenMai.Int64)
		item.GiaKhuyenMai = &gia
	}
	if danhMucID.Valid {
		idDanhMuc := uint64(danhMucID.Int64)
		item.DanhMucID = &idDanhMuc
	}
	return &item, nil
}

func giaTriUint64Ptr(p *uint64) any {
	if p == nil {
		return nil
	}
	return *p
}

func (r *SanPhamRepository) Tao(request TaoSanPhamRequest, madinhdanh string) (uint64, error) {
	cauLenh := `
		INSERT INTO sanpham (madinhdanh, tensanpham, mota, giaban, giakhuyenmai, soluongton, trangthai, danhmuc_id)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?)
	`
	ketQua, loi := r.db.Exec(cauLenh, madinhdanh, request.TenSanPham, request.MoTa, request.GiaBan, giaTriUint64Ptr(request.GiaKhuyenMai), request.SoLuongTon, request.TrangThai, giaTriUint64Ptr(request.DanhMucID))
	if loi != nil {
		return 0, loi
	}
	id, loi := ketQua.LastInsertId()
	if loi != nil {
		return 0, loi
	}
	return uint64(id), nil
}

func (r *SanPhamRepository) CapNhat(id uint64, request CapNhatSanPhamRequest, madinhdanh string) error {
	var tonTai int

	loi := r.db.QueryRow(`
		SELECT COUNT(*)
		FROM sanpham
		WHERE id = ?
		AND deleted_at IS NULL
	`, id).Scan(&tonTai)

	if loi != nil {
		return loi
	}

	if tonTai == 0 {
		return errors.New("sản phẩm không tồn tại")
	}

	cauLenh := `
		UPDATE sanpham
		SET
			madinhdanh = ?,
			tensanpham = ?,
			mota = ?,
			giaban = ?,
			giakhuyenmai = ?,
			soluongton = ?,
			trangthai = ?,
			danhmuc_id = ?
		WHERE id = ?
		AND deleted_at IS NULL
	`

	_, loi = r.db.Exec(
		cauLenh,
		madinhdanh,
		request.TenSanPham,
		request.MoTa,
		request.GiaBan,
		request.GiaKhuyenMai,
		request.SoLuongTon,
		request.TrangThai,
		request.DanhMucID,
		id,
	)

	if loi != nil {
		return loi
	}

	return nil
}

func (r *SanPhamRepository) Xoa(id uint64) error {
	ketQua, loi := r.db.Exec(`UPDATE sanpham SET deleted_at = NOW() WHERE id = ? AND deleted_at IS NULL`, id)
	if loi != nil {
		return loi
	}
	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("sản phẩm không tồn tại")
	}
	return nil
}

func (r *SanPhamRepository) CapNhatTrangThai(id uint64, trangthai string) error {
	ketQua, loi := r.db.Exec(`UPDATE sanpham SET trangthai = ? WHERE id = ? AND deleted_at IS NULL`, trangthai, id)
	if loi != nil {
		return loi
	}
	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		return errors.New("sản phẩm không tồn tại")
	}
	return nil
}

func (r *SanPhamRepository) CapNhatHinhAnh(id uint64, duongdan string) error {
	tx, loi := r.db.Begin()
	if loi != nil {
		return loi
	}
	ketQua, loi := tx.Exec(`UPDATE sanpham SET hinhanh = ? WHERE id = ? AND deleted_at IS NULL`, duongdan, id)
	if loi != nil {
		_ = tx.Rollback()
		return loi
	}
	soDong, _ := ketQua.RowsAffected()
	if soDong == 0 {
		_ = tx.Rollback()
		return errors.New("sản phẩm không tồn tại")
	}
	_, _ = tx.Exec(`UPDATE anhsanpham SET anhchinh = 0 WHERE sanpham_id = ?`, id)
	_, loi = tx.Exec(`INSERT INTO anhsanpham (sanpham_id, duongdan, anhchinh, thutu) VALUES (?, ?, 1, 0)`, id, duongdan)
	if loi != nil {
		_ = tx.Rollback()
		return loi
	}
	return tx.Commit()
}

func (r *SanPhamRepository) MaDinhDanhDaTonTai(madinhdanh string, boQuaID uint64) (bool, error) {
	var soLuong int
	if loi := r.db.QueryRow(`SELECT COUNT(*) FROM sanpham WHERE madinhdanh = ? AND deleted_at IS NULL AND id != ?`, madinhdanh, boQuaID).Scan(&soLuong); loi != nil {
		return false, loi
	}
	return soLuong > 0, nil
}
