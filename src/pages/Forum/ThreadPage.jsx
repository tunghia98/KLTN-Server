import React from 'react';
import { useParams } from 'react-router-dom';
import Thread from '../../components/Forum/Thread';

const ThreadPage = () => {
  const { forumId, threadId } = useParams();

  const thread = {
    id: threadId,
    title: 'Chủ đề về cây trồng',
    posts: [
      { title: 'Lúa là gì?', content: 'Lúa là một loại cây trồng quan trọng.' },
      { title: 'Kỹ thuật trồng lúa', content: 'Trồng lúa cần chú ý đến đất và nước.' },
    ],
  };

  return (
    <div className="thread-page">
      <h1>{thread.title}</h1>
      <Thread thread={thread} />
    </div>
  );
}

export default ThreadPage;
