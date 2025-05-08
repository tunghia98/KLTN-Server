import ThreadList from "./ThreadList";
import "./Forum.css";

function PopularThreads({ threads }) {
  const sortedThreads = [...threads].sort((a, b) => b.views - a.views).slice(0, 10); 

  return (
    <div className="popular-threads">
      <h2>Chủ Đề Hay Nhất</h2>
      <ThreadList threads={sortedThreads} />
    </div>
  );
}

export default PopularThreads;
