// Entities v2.0: Animation 4-frame, Dorami trợ lý, Dọn rửa bát đĩa, Khách hàng đông đúc
class PlayerDoraemon {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.baseSpeed = 240;
    this.carryingDorayaki = 0;
    this.carryingDishes = 0;
    this.facing = 1;
    this.animTimer = 0;
    this.isMoving = false;
  }

  update(dt, upgrades) {
    const copterLevel = upgrades.bambooCopter ? upgrades.bambooCopter.level : 0;
    const speedMult = 1 + (copterLevel * 0.3);
    const speed = this.baseSpeed * speedMult;

    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      this.isMoving = true;
      this.facing = dx >= 0 ? 1 : -1;
      this.x += (dx / dist) * speed * dt;
      this.y += (dy / dist) * speed * dt;
      this.animTimer += dt * 10; // Chạy hoạt ảnh bước đi
    } else {
      this.isMoving = false;
      this.animTimer += dt * 3; // Nhịp thở idle nhún nhẹ
    }
  }

  render(ctx, upgrades) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));

    // Hiệu ứng bước đi nhún nhảy 4 frame
    const frameIndex = this.isMoving ? Math.floor(this.animTimer) % 4 : 0;
    const idleBob = !this.isMoving ? Math.sin(this.animTimer) * 1.5 : 0;
    ctx.translate(0, idleBob);

    if (window.assetLoader.hasImage('doraemon_sheet')) {
      const sheet = window.assetLoader.getImage('doraemon_sheet');
      ctx.scale(this.facing, 1);
      // Vẽ frame từ sprite sheet 48x48 pixel art, phóng to nét chuẩn 16-bit
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(sheet, frameIndex * 48, 0, 48, 48, -28, -52, 56, 56);

      // Chong chóng tre quay tít trên đầu khi di chuyển hoặc nâng cấp
      if (upgrades && upgrades.bambooCopter && upgrades.bambooCopter.level > 0) {
        ctx.fillStyle = "#eab308";
        ctx.fillRect(-2, -58, 4, 8);
        ctx.fillStyle = "#ca8a04";
        const rotorAngle = (this.animTimer * 18) % (Math.PI * 2);
        ctx.save();
        ctx.translate(0, -58);
        ctx.scale(Math.cos(rotorAngle), 1);
        ctx.fillRect(-15, -2, 30, 4);
        ctx.restore();
      }

      // Bánh rán bưng trên tay
      if (this.carryingDorayaki > 0) {
        for (let i = 0; i < this.carryingDorayaki; i++) {
          renderDorayakiIcon(ctx, 18, -12 - (i * 12), 14);
        }
      }

      // Dĩa bát dơ đang cầm đi rửa
      if (this.carryingDishes > 0) {
        for (let i = 0; i < this.carryingDishes; i++) {
          renderDirtyDishIcon(ctx, -18, -10 - (i * 10), 14);
        }
      }

      ctx.restore();
      return;
    }

    // Fallback nếu chưa load sheet
    ctx.restore();
  }
}

// Em gái Dorami: Tự động di chuyển dọn bàn và phụ bưng bánh!
class AssistantDorami {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.targetX = x;
    this.targetY = y;
    this.speed = 180;
    this.facing = 1;
    this.animTimer = 0;
    this.currentTask = null; // 'CLEAN' or 'SERVE'
    this.state = "IDLE";
    this.timer = 0;
  }

  update(dt, game) {
    this.animTimer += dt * 8;
    this.timer += dt;

    // Tự động tìm bàn có dĩa dơ cần dọn
    if (!this.currentTask && this.timer > 1.0) {
      this.timer = 0;
      const dirtyTable = game.tables.find(t => t.isDirty);
      if (dirtyTable) {
        this.currentTask = { type: "CLEAN", target: dirtyTable };
        this.targetX = dirtyTable.x + dirtyTable.w / 2;
        this.targetY = dirtyTable.y + dirtyTable.h / 2;
      } else {
        // Đi lang thang đón khách
        if (Math.random() < 0.1) {
          this.targetX = 460 + (Math.random() * 120 - 60);
          this.targetY = 240 + (Math.random() * 60 - 30);
        }
      }
    }

    // Di chuyển tới target
    const dx = this.targetX - this.x;
    const dy = this.targetY - this.y;
    const dist = Math.hypot(dx, dy);

    if (dist > 4) {
      this.facing = dx >= 0 ? 1 : -1;
      this.x += (dx / dist) * this.speed * dt;
      this.y += (dy / dist) * this.speed * dt;
    } else if (this.currentTask) {
      // Hoàn thành task
      if (this.currentTask.type === "CLEAN") {
        const table = this.currentTask.target;
        if (table.isDirty) {
          table.clean();
          game.coins += window.GAME_CONFIG.economy.cleanTipReward;
          window.soundManager.playCoin();
        }
      }
      this.currentTask = null;
      // Quay về khu bồn rửa bát
      this.targetX = game.sink.x + 20;
      this.targetY = game.sink.y + 60;
    }
  }

  render(ctx) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));
    const bob = Math.sin(this.animTimer) * 2;
    ctx.translate(0, bob);
    ctx.scale(this.facing, 1);

    if (window.assetLoader.hasImage('dorami')) {
      const img = window.assetLoader.getImage('dorami');
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, -24, -48, 48, 48);
    }

    // Tên trợ lý Dorami
    ctx.fillStyle = "#e11d48";
    ctx.font = "bold 10px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("Dorami (Phụ Bếp)", 0, -56);

    ctx.restore();
  }
}

