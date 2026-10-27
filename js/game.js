// Game Engine Loop v2.0: Quản lý nhà hàng quy mô lớn, dọn rửa bát đĩa, trợ lý Dorami
class Game {
  constructor() {
    this.canvas = document.getElementById("gameCanvas");
    this.ctx = this.canvas.getContext("2d");

    this.coins = window.GAME_CONFIG.economy.startingCoins;
    this.reputation = 0;
    this.upgrades = JSON.parse(JSON.stringify(window.GAME_CONFIG.upgrades));

    this.lastTime = performance.now();
    this.spawnTimer = 0;

    this.initEntities();
    this.setupInputs();
    this.setupUI();

    requestAnimationFrame((t) => this.loop(t));
  }

  initEntities() {
    this.player = new window.PlayerDoraemon(520, 260);
    this.stove = new window.Stove(440, 60);
    this.sink = new window.DishSink(880, 60);

    // 6 bàn ăn được bố trí 2 hàng rộng rãi
    this.tables = [
      new window.Table(1, 140, 180),
      new window.Table(2, 470, 180),
      new window.Table(3, 800, 180),
      new window.Table(4, 140, 380),
      new window.Table(5, 470, 380),
      new window.Table(6, 800, 380)
    ];

    this.customers = [];
    this.dorami = null;
    this.stove.startCook();
  }

  setupInputs() {
    this.canvas.addEventListener("click", (e) => {
      window.soundManager.unlock();
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const scaleY = this.canvas.height / rect.height;
      const clickX = (e.clientX - rect.left) * scaleX;
      const clickY = (e.clientY - rect.top) * scaleY;

      // 1. Click Bếp lấy bánh
      if (
        clickX >= this.stove.x && clickX <= this.stove.x + this.stove.w &&
        clickY >= this.stove.y && clickY <= this.stove.y + this.stove.h
      ) {
        this.player.targetX = this.stove.x + this.stove.w / 2;
        this.player.targetY = this.stove.y + this.stove.h + 30;
        this.pendingAction = { type: "TAKE_FOOD" };
        return;
      }

      // 2. Click Bồn Rửa Bát
      if (
        clickX >= this.sink.x && clickX <= this.sink.x + this.sink.w &&
        clickY >= this.sink.y && clickY <= this.sink.y + this.sink.h
      ) {
        this.player.targetX = this.sink.x + this.sink.w / 2;
        this.player.targetY = this.sink.y + this.sink.h + 30;
        this.pendingAction = { type: "WASH_DISHES" };
        return;
      }

      // 3. Click Bàn Ăn (Phục vụ hoặc Thu gom dĩa dơ)
      const activeTablesCount = this.upgrades.expandTable.level;
      for (let i = 0; i < activeTablesCount; i++) {
        const table = this.tables[i];
        if (
          clickX >= table.x && clickX <= table.x + table.w &&
          clickY >= table.y && clickY <= table.y + table.h
        ) {
          this.player.targetX = table.x + table.w / 2;
          this.player.targetY = table.y + table.h / 2;
          this.pendingAction = { type: "INTERACT_TABLE", target: table };
          return;
        }
      }

      // Di chuyển tự do
      this.player.targetX = clickX;
      this.player.targetY = clickY;
      this.pendingAction = null;
    });
  }

  setupUI() {
    this.coinsEl = document.getElementById("coinCount");
    this.repEl = document.getElementById("repCount");
    this.dorayakiInventoryEl = document.getElementById("dorayakiCount");
    this.upgradeButtonsContainer = document.getElementById("upgradeList");
    this.renderUpgradeButtons();
  }

  renderUpgradeButtons() {
    if (!this.upgradeButtonsContainer) return;
    this.upgradeButtonsContainer.innerHTML = "";

    Object.values(this.upgrades).forEach(up => {
      const btn = document.createElement("button");
      btn.className = "upgrade-btn";
      const isMax = up.level >= up.maxLevel;
      btn.disabled = isMax || this.coins < up.cost;
      btn.innerHTML = `
        <div class="upgrade-title"><strong>${up.name}</strong> (Cấp ${up.level}/${up.maxLevel})</div>
        <div class="upgrade-desc">${up.description}</div>
        <div class="upgrade-cost">${isMax ? "★ ĐÃ MAX CẤP" : "💰 " + up.cost + " xu"}</div>
      `;
      btn.onclick = () => this.buyUpgrade(up.id);
      this.upgradeButtonsContainer.appendChild(btn);
    });
  }

