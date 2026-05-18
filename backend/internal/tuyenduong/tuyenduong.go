package tuyenduong

import (
	"database/sql"
	"net/http"
	"time"

	"hethongbanhang/backend/internal/caidat"
	"hethongbanhang/backend/internal/modules/taikhoan"
	"hethongbanhang/backend/internal/phanhoi"
	"hethongbanhang/backend/internal/trunggian"

	"github.com/gin-gonic/gin"
)

func DangKy(r *gin.Engine, db *sql.DB, cauhinh caidat.CauHinh) {
	api := r.Group("/api")

	api.GET("/kiemtra", func(c *gin.Context) {
		if loi := db.Ping(); loi != nil {
			phanhoi.ThatBai(c, http.StatusInternalServerError, "Không kết nối được cơ sở dữ liệu", gin.H{
				"chitiet": loi.Error(),
			})
			return
		}

		phanhoi.ThanhCong(c, http.StatusOK, "Backend Golang đã chạy và kết nối MySQL thành công", gin.H{
			"ungdung":    "Hệ thống bán hàng",
			"cosodulieu": "hethongbanhang",
			"thoigian":   time.Now().Format("02/01/2006 15:04:05"),
		})
	})

	taikhoanRepository := taikhoan.TaoTaiKhoanRepository(db)
	taikhoanService := taikhoan.TaoTaiKhoanService(taikhoanRepository, cauhinh.JWTBiMat)
	taikhoanHandler := taikhoan.TaoTaiKhoanHandler(taikhoanService)

	api.POST("/dangnhap", taikhoanHandler.DangNhap)

	nhomDaDangNhap := api.Group("")
	nhomDaDangNhap.Use(trunggian.KiemTraJWT(cauhinh.JWTBiMat))
	{
		nhomDaDangNhap.POST("/dangxuat", taikhoanHandler.DangXuat)
		nhomDaDangNhap.GET("/thong-tin-tai-khoan", taikhoanHandler.ThongTinTaiKhoan)
	}

	nhomQuanTri := api.Group("/admin")
	nhomQuanTri.Use(trunggian.KiemTraJWT(cauhinh.JWTBiMat))
	nhomQuanTri.Use(trunggian.ChiQuanTri())
	{
		nhomQuanTri.GET("/kiemtra", func(c *gin.Context) {
			phanhoi.ThanhCong(c, http.StatusOK, "Bạn có quyền quản trị", gin.H{
				"vaitro": "quantri",
			})
		})
	}
}