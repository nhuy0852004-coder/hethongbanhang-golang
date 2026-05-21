# Nâng cấp sản phẩm

## Mục tiêu
- Chuẩn hóa giao diện phần sản phẩm theo phong cách của danh mục.
- Giữ bố cục, khoảng cách, màu sắc, nút bấm và trạng thái nhất quán với màn hình danh mục.
- Đảm bảo mọi trường tiền tệ hiển thị và nhập đúng định dạng tiền Việt Nam.

## Phạm vi cần nâng cấp
- Danh sách sản phẩm
- Form thêm/sửa sản phẩm
- Modal chi tiết sản phẩm
- Bộ lọc, tìm kiếm, phân trang
- Các trạng thái rỗng, loading, lỗi

## Yêu cầu giao diện
- Lấy màn hình danh mục làm chuẩn tham chiếu khi chỉnh sửa sản phẩm.
- Ưu tiên đồng bộ:
  - layout
  - card
  - table
  - spacing
  - button style
  - badge/trạng thái
  - empty state
- Nếu có khác biệt giữa sản phẩm và danh mục, phải điều chỉnh để nhìn đồng bộ hơn.

## Yêu cầu tiền tệ VN
- Mọi trường giá, giá khuyến mãi, giá nhập, giá bán phải hiển thị theo định dạng tiền Việt Nam.
- Khi nhập liệu phải chấp nhận đúng kiểu dữ liệu số và chuyển đổi sang định dạng phù hợp trước khi lưu.
- Không để hiển thị giá kiểu thô như `1000000`; phải hiển thị dạng `1.000.000 ₫` hoặc format VN tương đương theo quy ước dự án.

## Tiêu chí hoàn thành
- Giao diện sản phẩm đồng bộ với danh mục.
- Form nhập tiền hoạt động đúng và không gây lỗi định dạng.
- Không làm vỡ layout ở các màn hình nhỏ.
- Không phát sinh lỗi linter hoặc runtime rõ ràng.
