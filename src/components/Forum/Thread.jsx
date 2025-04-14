import React from 'react';
import { Link } from 'react-router-dom';
import Post from './Post';
import "./Forum.css";

const Thread = ({ thread }) => {
  return (
    <div className="thread">
      <h3>{thread.title}</h3>
      <div>
        {thread.posts.map((post, index) => (
          <Post key={index} post={post} />
        ))}
      </div>
    </div>
  );
}

export default Thread;
