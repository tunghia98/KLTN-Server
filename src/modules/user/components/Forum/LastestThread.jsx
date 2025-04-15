import React, { useState } from "react";
import ThreadList from "./ThreadList";
import "./Forum.css";

function LatestThreads() {
  const [threads] = useState([
    { id: 101, title: "Làm thế nào để trồng lúa?", category: "Phân bón", crop: "Lúa", region: "Bắc Bộ", likes: 10, replies: 3 },
    { id: 102, title: "Cách bảo vệ cây cà chua khỏi sâu bệnh?", category: "Thuốc bảo vệ thực vật", crop: "Cà chua", region: "Nam Bộ", likes: 7, replies: 5 },
    { id: 103, title: "Lắp đặt hệ thống tưới tự động cho cây trồng", category: "Vật tư", crop: "Cà phê", region: "Trung Bộ", likes: 5, replies: 2 },
  ]);

  return (
    <div className="latest-threads">
      <h2>Chủ Đề Mới Nhất</h2>
      <ThreadList threads={threads} />
    </div>
  );
}

export default LatestThreads;
