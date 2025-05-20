// src/components/CreateNewThread/ImageUpload.jsx
import React from "react";

const ImageUpload = ({ images, onChange }) => {
  return (
    <div style={{ marginBottom: 16 }}>
      <label htmlFor="images-upload" style={{ display: "block", marginBottom: 6 }}>
        Ảnh đính kèm (tối đa 5 ảnh)
      </label>
      <input
        id="images-upload"
        type="file"
        multiple
        accept="image/*"
        onChange={onChange}
      />
      {images.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {images.map((file, idx) => (
            <span
              key={idx}
              style={{
                display: "inline-block",
                marginRight: 6,
                backgroundColor: "#e0e0e0",
                padding: "4px 8px",
                borderRadius: 4,
              }}
            >
              {file.name}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
