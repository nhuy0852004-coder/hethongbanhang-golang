package danhmuc

import (
	"errors"
	"strings"
)

type TaoDanhMucRequest struct {
	TenDanhMuc   string  `json:"tendanhmuc"`
	MoTa         string  `json:"mota"`
	ThuTu        int     `json:"thutu"`
	TrangThai    string  `json:"trangthai"`
	DanhMucChaID *uint64 `json:"danhmuccha_id"`
}

func (r TaoDanhMucRequest) KiemTra() error {
	if r.TenDanhMuc == "" {
		return errors.New("tên danh mục không được để trống")
	}

	if r.TrangThai != "hien_thi" && r.TrangThai != "an" {
		return errors.New("trạng thái không hợp lệ")
	}

	if r.ThuTu < 0 {
		return errors.New("thứ tự không hợp lệ")
	}

	return nil
}

type CapNhatDanhMucRequest struct {
	TenDanhMuc   string  `json:"tendanhmuc"`
	MoTa         string  `json:"mota"`
	ThuTu        int     `json:"thutu"`
	TrangThai    string  `json:"trangthai"`
	DanhMucChaID *uint64 `json:"danhmuccha_id"`
}

func (r CapNhatDanhMucRequest) KiemTra() error {
	if r.TenDanhMuc == "" {
		return errors.New("tên danh mục không được để trống")
	}

	if r.TrangThai != "hien_thi" && r.TrangThai != "an" {
		return errors.New("trạng thái không hợp lệ")
	}

	if r.ThuTu < 0 {
		return errors.New("thứ tự không hợp lệ")
	}

	return nil
}

type CapNhatTrangThaiRequest struct {
	TrangThai string `json:"trangthai"`
}

func (r CapNhatTrangThaiRequest) KiemTra() error {
	if r.TrangThai != "hien_thi" && r.TrangThai != "an" {
		return errors.New("trạng thái không hợp lệ")
	}
	return nil
}

type PhanTrangResponse struct {
	Trang       int   `json:"trang"`
	GioiHan     int   `json:"gioihan"`
	TongSoDong  int64 `json:"tongsodong"`
	TongSoTrang int   `json:"tongsotrang"`
}

type DanhSachDanhMucResponse struct {
	DanhSach  []DanhMuc         `json:"danhsach"`
	PhanTrang PhanTrangResponse `json:"phantrang"`
}

type BulkCapNhatTrangThaiRequest struct {
	IDs       []uint64 `json:"ids"`
	TrangThai string   `json:"trangthai"`
}

type BulkXoaDanhMucRequest struct {
	IDs []uint64 `json:"ids"`
}

func (r *BulkCapNhatTrangThaiRequest) KiemTra() error {
	if len(r.IDs) == 0 {
		return errors.New("vui lòng chọn ít nhất một danh mục")
	}

	r.TrangThai = strings.TrimSpace(r.TrangThai)

	if r.TrangThai != "hien_thi" && r.TrangThai != "an" {
		return errors.New("trạng thái danh mục không hợp lệ")
	}

	for _, id := range r.IDs {
		if id == 0 {
			return errors.New("id danh mục không hợp lệ")
		}
	}

	return nil
}

func (r *BulkXoaDanhMucRequest) KiemTra() error {
	if len(r.IDs) == 0 {
		return errors.New("vui lòng chọn ít nhất một danh mục")
	}

	for _, id := range r.IDs {
		if id == 0 {
			return errors.New("id danh mục không hợp lệ")
		}
	}

	return nil
}
