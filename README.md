# Hoang-Huy-Quan

## Cài Đặt Môi Trường

1. Cài đặt MongoDB Compass theo link sau:

   [Tải MongoDB Compass](https://www.mongodb.com/try/download/compass)

2. Tạo kết nối MongoDB mới:
   
   ![Screenshot 2025-01-22 at 11 35 29](https://github.com/user-attachments/assets/5feb2f5d-69c1-453b-9989-4800a6508e22)
   
   - Giá trị mặc định là `mongodb://localhost:27017/`.
   - Bạn cũng có thể thay đổi port nếu cần. Nếu thay đổi, vui lòng cập nhật lại biến `MONGO_DB_URL` trong file `.env.dev` tại thư mục `Hoang-Huy-Quan/code-challenge/problem5`.

3. Tại thư mục gốc, chạy lệnh `yarn all` để cài đặt `node_modules` cho các mono repo (Tôi sử dụng mono repo cho dự án này, với mỗi bài toán là một repo riêng biệt).

## Cách Chạy Ứng Dụng

### Với Problem 4:
- Truy cập vào file `Hoang-Huy-Quan/code-challenge/problem4/index.ts`.
- Truyền số nguyên muốn test vào các hàm `sum_to_n_a(5)`, `sum_to_n_b(5)`, `sum_to_n_c(5)` (Hiện tại tôi đang để giá trị là 5).
- Tại thư mục gốc, chạy lệnh `yarn problem4` để xem kết quả.

### Với Problem 5:
- Tại thư mục gốc, chạy lệnh `yarn problem5` để chạy các dịch vụ.
   - Dịch vụ bao gồm các API:
      - `sign-in`
      - `sign-out`
      - `sign-up`
      - `get-user`
      - `get-users`
      - `update-user`
      - `delete-user`
      - `update-user-score`
- Mở thêm một terminal mới và tại thư mục gốc, chạy lệnh `yarn problem6` để chạy web và test các API đã được triển khai ở Problem 5.
- Màn hình đăng nhập sẽ hiển thị trên website.
  
  ![Screenshot 2025-01-22 at 11 48 06](https://github.com/user-attachments/assets/49dd34bb-3eff-4e78-8c74-b8c5a318d019)
  
- Bấm vào nút đăng ký để tạo tài khoản.
  
  ![Screenshot 2025-01-22 at 11 48 16](https://github.com/user-attachments/assets/58f5c9c6-1434-4501-be31-e2eb1a7d8bcd)
  
**Lưu ý**: Tài khoản được tạo đầu tiên sẽ được cấp quyền **admin**, các tài khoản sau sẽ có quyền **user** bình thường. Tôi biết việc cấp quyền admin cần một quy trình phức tạp hơn, nhưng tôi đã xử lý theo cách này để phân loại quyền của tài khoản.

  ![Screenshot 2025-01-22 at 12 05 40](https://github.com/user-attachments/assets/81dda3c7-34fe-4a8a-bc77-96bda86d7064)

- Sau khi đăng ký và đăng nhập, bạn có thể thử các tính năng:
   - Tạo người dùng.
   - Lấy danh sách người dùng.
   - Lấy chi tiết người dùng.
   - Cập nhật thông tin người dùng.
   - Xóa người dùng.

### Với Problem 6:
- Tại thư mục gốc, chạy lệnh `yarn problem5`.
- Mở thêm một terminal mới và tại thư mục gốc, chạy lệnh `yarn problem6`.
- Tương tự như Problem 5, sau khi đăng ký và đăng nhập, bạn có thể test tính năng cộng điểm cho người dùng bằng cách chọn mục trong dropdown và bấm "Cộng điểm".

#### Sơ đồng minh họa luồng thực thi:

![Untitled Diagram-Page-2 (1)](https://github.com/user-attachments/assets/db1bf074-6b9b-43be-bfa1-81b57b84c2ac)

#### Cải thiện:
- Hiện tại, tôi đang cộng điểm trực tiếp vào bảng `User`, điều này không tốt cho việc quản lý dữ liệu vì không thể xem lịch sử cộng điểm hoặc sao lưu. Để cải thiện, chúng ta có thể tách riêng một bảng `UserScore` để lưu lại các lần cộng điểm của người dùng.


