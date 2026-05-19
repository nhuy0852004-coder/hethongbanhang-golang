package thoigianthuc

import (
	"net/http"
	"strings"

	"hethongbanhang/backend/internal/baomat"
	"hethongbanhang/backend/internal/phanhoi"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var nangCapKetNoi = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func (t *TrungTamRealtime) XuLyKetNoi(c *gin.Context, jwtBiMat string) {
	kenh := strings.TrimSpace(c.Query("kenh"))

	if kenh != "admin" && kenh != "donhang" {
		phanhoi.ThatBai(c, http.StatusBadRequest, "Kênh realtime không hợp lệ", nil)
		return
	}

	madonhang := ""

	if kenh == "admin" {
		token := strings.TrimSpace(c.Query("token"))

		if token == "" {
			phanhoi.ThatBai(c, http.StatusUnauthorized, "Thiếu token admin khi kết nối realtime", nil)
			return
		}

		thongTinToken, loi := baomat.DocToken(token, jwtBiMat)
		if loi != nil {
			phanhoi.ThatBai(c, http.StatusUnauthorized, "Token realtime không hợp lệ", nil)
			return
		}

		if thongTinToken.VaiTro != "quantri" {
			phanhoi.ThatBai(c, http.StatusForbidden, "Bạn không có quyền kết nối kênh admin realtime", nil)
			return
		}
	}

	if kenh == "donhang" {
		madonhang = strings.TrimSpace(c.Query("madonhang"))

		if madonhang == "" {
			phanhoi.ThatBai(c, http.StatusBadRequest, "Thiếu mã đơn hàng cần theo dõi", nil)
			return
		}
	}

	ketnoi, loi := nangCapKetNoi.Upgrade(c.Writer, c.Request, nil)
	if loi != nil {
		return
	}

	khach := &KhachKetNoi{
		trungtam:  t,
		ketnoi:   ketnoi,
		gui:      make(chan []byte, 256),
		kenh:     kenh,
		madonhang: madonhang,
	}

	t.DangKy(khach)

	khach.gui <- t.taoTinNhan("ket_noi_thanh_cong", gin.H{
		"kenh":      kenh,
		"madonhang": madonhang,
	})

	go khach.GhiTinNhan()
	go khach.DocTinNhan()
}