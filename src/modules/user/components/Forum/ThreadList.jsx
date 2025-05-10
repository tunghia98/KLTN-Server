// ThreadList.jsx
import ThreadItem from "./ThreadItem";
import "./Forum.css";

const ThreadList = ({ threads }) => {
  if (!Array.isArray(threads) || threads.length === 0) return <p>Không có chủ đề nào.</p>;

  return (
    <div className="thread-list">
      {threads.map((thread, index) => (
        <ThreadItem
          key={thread.id || index}
          title={thread.title}
          likes={thread.likes}
          replies={thread.replies}
          category={thread.category}
          crop={thread.crop}
          region={thread.region}
        />
      ))}
    </div>
  );
};

export default ThreadList;

