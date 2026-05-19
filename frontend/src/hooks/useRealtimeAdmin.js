import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function useRealtimeAdmin({
  bat = true,
  onDonHangMoi,
  onCapNhatDonHang,
} = {}) {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);

  const onDonHangMoiRef = useRef(onDonHangMoi);
  const onCapNhatDonHangRef = useRef(onCapNhatDonHang);

  const [daKetNoi, setDaKetNoi] = useState(false);

  useEffect(() => {
    onDonHangMoiRef.current = onDonHangMoi;
    onCapNhatDonHangRef.current = onCapNhatDonHang;
  }, [onDonHangMoi, onCapNhatDonHang]);

  useEffect(() => {
    if (!bat) {
      return;
    }

    let daHuy = false;

    const ketNoi = () => {
      const token = localStorage.getItem("ma_dang_nhap");

      if (!token) {
        setDaKetNoi(false);
        return;
      }

      const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";
      const url = `${wsUrl}?kenh=admin&token=${encodeURIComponent(token)}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (daHuy) {
          ws.close();
          return;
        }

        console.log("WebSocket admin đã kết nối");
        setDaKetNoi(true);
      };

      ws.onmessage = (event) => {
        try {
          const tinNhan = JSON.parse(event.data);

          console.log("Realtime admin:", tinNhan);

          if (tinNhan.sukien === "don_hang_moi") {
            toast.success("Bạn có đơn hàng mới");
            onDonHangMoiRef.current?.(tinNhan.dulieu);
          }

          if (tinNhan.sukien === "thong_bao_moi") {
            toast.success(tinNhan.dulieu?.noidung || "Bạn có thông báo mới");
          }

          if (tinNhan.sukien === "cap_nhat_trang_thai_don_hang") {
            onCapNhatDonHangRef.current?.(tinNhan.dulieu);
          }
        } catch (error) {
          console.warn("Tin nhắn realtime không hợp lệ", error);
        }
      };

      ws.onerror = (error) => {
        console.error("WebSocket admin lỗi:", error);
      };

      ws.onclose = (event) => {
        console.warn("WebSocket admin đã đóng:", event.code, event.reason);
        setDaKetNoi(false);

        if (!daHuy) {
          reconnectRef.current = setTimeout(() => {
            ketNoi();
          }, 2500);
        }
      };
    };

    ketNoi();

    return () => {
      daHuy = true;

      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }

      const ws = wsRef.current;

      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;

        if (ws.readyState === WebSocket.OPEN) {
          ws.close();
        }
      }

      wsRef.current = null;
    };
  }, [bat]);

  return {
    daKetNoi,
  };
}
