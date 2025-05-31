import React, { useEffect, useState } from "react";
import ThreadItem from "./ThreadItem";
import "./Forum.css";

const ThreadList = ({ threads }) => {
  const [enrichedThreads, setEnrichedThreads] = useState([]);

  useEffect(() => {
    const fetchExtraDataForThreads = async () => {
      if (!Array.isArray(threads) || threads.length === 0) return;

      const promises = threads.map(async (thread) => {
        try {
          const [crop, region, category] = await Promise.all([
            fetch(
              `https://kltn.azurewebsites.net/api/crops/${thread.cropId}`
            ).then((res) => (res.ok ? res.json() : null)),
            fetch(
              `https://kltn.azurewebsites.net/api/regions/${thread.regionId}`
            ).then((res) => (res.ok ? res.json() : null)),
            fetch(
              `https://kltn.azurewebsites.net/api/categoryforums/${thread.categoryId}`
            ).then((res) => (res.ok ? res.json() : null)),
          ]);

          return {
            ...thread,
            cropName: crop?.name || "Không rõ giống",
            regionName: region?.name || "Không rõ khu vực",
            categoryName: category?.name || "Không rõ danh mục",
          };
        } catch (err) {
          console.error("Lỗi khi fetch dữ liệu phụ:", err);
          return thread;
        }
      });

      const result = await Promise.all(promises);
      setEnrichedThreads(result);
    };

    fetchExtraDataForThreads();
  }, [threads]);

  if (!Array.isArray(threads) || threads.length === 0)
    return <p>Không có chủ đề nào.</p>;

  return (
    <div className="thread-list">
      {enrichedThreads.map((thread, index) => (
        <ThreadItem
          key={thread.id || index}
          title={thread.title}
          likes={thread.likeCount}
          commentCount={thread.commentCount}
          replies={thread.replies}
          category={thread.categoryName}
          crop={thread.cropName}
          region={thread.regionName}
        />
      ))}
    </div>
  );
};

export default ThreadList;
