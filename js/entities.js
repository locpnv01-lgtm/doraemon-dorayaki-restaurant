// Entities: Doraemon, Customers, Cooking Stove, Dining Tables
// Áp dụng kỹ thuật canvas-game-art (Chibi, Bobbing, Cartoon Outlines, Pixel Perfect)

class PlayerDoraemon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.baseSpeed = 220; // px / second
    this.carryingDorayaki = 0; // số lượng bánh đang bưng
    this.facing = 1; // 1: phải, -1: trái
    this.bobTimer = 0;
  }

  update(dt, upgrades) {
    const speedMult = 1 + (upgrades.bambooCopter.level * 0.25);
    const speed = this.baseSpeed * speedMult;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      this.facing = dx >= 0 ? 1 : -1;
      this.x += (dx / dist) * speed * dt;
      this.y += (dy / dist) * speed * dt;
      this.bobTimer += dt * 10;
    } else {
      this.bobTimer += dt * 2.5; // idle breathing
    }
  }

  render(ctx, upgrades) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));

    const bob = Math.sin(this.bobTimer) * 2;
    ctx.translate(0, bob);

    // Kiểm tra xem có custom sprite bên ngoài không
    if (window.assetLoader.hasImage('doraemon')) {
      const img = window.assetLoader.getImage('doraemon');
      ctx.scale(this.facing, 1);
      ctx.drawImage(img, -36, -56, 72, 72);

      // Chong chóng tre nếu có nâng cấp
      if (upgrades && upgrades.bambooCopter && upgrades.bambooCopter.level > 0) {
        ctx.fillStyle = "#eab308";
        ctx.fillRect(-2, -62, 4, 8);
        ctx.fillStyle = "#ca8a04";
        const rotorAngle = (this.bobTimer * 15) % (Math.PI * 2);
        ctx.save();
        ctx.translate(0, -62);
        ctx.scale(Math.cos(rotorAngle), 1);
        ctx.fillRect(-14, -2, 28, 4);
        ctx.restore();
      }

      // Hiển thị bánh rán bưng trên tay
      if (this.carryingDorayaki > 0) {
        for (let i = 0; i < this.carryingDorayaki; i++) {
          renderDorayakiIcon(ctx, 20, -10 - (i * 14), 16);
        }
      }

      ctx.restore();
      return;
    }

    // Fallback: Procedural Doraemon 2D Pixel Chibi
    ctx.scale(this.facing, 1);

    // Bóng dưới chân (Floor shadow)
    ctx.fillStyle = "rgba(0,0,0,0.2)";
    ctx.beginPath();
    ctx.ellipse(0, 4, 20, 7, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, bob);

    // Thân Doraemon (Xanh dương đặc trưng #0284c7)
    ctx.fillStyle = "#0284c7";
    ctx.beginPath();
    ctx.arc(0, -18, 22, 0, Math.PI * 2); // Đầu tròn
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.ellipse(0, 0, 18, 14, 0, 0, Math.PI * 2); // Thân
    ctx.fill();

    // Bụng trắng & Túi thần kỳ
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, 1, 13, 10, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, 2, 7, 0, Math.PI); // Bán nguyệt túi
    ctx.stroke();

    // Vòng cổ đỏ & Chuông vàng
    ctx.fillStyle = "#ef4444";
    ctx.fillRect(-12, -8, 24, 4);
    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(0, -4, 4, 0, Math.PI * 2);
    ctx.fill();

    // Mặt trắng Doraemon
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(0, -14, 18, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Mắt
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.ellipse(-5, -24, 5, 7, 0, 0, Math.PI * 2);
    ctx.ellipse(5, -24, 5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Tròng mắt
    ctx.fillStyle = "#0f172a";
    ctx.beginPath();
    ctx.arc(-3, -24, 2, 0, Math.PI * 2);
    ctx.arc(3, -24, 2, 0, Math.PI * 2);
    ctx.fill();

    // Mũi đỏ
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(0, -18, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Râu mèo 2 bên
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 1;
    [-1, 1].forEach(side => {
      ctx.beginPath();
      ctx.moveTo(side * 4, -16);
      ctx.lineTo(side * 14, -18);
      ctx.moveTo(side * 4, -14);
      ctx.lineTo(side * 15, -14);
      ctx.moveTo(side * 4, -12);
      ctx.lineTo(side * 14, -10);
      ctx.stroke();
    });

    // Chong chóng tre nếu có nâng cấp
    if (upgrades && upgrades.bambooCopter && upgrades.bambooCopter.level > 0) {
      ctx.fillStyle = "#eab308";
      ctx.fillRect(-2, -44, 4, 8);
      ctx.fillStyle = "#ca8a04";
      const rotorAngle = (this.bobTimer * 15) % (Math.PI * 2);
      ctx.save();
      ctx.translate(0, -44);
      ctx.scale(Math.cos(rotorAngle), 1);
      ctx.fillRect(-14, -2, 28, 4);
      ctx.restore();
    }

    // Hiển thị bánh rán bưng trên tay
    if (this.carryingDorayaki > 0) {
      for (let i = 0; i < this.carryingDorayaki; i++) {
        renderDorayakiIcon(ctx, 16, -10 - (i * 12), 16);
      }
    }

    ctx.restore();
  }
}

// Bàn ăn
class Table {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = 90;
    this.h = 60;
    this.customer = null;
    this.hasFood = false;
  }

  isOccupied() {
    return this.customer !== null;
  }

  render(ctx) {
    ctx.save();
    // Vẽ ghế 2 bên
    ctx.fillStyle = "#b45309";
    ctx.fillRect(this.x - 16, this.y + 12, 14, 34);
    ctx.fillRect(this.x + this.w + 2, this.y + 12, 14, 34);

    // Mặt bàn gỗ
    ctx.fillStyle = "#d97706";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "#92400e";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Bàn số
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText(`Bàn ${this.id}`, this.x + 28, this.y + 34);

    // Đĩa bánh trên bàn
    if (this.hasFood) {
      renderDorayakiIcon(ctx, this.x + 45, this.y + 30, 20);
    }

    ctx.restore();
  }
}

