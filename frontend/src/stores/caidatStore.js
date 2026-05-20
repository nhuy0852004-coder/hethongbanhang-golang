import { create } from "zustand";
import { layCaiDat } from "../api/caidatApi";

const useCaiDatStore = create((set, get) => ({
  caidat: null,
  dangTai: false,
  daTai: false,

  taiCaiDat: async () => {
    if (get().dangTai) return get().caidat;

    try {
      set({ dangTai: true });

      const ketQua = await layCaiDat();

      set({
        caidat: ketQua.dulieu,
        daTai: true,
      });

      return ketQua.dulieu;
    } finally {
      set({ dangTai: false });
    }
  },

  capNhatCaiDatLocal: (duLieu) => {
    set({
      caidat: duLieu,
      daTai: true,
    });
  },
}));

export default useCaiDatStore;