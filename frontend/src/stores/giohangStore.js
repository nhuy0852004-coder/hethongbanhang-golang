import { create } from "zustand";

const TEN_LUU_GIO_HANG = "gio_hang_cua_hang";

function layGioHangTuLocal() {
  try {
    const duLieu = localStorage.getItem(TEN_LUU_GIO_HANG);
    return duLieu ? JSON.parse(duLieu) : [];
  } catch {
    return [];
  }
}

function luuGioHangVaoLocal(danhSach) {
  localStorage.setItem(TEN_LUU_GIO_HANG, JSON.stringify(danhSach));
}

const useGioHangStore = create((set, get) => ({
  danhsach: layGioHangTuLocal(),

  tongSoLuong: () => {
    return get().danhsach.reduce((tong, item) => tong + Number(item.soluong || 0), 0);
  },

  tongTien: () => {
    return get().danhsach.reduce((tong, item) => {
      const gia = item.giakhuyenmai && item.giakhuyenmai > 0 ? item.giakhuyenmai : item.giaban;
      return tong + gia * item.soluong;
    }, 0);
  },

  themVaoGio: (sanpham, soluongThem = 1) => {
    const danhSachCu = get().danhsach;
    const sanPhamTonTai = danhSachCu.find((item) => item.id === sanpham.id);

    let danhSachMoi = [];

    if (sanPhamTonTai) {
      danhSachMoi = danhSachCu.map((item) => {
        if (item.id !== sanpham.id) {
          return item;
        }

        const soLuongMoi = Math.min(
          Number(item.soluong || 0) + Number(soluongThem || 1),
          Number(sanpham.soluongton || 0)
        );

        return {
          ...item,
          soluong: soLuongMoi,
          soluongton: sanpham.soluongton,
        };
      });
    } else {
      danhSachMoi = [
        ...danhSachCu,
        {
          id: sanpham.id,
          madinhdanh: sanpham.madinhdanh,
          tensanpham: sanpham.tensanpham,
          hinhanh: sanpham.hinhanh,
          giaban: sanpham.giaban,
          giakhuyenmai: sanpham.giakhuyenmai,
          soluongton: sanpham.soluongton,
          tendanhmuc: sanpham.tendanhmuc,
          soluong: Math.min(Number(soluongThem || 1), Number(sanpham.soluongton || 0)),
        },
      ];
    }

    luuGioHangVaoLocal(danhSachMoi);

    set({
      danhsach: danhSachMoi,
    });
  },

  capNhatSoLuong: (id, soluong) => {
    const danhSachMoi = get().danhsach.map((item) => {
      if (item.id !== id) {
        return item;
      }

      const soLuongHopLe = Math.max(1, Math.min(Number(soluong || 1), Number(item.soluongton || 1)));

      return {
        ...item,
        soluong: soLuongHopLe,
      };
    });

    luuGioHangVaoLocal(danhSachMoi);

    set({
      danhsach: danhSachMoi,
    });
  },

  xoaKhoiGio: (id) => {
    const danhSachMoi = get().danhsach.filter((item) => item.id !== id);

    luuGioHangVaoLocal(danhSachMoi);

    set({
      danhsach: danhSachMoi,
    });
  },

  xoaTatCa: () => {
    luuGioHangVaoLocal([]);

    set({
      danhsach: [],
    });
  },
}));

export default useGioHangStore;