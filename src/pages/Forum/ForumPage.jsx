import React from 'react';
import { useParams } from 'react-router-dom';
import ThreadList from '../../components/Forum/ThreadList';

const ForumPage = () => {
  const { id } = useParams();

  return (
    <div className="forum-page">
      <h1>Diễn Đàn {id}</h1>
      <ThreadList forumId={id} />
    </div>
  );
}

export default ForumPage;
