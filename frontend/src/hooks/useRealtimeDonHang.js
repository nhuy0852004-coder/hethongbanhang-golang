import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function useRealtimeDonHang({
  madonhang,
  bat = true,
  onCapNhatDonHang,
} = {}) {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const onCapNhatDonHangRef = useRef(onCapNhatDonHang);

  const [daKetNoi, setDaKetNoi] = useState(false);

  useEffect(() => {
    onCapNhatDonHangRef.current = onCapNhatDonHang;
  }, [onCapNhatDonHang]);

  useEffect(() => {
    if (!bat || !madonhang) {
      return;
    }

    let daHuy = false;

    function ketNoi() {
      const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws";
      const url = `${wsUrl}?kenh=donhang&madonhang=${encodeURIComponent(
        madonhang
      )}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (daHuy) {
          return;
        }

        console.log("WebSocket theo dõi đơn hàng đã kết nối:", madonhang);
        setDaKetNoi(true);
      };

      ws.onmessage = (event) => {
        try {
          const tinNhan = JSON.parse(event.data);

          console.log("Realtime đơn hàng:", tinNhan);

          if (tinNhan.sukien === "cap_nhat_trang_thai_don_hang") {
            toast.success("Trạng thái đơn hàng đã được cập nhật");
            onCapNhatDonHangRef.current?.(tinNhan.dulieu);
          }
        } catch (error) {
          console.warn("Tin nhắn realtime đơn hàng không hợp lệ", error);
        }
      };

      ws.onerror = () => {
        setDaKetNoi(false);
      };

      ws.onclose = () => {
        setDaKetNoi(false);

        if (!daHuy) {
          reconnectRef.current = setTimeout(() => {
            ketNoi();
          }, 2500);
        }
      };
    }

    ketNoi();

    return () => {
      daHuy = true;

      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }

      const ws = wsRef.current;

      if (ws) {
        ws.onopen = null;
        ws.onmessage = null;
        ws.onerror = null;
        ws.onclose = null;

        // Quan trọng:
        // Chỉ đóng khi WebSocket đã OPEN.
        // Không close khi CONNECTING để tránh warning:
        // "WebSocket is closed before the connection is established"
        if (ws.readyState === WebSocket.OPEN) {
          ws.close(1000, "Component unmount");
        }
      }

      wsRef.current = null;
    };
  }, [bat, madonhang]);

  return {
    daKetNoi,
  };
}