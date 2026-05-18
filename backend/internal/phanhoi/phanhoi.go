package phanhoi

import "github.com/gin-gonic/gin"

type CauTrucPhanHoi struct {
    ThanhCong bool        `json:"thanhcong"`
    ThongBao  string      `json:"thongbao"`
    DuLieu    interface{} `json:"dulieu,omitempty"`
    Loi       interface{} `json:"loi,omitempty"`
}

func ThanhCong(c *gin.Context, maTrangThai int, thongbao string, dulieu interface{}) {
    c.JSON(maTrangThai, CauTrucPhanHoi{
        ThanhCong: true,
        ThongBao:  thongbao,
        DuLieu:    dulieu,
    })
}

func ThatBai(c *gin.Context, maTrangThai int, thongbao string, loi interface{}) {
    c.JSON(maTrangThai, CauTrucPhanHoi{
        ThanhCong: false,
        ThongBao:  thongbao,
        Loi:       loi,
    })
}
