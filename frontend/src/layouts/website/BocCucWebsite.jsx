import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import DauTrangWebsite from "./DauTrangWebsite";
import ChanTrangWebsite from "./ChanTrangWebsite";
import useCaiDatStore from "../../stores/caidatStore";

export default function BocCucWebsite() {
  const taiCaiDat = useCaiDatStore((state) => state.taiCaiDat);

  useEffect(() => {
    taiCaiDat();
  }, [taiCaiDat]);

  return (
    <div className="bo-cuc-website">
      <DauTrangWebsite />

      <main className="noi-dung-website">
        <Outlet />
      </main>

      <ChanTrangWebsite />
    </div>
  );
}