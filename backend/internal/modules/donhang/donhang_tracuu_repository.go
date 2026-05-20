package donhang

import (
	"database/sql"
	"errors"
	"fmt"
	"strings"
)

func (r *DonHangRepository) TraCuu(request TraCuuDonHangRequest) (*DonHang, error) {
	dieuKien := []string{
		"deleted_at IS NULL",
	}

	thamSo := []interface{}{}

	if strings.TrimSpace(request.MaDonHang) != "" {
		dieuKien = append(dieuKien, "madonhang = ?")
		thamSo = append(thamSo, request.MaDonHang)
	}

	if strings.TrimSpace(request.SoDienThoai) != "" {
		dieuKien = append(dieuKien, "sodienthoai = ?")
		thamSo = append(thamSo, request.SoDienThoai)
	}

	cauLenh := fmt.Sprintf(`
		SELECT id
		FROM donhang
		WHERE %s
		ORDER BY id DESC
		LIMIT 1
	`, strings.Join(dieuKien, " AND "))

	var id uint64

	loi := r.db.QueryRow(cauLenh, thamSo...).Scan(&id)
	if loi != nil {
		if errors.Is(loi, sql.ErrNoRows) {
			return nil, errors.New("không tìm thấy đơn hàng phù hợp")
		}

		return nil, loi
	}

	return r.ChiTiet(id)
}