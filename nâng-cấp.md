# Lộ trình nâng cấp — Quản lý đơn hàng

## Hiện trạng

| Thành phần | Tình trạng |
|---|---|
| Danh sách đơn hàng | ✅ Có — bảng cơ bản, lọc theo trạng thái/ngày/tìm kiếm |
| Xem chi tiết đơn | ✅ Có — modal ChiTietDonHangModal |
| Cập nhật trạng thái | ✅ Có — modal XuLyDonHangModal |
| Hủy đơn | ✅ Có — modal HuyDonHangModal |
| Filter nâng cao phía FE | ✅ Có — trangthaithanhtoan, tongtientu, tongtienden, phuongthuc |
| Filter nâng cao phía BE | ❌ Thiếu — backend chỉ nhận 4 param cơ bản, bỏ qua phần còn lại |
| Thống kê nhanh đầu trang | ❌ Thiếu |
| Timeline trạng thái đơn | ❌ Thiếu |
| In phiếu giao hàng | ❌ Thiếu — hiện dùng window.print() in cả trang |
| Xuất Excel | ❌ Thiếu |
| Ghi chú nội bộ | ❌ Thiếu |
| Xác nhận thanh toán nhanh | ❌ Thiếu |
| Bulk xử lý đơn | ❌ Thiếu |

---

## Tính năng cần nâng cấp (theo thứ tự ưu tiên)

---

### 1. Fix backend filter — bắt buộc làm trước

**Vấn đề:** Frontend gửi `trangthaithanhtoan`, `tongtientu`, `tongtienden`, `phuongthucthanhtoan`, `sapxep` nhưng `donhang_handler.go` chỉ đọc `timkiem`, `trangthai`, `tungay`, `denngay`. Các bộ lọc nâng cao hoàn toàn vô tác dụng.

**Việc cần làm:**
- `donhang_handler.go` — đọc thêm các query param còn thiếu
- `donhang_service.go` + `donhang_repository.go` — truyền và áp dụng filter vào câu SQL
- Model `DonHang` thêm field `TrangThaiThanhToan`, `PhuongThucThanhToan`, `SoSanPham`

---

### 2. Thanh thống kê nhanh (Stats bar)

Hiển thị 4 số liệu ngay dưới tiêu đề trang, cập nhật theo bộ lọc ngày:

| Ô | Nội dung |
|---|---|
| Tổng đơn hôm nay | Số đơn tạo trong ngày |
| Chờ xác nhận | Đơn trạng thái `cho_xac_nhan` |
| Đang giao | Đơn trạng thái `dang_giao` |
| Doanh thu hôm nay | Tổng tiền đơn `hoan_thanh` trong ngày |

**Việc cần làm:**
- Backend: 1 endpoint GET `/donhang/thongke-nhanh?tungay=&denngay=`
- Frontend: component `ThongKeDonHang` render 4 card số liệu

---

### 3. Redesign modal chi tiết + xử lý đơn

Gộp `ChiTietDonHangModal` và `XuLyDonHangModal` thành một modal duy nhất rộng hơn, gồm 2 cột:

**Cột trái — Thông tin đơn:**
- Header: mã đơn, badge trạng thái, ngày đặt
- Thông tin khách: họ tên, SĐT, email, địa chỉ
- Bảng sản phẩm: ảnh, tên, SL, đơn giá, thành tiền
- Tổng tiền, phương thức thanh toán, ghi chú khách

**Cột phải — Xử lý:**
- Timeline trạng thái đơn (các bước từ đặt → giao → hoàn thành)
- Dropdown đổi trạng thái đơn
- Dropdown đổi trạng thái thanh toán
- Ô ghi chú nội bộ (chỉ admin thấy)
- Nút In phiếu / Xác nhận thanh toán

---

### 4. Timeline trạng thái đơn hàng

Lưu lịch sử thay đổi trạng thái mỗi lần admin cập nhật.

**Việc cần làm:**
- Database: bảng `lichsu_donhang` (donhang_id, tu_trangthai, den_trangthai, ghi_chu, created_at)
- Backend: ghi log mỗi lần gọi `CapNhatTrangThai`
- Backend: endpoint GET `/donhang/:id/lich-su`
- Frontend: hiển thị timeline dạng dot + line trong modal

---

### 5. In phiếu giao hàng

Thay `window.print()` (in cả trang) bằng in đúng mẫu phiếu.

**Việc cần làm:**
- Component `PhieuGiaoHang` render nội dung phiếu: logo, mã đơn, thông tin khách, danh sách hàng, tổng tiền, chữ ký
- CSS `@media print` ẩn toàn bộ trang admin, chỉ in component phiếu
- Nút "In phiếu" trong modal mở component này rồi gọi `window.print()`

---

### 6. Xác nhận thanh toán nhanh

Nút bấm trực tiếp trên bảng danh sách (không cần mở modal) để chuyển `chua_thanh_toan` → `da_thanh_toan`.

**Việc cần làm:**
- Backend: endpoint PATCH `/donhang/:id/thanhtoan` nhận `{ trangthaithanhtoan: "da_thanh_toan" }`
- Frontend: icon-button trên bảng, optimistic update giống toggle trạng thái sản phẩm

---

### 7. Ghi chú nội bộ

Admin ghi chú riêng cho mỗi đơn, khách hàng không thấy.

**Việc cần làm:**
- Database: thêm cột `ghichu_noibo TEXT NULL` vào bảng `donhang`
- Backend: nhận và lưu `ghichu_noibo` khi cập nhật đơn
- Frontend: textarea trong modal cột xử lý

---

### 8. Xuất Excel đơn hàng

Xuất danh sách đơn hàng theo bộ lọc hiện tại ra file Excel.

**Cột xuất:** Mã đơn, Ngày đặt, Khách hàng, SĐT, Địa chỉ, Sản phẩm, Tổng tiền, Thanh toán, Trạng thái

**Việc cần làm:**
- Backend: endpoint GET `/donhang/export` (tương tự sanpham/export, dùng excelize)
- Frontend: nút "Xuất Excel" trên đầu trang, gọi API + trigger download

---

### 9. Bulk xử lý đơn hàng

Chọn nhiều đơn cùng lúc để xử lý hàng loạt.

**Hành động bulk:**
- Xác nhận hàng loạt (`cho_xac_nhan` → `da_xac_nhan`)
- Đánh dấu đã thanh toán hàng loạt
- Xuất Excel các đơn đã chọn

**Việc cần làm:**
- Backend: endpoint POST `/donhang/bulk-trangthai` nhận `{ ids: [], trangthai: "" }`
- Frontend: checkbox trên bảng + thanh bulk action (giống module sản phẩm)

---

## Thứ tự triển khai đề xuất

```
1 → Fix backend filter          (nền tảng, làm trước)
2 → Redesign modal chi tiết     (UX cốt lõi)
3 → Timeline trạng thái         (cùng lúc với modal)
4 → Stats bar                   (nhanh, độc lập)
5 → Xác nhận thanh toán nhanh   (nhanh, độc lập)
6 → Ghi chú nội bộ              (đơn giản)
7 → In phiếu giao hàng          (CSS print)
8 → Xuất Excel                  (backend + frontend)
9 → Bulk xử lý                  (làm cuối)
```
