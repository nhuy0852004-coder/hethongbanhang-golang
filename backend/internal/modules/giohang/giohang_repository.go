package giohang

import (
	"database/sql"
	"errors"
)

type GioHangRepository struct {
	db *sql.DB
}

func TaoGioHangRepository(db *sql.DB) *GioHangRepository {
	return &GioHangRepository{
		db: db,
	}
}

func (r *GioHangRepository) LaySanPham(id uint64) (*SanPhamGioHang, error) {
	var item SanPhamGioHang
	var giaKhuyenMai sql.NullInt64

	loi := r.db.QueryRow(`
		SELECT
			sp.id,
			sp.madinhdanh,
			sp.tensanpham,
			COALESCE(sp.hinhanh, '') AS hinhanh,
			sp.giaban,
			sp.giakhuyenmai,
			sp.soluongton,
			sp.trangthai,
			COALESCE(dm.tendanhmuc, '') AS tendanhmuc
		FROM sanpham sp
		LEFT JOIN danhmuc dm ON dm.id = sp.danhmuc_id
		WHERE sp.id = ?
		AND sp.deleted_at IS NULL
		LIMIT 1
	`, id).Scan(
		&item.ID,
		&item.MaDinhDanh,
		&item.TenSanPham,
		&item.HinhAnh,
		&item.GiaBan,
		&giaKhuyenMai,
		&item.SoLuongTon,
		&item.TrangThai,
		&item.TenDanhMuc,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("sản phẩm không tồn tại hoặc đã bị xóa")
		}

		return nil, loi
	}

	if giaKhuyenMai.Valid {
		gia := uint64(giaKhuyenMai.Int64)
		item.GiaKhuyenMai = &gia
	}

	return &item, nil
}