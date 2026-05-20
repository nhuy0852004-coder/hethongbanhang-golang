package caidat

import (
	"database/sql"
	"errors"
)

type CaiDatRepository struct {
	db *sql.DB
}

func TaoCaiDatRepository(db *sql.DB) *CaiDatRepository {
	return &CaiDatRepository{
		db: db,
	}
}

func (r *CaiDatRepository) LayCaiDat() (*CaiDatCuaHang, error) {
	var item CaiDatCuaHang

	loi := r.db.QueryRow(`
		SELECT
			id,
			tencuahang,
			COALESCE(logo, '') AS logo,
			COALESCE(sodienthoai, '') AS sodienthoai,
			COALESCE(email, '') AS email,
			COALESCE(diachi, '') AS diachi,
			COALESCE(chinhsachvanchuyen, '') AS chinhsachvanchuyen,
			COALESCE(chinhsachdoitra, '') AS chinhsachdoitra
		FROM caidatcuahang
		ORDER BY id ASC
		LIMIT 1
	`).Scan(
		&item.ID,
		&item.TenCuaHang,
		&item.Logo,
		&item.SoDienThoai,
		&item.Email,
		&item.DiaChi,
		&item.ChinhSachVanChuyen,
		&item.ChinhSachDoiTra,
	)

	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			_, loiThem := r.db.Exec(`
				INSERT INTO caidatcuahang (
					tencuahang,
					sodienthoai,
					email,
					diachi,
					chinhsachvanchuyen,
					chinhsachdoitra
				)
				VALUES (?, ?, ?, ?, ?, ?)
			`,
				"Cửa hàng của tôi",
				"0901234567",
				"cuahang@example.com",
				"Việt Nam",
				"Giao hàng toàn quốc.",
				"Đổi trả trong 7 ngày nếu sản phẩm lỗi.",
			)

			if loiThem != nil {
				return nil, loiThem
			}

			return r.LayCaiDat()
		}

		return nil, loi
	}

	return &item, nil
}

func (r *CaiDatRepository) CapNhat(request CapNhatCaiDatRequest) (*CaiDatCuaHang, error) {
	caiDatHienTai, loi := r.LayCaiDat()
	if loi != nil {
		return nil, loi
	}

	_, loi = r.db.Exec(`
		UPDATE caidatcuahang
		SET
			tencuahang = ?,
			sodienthoai = ?,
			email = ?,
			diachi = ?,
			chinhsachvanchuyen = ?,
			chinhsachdoitra = ?
		WHERE id = ?
	`,
		request.TenCuaHang,
		request.SoDienThoai,
		request.Email,
		request.DiaChi,
		request.ChinhSachVanChuyen,
		request.ChinhSachDoiTra,
		caiDatHienTai.ID,
	)

	if loi != nil {
		return nil, loi
	}

	return r.LayCaiDat()
}

func (r *CaiDatRepository) CapNhatLogo(duongdan string) (*CaiDatCuaHang, error) {
	caiDatHienTai, loi := r.LayCaiDat()
	if loi != nil {
		return nil, loi
	}

	_, loi = r.db.Exec(`
		UPDATE caidatcuahang
		SET logo = ?
		WHERE id = ?
	`, duongdan, caiDatHienTai.ID)

	if loi != nil {
		return nil, loi
	}

	return r.LayCaiDat()
}