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
  loi: "",

  taiThongBao: async (params = { trang: 1, gioihan: 8 }) => {
    set({ dangTai: true, loi: "" });

    try {
      const ketQua = await layDanhSachThongBao(params);

      set({
        danhsach: ketQua?.dulieu?.danhsach || [],
        loi: "",
      });

      return ketQua;
    } catch (loi) {
      console.warn("Không tải được thông báo:", loi?.response?.data || loi);

      set({
        danhsach: [],
        loi:
          loi?.response?.data?.thongbao ||
          loi?.message ||
          "Không tải được thông báo",
      });

      return null;
    } finally {
      set({ dangTai: false });
    }
  },

  taiSoChuaDoc: async () => {
    try {
      const ketQua = await demThongBaoChuaDoc();

      set({
        soChuaDoc: ketQua?.dulieu?.sochuadoc || 0,
      });

      return ketQua;
    } catch (loi) {
      console.warn(
        "Không đếm được thông báo chưa đọc:",
        loi?.response?.data || loi
      );

      set({
        soChuaDoc: 0,
      });

      return null;
    }
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
    try {
      const ketQua = await capNhatDaDocThongBao(id, dadoc);

      set({
        danhsach: get().danhsach.map((item) =>
          item.id === id ? { ...item, dadoc } : item
        ),
      });

      await get().taiSoChuaDoc();

      return ketQua;
    } catch (loi) {
      console.warn("Không cập nhật được thông báo:", loi?.response?.data || loi);
      return null;
    }
  },

  danhDauTatCaDaDoc: async () => {
    try {
      const ketQua = await danhDauTatCaThongBaoDaDoc();

      set({
        danhsach: get().danhsach.map((item) => ({
          ...item,
          dadoc: true,
        })),
        soChuaDoc: 0,
      });

      return ketQua;
    } catch (loi) {
      console.warn(
        "Không đánh dấu tất cả thông báo:",
        loi?.response?.data || loi
      );
      return null;
    }
  },

  xoaThongBao: async (id) => {
    try {
      const ketQua = await xoaThongBao(id);

      set({
        danhsach: get().danhsach.filter((item) => item.id !== id),
      });

      await get().taiSoChuaDoc();

      return ketQua;
    } catch (loi) {
      console.warn("Không xóa được thông báo:", loi?.response?.data || loi);
      return null;
    }
  },
}));

export default useThongBaoStore;
