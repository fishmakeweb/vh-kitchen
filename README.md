# vh kitchen

## Giới thiệu
vh kitchen là một dự án xây dựng trang web đặt đồ ăn nhanh, landing page cho nhà hàng, bếp ăn hoặc dịch vụ ẩm thực. Dự án được phát triển dựa trên các công nghệ web hiện đại để mang lại trải nghiệm mượt mà, thân thiện với người dùng và tối ưu cho nhà phát triển.

### Tính năng nổi bật  
- **Landing Page hiện đại:** Chứa các phần giới thiệu món ăn, giới thiệu, đặt hàng nhanh và liên hệ.
- **Admin Dashboard:** Cung cấp trang quản lý nội bộ (Dashboard, AI Menu Processor, Quản lý Flash Sale, Quản lý đơn hàng, ...).
- **Tích hợp AI Chatbot:** Trợ lý ảo (vh kitchen AI Assistant) giúp điều hướng và chăm sóc khách hàng tự động trên giao diện web.
- **Responsive & Tốc độ cao:** Sử dụng Tailwind CSS cùng với cấu trúc tối ưu của Next.js (App Router) giúp trang web hoạt động siêu tốc trên mọi thiết bị.

## Công nghệ sử dụng
- **Framework:** [Next.js](https://nextjs.org/) (React)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Icons:** Iconify
- **Animations:** Framer Motion

## 💾 Hướng dẫn cài đặt

Chào mừng bạn đến với **vh kitchen**! Dưới đây là các bước để cài đặt và chạy dự án trên máy tính của bạn.

### 📝 Các bước cài đặt

#### 1. **Di chuyển vào thư mục dự án**

```bash
cd package
```

#### 2. **Cài đặt các gói phụ thuộc (Dependencies)**

Bạn hãy chạy lệnh sau để tải các thư viện cần thiết:

```bash
npm install
```

Hoặc dùng yarn / pnpm tương tự: `pnpm install` / `yarn install`

#### 3. **Khởi chạy Development Server**

Sau khi xong bước cài đặt, khởi động server dev bằng lệnh:

```bash
npm run dev
```

Mở trình duyệt truy cập vào `http://localhost:3000` để xem kết quả.

---

## Cấu trúc thư mục tham khảo
- `src/app`: Nơi chứa toàn bộ cấu trúc router của Next.js (bao gồm `(admin)`, `(site)`, các routes API và trang chủ `page.tsx`).
- `src/components`: Chứa các component dùng chung phân chia theo layout, trang chủ (Home), trang chung (Shared Component),... 
- `public`: Chứa tài nguyên (ảnh, video, logos...).
- `package.json`, `tailwind.config.mjs`...: Các file cấu hình cơ bản của project.

## Happy coding! 💻
