// Game Engine Main Loop & Event Management
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

    // Game loop request
    requestAnimationFrame((t) => this.loop(t));
  }

  initEntities() {
    this.player = new window.PlayerDoraemon(480, 260);
    this.stove = new window.Stove(410, 80);

    this.tables = [
      new window.Table(1, 160, 200),
      new window.Table(2, 700, 200),
      new window.Table(3, 160, 380),
      new window.Table(4, 700, 380)
    ];

    this.customers = [];
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

      // 1. Click vào bếp nướng
      if (
        clickX >= this.stove.x && clickX <= this.stove.x + this.stove.w &&
        clickY >= this.stove.y && clickY <= this.stove.y + this.stove.h
      ) {
        this.player.targetX = this.stove.x + this.stove.w / 2;
        this.player.targetY = this.stove.y + this.stove.h + 30;
        this.pendingAction = { type: "TAKE_FOOD" };
        return;
      }

      // 2. Click vào bàn ăn
      const activeTablesCount = this.upgrades.expandTable.level;
      for (let i = 0; i < activeTablesCount; i++) {
        const table = this.tables[i];
        if (
          clickX >= table.x && clickX <= table.x + table.w &&
          clickY >= table.y && clickY <= table.y + table.h
        ) {
          this.player.targetX = table.x + table.w / 2;
          this.player.targetY = table.y + table.h / 2;
          this.pendingAction = { type: "SERVE_TABLE", target: table };
          return;
        }
      }

      // 3. Click di chuyển tự do
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
        <div class="upgrade-title"><strong>${up.name}</strong> (Lv ${up.level}/${up.maxLevel})</div>
        <div class="upgrade-desc">${up.description}</div>
        <div class="upgrade-cost">${isMax ? "Tối Đa" : "💰 " + up.cost + " xu"}</div>
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
      up.cost = Math.floor(up.cost * 1.6);
      window.soundManager.playUpgrade();
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
      const newCustomer = new window.Customer(customerConfig, chosenTable);
      this.customers.push(newCustomer);
      window.soundManager.playBell();
    }
  }

  update(dt) {
    // 1. Cập nhật bếp nấu theo cấp độ
    const cookDuration = window.GAME_CONFIG.economy.dorayakiBaseCookTime * Math.pow(0.8, this.upgrades.stoveSpeed.level - 1);
    this.stove.update(dt, cookDuration);

    // 2. Cập nhật Doraemon
    this.player.update(dt, this.upgrades);

    // 3. Kiểm tra tương tác khi Doraemon đến gần mục tiêu
    if (this.pendingAction) {
      const dist = Math.hypot(this.player.x - this.player.targetX, this.player.y - this.player.targetY);
      if (dist < 25) {
        if (this.pendingAction.type === "TAKE_FOOD") {
          if (this.player.carryingDorayaki < 3 && this.stove.takeDorayaki()) {
            this.player.carryingDorayaki++;
            window.soundManager.playCook();
          }
        } else if (this.pendingAction.type === "SERVE_TABLE") {
          const table = this.pendingAction.target;
          if (table.customer && table.customer.state === "WAITING_FOOD" && this.player.carryingDorayaki > 0) {
            table.customer.serve();
            this.player.carryingDorayaki--;
          }
        }
        this.pendingAction = null;
      }
    }

    // 4. Sinh khách định kỳ
    this.spawnTimer += dt;
    if (this.spawnTimer >= window.GAME_CONFIG.economy.customerSpawnInterval) {
      this.spawnTimer = 0;
      this.spawnCustomer();
    }

    // 5. Cập nhật khách hàng
    this.customers.forEach(c => {
      c.update(dt, (leftCustomer) => {
        if (leftCustomer.isSatisfied) {
          const earned = window.GAME_CONFIG.economy.dorayakiSellPrice + (Math.random() < leftCustomer.tipChance ? 5 : 0);
          this.coins += earned;
          this.reputation += 10;
          window.soundManager.playCoin();
          this.renderUpgradeButtons();
        }
        // Xóa khách khỏi danh sách
        this.customers = this.customers.filter(item => item !== leftCustomer);
      });
    });

    // 6. Cập nhật HUD
    if (this.coinsEl) this.coinsEl.innerText = this.coins;
    if (this.repEl) this.repEl.innerText = this.reputation;
    if (this.dorayakiInventoryEl) this.dorayakiInventoryEl.innerText = `${this.player.carryingDorayaki}/3`;
  }

  render() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Sàn nhà lát gạch kiểu Nhật ấm cúng
    this.ctx.fillStyle = "#fef3c7";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Lưới viền sàn
    this.ctx.strokeStyle = "#fde68a";
    this.ctx.lineWidth = 1;
    for (let x = 0; x < this.canvas.width; x += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, 0);
      this.ctx.lineTo(x, this.canvas.height);
      this.ctx.stroke();
    }
    for (let y = 0; y < this.canvas.height; y += 40) {
      this.ctx.beginPath();
      this.ctx.moveTo(0, y);
      this.ctx.lineTo(this.canvas.width, y);
      this.ctx.stroke();
    }

    // Cửa ra vào phía dưới
    this.ctx.fillStyle = "#78350f";
    this.ctx.fillRect(420, 585, 120, 15);
    this.ctx.fillStyle = "#ffffff";
    this.ctx.font = "bold 10px sans-serif";
    this.ctx.fillText("CỬA RA VÀO", 450, 596);

    // Bếp
    this.stove.render(this.ctx);

    // Bàn ăn đang hoạt động
    const activeTables = this.tables.slice(0, this.upgrades.expandTable.level);
    activeTables.forEach(t => t.render(this.ctx));

    // Khách hàng
    this.customers.forEach(c => c.render(this.ctx));

    // Doraemon (Nhân vật chính)
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
