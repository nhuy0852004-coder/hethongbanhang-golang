package tuyenduong

import (
	"database/sql"
	"net/http"
	"time"

	"hethongbanhang/backend/internal/caidat"
	"hethongbanhang/backend/internal/modules/baocao"
	caidatmodule "hethongbanhang/backend/internal/modules/caidat"
	"hethongbanhang/backend/internal/modules/danhmuc"
	"hethongbanhang/backend/internal/modules/donhang"
	"hethongbanhang/backend/internal/modules/giohang"
	"hethongbanhang/backend/internal/modules/khachhang"
	"hethongbanhang/backend/internal/modules/sanpham"
	"hethongbanhang/backend/internal/modules/taikhoan"
	"hethongbanhang/backend/internal/modules/thongbao"
	"hethongbanhang/backend/internal/modules/tongquan"
	"hethongbanhang/backend/internal/phanhoi"
	"hethongbanhang/backend/internal/thoigianthuc"
	"hethongbanhang/backend/internal/trunggian"

	"github.com/gin-gonic/gin"
)

func DangKy(r *gin.Engine, db *sql.DB, cauhinh caidat.CauHinh, realtime *thoigianthuc.TrungTamRealtime) {
	r.GET("/ws", func(c *gin.Context) {
		realtime.XuLyKetNoi(c, cauhinh.JWTBiMat)
	})

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
	

	thongbaoRepository := thongbao.TaoThongBaoRepository(db)
	thongbaoService := thongbao.TaoThongBaoService(thongbaoRepository)
	thongbaoHandler := thongbao.TaoThongBaoHandler(thongbaoService)

	donhangRepository := donhang.TaoDonHangRepository(db)
	donhangService := donhang.TaoDonHangService(donhangRepository, realtime, thongbaoService)
	donhangHandler := donhang.TaoDonHangHandler(donhangService)

	giohangRepository := giohang.TaoGioHangRepository(db)
	giohangService := giohang.TaoGioHangService(giohangRepository)
	giohangHandler := giohang.TaoGioHangHandler(giohangService)

	tongquanRepository := tongquan.TaoTongQuanRepository(db)
	tongquanService := tongquan.TaoTongQuanService(tongquanRepository)
	tongquanHandler := tongquan.TaoTongQuanHandler(tongquanService)

	khachhangRepository := khachhang.TaoKhachHangRepository(db)
	khachhangService := khachhang.TaoKhachHangService(khachhangRepository)
	khachhangHandler := khachhang.TaoKhachHangHandler(khachhangService)

	baocaoRepository := baocao.TaoBaoCaoRepository(db)
	baocaoService := baocao.TaoBaoCaoService(baocaoRepository)
	baocaoHandler := baocao.TaoBaoCaoHandler(baocaoService)

	caidatRepository := caidatmodule.TaoCaiDatRepository(db)
	caidatService := caidatmodule.TaoCaiDatService(caidatRepository)
	caidatHandler := caidatmodule.TaoCaiDatHandler(caidatService)

	api.POST("/dangnhap", taikhoanHandler.DangNhap)

	api.GET("/danhmuc", danhmucHandler.DanhSach)
	api.GET("/danhmuc/:id", danhmucHandler.ChiTiet)

	api.GET("/sanpham", sanphamHandler.DanhSach)
	api.GET("/sanpham/:id", sanphamHandler.ChiTiet)

	api.GET("/caidat", caidatHandler.LayCaiDat)

	api.POST("/giohang/kiemtra", giohangHandler.KiemTra)

	api.POST("/donhang", donhangHandler.TaoDonHang)
	api.GET("/donhang/tracuu", donhangHandler.TraCuu)

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
		nhomQuanTriGoc.GET("/tongquan", tongquanHandler.LayTongQuan)

		nhomQuanTriGoc.GET("/baocao/doanhthu", baocaoHandler.DoanhThu)
		nhomQuanTriGoc.GET("/baocao/top-sanpham", baocaoHandler.TopSanPham)
		nhomQuanTriGoc.GET("/baocao/donhang", baocaoHandler.DonHang)

		nhomQuanTriGoc.PUT("/caidat", caidatHandler.CapNhat)
		nhomQuanTriGoc.POST("/caidat/upload-logo", caidatHandler.UploadLogo)

		nhomQuanTriGoc.PATCH("/danhmuc/bulk-trangthai", danhmucHandler.BulkCapNhatTrangThai)
		nhomQuanTriGoc.POST("/danhmuc/bulk-xoa", danhmucHandler.BulkXoa)

		nhomQuanTriGoc.POST("/danhmuc", danhmucHandler.Tao)
		nhomQuanTriGoc.PUT("/danhmuc/:id", danhmucHandler.CapNhat)
		nhomQuanTriGoc.DELETE("/danhmuc/:id", danhmucHandler.Xoa)
		nhomQuanTriGoc.PATCH("/danhmuc/:id/trangthai", danhmucHandler.CapNhatTrangThai)

		nhomQuanTriGoc.POST("/sanpham", sanphamHandler.Tao)
		nhomQuanTriGoc.PATCH("/sanpham/bulk-trangthai", sanphamHandler.BulkCapNhatTrangThai)
		nhomQuanTriGoc.POST("/sanpham/bulk-xoa", sanphamHandler.BulkXoa)
		nhomQuanTriGoc.PUT("/sanpham/:id", sanphamHandler.CapNhat)
		nhomQuanTriGoc.DELETE("/sanpham/:id", sanphamHandler.Xoa)
		nhomQuanTriGoc.PATCH("/sanpham/:id/trangthai", sanphamHandler.CapNhatTrangThai)
		nhomQuanTriGoc.POST("/sanpham/:id/upload-anh", sanphamHandler.UploadAnh)
		nhomQuanTriGoc.POST("/sanpham/:id/upload-album", sanphamHandler.UploadAlbumAnh)

		nhomQuanTriGoc.GET("/donhang", donhangHandler.DanhSach)
		nhomQuanTriGoc.GET("/donhang/:id", donhangHandler.ChiTiet)
		nhomQuanTriGoc.PATCH("/donhang/:id/trangthai", donhangHandler.CapNhatTrangThai)
		nhomQuanTriGoc.DELETE("/donhang/:id", donhangHandler.Xoa)

		nhomQuanTriGoc.GET("/khachhang", khachhangHandler.DanhSach)
		nhomQuanTriGoc.GET("/khachhang/:id", khachhangHandler.ChiTiet)
		nhomQuanTriGoc.GET("/khachhang/:id/donhang", khachhangHandler.DonHangCuaKhachHang)

		nhomQuanTriGoc.GET("/thongbao", thongbaoHandler.DanhSach)
		nhomQuanTriGoc.GET("/thongbao/dem-chua-doc", thongbaoHandler.DemChuaDoc)
		nhomQuanTriGoc.PATCH("/thongbao/:id/dadoc", thongbaoHandler.CapNhatDaDoc)
		nhomQuanTriGoc.PATCH("/thongbao/danh-dau-tat-ca", thongbaoHandler.DanhDauTatCaDaDoc)
		nhomQuanTriGoc.DELETE("/thongbao/:id", thongbaoHandler.Xoa)
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
