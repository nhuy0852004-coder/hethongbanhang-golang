import { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";

export default function useRealtimeDonHang({ madonhang, bat = true, onCapNhatDonHang } = {}) {
  const wsRef = useRef(null);
  const reconnectRef = useRef(null);
  const [daKetNoi, setDaKetNoi] = useState(false);

  useEffect(() => {
    if (!bat || !madonhang) {
      return;
    }

    let daHuy = false;

    const ketNoi = () => {
      const url = `${import.meta.env.VITE_WS_URL || "ws://localhost:8080/ws"}?kenh=donhang&madonhang=${encodeURIComponent(madonhang)}`;

      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        setDaKetNoi(true);
      };

      ws.onmessage = (event) => {
        try {
          const tinNhan = JSON.parse(event.data);

          if (tinNhan.sukien === "cap_nhat_trang_thai_don_hang") {
            toast.success("Trạng thái đơn hàng đã được cập nhật");
            onCapNhatDonHang?.(tinNhan.dulieu);
          }
        } catch {
          console.warn("Tin nhắn realtime không hợp lệ");
        }
      };

      ws.onclose = () => {
        setDaKetNoi(false);

        if (!daHuy) {
          reconnectRef.current = setTimeout(() => {
            ketNoi();
          }, 2000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    };

    ketNoi();

    return () => {
      daHuy = true;

      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }

      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [bat, madonhang, onCapNhatDonHang]);

  return {
    daKetNoi,
  };
}