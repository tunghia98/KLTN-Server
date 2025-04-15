import React, { useState } from "react";
import ThreadList from "./ThreadList";
import "./Forum.css";

function AllThreads() {
  const [category, setCategory] = useState("");
  const [crop, setCrop] = useState("");
  const [region, setRegion] = useState("");

  const threads = [
    { id: 1, title: "Làm thế nào để trồng lúa?", category: "Phân bón", crop: "Lúa", region: "Bắc Bộ", likes: 10, replies: 3 },
    { id: 2, title: "Cách bảo vệ cây cà chua khỏi sâu bệnh?", category: "Thuốc bảo vệ thực vật", crop: "Cà chua", region: "Nam Bộ", likes: 7, replies: 5 },
    { id: 3, title: "Lắp đặt hệ thống tưới tự động cho cây trồng", category: "Vật tư", crop: "Cà phê", region: "Trung Bộ", likes: 5, replies: 2 },
    // ... thêm các thread khác
  ];

  const filteredThreads = threads.filter((thread) => {
    return (
      (category ? thread.category === category : true) &&
      (crop ? thread.crop === crop : true) &&
      (region ? thread.region === region : true)
    );
  });

  return (
    <div className="forum-container">
      <h2 className="forum-title">Tất Cả Chủ Đề</h2>
      <div className="filter-form">
        <label>Phân loại: </label>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="">Tất cả</option>
          <option value="Phân bón">Phân bón</option>
          <option value="Vật tư">Vật tư</option>
          <option value="Thuốc bảo vệ thực vật">Thuốc bảo vệ thực vật</option>
        </select>

        <label>Giống cây trồng: </label>
        <select onChange={(e) => setCrop(e.target.value)} value={crop}>
          <option value="">Tất cả</option>
          <option value="Lúa">Lúa</option>
          <option value="Cà chua">Cà chua</option>
          <option value="Cà phê">Cà phê</option>
        </select>

        <label>Khu vực: </label>
        <select onChange={(e) => setRegion(e.target.value)} value={region}>
          <option value="">Tất cả</option>
          <option value="Bắc Bộ">Bắc Bộ</option>
          <option value="Nam Bộ">Nam Bộ</option>
          <option value="Trung Bộ">Trung Bộ</option>
        </select>
      </div>

      <ThreadList threads={filteredThreads} />
    </div>
  );
}

export default AllThreads;
