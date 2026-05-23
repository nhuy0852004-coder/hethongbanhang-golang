# Nâng cấp sản phẩm

## Mục tiêu
- Chuẩn hóa toàn bộ module sản phẩm theo cùng ngôn ngữ giao diện với màn hình danh mục.
- Đảm bảo module sản phẩm đủ đầy nghiệp vụ để vận hành thực tế ở môi trường quản trị.
- Tối ưu trải nghiệm nhập liệu, tìm kiếm, lọc, xem nhanh, chỉnh sửa và quản lý tồn kho.
- Đảm bảo mọi trường tiền tệ hiển thị và nhập đúng định dạng tiền Việt Nam.

## Nguyên tắc triển khai
- Lấy màn hình danh mục làm chuẩn tham chiếu cho style, spacing, table, button, card, modal, empty state.
- Ưu tiên đồng bộ UX hơn là tự phát sinh style mới.
- Form phải rõ ràng, ít lỗi nhập liệu, có validate trước khi gửi API.
- Dữ liệu hiển thị phải nhất quán giữa danh sách, chi tiết, form và API.
- Không hard-code tiền tệ, trạng thái, danh mục hoặc biến thể nếu có thể lấy từ nguồn dữ liệu.

## Phạm vi chức năng cần có

<!-- ### 1. Quản lý danh sách sản phẩm
- Hiển thị danh sách sản phẩm theo bảng hoặc card đúng phong cách admin.
- Có phân trang.
- Có tìm kiếm theo tên, mã, SKU, barcode.
- Có lọc theo:
  - danh mục
  - trạng thái hoạt động
  - tình trạng tồn kho
  - khoảng giá
  - sản phẩm nổi bật / bán chạy / khuyến mãi
- Có sắp xếp theo:
  - mới nhất
  - cũ nhất
  - giá tăng dần
  - giá giảm dần
  - tồn kho thấp
  - lượt bán
- Có checkbox chọn nhiều để thao tác hàng loạt.
- Hiển thị số lượng kết quả, số trang và trạng thái loading.

### 2. Thêm mới sản phẩm
Form thêm mới cần có đầy đủ trường nghiệp vụ:
- Tên sản phẩm
- Mã sản phẩm / SKU
- Mô tả ngắn
- Mô tả chi tiết
- Danh mục
- Thương hiệu
- Đơn vị tính
- Giá nhập
- Giá bán
- Giá khuyến mãi
- Số lượng tồn kho
- Ngưỡng cảnh báo tồn kho
- Trọng lượng / kích thước nếu có
- Trạng thái kích hoạt
- Sản phẩm nổi bật
- Sản phẩm bán chạy
- Sản phẩm mới
- Có cho phép đặt trước hay không
- Hình ảnh chính
- Album hình ảnh
- Thuộc tính / biến thể nếu hệ thống hỗ trợ

Yêu cầu form:
- Validate bắt buộc với các trường cốt lõi.
- Không cho lưu nếu giá bán nhỏ hơn giá nhập trong trường hợp nghiệp vụ không cho phép.
- Không cho lưu số lượng âm.
- Có preview ảnh trước khi lưu.
- Có trạng thái loading khi upload ảnh hoặc submit.
- Có thông báo lỗi rõ ràng theo từng field. -->

<!-- ### 3. Chỉnh sửa sản phẩm
- Dữ liệu cũ phải được đổ đầy đủ vào form.
- Cho phép cập nhật từng phần mà không làm mất dữ liệu ảnh hoặc thuộc tính nếu không thay đổi.
- Hiển thị cảnh báo nếu thay đổi ảnh, giá hoặc tồn kho ảnh hưởng đến đơn hàng hoặc chiến lược bán.
- Có nút lưu nháp hoặc lưu cập nhật tùy luồng nghiệp vụ. -->

### 4. Xem chi tiết sản phẩm
- Hiển thị đầy đủ thông tin sản phẩm.
- Có ảnh chính và album ảnh.
- Có khối thông tin giá, tồn kho, trạng thái, lượt bán, ngày tạo, ngày cập nhật.
- Có lịch sử chỉnh sửa nếu hệ thống có hỗ trợ.
- Có nút chuyển sang sửa nhanh.
- Có nút nhân bản sản phẩm nếu cần tạo sản phẩm tương tự.

### 5. Quản lý tồn kho
- Hiển thị số lượng tồn thực tế.
- Có cảnh báo sắp hết hàng.
- Có cảnh báo hết hàng.
- Có màn hình hoặc modal nhập kho / xuất kho nếu nghiệp vụ cần.
- Có log biến động tồn kho nếu hệ thống hỗ trợ.
- Khi cập nhật số lượng phải đảm bảo không lệch số liệu giữa UI và backend.

