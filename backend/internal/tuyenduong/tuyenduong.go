package tuyenduong

import (
	"database/sql"
	"net/http"
	"time"

	"hethongbanhang/backend/internal/caidat"
	"hethongbanhang/backend/internal/modules/danhmuc"
	"hethongbanhang/backend/internal/modules/sanpham"
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

	danhmucRepository := danhmuc.TaoDanhMucRepository(db)
	danhmucService := danhmuc.TaoDanhMucService(danhmucRepository)
	danhmucHandler := danhmuc.TaoDanhMucHandler(danhmucService)

	sanphamRepository := sanpham.TaoSanPhamRepository(db)
	sanphamService := sanpham.TaoSanPhamService(sanphamRepository)
	sanphamHandler := sanpham.TaoSanPhamHandler(sanphamService)

	api.POST("/dangnhap", taikhoanHandler.DangNhap)

	api.GET("/danhmuc", danhmucHandler.DanhSach)
	api.GET("/danhmuc/:id", danhmucHandler.ChiTiet)

	api.GET("/sanpham", sanphamHandler.DanhSach)
	api.GET("/sanpham/:id", sanphamHandler.ChiTiet)

	nhomDaDangNhap := api.Group("")
	nhomDaDangNhap.Use(trunggian.KiemTraJWT(cauhinh.JWTBiMat))
	{
		nhomDaDangNhap.POST("/dangxuat", taikhoanHandler.DangXuat)
		nhomDaDangNhap.GET("/thong-tin-tai-khoan", taikhoanHandler.ThongTinTaiKhoan)
	}

	nhomQuanTriGoc := api.Group("")
	nhomQuanTriGoc.Use(trunggian.KiemTraJWT(cauhinh.JWTBiMat))
	nhomQuanTriGoc.Use(trunggian.ChiQuanTri())
	{
		nhomQuanTriGoc.POST("/danhmuc", danhmucHandler.Tao)
		nhomQuanTriGoc.PUT("/danhmuc/:id", danhmucHandler.CapNhat)
		nhomQuanTriGoc.DELETE("/danhmuc/:id", danhmucHandler.Xoa)
		nhomQuanTriGoc.PATCH("/danhmuc/:id/trangthai", danhmucHandler.CapNhatTrangThai)

		nhomQuanTriGoc.POST("/sanpham", sanphamHandler.Tao)
		nhomQuanTriGoc.PUT("/sanpham/:id", sanphamHandler.CapNhat)
		nhomQuanTriGoc.DELETE("/sanpham/:id", sanphamHandler.Xoa)
		nhomQuanTriGoc.PATCH("/sanpham/:id/trangthai", sanphamHandler.CapNhatTrangThai)
		nhomQuanTriGoc.POST("/sanpham/:id/upload-anh", sanphamHandler.UploadAnh)
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