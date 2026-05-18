package cosodulieu

import (
    "database/sql"
    "fmt"
    "time"

    "hethongbanhang/backend/internal/caidat"

    _ "github.com/go-sql-driver/mysql"
)

func KetNoi(cauhinh caidat.CauHinh) (*sql.DB, error) {
    chuoiKetNoi := fmt.Sprintf(
        "%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=True&loc=Asia%%2FHo_Chi_Minh",
        cauhinh.DBUser,
        cauhinh.DBPass,
        cauhinh.DBHost,
        cauhinh.DBPort,
        cauhinh.DBName,
    )

    db, loi := sql.Open("mysql", chuoiKetNoi)
    if loi != nil {
        return nil, loi
    }

    db.SetMaxOpenConns(20)
    db.SetMaxIdleConns(10)
    db.SetConnMaxLifetime(30 * time.Minute)

    if loi = db.Ping(); loi != nil {
        return nil, loi
    }

    return db, nil
}
