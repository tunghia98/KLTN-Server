import React from 'react';
import { useParams } from 'react-router-dom';

const PostPage = () => {
  const { forumId, threadId, postId } = useParams();

  const post = {
    title: 'Lúa là gì?',
    content: 'Lúa là một loại cây trồng quan trọng ở nhiều quốc gia.',
  };

  return (
    <div className="post-page">
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </div>
  );
}

export default PostPage;
