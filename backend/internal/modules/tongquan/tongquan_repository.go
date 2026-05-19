package tongquan

import (
	"database/sql"
	"time"
)

type TongQuanRepository struct {
	db *sql.DB
}

func TaoTongQuanRepository(db *sql.DB) *TongQuanRepository {
	return &TongQuanRepository{
		db: db,
	}
}

func (r *TongQuanRepository) LayThongKe() (ThongKeTongQuan, error) {
	var thongKe ThongKeTongQuan

	loi := r.db.QueryRow(`
		SELECT COALESCE(SUM(tongtien), 0)
		FROM donhang
		WHERE DATE(created_at) = CURDATE()
		AND trangthai != 'da_huy'
		AND deleted_at IS NULL
	`).Scan(&thongKe.DoanhThuHomNay)

	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*)
		FROM donhang
		WHERE DATE(created_at) = CURDATE()
		AND deleted_at IS NULL
	`).Scan(&thongKe.DonHangHomNay)

	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*)
		FROM sanpham
		WHERE deleted_at IS NULL
	`).Scan(&thongKe.TongSanPham)

	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*)
		FROM khachhang
	`).Scan(&thongKe.TongKhachHang)

	if loi != nil {
		return thongKe, loi
	}

	return thongKe, nil
}

func (r *TongQuanRepository) LayDoanhThuBayNgay() ([]DoanhThuTheoNgay, error) {
	homNay := time.Now()
	ngayBatDau := homNay.AddDate(0, 0, -6).Format("2006-01-02")
	ngayKetThuc := homNay.Format("2006-01-02")

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
	`, ngayBatDau, ngayKetThuc)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	duLieuTheoNgay := map[string]DoanhThuTheoNgay{}

	for rows.Next() {
		var item DoanhThuTheoNgay

		loi := rows.Scan(
			&item.Ngay,
			&item.DoanhThu,
			&item.DonHang,
		)

		if loi != nil {
			return nil, loi
		}

		duLieuTheoNgay[item.Ngay] = item
	}

	danhSach := []DoanhThuTheoNgay{}

	for i := 6; i >= 0; i-- {
		ngay := homNay.AddDate(0, 0, -i).Format("2006-01-02")

		if item, tonTai := duLieuTheoNgay[ngay]; tonTai {
			danhSach = append(danhSach, item)
		} else {
			danhSach = append(danhSach, DoanhThuTheoNgay{
				Ngay:     ngay,
				DoanhThu: 0,
				DonHang:  0,
			})
		}
	}

	return danhSach, nil
}

func (r *TongQuanRepository) LayDonHangMoiNhat() ([]DonHangMoiNhat, error) {
	rows, loi := r.db.Query(`
		SELECT
			id,
			madonhang,
			hoten,
			sodienthoai,
			tongtien,
			trangthai,
			DATE_FORMAT(created_at, '%d/%m/%Y %H:%i') AS created_at
		FROM donhang
		WHERE deleted_at IS NULL
		ORDER BY id DESC
		LIMIT 8
	`)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []DonHangMoiNhat{}

	for rows.Next() {
		var item DonHangMoiNhat

		loi := rows.Scan(
			&item.ID,
			&item.MaDonHang,
			&item.HoTen,
			&item.SoDienThoai,
			&item.TongTien,
			&item.TrangThai,
			&item.CreatedAt,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, nil
}

func (r *TongQuanRepository) LaySanPhamSapHet() ([]SanPhamSapHet, error) {
	rows, loi := r.db.Query(`
		SELECT
			sp.id,
			sp.madinhdanh,
			sp.tensanpham,
			COALESCE(sp.hinhanh, '') AS hinhanh,
			sp.soluongton,
			sp.trangthai,
			COALESCE(dm.tendanhmuc, '') AS tendanhmuc
		FROM sanpham sp
		LEFT JOIN danhmuc dm ON dm.id = sp.danhmuc_id
		WHERE sp.deleted_at IS NULL
		AND sp.soluongton <= 10
		ORDER BY sp.soluongton ASC, sp.id DESC
		LIMIT 10
	`)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []SanPhamSapHet{}

	for rows.Next() {
		var item SanPhamSapHet

		loi := rows.Scan(
			&item.ID,
			&item.MaDinhDanh,
			&item.TenSanPham,
			&item.HinhAnh,
			&item.SoLuongTon,
			&item.TrangThai,
			&item.TenDanhMuc,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}

	return danhSach, nil
}
