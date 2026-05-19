package tongquan

import (
	"net/http"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type TongQuanHandler struct {
	service *TongQuanService
}

func TaoTongQuanHandler(service *TongQuanService) *TongQuanHandler {
	return &TongQuanHandler{
		service: service,
	}
}

func (h *TongQuanHandler) LayTongQuan(c *gin.Context) {
	duLieu, loi := h.service.LayTongQuan()
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy dữ liệu tổng quan thành công", duLieu)
}