// src/components/CreateNewThread/Editor.jsx
import React, { useEffect, useRef } from "react";
import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import Paragraph from "@editorjs/paragraph";

const Editor = ({ data, onChange }) => {
  const editorRef = useRef(null);

  useEffect(() => {
    let editorInstance = null;

    if (document.getElementById("editorjs")) {
      editorInstance = new EditorJS({
        holder: "editorjs",
        tools: { header: Header, list: List, quote: Quote, paragraph: Paragraph },
        autofocus: true,
        data: data || {},
        onChange: async () => {
          const content = await editorInstance.save();
          onChange(content);
        },
      });
      editorRef.current = editorInstance;
    } else {
      console.error("Element with id 'editorjs' not found");
    }

    return () => {
      if (editorInstance && typeof editorInstance.destroy === "function") {
        editorInstance.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  return (
    <div
      id="editorjs"
      style={{
        border: "1px solid #ccc",
        borderRadius: 4,
        padding: 10,
        minHeight: 250,
        backgroundColor: "white",
      }}
    ></div>
  );
};

export default Editor;
