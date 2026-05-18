package caidat

import (
    "os"

    "github.com/joho/godotenv"
)

type CauHinh struct {
    CongChay    string
    CheDo       string
    DBHost      string
    DBPort      string
    DBUser      string
    DBPass      string
    DBName      string
    JWTBiMat    string
    URLFrontend string
}

func LayCauHinh() CauHinh {
    _ = godotenv.Load()

    return CauHinh{
        CongChay:    layBienMoiTruong("CONG_CHAY", "8080"),
        CheDo:       layBienMoiTruong("CHE_DO", "dev"),
        DBHost:      layBienMoiTruong("DB_HOST", "127.0.0.1"),
        DBPort:      layBienMoiTruong("DB_PORT", "3306"),
        DBUser:      layBienMoiTruong("DB_USER", "root"),
        DBPass:      layBienMoiTruong("DB_PASS", ""),
        DBName:      layBienMoiTruong("DB_NAME", "hethongbanhang"),
        JWTBiMat:    layBienMoiTruong("JWT_BI_MAT", "bi_mat_mac_dinh"),
        URLFrontend: layBienMoiTruong("URL_FRONTEND", "http://localhost:5173"),
    }
}

func layBienMoiTruong(khoa string, macdinh string) string {
    giatri := os.Getenv(khoa)
    if giatri == "" {
        return macdinh
    }
    return giatri
}
