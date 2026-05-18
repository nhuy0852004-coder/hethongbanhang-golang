package taikhoan

import (
	"database/sql"
	"log"

	"golang.org/x/crypto/bcrypt"
)

func TaoTaiKhoanQuanTriMacDinh(db *sql.DB) {
	var soLuong int

	loi := db.QueryRow("SELECT COUNT(*) FROM nguoidung WHERE email = ?", "admin@cuahang.vn").Scan(&soLuong)
	if loi != nil {
		log.Println("Không kiểm tra được tài khoản admin mặc định:", loi)
		return
	}

	if soLuong > 0 {
		return
	}

	var vaitroID uint64

	loi = db.QueryRow("SELECT id FROM vaitro WHERE tenvaitro = ? LIMIT 1", "quantri").Scan(&vaitroID)
	if loi != nil {
		ketQua, loiThemVaiTro := db.Exec("INSERT INTO vaitro (tenvaitro, mota) VALUES (?, ?)", "quantri", "Quản trị hệ thống")
		if loiThemVaiTro != nil {
			log.Println("Không tạo được vai trò quản trị:", loiThemVaiTro)
			return
		}

		idMoi, _ := ketQua.LastInsertId()
		vaitroID = uint64(idMoi)
	}

	matKhauMaHoa, loi := bcrypt.GenerateFromPassword([]byte("123456"), bcrypt.DefaultCost)
	if loi != nil {
		log.Println("Không mã hóa được mật khẩu admin:", loi)
		return
	}

	_, loi = db.Exec(`
		INSERT INTO nguoidung (hoten, email, matkhau, sodienthoai, vaitro_id, trangthai)
		VALUES (?, ?, ?, ?, ?, ?)
	`,
		"Quản trị viên",
		"admin@cuahang.vn",
		string(matKhauMaHoa),
		"0901234567",
		vaitroID,
		"hoat_dong",
	)

	if loi != nil {
		log.Println("Không tạo được tài khoản admin mặc định:", loi)
		return
	}

	log.Println("Đã tạo tài khoản admin mặc định: admin@cuahang.vn / 123456")
}