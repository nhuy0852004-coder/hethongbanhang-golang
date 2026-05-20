import { create } from "zustand";
import { layCaiDat } from "../api/caidatApi";

const useCaiDatStore = create((set, get) => ({
  caidat: null,
  dangTai: false,

  taiCaiDat: async () => {
    if (get().dangTai) return;

    try {
      set({ dangTai: true });

      const ketQua = await layCaiDat();

      set({
        caidat: ketQua.dulieu,
      });

      return ketQua.dulieu;
    } finally {
      set({ dangTai: false });
    }
  },

  capNhatCaiDatLocal: (duLieu) => {
    set({
      caidat: duLieu,
    });
  },
}));

export default useCaiDatStore;