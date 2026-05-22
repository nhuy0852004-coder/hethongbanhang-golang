package sanpham

import (
	"fmt"
	"log"
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

type SanPhamHandler struct {
	service *SanPhamService
}

func TaoSanPhamHandler(service *SanPhamService) *SanPhamHandler {
	return &SanPhamHandler{
		service: service,
	}
}

func (h *SanPhamHandler) DanhSach(c *gin.Context) {
	trang, _ := strconv.Atoi(c.DefaultQuery("trang", "1"))
	gioihan, _ := strconv.Atoi(c.DefaultQuery("gioihan", "10"))

	danhmucID, _ := strconv.ParseUint(c.DefaultQuery("danhmuc_id", "0"), 10, 64)
	giatu, _ := strconv.ParseUint(c.DefaultQuery("giatu", "0"), 10, 64)
	giaden, _ := strconv.ParseUint(c.DefaultQuery("giaden", "0"), 10, 64)

	loc := LocSanPhamRequest{
		TimKiem:   c.Query("timkiem"),
		TrangThai: c.Query("trangthai"),
		TonKho:    c.Query("tonkho"),
		SanPham:   c.Query("sanpham"),
		SapXep:    c.DefaultQuery("sapxep", "moi_nhat"),
		DanhMucID: danhmucID,
		GiaTu:     giatu,
		GiaDen:    giaden,
		Trang:     trang,
		GioiHan:   gioihan,
	}

	duLieu, loi := h.service.DanhSach(loc)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy danh sách sản phẩm thành công", duLieu)
}

func (h *SanPhamHandler) ChiTiet(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id sản phẩm không hợp lệ", nil)
		return
	}

	duLieu, loi := h.service.ChiTiet(id)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusNotFound, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy chi tiết sản phẩm thành công", duLieu)
}

func (h *SanPhamHandler) Tao(c *gin.Context) {
	var request TaoSanPhamRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu sản phẩm không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.Tao(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusCreated, "Thêm sản phẩm thành công", duLieu)
}

func (h *SanPhamHandler) CapNhat(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id sản phẩm không hợp lệ", nil)
		return
	}

	var request CapNhatSanPhamRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu sản phẩm không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.CapNhat(id, request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật sản phẩm thành công", duLieu)
}

func (h *SanPhamHandler) Xoa(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id sản phẩm không hợp lệ", nil)
		return
	}

	if loi := h.service.Xoa(id); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Xóa sản phẩm thành công", gin.H{
		"id": id,
	})
}

func (h *SanPhamHandler) CapNhatTrangThai(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id sản phẩm không hợp lệ", nil)
		return
	}

	var request CapNhatTrangThaiSanPhamRequest

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

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật trạng thái sản phẩm thành công", duLieu)
}

func (h *SanPhamHandler) UploadAnh(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id sản phẩm không hợp lệ", nil)
		return
	}

	file, loi := c.FormFile("hinhanh")
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Vui lòng chọn ảnh sản phẩm", gin.H{
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

	phanhoi.ThanhCong(c, http.StatusOK, "Upload ảnh sản phẩm thành công", duLieu)
}

func (h *SanPhamHandler) UploadAlbumAnh(c *gin.Context) {
	id, loi := strconv.ParseUint(c.Param("id"), 10, 64)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "id sản phẩm không hợp lệ", nil)
		return
	}

	form, loi := c.MultipartForm()
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu album ảnh không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	files := form.File["album"]
	if len(files) == 0 {
		files = form.File["album[]"]
	}

	if len(files) == 0 {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Vui lòng chọn ít nhất một ảnh album", nil)
		return
	}

	if len(files) > 10 {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Album chỉ được upload tối đa 10 ảnh mỗi lần", nil)
		return
	}

	danhSachDuongDan := []string{}
	for _, file := range files {
		duongDanPublic, ok := h.luuFileAnh(c, id, file)
		if !ok {
			return
		}
		log.Printf("Saved uploaded album file for product %d: %s", id, duongDanPublic)
		danhSachDuongDan = append(danhSachDuongDan, duongDanPublic)
	}

	duLieu, loi := h.service.ThemAlbumAnh(id, danhSachDuongDan)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	log.Printf("Inserted %d album images for product %d", len(danhSachDuongDan), id)
	phanhoi.ThanhCong(c, http.StatusOK, "Upload album ảnh sản phẩm thành công", duLieu)
}

func (h *SanPhamHandler) luuFileAnh(c *gin.Context, id uint64, file any) (string, bool) {
	fileHeader, ok := file.(*multipart.FileHeader)
	if !ok || fileHeader == nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "File ảnh không hợp lệ", nil)
		return "", false
	}

	if fileHeader.Size > 5*1024*1024 {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Ảnh sản phẩm không được vượt quá 5MB", nil)
		return "", false
	}

	duoiFile := strings.ToLower(filepath.Ext(fileHeader.Filename))
	duoiHopLe := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".webp": true,
	}

	if !duoiHopLe[duoiFile] {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Ảnh sản phẩm chỉ hỗ trợ jpg, jpeg, png, webp", nil)
		return "", false
	}

	thuMucLuu := "./public/uploads/sanpham"
	if loi := os.MkdirAll(thuMucLuu, os.ModePerm); loi != nil {
		phanhoi.ThatBai(c, http.StatusInternalServerError, "Không tạo được thư mục lưu ảnh", gin.H{
			"chitiet": loi.Error(),
		})
		return "", false
	}

	tenFile := fmt.Sprintf("sanpham-%d-%d%s", id, time.Now().UnixNano(), duoiFile)
	duongDanLuu := filepath.Join(thuMucLuu, tenFile)

	if loi := c.SaveUploadedFile(fileHeader, duongDanLuu); loi != nil {
		phanhoi.ThatBai(c, http.StatusInternalServerError, "Không lưu được ảnh sản phẩm", gin.H{
			"chitiet": loi.Error(),
		})
		return "", false
	}

	log.Printf("Saved file to %s for product %d", duongDanLuu, id)

	return "/uploads/sanpham/" + tenFile, true
}

func (h *SanPhamHandler) BulkCapNhatTrangThai(c *gin.Context) {
	var request BulkCapNhatTrangThaiSanPhamRequest

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

	phanhoi.ThanhCong(c, http.StatusOK, "Cập nhật trạng thái sản phẩm hàng loạt thành công", duLieu)
}

func (h *SanPhamHandler) BulkXoa(c *gin.Context) {
	var request BulkXoaSanPhamRequest

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

	phanhoi.ThanhCong(c, http.StatusOK, "Xóa sản phẩm hàng loạt thành công", duLieu)
}
