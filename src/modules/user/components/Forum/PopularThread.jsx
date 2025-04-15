import ThreadList from "./ThreadList";
import "./Forum.css";

function PopularThreads() {
  const threads = [
    { id: 201, title: "Cách trồng cây cà phê cho năng suất cao", likes: 100, replies: 7, category: "Kỹ thuật", crop: "Cà phê", region: "Tây Nguyên" },
    { id: 202, title: "Làm thế nào để bảo vệ cây trồng khỏi sâu bệnh?", likes: 80, replies: 5, category: "Thuốc BVTV", crop: "Lúa", region: "ĐBSCL" },
  ];

  return (
    <div className="popular-threads">
      <h2>Chủ Đề Hay Nhất</h2>
      <ThreadList threads={threads} />
    </div>
  );
}

export default PopularThreads;
