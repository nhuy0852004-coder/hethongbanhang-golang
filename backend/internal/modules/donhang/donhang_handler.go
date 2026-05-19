package donhang

import (
	"net/http"
	"strconv"

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

func (h *DonHangHandler) DanhSach(c *gin.Context) {
	timkiem := c.Query("timkiem")
	trangthai := c.Query("trangthai")
	tungay := c.Query("tungay")
	denngay := c.Query("denngay")

	trang, _ := strconv.Atoi(c.DefaultQuery("trang", "1"))
	gioihan, _ := strconv.Atoi(c.DefaultQuery("gioihan", "10"))

	duLieu, loi := h.service.DanhSach(timkiem, trangthai, tungay, denngay, trang, gioihan)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy danh sách đơn hàng thành công", duLieu)
}

func (h *DonHangHandler) ChiTiet(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id đơn hàng không hợp lệ", nil)
		return
	}

	duLieu, loi := h.service.ChiTiet(id)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusNotFound, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy chi tiết đơn hàng thành công", duLieu)
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

func (h *DonHangHandler) CapNhatTrangThai(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id đơn hàng không hợp lệ", nil)
		return
	}

	var request CapNhatTrangThaiDonHangRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu trạng thái không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.CapNhatTrangThai(id, request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật trạng thái đơn hàng thành công", duLieu)
}

func (h *DonHangHandler) Xoa(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id đơn hàng không hợp lệ", nil)
		return
	}

	if loi := h.service.Xoa(id); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Xóa đơn hàng thành công", gin.H{
		"id": id,
	})
}