  buyUpgrade(id) {
    const up = this.upgrades[id];
    if (up && up.level < up.maxLevel && this.coins >= up.cost) {
      this.coins -= up.cost;
      up.level++;
      up.cost = Math.floor(up.cost * 1.5);
      window.soundManager.playUpgrade();

      // Kích hoạt Dorami phụ bếp
      if (id === "hireDorami" && !this.dorami) {
        this.dorami = new window.AssistantDorami(this.sink.x + 20, this.sink.y + 60);
      }

      this.renderUpgradeButtons();
    }
  }

  spawnCustomer() {
    const activeTables = this.tables.slice(0, this.upgrades.expandTable.level);
    const emptyTables = activeTables.filter(t => !t.isOccupied());

    if (emptyTables.length > 0) {
      const chosenTable = emptyTables[Math.floor(Math.random() * emptyTables.length)];
      const customerConfig = window.GAME_CONFIG.customers[
        Math.floor(Math.random() * window.GAME_CONFIG.customers.length)
      ];
      // Nếu có Cánh cửa thần kỳ thì có 30% tỷ lệ sinh khách VIP
      const isVIP = (this.upgrades.anywhereDoor && this.upgrades.anywhereDoor.level > 0 && Math.random() < 0.35);
      const newCustomer = new window.Customer(customerConfig, chosenTable, isVIP);
      this.customers.push(newCustomer);
      window.soundManager.playBell();
    }
  }