// Bếp nấu bánh rán (Stove)
class Stove {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 140;
    this.h = 70;
    this.cookedCount = 0;
    this.maxCapacity = 4;
    this.cookingProgress = 0; // 0 -> 1
    this.isCooking = false;
  }

  update(dt, cookDuration) {
    if (this.isCooking && this.cookedCount < this.maxCapacity) {
      this.cookingProgress += dt / cookDuration;
      if (this.cookingProgress >= 1) {
        this.cookingProgress = 0;
        this.cookedCount++;
        window.soundManager.playCook();
        if (this.cookedCount >= this.maxCapacity) {
          this.isCooking = false;
        }
      }
    }
  }

  startCook() {
    if (this.cookedCount < this.maxCapacity) {
      this.isCooking = true;
    }
  }

  takeDorayaki() {
    if (this.cookedCount > 0) {
      this.cookedCount--;
      this.isCooking = true; // tiếp tục nấu nếu còn chỗ
      return true;
    }
    return false;
  }

  render(ctx) {
    ctx.save();
    // Thân bếp nướng
    ctx.fillStyle = "#475569";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Mặt chảo nướng Dorayaki
    ctx.fillStyle = "#1e293b";
    ctx.fillRect(this.x + 10, this.y + 10, this.w - 20, this.h - 32);

    ctx.fillStyle = "#f8fafc";
    ctx.font = "bold 12px sans-serif";
    ctx.fillText("BẾP BÁNH RÁN", this.x + 24, this.y + 60);

    // Vẽ các bánh rán đang chín / đã nướng
    for (let i = 0; i < 4; i++) {
      const bx = this.x + 28 + (i * 28);
      const by = this.y + 24;
      if (i < this.cookedCount) {
        renderDorayakiIcon(ctx, bx, by, 16);
      } else if (i === this.cookedCount && this.isCooking) {
        // Bánh đang nướng nhấp nháy tiến độ
        const r = Math.max(0.1, 8 * Math.max(0, this.cookingProgress));
        ctx.fillStyle = `rgba(217, 119, 6, ${0.4 + this.cookingProgress * 0.6})`;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        // Vòng tròn chảo rỗng
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, 9, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

// Khách hàng (Customers)
class Customer {
  constructor(config, targetTable) {
    this.name = config.name;
    this.color = config.color;
    this.shirt = config.shirt;
    this.hair = config.hair;
    this.table = targetTable;
    this.table.customer = this;

    this.x = 480;
    this.y = 560; // Đi từ cửa vào
    this.targetX = targetTable.x + targetTable.w / 2;
    this.targetY = targetTable.y - 10;

    this.state = "ENTERING"; // ENTERING -> WAITING_FOOD -> EATING -> LEAVING
    this.patience = window.GAME_CONFIG.economy.customerPatience;
    this.maxPatience = this.patience;
    this.eatTimer = config.eatTime;
    this.tipChance = config.tipChance;
    this.isSatisfied = false;
  }

  update(dt, onLeave) {
    if (this.state === "ENTERING") {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 3) {
        this.x += (dx / dist) * 160 * dt;
        this.y += (dy / dist) * 160 * dt;
      } else {
        this.state = "WAITING_FOOD";
      }
    } else if (this.state === "WAITING_FOOD") {
      this.patience -= dt;
      if (this.patience <= 0) {
        // Giận dỗi bỏ về không trả tiền
        this.leave(false, onLeave);
      }
    } else if (this.state === "EATING") {
      this.eatTimer -= dt;
      if (this.eatTimer <= 0) {
        // Ăn xong -> Tính tiền
        this.leave(true, onLeave);
      }
    } else if (this.state === "LEAVING") {
      const dx = 480 - this.x;
      const dy = 580 - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 5) {
        this.x += (dx / dist) * 180 * dt;
        this.y += (dy / dist) * 180 * dt;
      } else {
        onLeave(this);
      }
    }
  }

  serve() {
    if (this.state === "WAITING_FOOD") {
      this.state = "EATING";
      this.table.hasFood = true;
      return true;
    }
    return false;
  }

  leave(paid, onLeave) {
    this.state = "LEAVING";
    this.table.customer = null;
    this.table.hasFood = false;
    this.isSatisfied = paid;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));

    // Kiểm tra sprite khách hàng
    let spriteName = null;
    if (this.name === "Nobita") spriteName = "customer_1";
    else if (this.name === "Shizuka") spriteName = "customer_2";
    else if (this.name === "Jaian") spriteName = "customer_3";

    if (spriteName && window.assetLoader.hasImage(spriteName)) {
      const img = window.assetLoader.getImage(spriteName);
      ctx.drawImage(img, -28, -52, 56, 56);
    } else {
      // Vẽ nhân vật đơn giản chibi
      // Bóng
      ctx.fillStyle = "rgba(0,0,0,0.18)";
      ctx.beginPath();
      ctx.ellipse(0, 4, 14, 5, 0, 0, Math.PI * 2);
      ctx.fill();

      // Thân / Áo
      ctx.fillStyle = this.shirt;
      ctx.fillRect(-10, -14, 20, 16);

      // Đầu
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(0, -22, 12, 0, Math.PI * 2);
      ctx.fill();

      // Tóc
      ctx.fillStyle = this.hair;
      ctx.beginPath();
      ctx.arc(0, -26, 12, Math.PI, Math.PI * 2);
      ctx.fill();
    }

    // Tên khách
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(this.name, 0, -38);

    // Trạng thái bong bóng biểu cảm
    if (this.state === "WAITING_FOOD") {
      // Bong bóng thèm bánh rán
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(-24, -68, 48, 24, 6);
      ctx.fill();
      ctx.stroke();
      renderDorayakiIcon(ctx, 0, -56, 12);

      // Thanh kiên nhẫn (Patience bar)
      const ratio = Math.max(0, this.patience / this.maxPatience);
      ctx.fillStyle = ratio > 0.3 ? "#22c55e" : "#ef4444";
      ctx.fillRect(-20, -44, 40 * ratio, 4);
    } else if (this.state === "EATING") {
      // Icon trái tim đang ăn ngon miệng
      ctx.fillStyle = "#ec4899";
      ctx.font = "16px sans-serif";
      ctx.fillText("♥ Măm!", 0, -52);
    }

    ctx.restore();
  }
}

// Hàm bổ trợ: Vẽ bánh rán Dorayaki thơm ngon chuẩn visual
function renderDorayakiIcon(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);

  if (window.assetLoader.hasImage('dorayaki')) {
    const img = window.assetLoader.getImage('dorayaki');
    ctx.drawImage(img, -size, -size * 0.75, size * 2, size * 1.5);
    ctx.restore();
    return;
  }

  // Vỏ bánh nâu vàng óng ánh
  ctx.fillStyle = "#b45309";
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#78350f";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Nhân đậu đỏ ngọt ngào ở giữa
  ctx.fillStyle = "#450a0a";
  ctx.fillRect(-size * 0.75, -1.5, size * 1.5, 3);

  // Ánh sáng bóng trên mặt bánh
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.beginPath();
  ctx.ellipse(-size * 0.25, -size * 0.2, size * 0.4, size * 0.18, -0.2, 0, Math.PI * 2);
  ctx.fill();

  ctx.restore();
}

window.PlayerDoraemon = PlayerDoraemon;
window.Table = Table;
window.Stove = Stove;
window.Customer = Customer;
window.renderDorayakiIcon = renderDorayakiIcon;
