import React from 'react';
import "./Forum.css";
import { Link } from 'react-router-dom';

const ThreadList = ({ forumId }) => {
  const threads = [
    { id: 1, title: 'Hỏi về kỹ thuật trồng lúa', postCount: 24 },
    { id: 2, title: 'Chia sẻ về giống cây trồng', postCount: 30 },
  ];

  return (
    <div className="thread-list">
      <h2>Danh Sách Chủ Đề</h2>
      <ul>
        {threads.map(thread => (
          <li key={thread.id}>
            <Link to={`/forum/${forumId}/thread/${thread.id}`}>
              <h4>{thread.title}</h4>
              <p>{thread.postCount} bài viết</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ThreadList;
