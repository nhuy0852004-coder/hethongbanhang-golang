package main

import (
    "log"

    "hethongbanhang/backend/internal/caidat"
    "hethongbanhang/backend/internal/cosodulieu"
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

    r := gin.Default()

    r.Use(truycap.ChoPhepTruyCap(cauhinh.URLFrontend))

    r.Static("/uploads", "./public/uploads")

    tuyenduong.DangKy(r, db)

    log.Println("Backend đang chạy tại cổng:", cauhinh.CongChay)
    log.Println("API kiểm tra: http://localhost:" + cauhinh.CongChay + "/api/kiemtra")

    if loi := r.Run(":" + cauhinh.CongChay); loi != nil {
        log.Fatal("Không thể chạy backend: ", loi)
    }
}
