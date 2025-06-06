import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toSlug from "../../../../utils/toSlug";
import "./ThreadManager.css";

export default function ThreadManager() {
  const [threads, setThreads] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("newest");
  const navigate = useNavigate();

  const fetchThreads = async () => {
    try {
      setLoading(true);
      const res = await fetch("https://kltn.azurewebsites.net/api/forumposts");
      const data = await res.json();
      setThreads(data);
    } catch (err) {
      console.error("Lỗi khi tải bài viết:", err);
      setError("Không thể tải danh sách bài viết.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchThreads();
  }, []);

  const isOlderThan7Days = (dateString) => {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffInDays = (now - createdDate) / (1000 * 60 * 60 * 24);
    return diffInDays >= 7;
  };

  const handleAutoReply = async (threadId) => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/forumposts/${threadId}/auto-reply`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

      if (!res.ok) throw new Error("Trả lời thất bại");

      alert("✅ Đã trả lời tự động.");
      fetchThreads();
    } catch (err) {
      console.error("Lỗi trả lời tự động:", err);
      alert("❌ Trả lời tự động thất bại.");
    }
  };

  const filteredThreads = (
    filter === "unanswered"
      ? threads.filter((thread) => thread.commentCount === 0)
      : threads
  ).sort((a, b) => {
    const dateA = new Date(a.createdAt);
    const dateB = new Date(b.createdAt);
    return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
  });
  return (
    <div className="thread-manager">
      <h2>Quản lý bài viết</h2>

      <div className="thread-filter">
        <button
          className={filter === "all" ? "active" : ""}
          onClick={() => setFilter("all")}
        >
          Tất cả bài viết
        </button>
        <button
          className={filter === "unanswered" ? "active" : ""}
          onClick={() => setFilter("unanswered")}
        >
          Bài viết chưa có câu trả lời
        </button>
      </div>

      <div className="thread-sort">
        <button
          className={sortOrder === "newest" ? "active" : ""}
          onClick={() => setSortOrder("newest")}
        >
          Mới nhất
        </button>
        <button
          className={sortOrder === "oldest" ? "active" : ""}
          onClick={() => setSortOrder("oldest")}
        >
          Cũ nhất
        </button>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : error ? (
        <p>{error}</p>
      ) : filteredThreads.length > 0 ? (
        <ul className="thread-list">
          {filteredThreads.map((thread) => (
            <li key={thread.id} className="thread-item">
              <div
                className="thread-info"
                onClick={() =>
                  navigate(`/forum/thread/${toSlug(thread.title)}`)
                }
              >
                <strong className="clickable-title">{thread.title}</strong> –{" "}
                {thread.authorName} –{" "}
                {new Date(thread.createdAt).toLocaleDateString()}
              </div>
              {filter === "unanswered" && (
                <button
                  className="auto-reply-btn"
                  onClick={() => handleAutoReply(thread.id)}
                >
                  Trả lời tự động
                </button>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p>Không có bài viết nào.</p>
      )}
    </div>
  );
}
