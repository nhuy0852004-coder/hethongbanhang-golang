package baocao

import (
	"net/http"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type BaoCaoHandler struct {
	service *BaoCaoService
}

func TaoBaoCaoHandler(service *BaoCaoService) *BaoCaoHandler {
	return &BaoCaoHandler{
		service: service,
	}
}

func (h *BaoCaoHandler) DoanhThu(c *gin.Context) {
	tungay := c.Query("tungay")
	denngay := c.Query("denngay")

	duLieu, loi := h.service.DoanhThu(tungay, denngay)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy báo cáo doanh thu thành công", duLieu)
}

func (h *BaoCaoHandler) TopSanPham(c *gin.Context) {
	tungay := c.Query("tungay")
	denngay := c.Query("denngay")

	duLieu, loi := h.service.TopSanPham(tungay, denngay)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy top sản phẩm bán chạy thành công", duLieu)
}

func (h *BaoCaoHandler) DonHang(c *gin.Context) {
	tungay := c.Query("tungay")
	denngay := c.Query("denngay")

	duLieu, loi := h.service.DonHang(tungay, denngay)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy thống kê đơn hàng thành công", duLieu)
}