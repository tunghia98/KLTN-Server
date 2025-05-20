import React from "react";

const SelectionModal = ({ title, options, selectedIds, onToggle, onClose, onConfirm }) => {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: 20,
          borderRadius: 8,
          maxHeight: "80vh",
          overflowY: "auto",
          minWidth: 300,
          position: "relative",
        }}
      >
        <h3 style={{ marginTop: 0 }}>{title}</h3>
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            right: 20,
            top: 20,
            border: "none",
            background: "transparent",
            fontSize: 20,
            cursor: "pointer",
          }}
          aria-label="Close modal"
        >
          &times;
        </button>

        {/* Danh sách checkbox */}
        {options.map((opt) => (
          <div key={opt.id}>
            <label>
              <input
                type="checkbox"
                checked={selectedIds.includes(opt.id)}
                onChange={() => onToggle(opt.id)}
              />
              {opt.name}
            </label>
          </div>
        ))}

        {/* Nút Xác nhận */}
        <div style={{ marginTop: 20, textAlign: "right" }}>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              backgroundColor: "#4caf50",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectionModal;
