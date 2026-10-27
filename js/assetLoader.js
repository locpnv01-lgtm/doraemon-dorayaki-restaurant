// Asset Loader hỗ trợ Sprite Sheets & Hiệu ứng động
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
      this.images[name] = null;
      this.loadedCount++;
    };
    img.src = src;
  }

  init() {
    this.loadImage('doraemon_sheet', 'assets/sprites/doraemon_sheet.png');
    this.loadImage('doraemon', 'assets/sprites/doraemon.png');
    this.loadImage('dorami', 'assets/sprites/dorami.png');
    this.loadImage('dorayaki', 'assets/sprites/dorayaki.png');
    this.loadImage('dirty_dish', 'assets/sprites/dirty_dish.png');
    this.loadImage('decor_bonsai', 'assets/sprites/decor_bonsai.png');
    this.loadImage('decor_lantern', 'assets/sprites/decor_lantern.png');
    this.loadImage('decor_lucky_cat', 'assets/sprites/decor_lucky_cat.png');
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
