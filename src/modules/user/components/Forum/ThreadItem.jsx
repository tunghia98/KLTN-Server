import "./Forum.css";
import { Link } from "react-router-dom";
import toSlug from "../../../../utils/toSlug";

const ThreadItem = ({ title, likes, commentCount, category, crop, region }) => {
  return (
    <div className="thread-item">
      <Link
        to={`/forum/thread/${toSlug(title)}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <h3 className="thread-title">{title}</h3>
      </Link>
      <p>
        {likes} lượt thích | {commentCount} câu trả lời
      </p>
      <p>Phân loại: {category}</p>
      <p>Giống cây: {crop}</p>
      <p>Khu vực: {region}</p>
    </div>
  );
};

export default ThreadItem;
