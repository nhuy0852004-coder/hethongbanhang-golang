package main

import (
	"log"
	"os"
	"path/filepath"

	"hethongbanhang/backend/internal/caidat"
	"hethongbanhang/backend/internal/cosodulieu"
	"hethongbanhang/backend/internal/modules/taikhoan"
	"hethongbanhang/backend/internal/thoigianthuc"
	"hethongbanhang/backend/internal/truycap"
	"hethongbanhang/backend/internal/tuyenduong"

	"github.com/gin-gonic/gin"
)
func main() {
	cauhinh := caidat.LayCauHinh()

	if cauhinh.CheDo == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	db, loi := cosodulieu.KetNoi(cauhinh)
	if loi != nil {
		log.Fatal("Không thể kết nối MySQL: ", loi)
	}
	defer db.Close()

	taikhoan.TaoTaiKhoanQuanTriMacDinh(db)

	realtime := thoigianthuc.TaoTrungTamRealtime()

	r := gin.Default()

	// Allow larger multipart forms for uploading multiple images (default 32MB).
	r.MaxMultipartMemory = 100 << 20 // 100 MB

	r.Use(truycap.ChoPhepTruyCap(cauhinh.URLFrontend))

	// Serve uploads using absolute path to avoid wrong working-dir issues.
	cwd, _ := os.Getwd()
	uploadsPath := filepath.Join(cwd, "public", "uploads")
	log.Println("Serving uploads from:", uploadsPath)
	r.Static("/uploads", uploadsPath)

	tuyenduong.DangKy(r, db, cauhinh, realtime)

	log.Println("Backend đang chạy tại cổng:", cauhinh.CongChay)
	log.Println("API kiểm tra: http://localhost:" + cauhinh.CongChay + "/api/kiemtra")
	log.Println("WebSocket realtime: ws://localhost:" + cauhinh.CongChay + "/ws")

	if loi := r.Run(":" + cauhinh.CongChay); loi != nil {
		log.Fatal("Không thể chạy backend: ", loi)
	}
}