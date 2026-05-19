package thoigianthuc

import (
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type TinNhanRealtime struct {
	SuKien  string      `json:"sukien"`
	DuLieu  interface{} `json:"dulieu"`
	ThoiGian string     `json:"thoigian"`
}

type KhachKetNoi struct {
	trungtam  *TrungTamRealtime
	ketnoi   *websocket.Conn
	gui      chan []byte
	kenh     string
	madonhang string
}

type TrungTamRealtime struct {
	mu          sync.RWMutex
	admin       map[*KhachKetNoi]bool
	theodonhang map[string]map[*KhachKetNoi]bool
}

func TaoTrungTamRealtime() *TrungTamRealtime {
	return &TrungTamRealtime{
		admin:       make(map[*KhachKetNoi]bool),
		theodonhang: make(map[string]map[*KhachKetNoi]bool),
	}
}

func (t *TrungTamRealtime) DangKy(khach *KhachKetNoi) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if khach.kenh == "admin" {
		t.admin[khach] = true
		log.Println("Admin đã kết nối WebSocket")
		return
	}

	if khach.kenh == "donhang" {
		if t.theodonhang[khach.madonhang] == nil {
			t.theodonhang[khach.madonhang] = make(map[*KhachKetNoi]bool)
		}

		t.theodonhang[khach.madonhang][khach] = true
		log.Println("Khách đang theo dõi đơn hàng:", khach.madonhang)
	}
}

func (t *TrungTamRealtime) HuyDangKy(khach *KhachKetNoi) {
	t.mu.Lock()
	defer t.mu.Unlock()

	if khach.kenh == "admin" {
		if _, tonTai := t.admin[khach]; tonTai {
			delete(t.admin, khach)
			close(khach.gui)
			log.Println("Admin đã ngắt WebSocket")
		}

		return
	}

	if khach.kenh == "donhang" {
		if danhSach, tonTai := t.theodonhang[khach.madonhang]; tonTai {
			if _, coKhach := danhSach[khach]; coKhach {
				delete(danhSach, khach)
				close(khach.gui)
			}

			if len(danhSach) == 0 {
				delete(t.theodonhang, khach.madonhang)
			}

			log.Println("Khách ngắt theo dõi đơn hàng:", khach.madonhang)
		}
	}
}

func (t *TrungTamRealtime) GuiChoAdmin(sukien string, dulieu interface{}) {
	tinNhan := t.taoTinNhan(sukien, dulieu)

	t.mu.RLock()
	defer t.mu.RUnlock()

	for khach := range t.admin {
		t.guiTinNhan(khach, tinNhan)
	}
}

func (t *TrungTamRealtime) GuiTheoDonHang(madonhang string, sukien string, dulieu interface{}) {
	tinNhan := t.taoTinNhan(sukien, dulieu)

	t.mu.RLock()
	defer t.mu.RUnlock()

	danhSach := t.theodonhang[madonhang]

	for khach := range danhSach {
		t.guiTinNhan(khach, tinNhan)
	}
}

func (t *TrungTamRealtime) taoTinNhan(sukien string, dulieu interface{}) []byte {
	tinNhan := TinNhanRealtime{
		SuKien:  sukien,
		DuLieu:  dulieu,
		ThoiGian: time.Now().Format("02/01/2006 15:04:05"),
	}

	duLieuJSON, loi := json.Marshal(tinNhan)
	if loi != nil {
		log.Println("Không mã hóa được tin nhắn realtime:", loi)
		return []byte(`{"sukien":"loi","dulieu":{"thongbao":"Không mã hóa được dữ liệu realtime"}}`)
	}

	return duLieuJSON
}

func (t *TrungTamRealtime) guiTinNhan(khach *KhachKetNoi, tinNhan []byte) {
	select {
	case khach.gui <- tinNhan:
	default:
		go t.HuyDangKy(khach)
	}
}

func (k *KhachKetNoi) DocTinNhan() {
	defer func() {
		k.trungtam.HuyDangKy(k)
		_ = k.ketnoi.Close()
	}()

	k.ketnoi.SetReadLimit(1024)
	_ = k.ketnoi.SetReadDeadline(time.Now().Add(60 * time.Second))

	k.ketnoi.SetPongHandler(func(string) error {
		_ = k.ketnoi.SetReadDeadline(time.Now().Add(60 * time.Second))
		return nil
	})

	for {
		if _, _, loi := k.ketnoi.ReadMessage(); loi != nil {
			break
		}
	}
}

func (k *KhachKetNoi) GhiTinNhan() {
	ticker := time.NewTicker(45 * time.Second)

	defer func() {
		ticker.Stop()
		_ = k.ketnoi.Close()
	}()

	for {
		select {
		case tinNhan, ok := <-k.gui:
			_ = k.ketnoi.SetWriteDeadline(time.Now().Add(10 * time.Second))

			if !ok {
				_ = k.ketnoi.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			if loi := k.ketnoi.WriteMessage(websocket.TextMessage, tinNhan); loi != nil {
				return
			}

		case <-ticker.C:
			_ = k.ketnoi.SetWriteDeadline(time.Now().Add(10 * time.Second))

			if loi := k.ketnoi.WriteMessage(websocket.PingMessage, nil); loi != nil {
				return
			}
		}
	}
}