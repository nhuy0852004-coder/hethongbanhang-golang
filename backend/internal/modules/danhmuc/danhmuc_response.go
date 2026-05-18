package danhmuc

type DanhMucResponse struct {
	ID            uint64  `json:"id"`
	TenDanhMuc    string  `json:"tendanhmuc"`
	DuongDan      string  `json:"duongdan"`
	MoTa          string  `json:"mota"`
	HinhAnh       string  `json:"hinhanh"`
	DanhMucChaID  *uint64 `json:"danhmuccha_id"`
	TenDanhMucCha string  `json:"tendanhmuccha"`
	ThuTu         int     `json:"thutu"`
	TrangThai     string  `json:"trangthai"`
	SoSanPham     int     `json:"sosanpham"`
	SoDanhMucCon  int     `json:"sodanhmuccon"`
}

func ChuyenSangResponse(item *DanhMuc) *DanhMucResponse {
	if item == nil {
		return nil
	}

	return &DanhMucResponse{
		ID:            item.ID,
		TenDanhMuc:    item.TenDanhMuc,
		DuongDan:      item.DuongDan,
		MoTa:          item.MoTa,
		HinhAnh:       item.HinhAnh,
		DanhMucChaID:  item.DanhMucChaID,
		TenDanhMucCha: item.TenDanhMucCha,
		ThuTu:         item.ThuTu,
		TrangThai:     item.TrangThai,
		SoSanPham:     item.SoSanPham,
		SoDanhMucCon:  item.SoDanhMucCon,
	}
}
