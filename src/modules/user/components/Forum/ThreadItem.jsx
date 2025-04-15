import "./Forum.css";
import {Link} from "react-router-dom"
import toSlug from "../../../../utils/toSlug";

const ThreadItem = ({title, likes, replies, category, crop, region }) => {
  return (
    <div className="thread-item">
      <Link to={`/forum/thread/${toSlug(title)}`}>
        <h3 className="thread-title">{title}</h3>
      </Link>
      <p>{likes} lượt thích | {replies} câu trả lời</p>
      <p>Phân loại: {category} | Giống cây: {crop} | Khu vực: {region}</p>
    </div>
  );
};

export default ThreadItem;
