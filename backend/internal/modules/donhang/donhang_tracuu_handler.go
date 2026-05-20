package donhang

import (
	"net/http"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

func (h *DonHangHandler) TraCuu(c *gin.Context) {
	request := TraCuuDonHangRequest{
		MaDonHang:   c.Query("madonhang"),
		SoDienThoai: c.Query("sodienthoai"),
	}

	duLieu, loi := h.service.TraCuu(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Tra cứu đơn hàng thành công", duLieu)
}