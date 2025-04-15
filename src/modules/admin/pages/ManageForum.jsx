// src/pages/AdminDashboard/ManageForum.jsx
import React, { useState, useEffect } from 'react';

const ManageForum = () => {
  const [threads, setThreads] = useState([]);

  const mockThreads = [
    { id: 1, title: 'Bài viết 1', commentsClosed: false },
    { id: 2, title: 'Bài viết 2', commentsClosed: true },
  ];

  useEffect(() => {
    // Lấy thread từ API, ở đây là mock dữ liệu
    setThreads(mockThreads);
  }, []);

  const toggleComments = (threadId) => {
    setThreads(prevThreads =>
      prevThreads.map(thread =>
        thread.id === threadId ? { ...thread, commentsClosed: !thread.commentsClosed } : thread
      )
    );
  };

  return (
    <div>
      <h2>Quản lý Diễn Đàn</h2>
      <table>
        <thead>
          <tr>
            <th>Tên bài viết</th>
            <th>Trạng thái bình luận</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {threads.map((thread) => (
            <tr key={thread.id}>
              <td>{thread.title}</td>
              <td>{thread.commentsClosed ? 'Đóng' : 'Mở'}</td>
              <td>
                <button onClick={() => toggleComments(thread.id)}>
                  {thread.commentsClosed ? 'Mở bình luận' : 'Đóng bình luận'}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManageForum;
