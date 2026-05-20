import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import DangTai from "../../../components/DangTai";
import TrangRong from "../../../components/TrangRong";
import useTieuDeTrang from "../../../hooks/useTieuDeTrang";
import { layDanhSachSanPham } from "../../../api/sanphamApi";
import { layDanhSachDanhMuc } from "../../../api/danhmucApi";
import TheSanPhamWebsite from "./TheSanPhamWebsite";

export default function DanhSachSanPhamWebsite() {
  useTieuDeTrang("Sản phẩm");
  const [searchParams, setSearchParams] = useSearchParams();

  const [dangTai, setDangTai] = useState(false);
  const [danhSach, setDanhSach] = useState([]);
  const [danhMuc, setDanhMuc] = useState([]);

  const [phanTrang, setPhanTrang] = useState({
    trang: 1,
    gioihan: 12,
    tongsodong: 0,
    tongsotrang: 1,
  });

  const [boLoc, setBoLoc] = useState({
    timkiem: searchParams.get("timkiem") || "",
    danhmuc_id: searchParams.get("danhmuc_id") || "",
    trang: Number(searchParams.get("trang") || 1),
    gioihan: 12,
    trangthai: "hien_thi",
  });

  useEffect(() => {
    taiDanhMuc();
  }, []);

  useEffect(() => {
    taiSanPham();
  }, [boLoc.trang, boLoc.danhmuc_id]);

  const taiDanhMuc = async () => {
    try {
      const ketQua = await layDanhSachDanhMuc({
        trang: 1,
        gioihan: 100,
        trangthai: "hien_thi",
      });

      setDanhMuc(ketQua.dulieu.danhsach || []);
    } catch {
      toast.error("Không tải được danh mục");
    }
  };

  const taiSanPham = async () => {
    try {
      setDangTai(true);

      const ketQua = await layDanhSachSanPham(boLoc);

      setDanhSach(ketQua.dulieu.danhsach || []);
      setPhanTrang(ketQua.dulieu.phantrang);
    } catch {
      toast.error("Không tải được sản phẩm");
    } finally {
      setDangTai(false);
    }
  };

  const capNhatBoLoc = (event) => {
    const { name, value } = event.target;

    setBoLoc((cu) => ({
      ...cu,
      [name]: value,
    }));
  };

  const timKiem = (event) => {
    event.preventDefault();

    const locMoi = {
      ...boLoc,
      trang: 1,
    };

    setBoLoc(locMoi);

    setSearchParams({
      timkiem: locMoi.timkiem,
      danhmuc_id: locMoi.danhmuc_id,
      trang: "1",
    });

    setTimeout(() => {
      taiSanPham();
    }, 0);
  };

  const chonDanhMuc = (event) => {
    const value = event.target.value;

    const locMoi = {
      ...boLoc,
      danhmuc_id: value,
      trang: 1,
    };

    setBoLoc(locMoi);

    setSearchParams({
      timkiem: locMoi.timkiem,
      danhmuc_id: value,
      trang: "1",
    });
  };

  const chuyenTrang = (trangMoi) => {
    if (trangMoi < 1 || trangMoi > phanTrang.tongsotrang) return;

    const locMoi = {
      ...boLoc,
      trang: trangMoi,
    };

    setBoLoc(locMoi);

    setSearchParams({
      timkiem: locMoi.timkiem,
      danhmuc_id: locMoi.danhmuc_id,
      trang: String(trangMoi),
    });
  };

  return (
    <div className="container-website trang-danh-sach-san-pham-web">
      <div className="dau-trang-web">
        <div>
          <h1>Sản phẩm</h1>
          <p>Khám phá các sản phẩm đang được bán tại cửa hàng</p>
        </div>
      </div>

      <div className="khung-loc-web">
        <form className="form-tim-san-pham-web" onSubmit={timKiem}>
          <div className="o-tim-san-pham-web">
            <Search size={18} />
            <input
              name="timkiem"
              value={boLoc.timkiem}
              onChange={capNhatBoLoc}
              placeholder="Tìm sản phẩm..."
            />
          </div>

          <button type="submit">Tìm kiếm</button>
        </form>

        <select value={boLoc.danhmuc_id} onChange={chonDanhMuc}>
          <option value="">Tất cả danh mục</option>

          {danhMuc.map((item) => (
            <option key={item.id} value={item.id}>
              {item.tendanhmuc}
            </option>
          ))}
        </select>
      </div>

      {dangTai ? (
        <DangTai noidung="Đang tải danh sách sản phẩm..." />
      ) : danhSach.length === 0 ? (
        <TrangRong tieude="Không tìm thấy sản phẩm" mota="Thử đổi từ khóa hoặc chọn danh mục khác." />
      ) : (
        <>
          <div className="san-pham-web-grid">
            {danhSach.map((item) => (
              <TheSanPhamWebsite key={item.id} sanpham={item} />
            ))}
          </div>

          <div className="phan-trang-web">
            <button
              disabled={phanTrang.trang <= 1}
              onClick={() => chuyenTrang(phanTrang.trang - 1)}
            >
              Trước
            </button>

            <span>
              Trang {phanTrang.trang} / {phanTrang.tongsotrang}
            </span>

            <button
              disabled={phanTrang.trang >= phanTrang.tongsotrang}
              onClick={() => chuyenTrang(phanTrang.trang + 1)}
            >
              Sau
            </button>
          </div>
        </>
      )}
    </div>
  );
}