import React from "react";
import ThreadList from "./ThreadList";
import "./Forum.css";

function LatestThreads({ threads }) {
  // Sắp xếp threads theo ngày tạo mới nhất
  const sortedThreads = [...threads].sort(
    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
  );

  return (
    <div className="latest-threads">
      <h2>Chủ Đề Mới Nhất</h2>
      <ThreadList threads={sortedThreads} />
    </div>
  );
}

export default LatestThreads;
