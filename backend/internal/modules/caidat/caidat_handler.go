package caidat

import (
	"fmt"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type CaiDatHandler struct {
	service *CaiDatService
}

func TaoCaiDatHandler(service *CaiDatService) *CaiDatHandler {
	return &CaiDatHandler{
		service: service,
	}
}

func (h *CaiDatHandler) LayCaiDat(c *gin.Context) {
	duLieu, loi := h.service.LayCaiDat()
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy cài đặt cửa hàng thành công", duLieu)
}

func (h *CaiDatHandler) CapNhat(c *gin.Context) {
	var request CapNhatCaiDatRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu cài đặt không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.CapNhat(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật cài đặt cửa hàng thành công", duLieu)
}

func (h *CaiDatHandler) UploadLogo(c *gin.Context) {
	file, loi := c.FormFile("logo")
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Vui lòng chọn logo cửa hàng", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	if file.Size > 3*1024*1024 {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Logo không được vượt quá 3MB", nil)
		return
	}

	duoiFile := strings.ToLower(filepath.Ext(file.Filename))
	duoiHopLe := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	if !duoiHopLe[duoiFile] {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Logo chỉ hỗ trợ jpg, jpeg, png, webp", nil)
		return
	}

	thuMucLuu := "./public/uploads/logo"

	if loi := os.MkdirAll(thuMucLuu, os.ModePerm); loi != nil {
		phanhoi.ThatBai(c, http.StatusInternalServerError, "Không tạo được thư mục lưu logo", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	tenFile := fmt.Sprintf("logo-%d%s", time.Now().UnixNano(), duoiFile)
	duongDanLuu := filepath.Join(thuMucLuu, tenFile)

	if loi := c.SaveUploadedFile(file, duongDanLuu); loi != nil {
		phanhoi.ThatBai(c, http.StatusInternalServerError, "Không lưu được logo", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duongDanPublic := "/uploads/logo/" + tenFile

	duLieu, loi := h.service.CapNhatLogo(duongDanPublic)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Upload logo cửa hàng thành công", duLieu)
}