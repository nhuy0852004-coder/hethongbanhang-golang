import { create } from "zustand";
import {
  capNhatDaDocThongBao,
  danhDauTatCaThongBaoDaDoc,
  demThongBaoChuaDoc,
  layDanhSachThongBao,
  xoaThongBao,
} from "../api/thongbaoApi";

const useThongBaoStore = create((set, get) => ({
  danhsach: [],
  soChuaDoc: 0,
  dangTai: false,

  taiThongBao: async (params = { trang: 1, gioihan: 8 }) => {
    set({ dangTai: true });

    try {
      const ketQua = await layDanhSachThongBao(params);

      set({
        danhsach: ketQua.dulieu.danhsach || [],
      });

      return ketQua;
    } finally {
      set({ dangTai: false });
    }
  },

  taiSoChuaDoc: async () => {
    const ketQua = await demThongBaoChuaDoc();

    set({
      soChuaDoc: ketQua.dulieu.sochuadoc || 0,
    });

    return ketQua;
  },

  themThongBaoMoi: (thongbao) => {
    if (!thongbao) return;

    const danhSachCu = get().danhsach;

    set({
      danhsach: [thongbao, ...danhSachCu].slice(0, 8),
      soChuaDoc: get().soChuaDoc + 1,
    });
  },

  capNhatDaDoc: async (id, dadoc = true) => {
    const ketQua = await capNhatDaDocThongBao(id, dadoc);

    const danhSachMoi = get().danhsach.map((item) =>
      item.id === id ? { ...item, dadoc } : item
    );

    set({
      danhsach: danhSachMoi,
    });

    await get().taiSoChuaDoc();

    return ketQua;
  },

  danhDauTatCaDaDoc: async () => {
    const ketQua = await danhDauTatCaThongBaoDaDoc();

    set({
      danhsach: get().danhsach.map((item) => ({
        ...item,
        dadoc: true,
      })),
      soChuaDoc: 0,
    });

    return ketQua;
  },

  xoaThongBao: async (id) => {
    const ketQua = await xoaThongBao(id);

    set({
      danhsach: get().danhsach.filter((item) => item.id !== id),
    });

    await get().taiSoChuaDoc();

    return ketQua;
  },
}));

export default useThongBaoStore;