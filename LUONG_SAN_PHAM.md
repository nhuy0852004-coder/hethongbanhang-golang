# LUỒNG HOẠT ĐỘNG HOÀN CHỈNH — TRANG QUẢN LÝ SẢN PHẨM

> **Dự án:** Hệ thống bán hàng (Go + React)  
> **Cập nhật:** 2026-06-04

---

## 1. TỔNG QUAN KIẾN TRÚC

```
Người dùng (Admin)
      │
      ▼
[React Frontend :5173]
  DanhSachSanPham.jsx
  SanPhamModal.jsx
  ChiTietSanPhamModal.jsx
      │  HTTP + JWT Bearer Token
      ▼
[Go Backend :8080]
  Handler → Service → Repository
      │  SQL
      ▼
[MySQL — hethongbanhang]
  sanpham / danhmuc / anhsanpham
```

---

## 2. CẤU TRÚC DATABASE

### 2.1 Bảng `sanpham`

| Cột | Kiểu | Mặc định | Mô tả |
|-----|------|----------|-------|
| `id` | BIGINT UNSIGNED | AUTO_INCREMENT | Khóa chính |
| `madinhdanh` | VARCHAR(80) UNIQUE | — | Mã định danh, tự sinh nếu trống: `SP-YYYYMMDD-XXXXXX` |
| `sku` | VARCHAR(80) | NULL | Mã SKU, tự sinh từ tên sản phẩm: `TENSP-XXXXXX` |
| `barcode` | VARCHAR(100) | NULL | Mã vạch EAN/UPC, nhập tay |
| `tensanpham` | VARCHAR(180) NOT NULL | — | Tên sản phẩm, **bắt buộc** |
| `mota` | TEXT | NULL | Mô tả (legacy, dùng `motachitiet`) |
| `motangan` | TEXT | NULL | Mô tả ngắn (SEO, card sản phẩm) |
| `motachitiet` | LONGTEXT | NULL | Mô tả đầy đủ chi tiết |
| `thuonghieu` | VARCHAR(150) | NULL | Thương hiệu |
| `donvitinh` | VARCHAR(50) | `'cái'` | Đơn vị tính (cái, hộp, kg...) |
| `gianhap` | BIGINT UNSIGNED | `0` | Giá nhập (VND, không có lẻ) |
| `giaban` | BIGINT UNSIGNED NOT NULL | `0` | Giá bán, **bắt buộc > 0** |
| `giakhuyenmai` | BIGINT UNSIGNED | NULL | Giá khuyến mãi, phải < `giaban` |
| `soluongton` | INT UNSIGNED | `0` | Tồn kho hiện tại |
| `nguongcanhbao` | INT UNSIGNED | `5` | Ngưỡng cảnh báo tồn kho thấp |
| `trongluong` | DECIMAL(10,2) | NULL | Trọng lượng (gram) |
| `kichthuoc` | VARCHAR(120) | NULL | Kích thước `D×R×C` |
| `hinhanh` | VARCHAR(255) | NULL | Đường dẫn ảnh đại diện |
| `noibat` | TINYINT(1) | `0` | Nhãn "Nổi bật" |
| `banchay` | TINYINT(1) | `0` | Nhãn "Bán chạy" |
| `sanphammoi` | TINYINT(1) | `0` | Nhãn "Sản phẩm mới" |
| `chodattruoc` | TINYINT(1) | `0` | Cho phép đặt trước |
| `thuoctinh` | TEXT | NULL | Thuộc tính dạng text |
| `bienthe` | TEXT | NULL | Biến thể (size, màu...) |
| `trangthai` | ENUM | `'hien_thi'` | `hien_thi` / `an` / `het_hang` |
| `danhmuc_id` | BIGINT UNSIGNED | NULL | FK → `danhmuc.id` |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

### 2.2 Bảng `danhmuc`

| Cột | Kiểu | Mặc định | Mô tả |
|-----|------|----------|-------|
| `id` | BIGINT UNSIGNED | AUTO_INCREMENT | Khóa chính |
| `tendanhmuc` | VARCHAR(150) NOT NULL | — | Tên danh mục, **duy nhất** |
| `duongdan` | VARCHAR(180) UNIQUE | — | Slug tự sinh (xóa dấu, thay dấu cách → `-`) |
| `mota` | TEXT | NULL | Mô tả danh mục |
| `hinhanh` | VARCHAR(255) | NULL | Ảnh đại diện danh mục |
| `danhmuccha_id` | BIGINT UNSIGNED | NULL | FK tự tham chiếu (danh mục cha) |
| `thutu` | INT | `0` | Thứ tự sắp xếp |
| `trangthai` | ENUM | `'hien_thi'` | `hien_thi` / `an` |
| `deleted_at` | TIMESTAMP | NULL | Soft delete |

