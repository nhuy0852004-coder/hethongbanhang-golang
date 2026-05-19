import { Outlet } from "react-router-dom";
import DauTrangWebsite from "./DauTrangWebsite";
import ChanTrangWebsite from "./ChanTrangWebsite";

export default function BocCucWebsite() {
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