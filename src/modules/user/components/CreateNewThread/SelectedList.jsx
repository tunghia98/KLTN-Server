// src/components/CreateNewThread/SelectedList.jsx
import React from "react";

const SelectedList = ({ selectedIds, options }) => {
  if (!selectedIds || selectedIds.length === 0) return <em>Chưa chọn</em>;

  return selectedIds.map((id) => {
    const opt = options.find((o) => o.id === id);
    return (
      <span
        key={id}
        style={{
          display: "inline-block",
          backgroundColor: "#e0e0e0",
          borderRadius: 4,
          padding: "2px 8px",
          marginRight: 6,
          marginBottom: 6,
        }}
      >
        {opt ? opt.name : id}
      </span>
    );
  });
};

export default SelectedList;