  update(dt) {
    const cookDuration = window.GAME_CONFIG.economy.dorayakiBaseCookTime * Math.pow(0.75, this.upgrades.stoveSpeed.level - 1);
    this.stove.update(dt, cookDuration);

    this.player.update(dt, this.upgrades);

    if (this.dorami) {
      this.dorami.update(dt, this);
    }

    // Tương tác của người chơi
    if (this.pendingAction) {
      const dist = Math.hypot(this.player.x - this.player.targetX, this.player.y - this.player.targetY);
      if (dist < 35) {
        if (this.pendingAction.type === "TAKE_FOOD") {
          if (this.player.carryingDorayaki < 3 && this.stove.takeDorayaki()) {
            this.player.carryingDorayaki++;
            window.soundManager.playCook();
          }
        } else if (this.pendingAction.type === "INTERACT_TABLE") {
          const table = this.pendingAction.target;
          // Phục vụ khách bánh rán
          if (table.customer && table.customer.state === "WAITING_FOOD" && this.player.carryingDorayaki > 0) {
            table.customer.serve();
            this.player.carryingDorayaki--;
          }
          // Dọn bàn dơ
          else if (table.isDirty) {
            table.clean();
            this.player.carryingDishes++;
            this.coins += window.GAME_CONFIG.economy.cleanTipReward;
            window.soundManager.playCoin();
          }
        } else if (this.pendingAction.type === "WASH_DISHES") {
          // Rửa dĩa tại bồn
          if (this.player.carryingDishes > 0) {
            this.player.carryingDishes = 0;
            window.soundManager.playCook();
          }
        }
        this.pendingAction = null;
      }
    }

    // Khách hàng đông đúc
    this.spawnTimer += dt;
    if (this.spawnTimer >= window.GAME_CONFIG.economy.customerSpawnInterval) {
      this.spawnTimer = 0;
      this.spawnCustomer();
    }

    this.customers.forEach(c => {
      c.update(dt, (leftCustomer) => {
        if (leftCustomer.isSatisfied) {
          const multiplier = leftCustomer.isVIP ? 2.5 : 1.0;
          const earned = Math.floor((window.GAME_CONFIG.economy.dorayakiSellPrice + (Math.random() < leftCustomer.tipChance ? 8 : 0)) * multiplier);
          this.coins += earned;
          this.reputation += leftCustomer.isVIP ? 25 : 10;
          window.soundManager.playCoin();
          this.renderUpgradeButtons();
        }
        this.customers = this.customers.filter(item => item !== leftCustomer);
      });
    });

    if (this.coinsEl) this.coinsEl.innerText = this.coins;
    if (this.repEl) this.repEl.innerText = this.reputation;
    if (this.dorayakiInventoryEl) this.dorayakiInventoryEl.innerText = `${this.player.carryingDorayaki}/3 bánh | ${this.player.carryingDishes} dĩa dơ`;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Nền sàn gỗ ấm cúng phong cách tiệm Nhật truyền thống (Tatami Wood Flooring)
    this.ctx.fillStyle = "#fef3c7";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Kẻ chỉ thảm Tatami / Gỗ cao cấp
    this.ctx.strokeStyle = "#e2d2a4";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 48) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 48) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Tường ốp gỗ trên cùng
    this.ctx.fillStyle = "#78350f";
    this.ctx.fillRect(0, 0, this.canvas.width, 36);
    this.ctx.fillStyle = "#fbbf24";
    this.ctx.font = "bold 13px sans-serif";
    this.ctx.fillText("🏮 TIỆM BÁNH RÁN DORAEMON & NHỮNG NGƯỜI BẠN • PHONG CÁCH NHẬT BẢN TRUYỀN THỐNG 🏮", 180, 23);

    // ĐÈN LỒNG ĐỎ TREO 2 BÊN TƯỜNG (Lantern decor)
    if (window.assetLoader.hasImage('decor_lantern')) {
      const lantern = window.assetLoader.getImage('decor_lantern');
      this.ctx.drawImage(lantern, 20, 20, 48, 72);
      this.ctx.drawImage(lantern, this.canvas.width - 68, 20, 48, 72);
      this.ctx.drawImage(lantern, 240, 20, 40, 60);
      this.ctx.drawImage(lantern, this.canvas.width - 280, 20, 40, 60);
    }

    // CHẬU CÂY BONSAI TRANG TRÍ (Decor plants ở 2 góc tiệm)
    if (window.assetLoader.hasImage('decor_bonsai')) {
      const bonsai = window.assetLoader.getImage('decor_bonsai');
      this.ctx.drawImage(bonsai, 25, 480, 56, 70);
      this.ctx.drawImage(bonsai, this.canvas.width - 85, 480, 56, 70);
    }

    // MÈO THẦN TÀI MANEKI-NEKO TRÊN QUẦY THU NGÂN / BỒN
    if (window.assetLoader.hasImage('decor_lucky_cat')) {
      const cat = window.assetLoader.getImage('decor_lucky_cat');
      this.ctx.drawImage(cat, 820, 65, 48, 54);
    }

    // Cánh Cửa Thần Kỳ VIP (Nếu có nâng cấp)
    if (this.upgrades.anywhereDoor && this.upgrades.anywhereDoor.level > 0) {
      this.ctx.save();
      // Khung cửa hồng Dokodemo Door
      this.ctx.fillStyle = "#ec4899";
      this.ctx.fillRect(40, 50, 60, 90);
      this.ctx.strokeStyle = "#be185d";
      this.ctx.lineWidth = 3;
      this.ctx.strokeRect(40, 50, 60, 90);
      // Nắm đấm cửa tròn vàng
      this.ctx.fillStyle = "#facc15";
      this.ctx.beginPath();
      this.ctx.arc(88, 95, 4, 0, Math.PI * 2);
      this.ctx.fill();
      // Bảng tên
      this.ctx.fillStyle = "#ffffff";
      this.ctx.font = "bold 9px sans-serif";
      this.ctx.fillText("CỬA THẦN KỲ", 44, 44);
      this.ctx.restore();
    }

    // Cửa ra vào phía dưới
    this.ctx.fillStyle = "#92400e";
    this.ctx.fillRect(460, 625, 120, 15);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 10px sans-serif";
    this.ctx.fillText("CỬA ĐÓN KHÁCH", 480, 636);

    // Bếp và bồn rửa bát
    this.stove.render(this.ctx);
    this.sink.render(this.ctx);

    // Bàn ăn
    const activeTables = this.tables.slice(0, this.upgrades.expandTable.level);
    activeTables.forEach(t => t.render(this.ctx));

    // Khách hàng
    this.customers.forEach(c => c.render(this.ctx));

    // Trợ lý Dorami
    if (this.dorami) {
      this.dorami.render(this.ctx);
    }

    // Doraemon nhân vật chính
    this.player.render(this.ctx, this.upgrades);
  }

  loop(currentTime) {
    const dt = Math.min((currentTime - this.lastTime) / 1000, 0.1);
    this.lastTime = currentTime;

    this.update(dt);
    this.render();

    requestAnimationFrame((t) => this.loop(t));
  }
}

window.addEventListener("DOMContentLoaded", () => {
  window.game = new Game();
});
