package danhmuc

import (
	"fmt"
	"mime/multipart"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
	"time"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type DanhMucHandler struct {
	service *DanhMucService
}

func TaoDanhMucHandler(service *DanhMucService) *DanhMucHandler {
	return &DanhMucHandler{
		service: service,
	}
}

func (h *DanhMucHandler) DanhSach(c *gin.Context) {
	timkiem := c.Query("timkiem")
	trangthai := c.Query("trangthai")
	danhmucchaID := c.Query("danhmuccha_id")
	hienthixoa := c.Query("hienthixoa") == "1" || c.Query("hienthixoa") == "true"

	trang, _ := strconv.Atoi(c.DefaultQuery("trang", "1"))
	gioihan, _ := strconv.Atoi(c.DefaultQuery("gioihan", "10"))

	duLieu, loi := h.service.DanhSach(timkiem, trangthai, danhmucchaID, hienthixoa, trang, gioihan)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy danh sách danh mục thành công", duLieu)
}

func (h *DanhMucHandler) ChiTiet(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	duLieu, loi := h.service.ChiTiet(id)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusNotFound, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy chi tiết danh mục thành công", duLieu)
}

func (h *DanhMucHandler) Tao(c *gin.Context) {
	var request TaoDanhMucRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu danh mục không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.Tao(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusCreated, "Thêm danh mục thành công", duLieu)
}

func (h *DanhMucHandler) CapNhat(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	var request CapNhatDanhMucRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu danh mục không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.CapNhat(id, request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật danh mục thành công", duLieu)
}

func (h *DanhMucHandler) Xoa(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	if loi := h.service.Xoa(id); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Xóa danh mục thành công", gin.H{
		"id": id,
	})
}

func (h *DanhMucHandler) KhoiPhuc(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	duLieu, loi := h.service.KhoiPhuc(id)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Khôi phục danh mục thành công", duLieu)
}

func (h *DanhMucHandler) XoaVinhVien(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	if loi := h.service.XoaVinhVien(id); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Xóa vĩnh viễn danh mục thành công", gin.H{
		"id": id,
	})
}

func (h *DanhMucHandler) CapNhatTrangThai(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	var request CapNhatTrangThaiRequest

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

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật trạng thái danh mục thành công", duLieu)
}

func (h *DanhMucHandler) CapNhatThuTu(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	var request CapNhatThuTuRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu thứ tự không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.CapNhatThuTu(id, request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật thứ tự danh mục thành công", duLieu)
}

func (h *DanhMucHandler) BulkCapNhatTrangThai(c *gin.Context) {
	var request BulkCapNhatTrangThaiRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu bulk trạng thái không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.BulkCapNhatTrangThai(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật trạng thái hàng loạt thành công", duLieu)
}

func (h *DanhMucHandler) BulkXoa(c *gin.Context) {
	var request BulkXoaDanhMucRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu bulk xóa không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.BulkXoa(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Xóa danh mục hàng loạt thành công", duLieu)
}

func (h *DanhMucHandler) UploadAnh(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id danh mục không hợp lệ", nil)
		return
	}

	file, loi := c.FormFile("hinhanh")
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Vui lòng chọn ảnh danh mục", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duongDanPublic, ok := h.luuFileAnh(c, id, file)
	if !ok {
		return
	}

	duLieu, loi := h.service.CapNhatHinhAnh(id, duongDanPublic)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Upload ảnh danh mục thành công", duLieu)
}

func (h *DanhMucHandler) luuFileAnh(c *gin.Context, id uint64, file *multipart.FileHeader) (string, bool) {
	if file.Size > 3*1024*1024 {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Ảnh danh mục không được vượt quá 3MB", nil)
		return "", false
	}

	duoiFile := strings.ToLower(filepath.Ext(file.Filename))
	duoiHopLe := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	if !duoiHopLe[duoiFile] {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Ảnh danh mục chỉ hỗ trợ jpg, jpeg, png, webp", nil)
		return "", false
	}

	thuMucLuu := "./public/uploads/danhmuc"
	if loi := os.MkdirAll(thuMucLuu, os.ModePerm); loi != nil {
		phanhoi.ThatBai(c, http.StatusInternalServerError, "Không tạo được thư mục lưu ảnh", gin.H{
			"chitiet": loi.Error(),
		})
		return "", false
	}

	tenFile := fmt.Sprintf("danhmuc-%d-%d%s", id, time.Now().UnixNano(), duoiFile)
	duongDanLuu := filepath.Join(thuMucLuu, tenFile)

	if loi := c.SaveUploadedFile(file, duongDanLuu); loi != nil {
		phanhoi.ThatBai(c, http.StatusInternalServerError, "Không lưu được ảnh danh mục", gin.H{
			"chitiet": loi.Error(),
		})
		return "", false
	}

	return "/uploads/danhmuc/" + tenFile, true
}
