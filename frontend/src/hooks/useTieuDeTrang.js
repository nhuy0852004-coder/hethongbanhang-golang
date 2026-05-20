import { useEffect } from "react";
import useCaiDatStore from "../stores/caidatStore";

export default function useTieuDeTrang(tieuDe = "") {
  const caidat = useCaiDatStore((state) => state.caidat);

  useEffect(() => {
    const tenCuaHang = caidat?.tencuahang || "Cửa Hàng Việt";

    if (tieuDe) {
      document.title = `${tieuDe} - ${tenCuaHang}`;
      return;
    }

    document.title = tenCuaHang;
  }, [tieuDe, caidat]);
}