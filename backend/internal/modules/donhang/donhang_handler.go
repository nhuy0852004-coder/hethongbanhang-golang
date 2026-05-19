package donhang

import (
	"net/http"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type DonHangHandler struct {
	service *DonHangService
}

func TaoDonHangHandler(service *DonHangService) *DonHangHandler {
	return &DonHangHandler{
		service: service,
	}
}

func (h *DonHangHandler) TaoDonHang(c *gin.Context) {
	var request TaoDonHangRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu đơn hàng không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.TaoDonHang(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusCreated, "Đặt hàng thành công", duLieu)
}