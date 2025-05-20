import ThreadList from "./ThreadList";
import "./Forum.css";

function PopularThreads({ threads }) {
  const sortedThreads = [...threads].sort((a, b) => b.views - a.views).slice(0, 10); 
  const popularThreads= sortedThreads.slice(0, 5); // Lấy 5 chủ đề phổ biến nhất
  return (
    <div className="popular-threads">
      <h2>Chủ Đề Hay Nhất</h2>
      <ThreadList threads={popularThreads} />
    </div>
  );
}

export default PopularThreads;
