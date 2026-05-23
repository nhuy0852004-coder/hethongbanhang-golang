package sanpham

import (
	"database/sql"
	"errors"
	"fmt"
	"log"
	"strings"
)

type SanPhamRepository struct {
	db *sql.DB
}

func TaoSanPhamRepository(db *sql.DB) *SanPhamRepository {
	return &SanPhamRepository{db: db}
}

func (r *SanPhamRepository) DanhSach(loc LocSanPhamRequest) ([]SanPham, int64, error) {
	dieuKien := []string{
		"sp.deleted_at IS NULL",
	}

	thamSo := []interface{}{}

	if strings.TrimSpace(loc.TimKiem) != "" {
		dieuKien = append(dieuKien, `
			(
				sp.tensanpham LIKE ?
				OR sp.madinhdanh LIKE ?
				OR COALESCE(sp.sku, '') LIKE ?
				OR COALESCE(sp.barcode, '') LIKE ?
			)
		`)

		tuKhoa := "%" + strings.TrimSpace(loc.TimKiem) + "%"
		thamSo = append(thamSo, tuKhoa, tuKhoa, tuKhoa, tuKhoa)
	}

	if strings.TrimSpace(loc.TrangThai) != "" {
		dieuKien = append(dieuKien, "sp.trangthai = ?")
		thamSo = append(thamSo, loc.TrangThai)
	}

	if loc.DanhMucID > 0 {
		dieuKien = append(dieuKien, "sp.danhmuc_id = ?")
		thamSo = append(thamSo, loc.DanhMucID)
	}

	if loc.GiaTu > 0 {
		dieuKien = append(dieuKien, "sp.giaban >= ?")
		thamSo = append(thamSo, loc.GiaTu)
	}

	if loc.GiaDen > 0 {
		dieuKien = append(dieuKien, "sp.giaban <= ?")
		thamSo = append(thamSo, loc.GiaDen)
	}

	switch loc.TonKho {
	case "con_hang":
		dieuKien = append(dieuKien, "sp.soluongton > 5")
	case "sap_het":
		dieuKien = append(dieuKien, "sp.soluongton > 0 AND sp.soluongton <= 5")
	case "het_hang":
		dieuKien = append(dieuKien, "sp.soluongton = 0")
	}

	switch loc.SanPham {
	case "noibat":
		dieuKien = append(dieuKien, "sp.noibat = 1")
	case "khuyenmai":
		dieuKien = append(dieuKien, "sp.giakhuyenmai IS NOT NULL AND sp.giakhuyenmai > 0")
	case "banchay":
		dieuKien = append(dieuKien, "COALESCE(lb.luotban, 0) > 0")
	}

	chuoiDieuKien := strings.Join(dieuKien, " AND ")

	cauDem := fmt.Sprintf(`
		SELECT COUNT(*)
		FROM sanpham sp
		LEFT JOIN (
			SELECT 
				ct.sanpham_id,
				SUM(ct.soluong) AS luotban
			FROM chitietdonhang ct
			INNER JOIN donhang dh ON dh.id = ct.donhang_id
			WHERE dh.deleted_at IS NULL
			AND dh.trangthai != 'da_huy'
			GROUP BY ct.sanpham_id
		) lb ON lb.sanpham_id = sp.id
		WHERE %s
	`, chuoiDieuKien)

	var tongSoDong int64

	if loi := r.db.QueryRow(cauDem, thamSo...).Scan(&tongSoDong); loi != nil {
		return nil, 0, loi
	}

	sapXep := "sp.id DESC"

	switch loc.SapXep {
	case "cu_nhat":
		sapXep = "sp.id ASC"
	case "gia_tang":
		sapXep = "sp.giaban ASC"
	case "gia_giam":
		sapXep = "sp.giaban DESC"
	case "ton_kho_thap":
		sapXep = "sp.soluongton ASC, sp.id DESC"
	case "luot_ban":
		sapXep = "COALESCE(lb.luotban, 0) DESC, sp.id DESC"
	default:
		sapXep = "sp.id DESC"
	}

	offset := (loc.Trang - 1) * loc.GioiHan

	cauLenh := fmt.Sprintf(`
		SELECT
			sp.id,
			sp.madinhdanh,
			COALESCE(sp.sku, '') AS sku,
			COALESCE(sp.barcode, '') AS barcode,
			sp.tensanpham,
			COALESCE(sp.mota, '') AS mota,
			COALESCE(sp.motangan, '') AS motangan,
			COALESCE(sp.motachitiet, '') AS motachitiet,
			COALESCE(sp.thuonghieu, '') AS thuonghieu,
			COALESCE(sp.donvitinh, 'cái') AS donvitinh,
			COALESCE(sp.gianhap, 0) AS gianhap,
			sp.giaban,
			sp.giakhuyenmai,
			sp.soluongton,
			COALESCE(sp.nguongcanhbao, 5) AS nguongcanhbao,
			sp.trongluong,
			COALESCE(sp.kichthuoc, '') AS kichthuoc,
			COALESCE(sp.hinhanh, '') AS hinhanh,
			COALESCE(sp.noibat, 0) AS noibat,
			COALESCE(sp.banchay, 0) AS banchay,
			COALESCE(sp.sanphammoi, 0) AS sanphammoi,
			COALESCE(sp.chodattruoc, 0) AS chodattruoc,
			COALESCE(sp.thuoctinh, '') AS thuoctinh,
			COALESCE(sp.bienthe, '') AS bienthe,
			sp.trangthai,
			sp.danhmuc_id,
			COALESCE(dm.tendanhmuc, '') AS tendanhmuc,
			COALESCE(lb.luotban, 0) AS luotban,
			sp.created_at,
			sp.updated_at
		FROM sanpham sp
		LEFT JOIN danhmuc dm ON dm.id = sp.danhmuc_id
		LEFT JOIN (
			SELECT 
				ct.sanpham_id,
				SUM(ct.soluong) AS luotban
			FROM chitietdonhang ct
			INNER JOIN donhang dh ON dh.id = ct.donhang_id
			WHERE dh.deleted_at IS NULL
			AND dh.trangthai != 'da_huy'
			GROUP BY ct.sanpham_id
		) lb ON lb.sanpham_id = sp.id
		WHERE %s
		ORDER BY %s
		LIMIT ? OFFSET ?
	`, chuoiDieuKien, sapXep)

	thamSoDanhSach := append(thamSo, loc.GioiHan, offset)

	rows, loi := r.db.Query(cauLenh, thamSoDanhSach...)
	if loi != nil {
		return nil, 0, loi
	}
	defer rows.Close()

	danhSach := []SanPham{}

	for rows.Next() {
		var item SanPham
		var giaNhap sql.NullInt64
		var giaKhuyenMai sql.NullInt64
		var danhMucID sql.NullInt64
		var trongLuong sql.NullFloat64
		var noiBat, banChay, sanPhamMoi, choDatTruoc int

		loi := rows.Scan(
			&item.ID,
			&item.MaDinhDanh,
			&item.SKU,
			&item.Barcode,
			&item.TenSanPham,
			&item.MoTa,
			&item.MoTaNgan,
			&item.MoTaChiTiet,
			&item.ThuongHieu,
			&item.DonViTinh,
			&giaNhap,
			&item.GiaBan,
			&giaKhuyenMai,
			&item.SoLuongTon,
			&item.NguongCanhBao,
			&trongLuong,
			&item.KichThuoc,
			&item.HinhAnh,
			&noiBat,
			&banChay,
			&sanPhamMoi,
			&choDatTruoc,
			&item.ThuocTinh,
			&item.BienThe,
			&item.TrangThai,
			&danhMucID,
			&item.TenDanhMuc,
			&item.LuotBan,
			&item.CreatedAt,
			&item.UpdatedAt,
		)

		if loi != nil {
			return nil, 0, loi
		}

		if giaNhap.Valid {
			item.GiaNhap = uint64(giaNhap.Int64)
		}

		if giaKhuyenMai.Valid {
			gia := uint64(giaKhuyenMai.Int64)
			item.GiaKhuyenMai = &gia
		}

		if trongLuong.Valid {
			giaTri := trongLuong.Float64
			item.TrongLuong = &giaTri
		}

		if danhMucID.Valid {
			id := uint64(danhMucID.Int64)
			item.DanhMucID = &id
		}

		item.NoiBat = noiBat == 1
		item.BanChay = banChay == 1
		item.SanPhamMoi = sanPhamMoi == 1
		item.ChoDatTruoc = choDatTruoc == 1

		albumAnh, loi := r.layAlbumAnh(item.ID)
		if loi != nil {
			return nil, 0, loi
		}
		item.AlbumAnh = albumAnh

		danhSach = append(danhSach, item)
	}

	return danhSach, tongSoDong, nil
}

