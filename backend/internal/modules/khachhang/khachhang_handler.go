package khachhang

import (
	"net/http"
	"strconv"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type KhachHangHandler struct {
	service *KhachHangService
}

func TaoKhachHangHandler(service *KhachHangService) *KhachHangHandler {
	return &KhachHangHandler{
		service: service,
	}
}

func (h *KhachHangHandler) DanhSach(c *gin.Context) {
	timkiem := c.Query("timkiem")
	trangthai := c.Query("trangthai")

	trang, _ := strconv.Atoi(c.DefaultQuery("trang", "1"))
	gioihan, _ := strconv.Atoi(c.DefaultQuery("gioihan", "10"))

	duLieu, loi := h.service.DanhSach(timkiem, trangthai, trang, gioihan)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy danh sách khách hàng thành công", duLieu)
}

func (h *KhachHangHandler) ChiTiet(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id khách hàng không hợp lệ", nil)
		return
	}

	duLieu, loi := h.service.ChiTiet(id)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusNotFound, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy chi tiết khách hàng thành công", duLieu)
}

func (h *KhachHangHandler) DonHangCuaKhachHang(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id khách hàng không hợp lệ", nil)
		return
	}

	duLieu, loi := h.service.DonHangCuaKhachHang(id)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy lịch sử đơn hàng của khách hàng thành công", duLieu)
}