### 6. Quản lý giá và khuyến mãi
- Giá phải chuẩn hóa theo tiền Việt Nam ở toàn bộ UI.
- Có thể cấu hình giá gốc, giá nhập, giá bán, giá khuyến mãi.
- Hỗ trợ trạng thái đang khuyến mãi và thời gian bắt đầu/kết thúc khuyến mãi nếu nghiệp vụ yêu cầu.
- Cần hiển thị rõ giá trước giảm, giá sau giảm, phần trăm giảm.
- Khi nhập tiền phải chỉ nhận số hợp lệ, tự format theo chuẩn VN sau khi blur hoặc trước khi submit.
- Không được lưu hoặc hiển thị dạng raw như `1000000` nếu UI đã có quy ước format tiền.

### 7. Hình ảnh sản phẩm
- Upload ảnh đại diện.
- Upload nhiều ảnh bổ sung.
- Cho phép sắp xếp thứ tự ảnh.
- Cho phép xóa ảnh từng ảnh.
- Cho phép chọn ảnh chính.
- Có preview ảnh, trạng thái upload, và xử lý lỗi upload.
- Có fallback nếu ảnh bị lỗi tải.

### 8. Phân loại và thuộc tính
- Gắn sản phẩm vào danh mục đúng cấu trúc hệ thống.
- Nếu có thuộc tính như màu sắc, size, chất liệu, dung tích, cần hỗ trợ chọn nhiều và lưu đồng bộ.
- Nếu có biến thể sản phẩm, cần map rõ giữa sản phẩm cha và biến thể con.
- Có khả năng mở rộng cho thuộc tính động trong tương lai.

### 9. Trạng thái và hành vi kinh doanh
- Sản phẩm hoạt động / không hoạt động.
- Sản phẩm ẩn / hiện.
- Sản phẩm nổi bật.
- Sản phẩm mới.
- Sản phẩm bán chạy.
- Sản phẩm khuyến mãi.
- Sản phẩm còn hàng / hết hàng / sắp hết hàng.
- Có thể gắn nhãn tuỳ theo chiến lược bán hàng.

### 10. Tương thích nghiệp vụ bán hàng
- Sản phẩm phải dùng được cho giỏ hàng, đơn hàng, báo cáo và thống kê.
- Dữ liệu sản phẩm khi đổi tên, đổi giá hoặc đổi trạng thái phải đồng bộ để không ảnh hưởng đến đơn hàng cũ.
- Có tính tương thích với màn hình website bán hàng và màn hình admin.

## Yêu cầu giao diện
- Lấy màn hình danh mục làm chuẩn tham chiếu khi chỉnh sửa sản phẩm.
- Đồng bộ các yếu tố:
  - layout
  - card
  - table
  - spacing
  - button style
  - badge/trạng thái
  - empty state
  - modal
  - form control
  - notification/toast
- Nếu có khoảng cách, kích thước, màu sắc lệch so với danh mục thì ưu tiên sửa cho giống danh mục.
- Ở màn hình nhỏ phải đảm bảo không vỡ layout.

## Yêu cầu validate và chất lượng dữ liệu
- Validate tên sản phẩm không rỗng.
- Validate SKU hoặc mã sản phẩm không trùng nếu hệ thống yêu cầu unique.
- Validate giá và số lượng là số hợp lệ.
- Validate ảnh đúng định dạng cho phép.
- Validate danh mục bắt buộc nếu sản phẩm phải thuộc danh mục.
- Validate dữ liệu trước khi gọi API và hiển thị lỗi theo field.
- Không để form gửi dữ liệu thiếu, sai kiểu hoặc sai định dạng.

## Yêu cầu tiền tệ VN
- Mọi trường giá, giá khuyến mãi, giá nhập, giá bán phải hiển thị theo định dạng tiền Việt Nam.
- Khi nhập liệu phải chấp nhận đúng kiểu dữ liệu số và chuyển đổi sang định dạng phù hợp trước khi lưu.
- Không để hiển thị giá kiểu thô như `1000000`; phải hiển thị dạng `1.000.000 ₫` hoặc format VN tương đương theo quy ước dự án.
- Các component dùng lại phải thống nhất một hàm format tiền chung.

## Yêu cầu kỹ thuật
- Tách rõ: UI, form state, API call, mapping dữ liệu, validate.
- Không đặt logic nghiệp vụ nặng trực tiếp trong JSX.
- Có xử lý loading, error, empty state nhất quán.
- Hạn chế re-render không cần thiết.
- Nếu có component dùng chung, phải tái sử dụng để tránh lặp code.
- Dữ liệu API trả về cần được normalize trước khi render nếu cần.

## Tiêu chí hoàn thành
- Giao diện sản phẩm đồng bộ với danh mục.
- Đủ các nghiệp vụ cốt lõi của quản lý sản phẩm.
- Form nhập tiền hoạt động đúng và không gây lỗi định dạng.
- Có đầy đủ trạng thái loading, empty, error, success.
- Không làm vỡ layout ở các màn hình nhỏ.
- Không phát sinh lỗi linter hoặc runtime rõ ràng.
- Có thể mở rộng cho biến thể, khuyến mãi và quản lý kho trong tương lai.