func (r *SanPhamRepository) SKUDaTonTai(sku string, boQuaID uint64) (bool, error) {
	var soLuong int

	loi := r.db.QueryRow(`
		SELECT COUNT(*)
		FROM sanpham
		WHERE sku = ?
		AND deleted_at IS NULL
		AND id != ?
	`, sku, boQuaID).Scan(&soLuong)

	if loi != nil {
		return false, loi
	}

	return soLuong > 0, nil
}

func (r *SanPhamRepository) ChiTiet(id uint64) (*SanPham, error) {
	cauLenh := `
		SELECT
			sp.id,
			sp.madinhdanh,
			COALESCE(sp.sku, '') AS sku,
			COALESCE(sp.barcode, '') AS barcode,
			sp.tensanpham,
			COALESCE(sp.mota, '') AS mota,
			COALESCE(sp.motangan, '') AS motangan,
			COALESCE(sp.motachitiet, '') AS motachitiet,
			COALESCE(sp.thuonghieu, '') AS thuonghieu,
			COALESCE(sp.donvitinh, 'cái') AS donvitinh,
			COALESCE(sp.gianhap, 0) AS gianhap,
			sp.giaban,
			sp.giakhuyenmai,
			sp.soluongton,
			COALESCE(sp.nguongcanhbao, 5) AS nguongcanhbao,
			sp.trongluong,
			COALESCE(sp.kichthuoc, '') AS kichthuoc,
			COALESCE(sp.hinhanh, '') AS hinhanh,
			COALESCE(sp.noibat, 0) AS noibat,
			COALESCE(sp.banchay, 0) AS banchay,
			COALESCE(sp.sanphammoi, 0) AS sanphammoi,
			COALESCE(sp.chodattruoc, 0) AS chodattruoc,
			COALESCE(sp.thuoctinh, '') AS thuoctinh,
			COALESCE(sp.bienthe, '') AS bienthe,
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
	var giaNhap sql.NullInt64
	var giaKhuyenMai sql.NullInt64
	var danhMucID sql.NullInt64
	var trongLuong sql.NullFloat64
	var noiBat, banChay, sanPhamMoi, choDatTruoc int
	loi := r.db.QueryRow(cauLenh, id).Scan(&item.ID, &item.MaDinhDanh, &item.SKU, &item.Barcode, &item.TenSanPham, &item.MoTa, &item.MoTaNgan, &item.MoTaChiTiet, &item.ThuongHieu, &item.DonViTinh, &giaNhap, &item.GiaBan, &giaKhuyenMai, &item.SoLuongTon, &item.NguongCanhBao, &trongLuong, &item.KichThuoc, &item.HinhAnh, &noiBat, &banChay, &sanPhamMoi, &choDatTruoc, &item.ThuocTinh, &item.BienThe, &item.TrangThai, &danhMucID, &item.TenDanhMuc, &item.CreatedAt, &item.UpdatedAt)
	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("sản phẩm không tồn tại")
		}
		return nil, loi
	}
	if giaNhap.Valid {
		item.GiaNhap = uint64(giaNhap.Int64)
	}
	if giaKhuyenMai.Valid {
		gia := uint64(giaKhuyenMai.Int64)
		item.GiaKhuyenMai = &gia
	}
	if trongLuong.Valid {
		giaTri := trongLuong.Float64
		item.TrongLuong = &giaTri
	}
	if danhMucID.Valid {
		idDanhMuc := uint64(danhMucID.Int64)
		item.DanhMucID = &idDanhMuc
	}
	item.NoiBat = noiBat == 1
	item.BanChay = banChay == 1
	item.SanPhamMoi = sanPhamMoi == 1
	item.ChoDatTruoc = choDatTruoc == 1

	albumAnh, loi := r.layAlbumAnh(id)
	if loi != nil {
		return nil, loi
	}
	item.AlbumAnh = albumAnh

	return &item, nil
}

func giaTriUint64Ptr(p *uint64) any {
	if p == nil {
		return nil
	}
	return *p
}

func nullNeuRong(giaTri string) any {
	if strings.TrimSpace(giaTri) == "" {
		return nil
	}
	return strings.TrimSpace(giaTri)
}

func (r *SanPhamRepository) Tao(request TaoSanPhamRequest, madinhdanh string) (uint64, error) {
	cauLenh := `
		INSERT INTO sanpham (
			madinhdanh,
			sku,
			barcode,
			tensanpham,
			mota,
			motangan,
			motachitiet,
			thuonghieu,
			donvitinh,
			gianhap,
			giaban,
			giakhuyenmai,
			soluongton,
			nguongcanhbao,
			trongluong,
			kichthuoc,
			noibat,
			banchay,
			sanphammoi,
			chodattruoc,
			thuoctinh,
			bienthe,
			trangthai,
			danhmuc_id
		)
		VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
	`
	ketQua, loi := r.db.Exec(cauLenh,
		madinhdanh,
		request.SKU,
		request.Barcode,
		request.TenSanPham,
		request.MoTa,
		request.MoTaNgan,
		request.MoTaChiTiet,
		request.ThuongHieu,
		request.DonViTinh,
		request.GiaNhap,
		request.GiaBan,
		giaTriUint64Ptr(request.GiaKhuyenMai),
		request.SoLuongTon,
		request.NguongCanhBao,
		request.TrongLuong,
		request.KichThuoc,
		request.NoiBat,
		request.BanChay,
		request.SanPhamMoi,
		request.ChoDatTruoc,
		nullNeuRong(request.ThuocTinh),
		nullNeuRong(request.BienThe),
		request.TrangThai,
		giaTriUint64Ptr(request.DanhMucID),
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
			sku = ?,
			barcode = ?,
			tensanpham = ?,
			mota = ?,
			motangan = ?,
			motachitiet = ?,
			thuonghieu = ?,
			donvitinh = ?,
			gianhap = ?,
			giaban = ?,
			giakhuyenmai = ?,
			soluongton = ?,
			nguongcanhbao = ?,
			trongluong = ?,
			kichthuoc = ?,
			noibat = ?,
			banchay = ?,
			sanphammoi = ?,
			chodattruoc = ?,
			thuoctinh = ?,
			bienthe = ?,
			trangthai = ?,
			danhmuc_id = ?
		WHERE id = ?
		AND deleted_at IS NULL
	`

	_, loi = r.db.Exec(
		cauLenh,
		madinhdanh,
		request.SKU,
		request.Barcode,
		request.TenSanPham,
		request.MoTa,
		request.MoTaNgan,
		request.MoTaChiTiet,
		request.ThuongHieu,
		request.DonViTinh,
		request.GiaNhap,
		request.GiaBan,
		request.GiaKhuyenMai,
		request.SoLuongTon,
		request.NguongCanhBao,
		request.TrongLuong,
		request.KichThuoc,
		request.NoiBat,
		request.BanChay,
		request.SanPhamMoi,
		request.ChoDatTruoc,
		nullNeuRong(request.ThuocTinh),
		nullNeuRong(request.BienThe),
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

func (r *SanPhamRepository) ThemAlbumAnh(id uint64, danhSachDuongDan []string) error {
	tx, loi := r.db.Begin()
	if loi != nil {
		log.Printf("ThemAlbumAnh: begin tx error: %v", loi)
		return loi
	}

	var tonTai int
	loi = tx.QueryRow(`SELECT COUNT(*) FROM sanpham WHERE id = ? AND deleted_at IS NULL`, id).Scan(&tonTai)
	if loi != nil {
		_ = tx.Rollback()
		log.Printf("ThemAlbumAnh: product exists check error: %v", loi)
		return loi
	}
	if tonTai == 0 {
		_ = tx.Rollback()
		return errors.New("sản phẩm không tồn tại")
	}

	var thuTuBatDau sql.NullInt64
	loi = tx.QueryRow(`SELECT MAX(thutu) FROM anhsanpham WHERE sanpham_id = ?`, id).Scan(&thuTuBatDau)
	if loi != nil {
		_ = tx.Rollback()
		log.Printf("ThemAlbumAnh: select max thutu error: %v", loi)
		return loi
	}

	thuTu := 0
	if thuTuBatDau.Valid {
		thuTu = int(thuTuBatDau.Int64) + 1
	}

	for index, duongdan := range danhSachDuongDan {
		_, loi = tx.Exec(
			`INSERT INTO anhsanpham (sanpham_id, duongdan, anhchinh, thutu) VALUES (?, ?, 0, ?)`,
			id,
			duongdan,
			thuTu+index,
		)
		if loi != nil {
			_ = tx.Rollback()
			log.Printf("ThemAlbumAnh: insert anhsanpham error (index=%d): %v", index, loi)
			return loi
		}
	}

	return tx.Commit()
}

func (r *SanPhamRepository) layAlbumAnh(id uint64) ([]AnhSanPham, error) {
	rows, loi := r.db.Query(`
		SELECT id, sanpham_id, duongdan, anhchinh, thutu
		FROM anhsanpham
		WHERE sanpham_id = ?
		ORDER BY anhchinh DESC, thutu ASC, id ASC
	`, id)
	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []AnhSanPham{}
	for rows.Next() {
		var item AnhSanPham
		var anhChinh int
		if loi := rows.Scan(&item.ID, &item.SanPhamID, &item.DuongDan, &anhChinh, &item.ThuTu); loi != nil {
			return nil, loi
		}
		item.AnhChinh = anhChinh == 1
		danhSach = append(danhSach, item)
	}

	return danhSach, rows.Err()
}

func (r *SanPhamRepository) MaDinhDanhDaTonTai(madinhdanh string, boQuaID uint64) (bool, error) {
	var soLuong int
	if loi := r.db.QueryRow(`SELECT COUNT(*) FROM sanpham WHERE madinhdanh = ? AND deleted_at IS NULL AND id != ?`, madinhdanh, boQuaID).Scan(&soLuong); loi != nil {
		return false, loi
	}
	return soLuong > 0, nil
}

func (r *SanPhamRepository) LayAlbumAnh(sanPhamID uint64) ([]AnhSanPham, error) {
	rows, loi := r.db.Query(`
		SELECT 
			id,
			duongdan,
			anhchinh,
			thutu
		FROM anhsanpham
		WHERE sanpham_id = ?
		AND deleted_at IS NULL
		ORDER BY anhchinh DESC, thutu ASC, id ASC
	`, sanPhamID)

	if loi != nil {
		return nil, loi
	}
	defer rows.Close()

	danhSach := []AnhSanPham{}

	for rows.Next() {
		var item AnhSanPham
		var anhChinh int

		loi := rows.Scan(
			&item.ID,
			&item.DuongDan,
			&anhChinh,
			&item.ThuTu,
		)

		if loi != nil {
			return nil, loi
		}

		item.AnhChinh = anhChinh == 1
		danhSach = append(danhSach, item)
	}

	return danhSach, nil
}