### 2.3 Bảng `anhsanpham`

| Cột | Kiểu | Mô tả |
|-----|------|-------|
| `id` | BIGINT UNSIGNED | Khóa chính |
| `sanpham_id` | BIGINT UNSIGNED | FK → `sanpham.id` |
| `duongdan` | VARCHAR(255) | Đường dẫn file ảnh |
| `anhchinh` | TINYINT(1) | `1` = ảnh đại diện chính |
| `thutu` | INT | Thứ tự hiển thị trong album |
| `deleted_at` | TIMESTAMP | Soft delete |

---

## 3. DANH MỤC — CHA/CON VÀ RÀNG BUỘC

### 3.1 Cây danh mục

```
Danh mục gốc (danhmuccha_id = NULL)
├── Thời trang (id=1)
│   ├── Áo nam (danhmuccha_id=1)
│   ├── Áo nữ (danhmuccha_id=1)
│   └── Quần (danhmuccha_id=1)
├── Giày dép (id=2)
│   ├── Sneakers
│   └── Dép
└── Phụ kiện (id=3)
```

**Sản phẩm chỉ gắn vào danh mục lá (con hoặc gốc) — không bắt buộc, nhưng tốt nhất là danh mục cụ thể nhất.**

### 3.2 Quy tắc danh mục cha/con

| Tình huống | Hành vi |
|------------|---------|
| Ẩn danh mục cha | **Tự động ẩn tất cả danh mục con** |
| Tạo danh mục con khi cha đang ẩn | **Lỗi** — con không thể hiện nếu cha đang ẩn |
| Xóa danh mục còn sản phẩm | **Lỗi** — phải xóa/chuyển sản phẩm trước |
| Đặt danh mục cha = chính nó | **Lỗi** — không được phép |
| Tạo vòng tròn cha-con | **Lỗi** — kiểm tra đệ quy trước khi lưu |
| Xóa danh mục cha có con | Cha bị xóa, con `danhmuccha_id → NULL` (trở thành gốc) |

### 3.3 Khi tạo sản phẩm — chọn danh mục nào?

```
Frontend (SanPhamModal) gọi:
GET /api/danhmuc?trang=1&gioihan=100&trangthai=hien_thi

→ Trả về TẤT CẢ danh mục đang hiển thị (cả cha lẫn con)
→ Frontend hiển thị trong <select> theo tên danh mục
→ Gửi danhmuc_id là ID của danh mục được chọn
```

**Lưu ý quan trọng:** Hiện tại hệ thống cho phép chọn cả danh mục cha và danh mục con. Khuyến nghị chọn danh mục con cụ thể nhất để lọc sản phẩm chính xác hơn.

---

## 4. LUỒNG TẠO SẢN PHẨM (CHI TIẾT)

### Bước 1 — Người dùng nhấn "Thêm sản phẩm"

```
DanhSachSanPham.jsx
  → moThem()
  → setModalMo(true), setCheDo("them"), setDuLieuSua(null)
  → Render <SanPhamModal mo={true} cheDo="them" />
```

### Bước 2 — Load danh mục vào form

```
DanhSachSanPham.jsx useEffect
  → layDanhSachDanhMuc({ trang: 1, gioihan: 100, trangthai: "hien_thi" })
  → GET /api/danhmuc?trang=1&gioihan=100&trangthai=hien_thi
  → setDanhSachDanhMuc(data.danhsach)
  → Truyền danhSachDanhMuc vào <SanPhamModal>
```

### Bước 3 — Người dùng điền form và Submit

```
SanPhamModal.jsx kiemTraForm()

Validate phía client:
  ✓ tensanpham ≠ rỗng
  ✓ donvitinh ≠ rỗng
  ✓ giaban > 0
  ✓ giaban ≥ gianhap (nếu gianhap có)
  ✓ giakhuyenmai < giaban (nếu có)
  ✓ soluongton ≥ 0
  ✓ nguongcanhbao ≥ 0
  ✓ trongluong ≥ 0 (nếu có)

Sau khi pass → gọi onLuu(duLieuGui, fileAnh, albumFiles)
```

