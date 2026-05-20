# Đề xuất cập nhật trang danh mục

## Mục tiêu
Hoàn thiện trang danh mục để đáp ứng đầy đủ nghiệp vụ quản trị, đồng thời cải thiện giao diện và trải nghiệm sử dụng cho màn hình danh sách danh mục.

## Hiện trạng chức năng
Trang `DanhSachDanhMuc.jsx` hiện đã có các chức năng chính:
- Danh sách dạng bảng
- Tìm kiếm theo tên danh mục hoặc đường dẫn
- Lọc theo trạng thái hiển thị / ẩn
- Thêm danh mục
- Cập nhật danh mục
- Bật / tắt trạng thái
- Xóa danh mục
- Phân trang
- Hiển thị số sản phẩm của từng danh mục
- Modal xử lý thêm/sửa

## Những điểm cần hoàn thiện thêm

<!-- ### 1. Xử lý nghiệp vụ đầy đủ hơn
- Kiểm tra tên danh mục trùng trước khi lưu
- Chuẩn hóa đường dẫn `duongdan` tự sinh từ tên danh mục
- Cho phép chọn danh mục cha rõ ràng hơn, tránh chọn chính nó hoặc vòng lặp
- Cảnh báo khi xóa danh mục đang có sản phẩm
- Hiển thị số lượng sản phẩm và trạng thái xóa mềm nếu có
- Làm rõ logic bật/tắt trạng thái và danh mục cha -->

<!-- ### 2. Cải thiện giao diện
- Thêm khối thống kê nhanh ở đầu trang:
  - Tổng danh mục
  - Danh mục hiển thị
  - Danh mục đang ẩn
  - Danh mục có sản phẩm
- Thêm trạng thái loading / empty state rõ hơn
- Bảng cần responsive tốt hơn trên màn hình nhỏ
- Nút thao tác nên có tooltip hoặc nhãn rõ ràng hơn
- Dùng màu sắc nhất quán cho trạng thái hiển thị / ẩn
- Tối ưu khoảng cách, padding và độ nổi bật của hàng dữ liệu -->

<!-- ### 3. UX nên có thêm
- Nút làm mới dữ liệu
- Reset bộ lọc về mặc định
- Tìm kiếm realtime hoặc debounce nhẹ
- Xác nhận xóa bằng modal thay vì `window.confirm`
- Modal thêm/sửa cần validate từng trường ngay trên form
- Tự focus vào ô tên danh mục khi mở modal thêm mới -->

## Đề xuất giao diện trang danh mục

<!-- ### Header trang
- Tiêu đề: `Quản lý danh mục`
- Mô tả ngắn: quản lý nhóm sản phẩm, trạng thái và thứ tự sắp xếp
- 1 nút chính: `Thêm danh mục`
- 1 nút phụ: `Làm mới`

### Khối thống kê
Nên đặt phía trên bảng, gồm 4 thẻ nhỏ:
- Tổng danh mục
- Đang hiển thị
- Đang ẩn
- Có sản phẩm -->

<!-- ### Khu vực bộ lọc
- Ô tìm kiếm theo tên / đường dẫn
- Select trạng thái
- Nút tìm kiếm
- Nút xóa bộ lọc -->

<!-- ### Bảng danh sách
Các cột nên có:
- ID
- Tên danh mục
- Đường dẫn
- Danh mục cha
- Sản phẩm
- Trạng thái
- Thứ tự
- Thao tác -->

### Modal thêm/sửa
Các trường nên có:
- Tên danh mục
- Danh mục cha
- Trạng thái
- Thứ tự
- Đường dẫn tự sinh, chỉ đọc hoặc cho chỉnh sửa nâng cao
- Mô tả ngắn nếu nghiệp vụ cần

<!-- ## Gợi ý nghiệp vụ backend nếu cần đồng bộ
- API kiểm tra trùng tên hoặc trùng đường dẫn
- API lấy cây danh mục thay vì danh sách phẳng nếu có phân cấp nhiều tầng
- API thống kê danh mục theo trạng thái
- API xác nhận danh mục có sản phẩm trước khi xóa -->

<!-- ## Ưu tiên triển khai
1. Bổ sung thống kê đầu trang
2. Làm lại filter với nút reset
3. Cải thiện modal thêm/sửa và validate
4. Xác nhận xóa an toàn hơn
5. Tối ưu responsive và trạng thái loading -->

<!-- ## Kết luận
Trang danh mục hiện đã có nền tảng tốt, nhưng để đầy đủ nghiệp vụ thì cần bổ sung thêm phần kiểm tra dữ liệu, an toàn khi xóa và cải thiện bố cục quản trị. Sau khi hoàn thiện, trang sẽ dễ dùng hơn, ít lỗi nhập liệu hơn và phù hợp với quy trình quản trị bán hàng thực tế. -->
