import React from 'react';
import "./Forum.css";
import { Link } from 'react-router-dom';

const ForumList = () => {
  const forums = [
    { id: 1, name: 'Diễn đàn Công Nghệ', description: 'Thảo luận về công nghệ mới nhất' },
    { id: 2, name: 'Diễn đàn Nông Nghiệp', description: 'Chia sẻ về kỹ thuật canh tác' },
  ];

  return (
    <div className="forum-list">
      <h2>Danh Sách Diễn Đàn</h2>
      <ul>
        {forums.map(forum => (
          <li key={forum.id}>
            <Link to={`/forum/${forum.id}`}>
              <h3>{forum.name}</h3>
            </Link>
            <p>{forum.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ForumList;
