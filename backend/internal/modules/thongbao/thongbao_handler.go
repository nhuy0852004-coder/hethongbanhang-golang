package thongbao

import (
	"net/http"
	"strconv"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type ThongBaoHandler struct {
	service *ThongBaoService
}

func TaoThongBaoHandler(service *ThongBaoService) *ThongBaoHandler {
	return &ThongBaoHandler{
		service: service,
	}
}

func (h *ThongBaoHandler) DanhSach(c *gin.Context) {
	dadoc := c.Query("dadoc")
	loai := c.Query("loai")

	trang, _ := strconv.Atoi(c.DefaultQuery("trang", "1"))
	gioihan, _ := strconv.Atoi(c.DefaultQuery("gioihan", "10"))

	duLieu, loi := h.service.DanhSach(dadoc, loai, trang, gioihan)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy danh sách thông báo thành công", duLieu)
}

func (h *ThongBaoHandler) DemChuaDoc(c *gin.Context) {
	duLieu, loi := h.service.DemChuaDoc()
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy số thông báo chưa đọc thành công", duLieu)
}

func (h *ThongBaoHandler) CapNhatDaDoc(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id thông báo không hợp lệ", nil)
		return
	}

	request := CapNhatDaDocRequest{
		DaDoc: true,
	}

	if c.Request.ContentLength > 0 {
		_ = c.ShouldBindJSON(&request)
	}

	duLieu, loi := h.service.CapNhatDaDoc(id, request.DaDoc)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật trạng thái thông báo thành công", duLieu)
}

func (h *ThongBaoHandler) DanhDauTatCaDaDoc(c *gin.Context) {
	if loi := h.service.DanhDauTatCaDaDoc(); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Đã đánh dấu tất cả thông báo là đã đọc", nil)
}

func (h *ThongBaoHandler) Xoa(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id thông báo không hợp lệ", nil)
		return
	}

	if loi := h.service.Xoa(id); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Xóa thông báo thành công", gin.H{
		"id": id,
	})
}