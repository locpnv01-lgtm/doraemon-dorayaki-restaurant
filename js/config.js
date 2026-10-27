// Data-Driven Config v2.0: Mở rộng quy mô nhà hàng cấp cao
const GAME_CONFIG = {
  canvas: {
    width: 1040,
    height: 640,
    targetFPS: 60
  },
  economy: {
    startingCoins: 80,
    dorayakiSellPrice: 20,
    dorayakiBaseCookTime: 3.0,  // Nấu nhanh
    customerPatience: 28.0,      // Thời gian khách chờ
    customerSpawnInterval: 3.5,  // Đông khách: cứ 3.5s lại có khách mới đến
    cleanTipReward: 8           // Thưởng dọn bàn sạch sẽ
  },
  upgrades: {
    stoveSpeed: {
      id: "stoveSpeed",
      name: "Chảo Thần Kỳ Lò Vi Sóng",
      cost: 50,
      level: 1,
      maxLevel: 5,
      description: "Tăng tốc độ nướng bánh lên 25%"
    },
    bambooCopter: {
      id: "bambooCopter",
      name: "Chong Chóng Tre Siêu Cấp",
      cost: 80,
      level: 1,
      maxLevel: 3,
      description: "Doraemon lướt bay nhanh hơn 30%"
    },
    expandTable: {
      id: "expandTable",
      name: "Mở Rộng Thêm Bàn Ăn",
      cost: 100,
      level: 2,
      maxLevel: 6, // Tối đa 6 bàn lớn
      description: "Tăng thêm bàn ghế đón khách nườm nượp"
    },
    hireDorami: {
      id: "hireDorami",
      name: "Triệu Hồi Em Gái Dorami",
      cost: 250,
      level: 0,
      maxLevel: 1,
      description: "Dorami tự động bưng dĩa dọn bàn và phụ bếp!"
    },
    anywhereDoor: {
      id: "anywhereDoor",
      name: "Cánh Cửa Thần Kỳ VIP",
      cost: 350,
      level: 0,
      maxLevel: 1,
      description: "Khách VIP xuyên không ghé thăm trả gấp đôi tiền"
    }
  },
  customers: [
    { name: "Nobita", shirt: "#eab308", hair: "#111827", eatTime: 4.0, tipChance: 0.3, sprite: "customer_1" },
    { name: "Shizuka", shirt: "#ec4899", hair: "#451a03", eatTime: 3.5, tipChance: 0.6, sprite: "customer_2" },
    { name: "Jaian", shirt: "#f97316", hair: "#0f172a", eatTime: 3.0, tipChance: 0.2, sprite: "customer_3" },
    { name: "Suneo", shirt: "#0284c7", hair: "#1e1b4b", eatTime: 3.2, tipChance: 0.8, sprite: "customer_1" },
    { name: "Dekisugi", shirt: "#10b981", hair: "#172554", eatTime: 3.0, tipChance: 0.7, sprite: "customer_2" }
  ]
};

window.GAME_CONFIG = GAME_CONFIG;