// Bàn ăn: Có trạng thái sạch sẽ, có thức ăn, và dĩa bát dơ sau khi ăn
class Table {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.w = 90;
    this.h = 60;
    this.customer = null;
    this.hasFood = false;
    this.isDirty = false;
  }

  isOccupied() {
    return this.customer !== null || this.isDirty;
  }

  clean() {
    this.isDirty = false;
    this.hasFood = false;
  }

  render(ctx) {
    ctx.save();
    // Ghế 2 bên
    ctx.fillStyle = "#b45309";
    ctx.fillRect(this.x - 14, this.y + 12, 12, 34);
    ctx.fillRect(this.x + this.w + 2, this.y + 12, 12, 34);

    // Khăn trải bàn phong cách Nhật
    ctx.fillStyle = this.isDirty ? "#fde68a" : "#ffffff";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "#b45309";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Số bàn
    ctx.fillStyle = "#78350f";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`Bàn ${this.id}`, this.x + this.w / 2, this.y + 35);

    // Đồ ăn hoặc Bát dĩa dơ
    if (this.hasFood) {
      renderDorayakiIcon(ctx, this.x + this.w / 2, this.y + 24, 18);
    } else if (this.isDirty) {
      renderDirtyDishIcon(ctx, this.x + this.w / 2, this.y + 24, 18);
      ctx.fillStyle = "#ef4444";
      ctx.font = "bold 10px sans-serif";
      ctx.fillText("Cần Dọn!", this.x + this.w / 2, this.y + 50);
    }

    ctx.restore();
  }
}

// Bồn rửa bát (Sink & Clean Station)
class DishSink {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 100;
    this.h = 60;
  }

  render(ctx) {
    ctx.save();
    // Bệ đá rửa chén
    ctx.fillStyle = "#64748b";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 2;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Chậu rửa
    ctx.fillStyle = "#38bdf8";
    ctx.fillRect(this.x + 10, this.y + 10, this.w - 20, this.h - 26);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 11px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("BỒN RỬA BÁT", this.x + this.w / 2, this.y + 52);

    ctx.restore();
  }
}

