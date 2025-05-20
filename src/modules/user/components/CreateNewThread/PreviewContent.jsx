// src/components/CreateNewThread/PreviewContent.jsx
import React from "react";

const PreviewContent = ({ content }) => {
  if (!content || !content.blocks) return <p>Chưa có nội dung</p>;

  return content.blocks.map((block, idx) => {
    switch (block.type) {
      case "header": {
        const Tag = `h${block.data.level || 2}`;
        return <Tag key={idx} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
      }
      case "paragraph":
        return <p key={idx} dangerouslySetInnerHTML={{ __html: block.data.text }} />;
      case "list":
        if (block.data.style === "ordered") {
          return (
            <ol key={idx}>
              {block.data.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ol>
          );
        } else {
          return (
            <ul key={idx}>
              {block.data.items.map((item, i) => (
                <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
              ))}
            </ul>
          );
        }
      case "quote":
        return (
          <blockquote key={idx}>
            <p dangerouslySetInnerHTML={{ __html: block.data.text }} />
            {block.data.caption && <footer>{block.data.caption}</footer>}
          </blockquote>
        );
      default:
        return (
          <p key={idx} style={{ color: "#888", fontStyle: "italic" }}>
            [Unsupported block type: {block.type}]
          </p>
        );
    }
  });
};

export default PreviewContent;
