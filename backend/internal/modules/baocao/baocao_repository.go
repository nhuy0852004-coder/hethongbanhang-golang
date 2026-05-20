package baocao

import "database/sql"

type BaoCaoRepository struct {
	db *sql.DB
}

func TaoBaoCaoRepository(db *sql.DB) *BaoCaoRepository {
	return &BaoCaoRepository{
		db: db,
	}
}

func (r *BaoCaoRepository) DoanhThu(tungay string, denngay string) ([]DoanhThuItem, error) {
	rows, loi := r.db.Query(`
		SELECT
			DATE_FORMAT(created_at, '%Y-%m-%d') AS ngay,
			COALESCE(SUM(CASE WHEN trangthai != 'da_huy' THEN tongtien ELSE 0 END), 0) AS doanhthu,
			COUNT(*) AS donhang
		FROM donhang
		WHERE deleted_at IS NULL
		AND DATE(created_at) >= ?
		AND DATE(created_at) <= ?
		GROUP BY DATE_FORMAT(created_at, '%Y-%m-%d')
		ORDER BY DATE_FORMAT(created_at, '%Y-%m-%d') ASC
	`, tungay, denngay)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []DoanhThuItem{}

	for rows.Next() {
		var item DoanhThuItem

		loi := rows.Scan(
			&item.Ngay,
			&item.DoanhThu,
			&item.DonHang,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, nil
}

func (r *BaoCaoRepository) TopSanPham(tungay string, denngay string) ([]TopSanPhamItem, error) {
	rows, loi := r.db.Query(`
		SELECT
			COALESCE(sp.id, 0) AS id,
			ct.tensanpham,
			COALESCE(ct.hinhanh, '') AS hinhanh,
			COALESCE(SUM(ct.soluong), 0) AS soluongban,
			COALESCE(SUM(ct.thanhtien), 0) AS doanhthu
		FROM chitietdonhang ct
		INNER JOIN donhang dh ON dh.id = ct.donhang_id
		LEFT JOIN sanpham sp ON sp.id = ct.sanpham_id
		WHERE dh.deleted_at IS NULL
		AND dh.trangthai != 'da_huy'
		AND DATE(dh.created_at) >= ?
		AND DATE(dh.created_at) <= ?
		GROUP BY sp.id, ct.tensanpham, ct.hinhanh
		ORDER BY soluongban DESC, doanhthu DESC
		LIMIT 10
	`, tungay, denngay)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []TopSanPhamItem{}

	for rows.Next() {
		var item TopSanPhamItem

		loi := rows.Scan(
			&item.ID,
			&item.TenSanPham,
			&item.HinhAnh,
			&item.SoLuongBan,
			&item.DoanhThu,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, nil
}

func (r *BaoCaoRepository) DonHang(tungay string, denngay string) (*ThongKeDonHang, error) {
	var item ThongKeDonHang

	loi := r.db.QueryRow(`
		SELECT
			COUNT(*) AS tongdonhang,
			COALESCE(SUM(CASE WHEN trangthai = 'hoan_thanh' THEN 1 ELSE 0 END), 0) AS donhoanthanh,
			COALESCE(SUM(CASE WHEN trangthai = 'da_huy' THEN 1 ELSE 0 END), 0) AS dondahuy,
			COALESCE(SUM(CASE WHEN trangthai IN ('cho_xac_nhan', 'da_xac_nhan', 'dang_giao_hang') THEN 1 ELSE 0 END), 0) AS donchoxuly,
			COALESCE(SUM(CASE WHEN trangthai != 'da_huy' THEN tongtien ELSE 0 END), 0) AS tongdoanhthu,
			COALESCE(SUM(CASE WHEN trangthai = 'da_huy' THEN tongtien ELSE 0 END), 0) AS doanhthubihuy
		FROM donhang
		WHERE deleted_at IS NULL
		AND DATE(created_at) >= ?
		AND DATE(created_at) <= ?
	`, tungay, denngay).Scan(
		&item.TongDonHang,
		&item.DonHoanThanh,
		&item.DonDaHuy,
		&item.DonChoXuLy,
		&item.TongDoanhThu,
		&item.DoanhThuBiHuy,
	)

	if loi != nil {
		return nil, loi
	}

	return &item, nil
}