import { create } from "zustand";

const useGiaoDienStore = create((set) => ({
  sidebarThuGon: localStorage.getItem("sidebar_thu_gon") === "true",
  sidebarMobileMo: false,
  dangTaiToanManHinh: false,
  tieuDeTrang: "Tổng quan",
  moTaTrang: "Quản lý hoạt động kinh doanh của cửa hàng",

  batTatSidebar: () =>
    set((state) => {
      const giaTriMoi = !state.sidebarThuGon;
      localStorage.setItem("sidebar_thu_gon", String(giaTriMoi));

      return {
        sidebarThuGon: giaTriMoi,
      };
    }),

  moSidebarMobile: () =>
    set({
      sidebarMobileMo: true,
    }),

  dongSidebarMobile: () =>
    set({
      sidebarMobileMo: false,
    }),

  batLoading: () =>
    set({
      dangTaiToanManHinh: true,
    }),

  tatLoading: () =>
    set({
      dangTaiToanManHinh: false,
    }),

  capNhatTieuDeTrang: (tieuDeTrang, moTaTrang = "") =>
    set({
      tieuDeTrang,
      moTaTrang,
    }),
}));

export default useGiaoDienStore;