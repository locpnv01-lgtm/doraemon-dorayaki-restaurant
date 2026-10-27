// Asset Loader với cơ chế Dual-Mode: Dùng file ảnh thật từ assets/sprites/ HOẶC Fallback Procedural Art
class AssetLoader {
  constructor() {
    this.images = {};
    this.loadedCount = 0;
    this.totalCount = 0;
  }

  loadImage(name, src) {
    this.totalCount++;
    const img = new Image();
    img.onload = () => {
      this.images[name] = img;
      this.loadedCount++;
    };
    img.onerror = () => {
      // Khi không có file ngoài, gán null để fallback sang procedural canvas render
      this.images[name] = null;
      this.loadedCount++;
    };
    img.src = src;
  }

  init() {
    // Thử load các sprite tùy biến nếu user đặt vào
    this.loadImage('doraemon', 'assets/sprites/doraemon.png');
    this.loadImage('dorayaki', 'assets/sprites/dorayaki.png');
    this.loadImage('table', 'assets/sprites/table.png');
    this.loadImage('customer_1', 'assets/sprites/customer_1.png');
    this.loadImage('customer_2', 'assets/sprites/customer_2.png');
    this.loadImage('customer_3', 'assets/sprites/customer_3.png');
  }

  hasImage(name) {
    return Boolean(this.images[name] && this.images[name].complete && this.images[name].naturalWidth > 0);
  }

  getImage(name) {
    return this.images[name] || null;
  }
}

window.assetLoader = new AssetLoader();
window.assetLoader.init();
