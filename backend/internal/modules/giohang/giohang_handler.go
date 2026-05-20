package giohang

import (
	"net/http"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type GioHangHandler struct {
	service *GioHangService
}

func TaoGioHangHandler(service *GioHangService) *GioHangHandler {
	return &GioHangHandler{
		service: service,
	}
}

func (h *GioHangHandler) KiemTra(c *gin.Context) {
	var request KiemTraGioHangRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu giỏ hàng không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.KiemTra(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Kiểm tra giỏ hàng thành công", duLieu)
}