// Bếp nướng siêu tốc
class Stove {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 160;
    this.h = 75;
    this.cookedCount = 0;
    this.maxCapacity = 5;
    this.cookingProgress = 0;
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
      this.isCooking = true;
      return true;
    }
    return false;
  }

  render(ctx) {
    ctx.save();
    // Bệ bếp inox
    ctx.fillStyle = "#475569";
    ctx.fillRect(this.x, this.y, this.w, this.h);
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    ctx.strokeRect(this.x, this.y, this.w, this.h);

    // Chảo gang đen
    ctx.fillStyle = "#0f172a";
    ctx.fillRect(this.x + 8, this.y + 8, this.w - 16, this.h - 32);

    ctx.fillStyle = "#fbbf24";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(`LÒ BÁNH RÁN (${this.cookedCount}/${this.maxCapacity})`, this.x + this.w / 2, this.y + 64);

    // Vẽ bánh nướng
    for (let i = 0; i < this.maxCapacity; i++) {
      const bx = this.x + 20 + (i * 28);
      const by = this.y + 24;
      if (i < this.cookedCount) {
        renderDorayakiIcon(ctx, bx, by, 14);
      } else if (i === this.cookedCount && this.isCooking) {
        const r = Math.max(0.1, 7 * Math.max(0, this.cookingProgress));
        ctx.fillStyle = `rgba(245, 158, 11, ${0.5 + this.cookingProgress * 0.5})`;
        ctx.beginPath();
        ctx.arc(bx, by, r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.strokeStyle = "#334155";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(bx, by, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
    }

    ctx.restore();
  }
}

// Khách hàng có hoạt ảnh đi vào, nhấp nhô chân, ăn ngon miệng, để lại dĩa dơ
class Customer {
  constructor(config, targetTable, isVIP = false) {
    this.name = config.name + (isVIP ? " (VIP)" : "");
    this.shirt = config.shirt;
    this.hair = config.hair;
    this.sprite = config.sprite;
    this.isVIP = isVIP;
    this.table = targetTable;
    this.table.customer = this;

    this.x = 520;
    this.y = 600; // Cửa vào
    this.targetX = targetTable.x + targetTable.w / 2;
    this.targetY = targetTable.y - 12;

    this.state = "ENTERING";
    this.patience = window.GAME_CONFIG.economy.customerPatience;
    this.maxPatience = this.patience;
    this.eatTimer = config.eatTime;
    this.tipChance = config.tipChance;
    this.animTimer = 0;
  }

  update(dt, onLeave) {
    this.animTimer += dt * 6;

    if (this.state === "ENTERING") {
      const dx = this.targetX - this.x;
      const dy = this.targetY - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 4) {
        this.x += (dx / dist) * 170 * dt;
        this.y += (dy / dist) * 170 * dt;
      } else {
        this.state = "WAITING_FOOD";
      }
    } else if (this.state === "WAITING_FOOD") {
      this.patience -= dt;
      if (this.patience <= 0) {
        this.leave(false, onLeave);
      }
    } else if (this.state === "EATING") {
      this.eatTimer -= dt;
      if (this.eatTimer <= 0) {
        this.leave(true, onLeave);
      }
    } else if (this.state === "LEAVING") {
      const dx = 520 - this.x;
      const dy = 620 - this.y;
      const dist = Math.hypot(dx, dy);
      if (dist > 6) {
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
    if (paid) {
      // Khách ăn xong để lại dĩa dơ trên bàn!
      this.table.isDirty = true;
    }
    this.isSatisfied = paid;
  }

  render(ctx) {
    ctx.save();
    ctx.translate(Math.floor(this.x), Math.floor(this.y));

    // Hoạt ảnh bước đi đung đưa
    const walkBob = (this.state === "ENTERING" || this.state === "LEAVING") ? Math.sin(this.animTimer * 2) * 2 : 0;
    ctx.translate(0, walkBob);

    if (window.assetLoader.hasImage(this.sprite)) {
      const img = window.assetLoader.getImage(this.sprite);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(img, -24, -48, 48, 48);
    } else {
      ctx.fillStyle = this.shirt;
      ctx.fillRect(-10, -14, 20, 16);
      ctx.fillStyle = "#fde047";
      ctx.beginPath();
      ctx.arc(0, -22, 12, 0, Math.PI * 2);
      ctx.fill();
    }

    // Tên và danh hiệu VIP
    ctx.fillStyle = this.isVIP ? "#f59e0b" : "#1e293b";
    ctx.font = `bold ${this.isVIP ? 12 : 11}px sans-serif`;
    ctx.textAlign = "center";
    ctx.fillText(this.name, 0, -38);

    // Trạng thái chờ / ăn
    if (this.state === "WAITING_FOOD") {
      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.roundRect(-24, -68, 48, 24, 6);
      ctx.fill();
      ctx.stroke();
      renderDorayakiIcon(ctx, 0, -56, 12);

      const ratio = Math.max(0, this.patience / this.maxPatience);
      ctx.fillStyle = ratio > 0.3 ? "#22c55e" : "#ef4444";
      ctx.fillRect(-20, -44, 40 * ratio, 4);
    } else if (this.state === "EATING") {
      ctx.fillStyle = "#ec4899";
      ctx.font = "bold 14px sans-serif";
      ctx.fillText("♥ Ngon quá!", 0, -52);
    }

    ctx.restore();
  }
}

function renderDorayakiIcon(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  if (window.assetLoader.hasImage('dorayaki')) {
    const img = window.assetLoader.getImage('dorayaki');
    ctx.drawImage(img, -size, -size * 0.75, size * 2, size * 1.5);
    ctx.restore();
    return;
  }
  ctx.fillStyle = "#b45309";
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.58, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function renderDirtyDishIcon(ctx, x, y, size) {
  ctx.save();
  ctx.translate(x, y);
  if (window.assetLoader.hasImage('dirty_dish')) {
    const img = window.assetLoader.getImage('dirty_dish');
    ctx.drawImage(img, -size, -size, size * 2, size * 2);
    ctx.restore();
    return;
  }
  ctx.fillStyle = "#94a3b8";
  ctx.beginPath();
  ctx.ellipse(0, 0, size, size * 0.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

window.PlayerDoraemon = PlayerDoraemon;
window.AssistantDorami = AssistantDorami;
window.Table = Table;
window.Stove = Stove;
window.DishSink = DishSink;
window.Customer = Customer;
window.renderDorayakiIcon = renderDorayakiIcon;
window.renderDirtyDishIcon = renderDirtyDishIcon;