### Bước 4 — Frontend gọi API tạo sản phẩm

```javascript
// DanhSachSanPham.jsx → luuSanPham()
const ketQua = await themSanPham(duLieuGui)
// POST /api/sanpham
// Headers: Authorization: Bearer <JWT_TOKEN>
// Body:
{
  tensanpham: "Áo thun Basic",
  danhmuc_id: 3,
  donvitinh: "cái",
  giaban: 150000,
  gianhap: 80000,
  giakhuyenmai: null,
  soluongton: 50,
  nguongcanhbao: 5,
  trangthai: "hien_thi",
  noibat: false,
  banchay: false,
  sanphammoi: true,
  chodattruoc: false,
  // ... các field khác
}
```

### Bước 5 — Backend Handler nhận request

```go
// sanpham_handler.go → Tao()
c.ShouldBindJSON(&request)  // Parse JSON → TaoSanPhamRequest
h.service.Tao(request)      // Gọi service
```

### Bước 6 — Service xử lý business logic

```go
// sanpham_service.go → Tao()

// 1. Validate request
request.KiemTra() 
//   - tensanpham không rỗng, ≥ 2 ký tự
//   - giaban > 0
//   - giakhuyenmai < giaban (nếu có)
//   - soluongton ≥ 0
//   - nguongcanhbao ≥ 0

// 2. Xử lý trạng thái tự động
if soluongton <= 0 {
    trangthai = "het_hang"  // Auto override
} else if trangthai == "" {
    trangthai = "hien_thi"
}

// 3. Sinh mã định danh tự động (nếu trống)
madinhdanh = "SP-20260604-391088"
//   Format: SP-{YYYYMMDD}-{6 số ngẫu nhiên}
//   Thử tối đa 20 lần nếu trùng

// 4. Sinh SKU tự động (nếu trống)
sku = "AO-THUN-BASIC-391088"
//   Format: {TÊN-IN-HOA-KHÔNG-DẤU}-{6 số ngẫu nhiên}
//   Giới hạn 24 ký tự phần tên

// 5. Lưu vào DB
id = repository.Tao(request, madinhdanh)

// 6. Lấy lại đối tượng đầy đủ
sanpham = repository.ChiTiet(id)

return sanpham
```

### Bước 7 — Upload ảnh (nếu người dùng chọn ảnh)

```javascript
// DanhSachSanPham.jsx → luuSanPham() (tiếp theo)
if (fileAnh) {
  const formData = new FormData()
  formData.append("hinhanh", fileAnh)
  await uploadAnhSanPham(sanPhamMoi.id, formData)
  // POST /api/sanpham/:id/upload-anh
  // Lưu vào: ./public/uploads/sanpham/
  // Cập nhật hinhanh trong bảng sanpham
  // Thêm vào bảng anhsanpham (anhchinh=1)
}

if (albumFiles.length > 0) {
  const formData = new FormData()
  albumFiles.forEach(f => formData.append("album", f))
  await uploadAlbumAnhSanPham(sanPhamMoi.id, formData)
  // POST /api/sanpham/:id/upload-album
  // Thêm nhiều dòng vào bảng anhsanpham (anhchinh=0)
}
```

### Bước 8 — Reload danh sách

```javascript
await taiDanhSach()
// GET /api/sanpham?trang=1&gioihan=8&...boLoc
// Refresh bảng sản phẩm
setModalMo(false)
toast.success("Thêm sản phẩm thành công")
```

---

## 5. LUỒNG SỬA SẢN PHẨM

```
1. Click "Sửa" (nut-sua) → moSua(item)
   → setCheDo("sua"), setDuLieuSua(item), setModalMo(true)

2. SanPhamModal nhận duLieuSua → điền sẵn form

3. Submit → luuSanPham() với PUT /api/sanpham/:id

4. Service CapNhat():
   - Kiểm tra sản phẩm tồn tại
   - Validate như Tao()
   - Auto-xử lý trangthai theo soluongton
   - Sinh mới madinhdanh/sku nếu trống

5. Upload ảnh mới (nếu chọn)

6. Reload danh sách
```

---

## 6. LUỒNG XEM CHI TIẾT

