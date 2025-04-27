import React, { useState } from "react";
import "./CommentSection.css";

function CommentSection({ comments }) {
  const [commentList, setCommentList] = useState(comments || []);
  const [newComment, setNewComment] = useState("");
  
  // Hàm thêm bình luận mới
  const handleAddComment = () => {
    if (newComment.trim()) {
      setCommentList([{ content: newComment, author: "Bạn đọc", date: new Date().toLocaleDateString(), likes: 0, liked: false }, ...commentList]);
      setNewComment("");  // Reset textarea after submitting
    }
  };

  // Hàm like cho từng bình luận
  const handleLikeComment = (index) => {
    const updatedComments = [...commentList];
    const comment = updatedComments[index];
    if (!comment.liked) {
      comment.likes += 1;
      comment.liked = true;
    } else {
      comment.likes -= 1;
      comment.liked = false;
    }
    setCommentList(updatedComments);
  };

  // Hàm hiển thị ô nhập trả lời cho bình luận
  const handleReplyComment = (index) => {
    const updatedComments = [...commentList];
    updatedComments[index].isReplying = !updatedComments[index].isReplying; // Toggle trạng thái trả lời
    setCommentList(updatedComments);
  };

  // Hàm trả lời bình luận
  const handleSubmitReply = (index, replyContent) => {
    if (replyContent.trim()) {
      const updatedComments = [...commentList];
      updatedComments[index].replies = updatedComments[index].replies || [];
      updatedComments[index].replies.push({ author: "Bạn đọc", content: replyContent });
      updatedComments[index].isReplying = false; // Tắt chế độ trả lời sau khi gửi
      setCommentList(updatedComments);
    }
  };

  return (
    <div className="comment-section">
      <h3>Bình luận ({commentList.length})</h3>

      <div className="comment-list">
        {commentList.map((cmt, idx) => (
          <div key={idx} className="comment-item">
            <p className="comment-author">{cmt.author} - {cmt.date}</p>
            <p>{cmt.content}</p>
            
            {/* Nút like với thay đổi màu sắc khi đã thích */}
            <button 
              onClick={() => handleLikeComment(idx)} 
              className={`like-button ${cmt.liked ? "liked" : ""}`}
            >
              {cmt.liked ? "Đã thích" : "👍 Thích"}
            </button>
            
            <button onClick={() => handleReplyComment(idx)} className="reply-button">Trả lời</button>
            
            {cmt.isReplying && (
              <div className="reply-form">
                <textarea
                  placeholder="Nhập câu trả lời..."
                  onBlur={(e) => handleSubmitReply(idx, e.target.value)}
                  autoFocus
                />
                <button onClick={() => handleSubmitReply(idx, document.querySelector('textarea').value)} className="submit-reply-button">Gửi</button>
              </div>
            )}

            {cmt.replies && cmt.replies.length > 0 && (
              <div className="replies">
                {cmt.replies.map((reply, replyIdx) => (
                  <div key={replyIdx} className="reply-item">
                    <p>{reply.author}: {reply.content}</p>
                  </div>
                ))}
              </div>
            )}
            <p>{cmt.likes} lượt thích</p>
          </div>
        ))}
      </div>

      <div className="comment-form">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Nhập bình luận của bạn..."
        />
        <button onClick={handleAddComment} className="submit-comment-button">Gửi bình luận</button>
      </div>
    </div>
  );
}

export default CommentSection;
