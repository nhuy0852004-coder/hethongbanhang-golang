package taikhoan

import (
	"net/http"

	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
)

type TaiKhoanHandler struct {
	service *TaiKhoanService
}

func TaoTaiKhoanHandler(service *TaiKhoanService) *TaiKhoanHandler {
	return &TaiKhoanHandler{
		service: service,
	}
}

func (h *TaiKhoanHandler) DangNhap(c *gin.Context) {
	var request DangNhapRequest

	if loi := c.ShouldBindJSON(&request); loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Dữ liệu đăng nhập không hợp lệ", gin.H{
			"chitiet": loi.Error(),
		})
		return
	}

	duLieu, loi := h.service.DangNhap(request)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Đăng nhập thành công", duLieu)
}

func (h *TaiKhoanHandler) DangXuat(c *gin.Context) {
	phanhoi.ThanhCong(c, http.StatusOK, "Đăng xuất thành công", gin.H{
		"ghichu": "JWT lưu phía frontend, backend không cần xóa token.",
	})
}

func (h *TaiKhoanHandler) ThongTinTaiKhoan(c *gin.Context) {
	nguoidungIDRaw, tonTai := c.Get("nguoidung_id")

	if !tonTai {
		phanhoi.ThatBai(c, http.StatusUnauthorized, "Không xác định được tài khoản đăng nhập", nil)
		return
	}

	nguoidungID, ok := nguoidungIDRaw.(uint64)
	if !ok {
		phanhoi.ThatBai(c, http.StatusUnauthorized, "Thông tin tài khoản không hợp lệ", nil)
		return
	}

	duLieu, loi := h.service.LayThongTinTaiKhoan(nguoidungID)
	if loi != nil {
		phanhoi.ThatBai(c, http.StatusBadRequest, loi.Error(), nil)
		return
	}

	phanhoi.ThanhCong(c, http.StatusOK, "Lấy thông tin tài khoản thành công", duLieu)
}