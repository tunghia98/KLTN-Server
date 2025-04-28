import React, { useState } from "react";
import "./CommentSection.css";
import { useUser } from "../../../../contexts/UserContext";

function CommentSection({ comments }) {
  const [commentList, setCommentList] = useState((comments || []).slice().reverse());
  const [newComment, setNewComment] = useState("");
  const [replyContents, setReplyContents] = useState({});
  const { user } = useUser(); // Lấy thông tin người dùng từ context

  const handleAddComment = () => {
    if (!user) {
      alert("Vui lòng đăng nhập để bình luận!");
      return;
    }

    const now = new Date();
    if (newComment.trim()) {
      setCommentList([
        {
          content: newComment,
          author: user.username || "Bạn đọc",  // Ưu tiên lấy tên người dùng
          date: now.toLocaleDateString(),
          time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          likes: 0,
          liked: false,
        },
        ...commentList,
      ]);
      setNewComment("");
    }
  };

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

      // Clear nội dung trả lời
      setReplyContents((prev) => ({ ...prev, [index]: "" }));
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
            <button onClick={handleAddComment} className="submit-comment-button">
              Gửi bình luận
            </button>
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
                  onChange={(e) => setReplyContents((prev) => ({ ...prev, [idx]: e.target.value }))}
                  autoFocus
                />
                <button onClick={() => handleSubmitReply(idx)} className="submit-reply-button">
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
