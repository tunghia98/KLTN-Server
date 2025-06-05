import React, { useState } from "react";
import "./CommentSection.css";
import { useUser } from "../../../../contexts/UserContext";

function CommentSection({ comments, thread }) {
  const [commentList, setCommentList] = useState(
    (comments || []).slice().reverse()
  );
  const [newComment, setNewComment] = useState("");
  const [replyContents, setReplyContents] = useState({});
  const { user } = useUser();
  const handleLikeComment = (index) => {
    if (!user) {
      alert("Vui lòng đăng nhập để thích bình luận!");
      return;
    }

    const updatedComments = [...commentList];
    const comment = updatedComments[index];
    comment.liked = !comment.liked;
    comment.likes += comment.liked ? 1 : -1;
    setCommentList(updatedComments);
  };

  const handleReplyComment = (index) => {
    const updatedComments = [...commentList];
    updatedComments[index].isReplying = !updatedComments[index].isReplying;
    setCommentList(updatedComments);
  };

  const handleSubmitReply = (index) => {
    if (!user) {
      alert("Vui lòng đăng nhập để trả lời bình luận!");
      return;
    }

    const replyContent = replyContents[index];
    if (replyContent && replyContent.trim()) {
      const updatedComments = [...commentList];
      updatedComments[index].replies = updatedComments[index].replies || [];
      updatedComments[index].replies.push({
        author: user.username || "Bạn đọc",
        content: replyContent,
      });
      updatedComments[index].isReplying = false;
      setCommentList(updatedComments);
      setReplyContents((prev) => ({ ...prev, [index]: "" }));
    }
  };

  const handleAddAutoReply = async () => {
    if (!user || user.role !== "admin") {
      alert("Chỉ quản trị viên mới có thể sử dụng tính năng này.");
      return;
    }

    try {
      const reply = await fetchAutoReply(thread.id);
      console.log(reply);
      if (reply && reply.trim()) {
        const now = new Date();
        const aiComment = {
          content: reply,
          author: "AI Bot",
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          likes: 0,
          liked: false,
        };

        setCommentList([aiComment, ...commentList]);
      }
    } catch (error) {
      console.error("Lỗi khi gọi trả lời AI:", error);
      alert("Không thể lấy trả lời tự động từ AI.");
    }
  };

  const fetchAutoReply = async (threadId) => {
    const response = await fetch(
      `https://kltn.azurewebsites.net/api/ChatBot/forum-posts/${threadId}/ai-comment`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error("Server error: " + errorText);
    }

    const data = await response.json();
      console.log(data);
      return data?.comment?.content || "Không có câu trả lời phù hợp.";
  };
  const increaseCommentCount = async (threadId) => {
    try {
      await fetch(
        `https://kltn.azurewebsites.net/api/forumposts/${threadId}/commentCount`,
        {
          method: "PATCH",
        }
      );
    } catch (err) {
      console.error("Lỗi khi cập nhật commentCount:", err);
    }
  };
  const handleAddComment = async () => {
    if (!user) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    const now = new Date();
    if (newComment.trim()) {
      setCommentList([
        {
          content: newComment,
          author: user.username || "Bạn đọc",
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          likes: 0,
          liked: false,
        },
        ...commentList,
      ]);
      setNewComment("");

      await increaseCommentCount(thread.id); // ✅ cập nhật commentCount
    }
  };

  return (
    <div className="comment-section">
      <h3>Bình luận ({commentList.length})</h3>

      <div className="comment-form">
        {user ? (
          <>
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Nhập bình luận của bạn..."
            />
            <button
              onClick={handleAddComment}
              className="submit-comment-button"
            >
              Gửi bình luận
            </button>
            {user.role === "admin" && (
              <button
                onClick={handleAddAutoReply}
                className="auto-reply-button"
              >
                Trả lời tự động
              </button>
            )}
          </>
        ) : (
          <p style={{ color: "gray", fontStyle: "italic" }}>
            Vui lòng đăng nhập để bình luận.
          </p>
        )}
      </div>

      <div className="comment-list">
        {commentList.map((cmt, idx) => (
          <div key={idx} className="comment-item">
            <p className="comment-author">
              {cmt.author} - {cmt.date} - {cmt.time}
            </p>
            <p>{cmt.content}</p>

            <button
              onClick={() => handleLikeComment(idx)}
              className={`like-button ${cmt.liked ? "liked" : ""}`}
              disabled={!user}
            >
              {cmt.liked ? "Đã thích" : "👍 Thích"}
            </button>

            <button
              onClick={() => handleReplyComment(idx)}
              className="reply-button"
              disabled={!user}
            >
              Trả lời
            </button>

            {cmt.isReplying && user && (
              <div className="reply-form">
                <textarea
                  placeholder="Nhập câu trả lời..."
                  value={replyContents[idx] || ""}
                  onChange={(e) =>
                    setReplyContents((prev) => ({
                      ...prev,
                      [idx]: e.target.value,
                    }))
                  }
                  autoFocus
                />
                <button
                  onClick={() => handleSubmitReply(idx)}
                  className="submit-reply-button"
                >
                  Gửi
                </button>
              </div>
            )}

            {cmt.replies && cmt.replies.length > 0 && (
              <div className="replies">
                {cmt.replies.map((reply, replyIdx) => (
                  <div key={replyIdx} className="reply-item">
                    <p>
                      {reply.author}: {reply.content}
                    </p>
                  </div>
                ))}
              </div>
            )}

            <p>{cmt.likes} lượt thích</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CommentSection;
