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
		AND trangthai = 'hoan_thanh'
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
		FROM donhang
		WHERE trangthai = 'cho_xac_nhan'
		AND deleted_at IS NULL
	`).Scan(&thongKe.DonChoXacNhan)
	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*)
		FROM sanpham
		WHERE deleted_at IS NULL
		AND trangthai = 'hien_thi'
	`).Scan(&thongKe.SanPhamDangBan)
	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*)
		FROM khachhang
		WHERE DATE(created_at) = CURDATE()
	`).Scan(&thongKe.KhachHangMoi)
	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*)
		FROM sanpham
		WHERE deleted_at IS NULL
		AND soluongton <= 5
	`).Scan(&thongKe.SanPhamSapHet)
	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*)
		FROM donhang
		WHERE DATE(created_at) = CURDATE()
		AND trangthai = 'da_huy'
		AND deleted_at IS NULL
	`).Scan(&thongKe.DonDaHuy)
	if loi != nil {
		return thongKe, loi
	}

	var tongDon int64
	var donHoanThanh int64
	loi = r.db.QueryRow(`
		SELECT COUNT(*) FROM donhang WHERE deleted_at IS NULL
	`).Scan(&tongDon)
	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*) FROM donhang WHERE deleted_at IS NULL AND trangthai = 'hoan_thanh'
	`).Scan(&donHoanThanh)
	if loi != nil {
		return thongKe, loi
	}

	if tongDon > 0 {
		thongKe.TyLeHoanThanh = float64(donHoanThanh) / float64(tongDon) * 100
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*) FROM sanpham WHERE deleted_at IS NULL
	`).Scan(&thongKe.TongSanPham)
	if loi != nil {
		return thongKe, loi
	}

	loi = r.db.QueryRow(`
		SELECT COUNT(*) FROM khachhang
	`).Scan(&thongKe.TongKhachHang)
	if loi != nil {
		return thongKe, loi
	}

	return thongKe, nil
}

func (r *TongQuanRepository) LayDoanhThuTheoKhoang(ngayBatDau, ngayKetThuc string) ([]DoanhThuTheoNgay, error) {
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
	if loi := rows.Err(); loi != nil {
		return nil, loi
	}

	batDau, loiBD := time.Parse("2006-01-02", ngayBatDau)
	if loiBD != nil {
		return nil, loiBD
	}
	ketThuc, loiKT := time.Parse("2006-01-02", ngayKetThuc)
	if loiKT != nil {
		return nil, loiKT
	}

	danhSach := []DoanhThuTheoNgay{}

	for ngay := batDau; !ngay.After(ketThuc); ngay = ngay.AddDate(0, 0, 1) {
		key := ngay.Format("2006-01-02")

		if item, tonTai := duLieuTheoNgay[key]; tonTai {
			danhSach = append(danhSach, item)
		} else {
			danhSach = append(danhSach, DoanhThuTheoNgay{
				Ngay:     key,
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
			'COD' AS thanhtoan,
			trangthai,
			DATE_FORMAT(created_at, '%d/%m/%Y') AS created_at
		FROM donhang
		WHERE deleted_at IS NULL
		ORDER BY id DESC
		LIMIT 4
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
			&item.ThanhToan,
			&item.TrangThai,
			&item.CreatedAt,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}
	if loi := rows.Err(); loi != nil {
		return nil, loi
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
		AND sp.soluongton <= 5
		ORDER BY sp.soluongton ASC, sp.id DESC
		LIMIT 4
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
	if loi := rows.Err(); loi != nil {
		return nil, loi
	}

	return danhSach, nil
}

func (r *TongQuanRepository) LayTrangThaiDonHang() (TrangThaiDonHang, error) {
	var tt TrangThaiDonHang

	loi := r.db.QueryRow(`
		SELECT
			COALESCE(SUM(CASE WHEN trangthai = 'cho_xac_nhan' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN trangthai = 'da_xac_nhan' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN trangthai = 'dang_giao_hang' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN trangthai = 'hoan_thanh' THEN 1 ELSE 0 END), 0),
			COALESCE(SUM(CASE WHEN trangthai = 'da_huy' THEN 1 ELSE 0 END), 0),
			COUNT(*)
		FROM donhang
		WHERE deleted_at IS NULL
		AND DATE(created_at) = CURDATE()
	`).Scan(&tt.ChoXacNhan, &tt.DaXacNhan, &tt.DangGiao, &tt.HoanThanh, &tt.DaHuy, &tt.TongDon)

	if loi != nil {
		return tt, loi
	}

	return tt, nil
}

func (r *TongQuanRepository) LaySanPhamBanChay() ([]SanPhamBanChay, error) {
	homNay := time.Now()
	ngayBatDau := homNay.AddDate(0, 0, -6).Format("2006-01-02")

	rows, loi := r.db.Query(`
		SELECT
			sp.tensanpham,
			COUNT(DISTINCT dh.id) AS sodon,
			COALESCE(SUM(ct.thanhtien), 0) AS doanhthu
		FROM chitietdonhang ct
		JOIN donhang dh ON dh.id = ct.donhang_id
		JOIN sanpham sp ON sp.id = ct.sanpham_id
		WHERE dh.deleted_at IS NULL
		AND dh.trangthai != 'da_huy'
		AND DATE(dh.created_at) >= ?
		GROUP BY sp.id, sp.tensanpham
		ORDER BY sodon DESC
		LIMIT 4
	`, ngayBatDau)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []SanPhamBanChay{}

	for rows.Next() {
		var item SanPhamBanChay

		loi := rows.Scan(
			&item.TenSanPham,
			&item.SoDon,
			&item.DoanhThu,
		)

		if loi != nil {
			return nil, loi
		}

		danhSach = append(danhSach, item)
	}
	if loi := rows.Err(); loi != nil {
		return nil, loi
	}

	return danhSach, nil
}
