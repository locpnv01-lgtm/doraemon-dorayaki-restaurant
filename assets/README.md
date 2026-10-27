# Hướng dẫn tải & Đặt Assets Game Doraemon Restaurant

Thư mục assets được cấu trúc để tự động nạp sprite/audio khi bạn bỏ file vào đúng tên:

```
dorayaki-restaurant/
├── index.html
├── js/
│   ├── config.js       <-- Tùy chỉnh thông số game, giá bán, thời gian nướng
│   ├── assetLoader.js  <-- Trình nạp sprite (tự động fallback nếu chưa tải ảnh)
│   ├── entities.js     <-- Khách hàng, Doraemon, Bàn ghế, Bếp
│   ├── game.js         <-- Vòng lặp chính Game Loop & State Machine
│   └── audio.js        <-- Âm thanh hiệu ứng Web Audio Synth + Fallback
└── assets/
    ├── sprites/
    │   ├── doraemon.png    <-- Sprite Doraemon (hoặc sprite sheet)
    │   ├── customer_1.png  <-- Nobita (tùy chọn)
    │   ├── customer_2.png  <-- Shizuka (tùy chọn)
    │   ├── customer_3.png  <-- Jaian (tùy chọn)
    │   ├── dorayaki.png    <-- Bánh rán
    │   └── table.png       <-- Bàn ghế
    ├── audio/
    │   ├── coin.mp3        <-- Tiếng nhận tiền
    │   ├── cook.mp3        <-- Tiếng nướng bánh
    │   └── bell.mp3        <-- Tiếng khách vào
    └── tiles/
        └── floor.png       <-- Nền gạch nhà hàng
```

> **Cơ chế Fallback thông minh:** 
> Nếu trong thư mục `assets/` chưa có file ảnh thật, engine sẽ **tự động vẽ Procedural Pixel Art (Doraemon & Bánh rán)** để bạn vẫn có thể mở lên chơi ngay lập tức mà không bao giờ bị màn hình đen hay lỗi 404!