```
1. Click "Xem" (nut-xem) → xemNhanh(item)
   → setModalChiTietMo(true)
   → GET /api/sanpham/:id  (kèm Bearer token)
   → setSanPhamChiTiet(data.sanpham)
   → setAlbumChiTiet(data.album)

2. ChiTietSanPhamModal hiện ra với layout 3 cột:
   - Cột trái: ảnh chính + album
   - Cột giữa: thông tin nhận diện + giá + tồn kho + nhãn
   - Cột phải: mô tả ngắn + mô tả chi tiết + thuộc tính + biến thể

3. Nút "Sửa nhanh" → đóng modal chi tiết → mở modal sửa
4. Nút "Nhân bản" → tạo bản copy (TODO)
```

---

## 7. LUỒNG XÓA SẢN PHẨM

### Xóa 1 sản phẩm

```
1. Click "Xóa" (nut-xoa) → moModalXoa(item)
2. Hiện XacNhanModal
3. Confirm → xacNhanXoaSanPham()
   → DELETE /api/sanpham/:id
   → Backend: UPDATE sanpham SET deleted_at=NOW() (soft delete)
4. Reload danh sách
```

### Xóa hàng loạt (Bulk Delete)

```
1. Chọn nhiều checkbox → setIdsDangChon([1,2,3])
2. Hiện thanh bulk action
3. Click "Xóa đã chọn" → moModalBulkXoa()
4. Confirm → xacNhanBulkXoa()
   → POST /api/sanpham/bulk-xoa
   → Body: { ids: [1,2,3] }
   → Backend: xóa từng ID, ghi nhận kết quả
   → Trả về: { thanh_cong: 3, that_bai: 0 }
```

---

## 8. LUỒNG THAY ĐỔI TRẠNG THÁI

### Toggle 1 sản phẩm (trong bảng)

```
Click toggle → doiTrangThai(item)
  if trangthai == "hien_thi" → "an"
  if trangthai == "an" → "hien_thi"
  if trangthai == "het_hang" → không làm gì (disabled)

→ PATCH /api/sanpham/:id/trangthai
→ Body: { trangthai: "an" }
→ Backend: UPDATE sanpham SET trangthai=?
```

### Bulk thay đổi trạng thái

```
Chọn nhiều → Click "Hiển thị tất cả" hoặc "Ẩn tất cả"
→ PATCH /api/sanpham/bulk-trangthai
→ Body: { ids: [1,2,3], trangthai: "hien_thi" }
```

---

## 9. BỘ LỌC VÀ TÌM KIẾM

### Các tham số lọc (GET /api/sanpham)

| Tham số | Kiểu | Mô tả |
|---------|------|-------|
| `trang` | int | Trang hiện tại (default: 1) |
| `gioihan` | int | Số item/trang (default: 10, max: 100) |
| `timkiem` | string | Tìm trong tên, mã, SKU, barcode |
| `trangthai` | string | `hien_thi` / `an` / `het_hang` |
| `danhmuc_id` | int | Lọc theo danh mục |
| `tonkho` | string | `con_hang` / `sap_het` / `het_hang` |
| `sanpham` | string | `noibat` / `khuyenmai` / `banchay` |
| `giatu` | int | Giá từ (VND) |
| `giaden` | int | Giá đến (VND) |
| `sapxep` | string | `moi_nhat` / `cu_nhat` / `gia_tang` / `gia_giam` / `ton_kho_thap` / `luot_ban` |

### Logic tìm kiếm phía backend

```sql
WHERE (
  tensanpham LIKE '%keyword%'
  OR madinhdanh LIKE '%keyword%'
  OR sku LIKE '%keyword%'
  OR barcode LIKE '%keyword%'
)
AND trangthai = 'hien_thi'
AND danhmuc_id = ?
AND soluongton > nguongcanhbao  -- con_hang
ORDER BY id DESC
LIMIT 10 OFFSET 0
```

---

## 10. ENDPOINT ĐẦY ĐỦ

### Public (không cần token)
| Method | URL | Mô tả |
|--------|-----|-------|
| GET | `/api/sanpham` | Danh sách sản phẩm (website) |
| GET | `/api/sanpham/:id` | Chi tiết sản phẩm (website) |

### Admin (cần JWT Bearer Token)
| Method | URL | Mô tả |
|--------|-----|-------|
| POST | `/api/sanpham` | Tạo sản phẩm mới |
| PUT | `/api/sanpham/:id` | Cập nhật sản phẩm |
| DELETE | `/api/sanpham/:id` | Xóa mềm sản phẩm |
| PATCH | `/api/sanpham/:id/trangthai` | Đổi trạng thái |
| POST | `/api/sanpham/:id/upload-anh` | Upload ảnh chính |
| POST | `/api/sanpham/:id/upload-album` | Upload album ảnh |
| PATCH | `/api/sanpham/bulk-trangthai` | Đổi trạng thái hàng loạt |
| POST | `/api/sanpham/bulk-xoa` | Xóa hàng loạt |

