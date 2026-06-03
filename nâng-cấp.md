Những chức năng nên thêm tiếp, theo thứ tự ưu tiên:

<!-- 1. Phân trang trên UI
Backend đã trả phantrang, frontend đã có state phanTrang, nhưng chưa render nút chuyển trang. Hiện chỉ lấy 10 dòng đầu, nếu danh mục nhiều sẽ không bấm sang trang được.
File: DanhSachDanhMuc.jsx (line 25) -->

<!-- 2. Khôi phục danh mục đã xóa mềm
Có checkbox “Hiển thị đã xóa”, nhưng dòng đã xóa chỉ bị disable sửa/xóa/trạng thái, chưa có nút “Khôi phục”. Backend hiện cũng chưa có API restore. -->


<!-- 3. Xóa vĩnh viễn
Vì đang dùng xóa mềm (deleted_at), nên khi xem mục đã xóa nên có thêm “Xóa vĩnh viễn” để dọn dữ liệu thật, nhất là danh mục tạo nhầm. -->

<!-- 4. Lọc theo danh mục cha
Hiện có cột “Danh mục cha” và form chọn cha, nhưng toolbar chưa có filter theo danh mục cha. Khi danh mục nhiều cấp, filter này rất cần. -->

<!-- 5. Hiển thị dạng cây
Danh mục có quan hệ cha-con, nhưng bảng đang hiển thị phẳng. Nên thêm view cây hoặc ít nhất indent danh mục con để dễ quản lý cấu trúc. -->

<!-- 6. Sắp xếp thứ tự nhanh
Có trường thutu, backend sort theo thutu, nhưng hiện phải mở modal từng dòng để sửa. Nên có nút lên/xuống, input inline, hoặc kéo-thả để đổi thứ tự.

7. Ảnh danh mục
Backend/model có trường hinhanh, repository cũng query hinhanh, nhưng modal chưa cho upload/chọn ảnh và bảng chưa hiển thị ảnh. Nếu website dùng danh mục ở trang chủ, ảnh danh mục sẽ hữu ích. -->

<!-- 8. Xem sản phẩm trong danh mục
Cột “Số sản phẩm” hiện chỉ là số. Nên cho click để nhảy sang trang sản phẩm đã lọc theo danh mục đó. -->

<!-- 9. Chi tiết/kết quả bulk rõ hơn
Bulk delete/status backend trả danh sách thành công/thất bại, nhưng UI chỉ toast tổng quan. Nên có modal/alert liệt kê danh mục nào thất bại và lý do. -->

<!-- 10. Dọn code slug trong modal
DanhMucModal.jsx có hàm taoDuongDan và state chỉnh slug nhưng hiện không dùng trong form; backend đang tự tạo slug. Nên bỏ phần thừa hoặc làm hẳn input “Đường dẫn” nếu muốn admin sửa slug. -->