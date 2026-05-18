package trunggian

import (
	"net/http"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

func ChiQuanTri() gin.HandlerFunc {
	return func(c *gin.Context) {
		vaitroRaw, tonTai := c.Get("vaitro")

		if !tonTai {
			phanhoi.ThatBai(c, http.StatusForbidden, "Không xác định được quyền tài khoản", nil)
			c.Abort()
			return
		}

		vaitro, ok := vaitroRaw.(string)
		if !ok {
			phanhoi.ThatBai(c, http.StatusForbidden, "Quyền tài khoản không hợp lệ", nil)
			c.Abort()
			return
		}

		if vaitro != "quantri" {
			phanhoi.ThatBai(c, http.StatusForbidden, "Bạn không có quyền truy cập chức năng này", nil)
			c.Abort()
			return
		}

		c.Next()
	}
}