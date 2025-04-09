const productsData = [
  {
    "id": 1,
    "name": "Sản phẩm 1 - Chế phẩm sinh học",
    "category": "Chế phẩm sinh học",
    "brand": "Satra",
    "seller": "EcoFarm",
    "city": "Cần Thơ",
    "price": 240583,
    "image": "https://via.placeholder.com/200x200?text=SP1"
  },
  {
    "id": 2,
    "name": "Sản phẩm 2 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "TH",
    "seller": "GreenHouse",
    "city": "Cần Thơ",
    "price": 309767,
    "image": "https://via.placeholder.com/200x200?text=SP2"
  },
  {
    "id": 3,
    "name": "Sản phẩm 3 - Hạt giống",
    "category": "Hạt giống",
    "brand": "VinEco",
    "seller": "AgriTech",
    "city": "Huế",
    "price": 150020,
    "image": "https://via.placeholder.com/200x200?text=SP3"
  },
  {
    "id": 4,
    "name": "Sản phẩm 4 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "VinEco",
    "seller": "GreenHouse",
    "city": "Đà Nẵng",
    "price": 160077,
    "image": "https://via.placeholder.com/200x200?text=SP4"
  },
  {
    "id": 5,
    "name": "Sản phẩm 5 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "TH",
    "seller": "GreenHouse",
    "city": "TP.HCM",
    "price": 281678,
    "image": "https://via.placeholder.com/200x200?text=SP5"
  },
  {
    "id": 6,
    "name": "Sản phẩm 6 - Vật Tư Nông Nghiệp",
    "category": "Vật Tư Nông Nghiệp",
    "brand": "TH",
    "seller": "Nông Trại Việt",
    "city": "Cần Thơ",
    "price": 147875,
    "image": "https://via.placeholder.com/200x200?text=SP6"
  },
  {
    "id": 7,
    "name": "Sản phẩm 7 - Nông sản hữu cơ",
    "category": "Nông sản hữu cơ",
    "brand": "VinEco",
    "seller": "EcoFarm",
    "city": "TP.HCM",
    "price": 12934,
    "image": "https://via.placeholder.com/200x200?text=SP7"
  },
  {
    "id": 8,
    "name": "Sản phẩm 8 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "Organic Việt",
    "seller": "EcoFarm",
    "city": "Huế",
    "price": 106421,
    "image": "https://via.placeholder.com/200x200?text=SP8"
  },
  {
    "id": 9,
    "name": "Sản phẩm 9 - Nông sản hữu cơ",
    "category": "Nông sản hữu cơ",
    "brand": "Satra",
    "seller": "Vườn Xanh",
    "city": "Đà Nẵng",
    "price": 439806,
    "image": "https://via.placeholder.com/200x200?text=SP9"
  },
  {
    "id": 10,
    "name": "Sản phẩm 10 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "VinEco",
    "seller": "EcoFarm",
    "city": "TP.HCM",
    "price": 43124,
    "image": "https://via.placeholder.com/200x200?text=SP10"
  },
  {
    "id": 11,
    "name": "Sản phẩm 11 - Phân Bón & Hóa Chất Nông Nghiệp",
    "category": "Phân Bón & Hóa Chất Nông Nghiệp",
    "brand": "VinEco",
    "seller": "GreenHouse",
    "city": "TP.HCM",
    "price": 350778,
    "image": "https://via.placeholder.com/200x200?text=SP11"
  },
  {
    "id": 12,
    "name": "Sản phẩm 12 - Vật Tư Nông Nghiệp",
    "category": "Vật Tư Nông Nghiệp",
    "brand": "Organic Việt",
    "seller": "AgriTech",
    "city": "Cần Thơ",
    "price": 383600,
    "image": "https://via.placeholder.com/200x200?text=SP12"
  },
  {
    "id": 13,
    "name": "Sản phẩm 13 - Hạt giống",
    "category": "Hạt giống",
    "brand": "TH",
    "seller": "AgriTech",
    "city": "Đà Nẵng",
    "price": 348857,
    "image": "https://via.placeholder.com/200x200?text=SP13"
  },
  {
    "id": 14,
    "name": "Sản phẩm 14 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "TH",
    "seller": "Vườn Xanh",
    "city": "Huế",
    "price": 426068,
    "image": "https://via.placeholder.com/200x200?text=SP14"
  },
  {
    "id": 15,
    "name": "Sản phẩm 15 - Hạt giống",
    "category": "Hạt giống",
    "brand": "TH",
    "seller": "Vườn Xanh",
    "city": "Đà Nẵng",
    "price": 151920,
    "image": "https://via.placeholder.com/200x200?text=SP15"
  },
  {
    "id": 16,
    "name": "Sản phẩm 16 - Vật Tư Nông Nghiệp",
    "category": "Vật Tư Nông Nghiệp",
    "brand": "VinEco",
    "seller": "Vườn Xanh",
    "city": "Đà Nẵng",
    "price": 37346,
    "image": "https://via.placeholder.com/200x200?text=SP16"
  },
  {
    "id": 17,
    "name": "Sản phẩm 17 - Khác",
    "category": "Khác",
    "brand": "Dalat Farm",
    "seller": "Nông Trại Việt",
    "city": "Đà Nẵng",
    "price": 172075,
    "image": "https://via.placeholder.com/200x200?text=SP17"
  },
  {
    "id": 18,
    "name": "Sản phẩm 18 - Khác",
    "category": "Khác",
    "brand": "Satra",
    "seller": "Vườn Xanh",
    "city": "Huế",
    "price": 437946,
    "image": "https://via.placeholder.com/200x200?text=SP18"
  },
  {
    "id": 19,
    "name": "Sản phẩm 19 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "Satra",
    "seller": "GreenHouse",
    "city": "TP.HCM",
    "price": 154925,
    "image": "https://via.placeholder.com/200x200?text=SP19"
  },
  {
    "id": 20,
    "name": "Sản phẩm 20 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "Satra",
    "seller": "AgriTech",
    "city": "Đà Nẵng",
    "price": 207856,
    "image": "https://via.placeholder.com/200x200?text=SP20"
  },
  {
    "id": 21,
    "name": "Sản phẩm 21 - Hạt giống",
    "category": "Hạt giống",
    "brand": "VinEco",
    "seller": "Nông Trại Việt",
    "city": "Huế",
    "price": 55451,
    "image": "https://via.placeholder.com/200x200?text=SP21"
  },
  {
    "id": 22,
    "name": "Sản phẩm 22 - Hạt giống",
    "category": "Hạt giống",
    "brand": "Organic Việt",
    "seller": "Vườn Xanh",
    "city": "Hà Nội",
    "price": 116979,
    "image": "https://via.placeholder.com/200x200?text=SP22"
  },
  {
    "id": 23,
    "name": "Sản phẩm 23 - Vật Tư Nông Nghiệp",
    "category": "Vật Tư Nông Nghiệp",
    "brand": "Dalat Farm",
    "seller": "AgriTech",
    "city": "TP.HCM",
    "price": 498212,
    "image": "https://via.placeholder.com/200x200?text=SP23"
  },
  {
    "id": 24,
    "name": "Sản phẩm 24 - Phân Bón & Hóa Chất Nông Nghiệp",
    "category": "Phân Bón & Hóa Chất Nông Nghiệp",
    "brand": "Satra",
    "seller": "GreenHouse",
    "city": "Huế",
    "price": 392150,
    "image": "https://via.placeholder.com/200x200?text=SP24"
  },
  {
    "id": 25,
    "name": "Sản phẩm 25 - Chế phẩm sinh học",
    "category": "Chế phẩm sinh học",
    "brand": "VinEco",
    "seller": "GreenHouse",
    "city": "Hà Nội",
    "price": 159758,
    "image": "https://via.placeholder.com/200x200?text=SP25"
  },
  {
    "id": 26,
    "name": "Sản phẩm 26 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "VinEco",
    "seller": "GreenHouse",
    "city": "Cần Thơ",
    "price": 114844,
    "image": "https://via.placeholder.com/200x200?text=SP26"
  },
  {
    "id": 27,
    "name": "Sản phẩm 27 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "TH",
    "seller": "Nông Trại Việt",
    "city": "Hà Nội",
    "price": 463765,
    "image": "https://via.placeholder.com/200x200?text=SP27"
  },
  {
    "id": 28,
    "name": "Sản phẩm 28 - Phân Bón & Hóa Chất Nông Nghiệp",
    "category": "Phân Bón & Hóa Chất Nông Nghiệp",
    "brand": "Organic Việt",
    "seller": "Vườn Xanh",
    "city": "Đà Nẵng",
    "price": 69965,
    "image": "https://via.placeholder.com/200x200?text=SP28"
  },
  {
    "id": 29,
    "name": "Sản phẩm 29 - Khác",
    "category": "Khác",
    "brand": "TH",
    "seller": "GreenHouse",
    "city": "Hà Nội",
    "price": 458297,
    "image": "https://via.placeholder.com/200x200?text=SP29"
  },
  {
    "id": 30,
    "name": "Sản phẩm 30 - Khác",
    "category": "Khác",
    "brand": "Organic Việt",
    "seller": "Vườn Xanh",
    "city": "Đà Nẵng",
    "price": 317122,
    "image": "https://via.placeholder.com/200x200?text=SP30"
  },
  {
    "id": 31,
    "name": "Sản phẩm 31 - Khác",
    "category": "Khác",
    "brand": "VinEco",
    "seller": "EcoFarm",
    "city": "Huế",
    "price": 68270,
    "image": "https://via.placeholder.com/200x200?text=SP31"
  },
  {
    "id": 32,
    "name": "Sản phẩm 32 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "VinEco",
    "seller": "EcoFarm",
    "city": "Đà Nẵng",
    "price": 13573,
    "image": "https://via.placeholder.com/200x200?text=SP32"
  },
  {
    "id": 33,
    "name": "Sản phẩm 33 - Nông sản hữu cơ",
    "category": "Nông sản hữu cơ",
    "brand": "Organic Việt",
    "seller": "Nông Trại Việt",
    "city": "Hà Nội",
    "price": 26662,
    "image": "https://via.placeholder.com/200x200?text=SP33"
  },
  {
    "id": 34,
    "name": "Sản phẩm 34 - Nông sản hữu cơ",
    "category": "Nông sản hữu cơ",
    "brand": "Satra",
    "seller": "Nông Trại Việt",
    "city": "Huế",
    "price": 377627,
    "image": "https://via.placeholder.com/200x200?text=SP34"
  },
  {
    "id": 35,
    "name": "Sản phẩm 35 - Hạt giống",
    "category": "Hạt giống",
    "brand": "Dalat Farm",
    "seller": "EcoFarm",
    "city": "Huế",
    "price": 465725,
    "image": "https://via.placeholder.com/200x200?text=SP35"
  },
  {
    "id": 36,
    "name": "Sản phẩm 36 - Chế phẩm sinh học",
    "category": "Chế phẩm sinh học",
    "brand": "TH",
    "seller": "AgriTech",
    "city": "Huế",
    "price": 229515,
    "image": "https://via.placeholder.com/200x200?text=SP36"
  },
  {
    "id": 37,
    "name": "Sản phẩm 37 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "Satra",
    "seller": "Vườn Xanh",
    "city": "Huế",
    "price": 36790,
    "image": "https://via.placeholder.com/200x200?text=SP37"
  },
  {
    "id": 38,
    "name": "Sản phẩm 38 - Khác",
    "category": "Khác",
    "brand": "Dalat Farm",
    "seller": "AgriTech",
    "city": "TP.HCM",
    "price": 92113,
    "image": "https://via.placeholder.com/200x200?text=SP38"
  },
  {
    "id": 39,
    "name": "Sản phẩm 39 - Khác",
    "category": "Khác",
    "brand": "VinEco",
    "seller": "Nông Trại Việt",
    "city": "Hà Nội",
    "price": 437390,
    "image": "https://via.placeholder.com/200x200?text=SP39"
  },
  {
    "id": 40,
    "name": "Sản phẩm 40 - Nông sản hữu cơ",
    "category": "Nông sản hữu cơ",
    "brand": "Dalat Farm",
    "seller": "AgriTech",
    "city": "Cần Thơ",
    "price": 59092,
    "image": "https://via.placeholder.com/200x200?text=SP40"
  },
  {
    "id": 41,
    "name": "Sản phẩm 41 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "VinEco",
    "seller": "EcoFarm",
    "city": "Cần Thơ",
    "price": 369720,
    "image": "https://via.placeholder.com/200x200?text=SP41"
  },
  {
    "id": 42,
    "name": "Sản phẩm 42 - Cây Cảnh",
    "category": "Cây Cảnh",
    "brand": "Satra",
    "seller": "Vườn Xanh",
    "city": "Huế",
    "price": 362945,
    "image": "https://via.placeholder.com/200x200?text=SP42"
  },
  {
    "id": 43,
    "name": "Sản phẩm 43 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "VinEco",
    "seller": "AgriTech",
    "city": "TP.HCM",
    "price": 392669,
    "image": "https://via.placeholder.com/200x200?text=SP43"
  },
  {
    "id": 44,
    "name": "Sản phẩm 44 - Thiết Bị Nông Nghiệp",
    "category": "Thiết Bị Nông Nghiệp",
    "brand": "Dalat Farm",
    "seller": "EcoFarm",
    "city": "TP.HCM",
    "price": 184450,
    "image": "https://via.placeholder.com/200x200?text=SP44"
  },
  {
    "id": 45,
    "name": "Sản phẩm 45 - Hạt giống",
    "category": "Hạt giống",
    "brand": "VinEco",
    "seller": "EcoFarm",
    "city": "Hà Nội",
    "price": 409080,
    "image": "https://via.placeholder.com/200x200?text=SP45"
  },
  {
    "id": 46,
    "name": "Sản phẩm 46 - Nông sản hữu cơ",
    "category": "Nông sản hữu cơ",
    "brand": "Satra",
    "seller": "EcoFarm",
    "city": "Đà Nẵng",
    "price": 428982,
    "image": "https://via.placeholder.com/200x200?text=SP46"
  },
  {
    "id": 47,
    "name": "Sản phẩm 47 - Khác",
    "category": "Khác",
    "brand": "Dalat Farm",
    "seller": "AgriTech",
    "city": "Hà Nội",
    "price": 485459,
    "image": "https://via.placeholder.com/200x200?text=SP47"
  },
  {
    "id": 48,
    "name": "Sản phẩm 48 - Hạt giống",
    "category": "Hạt giống",
    "brand": "VinEco",
    "seller": "EcoFarm",
    "city": "Hà Nội",
    "price": 15295,
    "image": "https://via.placeholder.com/200x200?text=SP48"
  },
  {
    "id": 49,
    "name": "Sản phẩm 49 - Phân Bón & Hóa Chất Nông Nghiệp",
    "category": "Phân Bón & Hóa Chất Nông Nghiệp",
    "brand": "TH",
    "seller": "Vườn Xanh",
    "city": "Đà Nẵng",
    "price": 494125,
    "image": "https://via.placeholder.com/200x200?text=SP49"
  },
  {
    "id": 50,
    "name": "Sản phẩm 50 - Vật Tư Nông Nghiệp",
    "category": "Vật Tư Nông Nghiệp",
    "brand": "Organic Việt",
    "seller": "GreenHouse",
    "city": "TP.HCM",
    "price": 57892,
    "image": "https://via.placeholder.com/200x200?text=SP50"
  }
];

export default productsData;