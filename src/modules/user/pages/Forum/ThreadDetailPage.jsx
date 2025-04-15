import React from "react";
import { useParams } from "react-router-dom";
import ThreadDetail from "../../components/Forum/ThreadDetail.jsx";
import toSlug from "../../../../utils/toSlug.js";

// Dữ liệu tạm
const dummyThreads = [
  { id: "1", title: "Làm thế nào để trồng lúa?", category: "Phân bón", crop: "Lúa", region: "Bắc Bộ", likes: 10, replies: 3, content: "Đây là phần nội dung chi tiết của chủ đề về trồng lúa..." },
  { id: "2", title: "Cách bảo vệ cây cà chua khỏi sâu bệnh?", category: "Thuốc bảo vệ thực vật", crop: "Cà chua", region: "Nam Bộ", likes: 7, replies: 5, content: "Phương pháp bảo vệ cây cà chua khỏi sâu bệnh như sau..." },
  { id: "3", title: "Lắp đặt hệ thống tưới tự động cho cây trồng", category: "Vật tư", crop: "Cà phê", region: "Trung Bộ", likes: 5, replies: 2, content: "Cách lắp đặt hệ thống tưới tự động để tiết kiệm nước..." },
];

function ThreadDetailPage() {
  const { title } = useParams(); // lấy slug từ URL

  const thread = dummyThreads.find(t => toSlug(t.title) === title);

  if (!thread) {
    return <p>Không tìm thấy chủ đề này.</p>;
  }

  return (
    <div className="thread-detail-page">
      <ThreadDetail thread={thread} />
    </div>
  );
}

export default ThreadDetailPage;