---

## 11. RESPONSE CHUẨN

```json
{
  "thanhcong": true,
  "thongbao": "Thêm sản phẩm thành công",
  "dulieu": {
    "id": 1,
    "madinhdanh": "SP-20260604-391088",
    "sku": "AO-THUN-BASIC-391088",
    "tensanpham": "Áo thun Basic Unisex",
    "trangthai": "hien_thi",
    "danhmuc_id": 3,
    "tendanhmuc": "Thời trang",
    "giaban": 150000,
    "soluongton": 50,
    "luotban": 0,
    "albumanh": [],
    "created_at": "2026-06-04T20:00:00+07:00"
  }
}
```

---

## 12. LỖI THƯỜNG GẶP VÀ CÁCH XỬ LÝ

| Lỗi | Nguyên nhân | Cách fix |
|-----|-------------|----------|
| `Unknown column 'sp.sku'` | Bảng DB chưa có cột mới | Chạy `migration_add_sanpham_columns.sql` |
| `Unknown column 'deleted_at' in anhsanpham` | Bảng `anhsanpham` thiếu cột `deleted_at` | `ALTER TABLE anhsanpham ADD COLUMN deleted_at TIMESTAMP NULL` |
| `Giá bán phải lớn hơn 0` | Người dùng không nhập giá bán | Nhập giá bán > 0 |
| `Giá bán không được nhỏ hơn giá nhập` | Logic giá sai | Kiểm tra giá nhập/bán |
| `Giá khuyến mãi phải nhỏ hơn giá bán` | Logic giá KM sai | giakhuyenmai < giaban |
| `Danh mục không tồn tại` | danhmuc_id không hợp lệ | Chọn danh mục hợp lệ |
| `Sản phẩm không tồn tại` | ID sai hoặc đã xóa | Reload danh sách |
| `go.work version mismatch` | go.work khai báo go thấp hơn go.mod | Đổi `go 1.22` → `go 1.26.2` trong go.work |

---

## 13. LUỒNG UPLOAD ẢNH CHI TIẾT

```
POST /api/sanpham/:id/upload-anh
  multipart/form-data field: "hinhanh"

Backend sanpham_handler.go → luuFileAnh():
  1. Kiểm tra size ≤ 5MB
  2. Kiểm tra extension: jpg, jpeg, png, webp
  3. Tạo thư mục ./public/uploads/sanpham/ nếu chưa có
  4. Đặt tên file: sanpham-{id}-{timestamp}.{ext}
  5. Lưu file vào disk
  6. Cập nhật sanpham.hinhanh = "/uploads/sanpham/{tenfile}"
  7. Thêm vào anhsanpham (anhchinh=1, thutu=0)

URL truy cập ảnh: http://localhost:8080/uploads/sanpham/{tenfile}
Frontend layUrlAnh(path): prepend API_BASE_URL nếu path bắt đầu bằng "/"
```

---

## 14. GHI CHÚ PHÁT TRIỂN

### Thứ tự làm đúng khi setup môi trường mới

```bash
# 1. Tạo DB
mysql -u root hethongbanhang < backend/database/taocsdl.sql

# 2. Nếu DB cũ (đã có dữ liệu), chạy migration để thêm cột
mysql -u root hethongbanhang < backend/database/migration_add_sanpham_columns.sql

# 3. Thêm cột deleted_at cho anhsanpham (nếu thiếu)
mysql -u root hethongbanhang -e "
  ALTER TABLE anhsanpham ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP NULL;
"

# 4. Chạy backend
cd backend && go run cmd/server/main.go

# 5. Chạy frontend
cd frontend && npm run dev
```

### Khi thêm field mới cho sản phẩm

1. Thêm vào `taocsdl.sql` (CREATE TABLE)
2. Thêm vào `migration_add_sanpham_columns.sql` (ALTER TABLE)
3. Thêm vào `sanpham_model.go` (struct SanPham)
4. Thêm vào `sanpham_request.go` (struct TaoSanPhamRequest + validation)
5. Thêm vào `sanpham_repository.go` (INSERT + SELECT)
6. Thêm vào `SanPhamModal.jsx` (form state + input)
7. Thêm vào `ChiTietSanPhamModal.jsx` (hiển thị)
