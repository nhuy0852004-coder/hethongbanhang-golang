package trunggian

import (
	"net/http"
	"strings"

	"hethongbanhang/backend/internal/baomat"
	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

func KiemTraJWT(biMat string) gin.HandlerFunc {
	return func(c *gin.Context) {
		header := c.GetHeader("Authorization")

		if header == "" {
			phanhoi.ThatBai(c, http.StatusUnauthorized, "Bạn chưa đăng nhập", gin.H{
				"authorization": "Thiếu Authorization header",
			})
			c.Abort()
			return
		}

		if !strings.HasPrefix(header, "Bearer ") {
			phanhoi.ThatBai(c, http.StatusUnauthorized, "Token không đúng định dạng", gin.H{
				"authorization": "Token phải có dạng Bearer <token>",
			})
			c.Abort()
			return
		}

		chuoiToken := strings.TrimPrefix(header, "Bearer ")

		thongTinToken, loi := baomat.DocToken(chuoiToken, biMat)
		if loi != nil {
			phanhoi.ThatBai(c, http.StatusUnauthorized, "Phiên đăng nhập không hợp lệ hoặc đã hết hạn", gin.H{
				"token": loi.Error(),
			})
			c.Abort()
			return
		}

		c.Set("nguoidung_id", thongTinToken.NguoiDungID)
		c.Set("email", thongTinToken.Email)
		c.Set("vaitro", thongTinToken.VaiTro)

		c.Next()
	}
}