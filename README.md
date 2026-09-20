# Gia phả Lê Viết — static site

Website tĩnh, không cần R/Shiny hay server-side database.

## Xem thử trên máy
Mở `index.html` bằng trình duyệt.

## Đưa lên GitHub Pages
1. Tạo một repository mới trên GitHub.
2. Upload toàn bộ nội dung thư mục này vào root của repository.
3. Vào Settings → Pages.
4. Trong Build and deployment, chọn Deploy from a branch.
5. Chọn branch `main` và thư mục `/ (root)`, rồi Save.

File `data/data.js` chứa dữ liệu để website hoạt động ngay cả khi mở trực tiếp từ máy.
Các file JSON được giữ thêm để thuận tiện bảo trì/chuyển đổi dữ liệu sau này.
