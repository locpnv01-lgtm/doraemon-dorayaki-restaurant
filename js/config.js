// Data-Driven Config: Toàn bộ thông số game nằm ở đây theo chuẩn Game Studio
const GAME_CONFIG = {
  canvas: {
    width: 960,
    height: 600,
    targetFPS: 60
  },
  economy: {
    startingCoins: 50,
    dorayakiSellPrice: 15,
    dorayakiBaseCookTime: 3.5, // giây
    customerPatience: 25.0,     // thời gian chờ tối đa (giây)
    customerSpawnInterval: 6.0, // cứ 6 giây sinh khách mới nếu có bàn trống
  },
  upgrades: {
    stoveSpeed: {
      id: "stoveSpeed",
      name: "Chảo Siêu Tốc (Gia Tốc)",
      cost: 60,
      level: 1,
      maxLevel: 5,
      description: "Nấu bánh nhanh hơn 20%"
    },
    bambooCopter: {
      id: "bambooCopter",
      name: "Chong Chóng Tre",
      cost: 100,
      level: 0,
      maxLevel: 3,
      description: "Doraemon bay nhanh hơn 25%"
    },
    expandTable: {
      id: "expandTable",
      name: "Thêm Bàn Ăn Mới",
      cost: 120,
      level: 2,
      maxLevel: 4,
      description: "Tăng số lượng bàn phục vụ"
    }
  },
  customers: [
    { name: "Nobita", color: "#facc15", shirt: "#eab308", hair: "#1f2937", eatTime: 5.0, tipChance: 0.2 },
    { name: "Shizuka", color: "#f472b6", shirt: "#ec4899", hair: "#374151", eatTime: 4.0, tipChance: 0.5 },
    { name: "Jaian", color: "#fb923c", shirt: "#f97316", hair: "#111827", eatTime: 3.0, tipChance: 0.1 },
    { name: "Suneo", color: "#38bdf8", shirt: "#0284c7", hair: "#0f172a", eatTime: 4.5, tipChance: 0.6 }
  ]
};

window.GAME_CONFIG = GAME_CONFIG;
