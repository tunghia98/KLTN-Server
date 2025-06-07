import React, { useState, useMemo } from "react";

const SelectionModal = ({
  title,
  options,
  selectedIds,
  onToggle,
  onClose,
  onConfirm,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  // Lọc options theo searchTerm, không phân biệt hoa thường
  const filteredOptions = useMemo(() => {
    return options.filter((opt) =>
      opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [options, searchTerm]);

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
          minWidth: 300,
          position: "relative",
          display: "flex",
          flexDirection: "column",
          width: "100%",
          maxWidth: 400,
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

        {/* Ô tìm kiếm */}
        <input
          type="text"
          placeholder={`Tìm kiếm ${title.toLowerCase()}...`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: "100%",
            padding: "6px 8px",
            marginBottom: 12,
            boxSizing: "border-box",
            fontSize: 14,
            borderRadius: 4,
            border: "1px solid #ccc",
          }}
        />

        {/* Danh sách checkbox có scroll nếu quá 10 options */}
        <div
          style={{
            maxHeight: filteredOptions.length > 10 ? 300 : "auto", // 300px ~ 10 dòng
            overflowY: filteredOptions.length > 10 ? "auto" : "visible",
            border: filteredOptions.length > 10 ? "1px solid #ddd" : "none",
            padding: filteredOptions.length > 10 ? "4px" : 0,
            borderRadius: 4,
            flexGrow: 1,
          }}
        >
          {filteredOptions.length === 0 ? (
            <p>Không có kết quả phù hợp.</p>
          ) : (
            filteredOptions.map((opt) => (
              <div key={opt.id} style={{ marginBottom: 6 }}>
                <label style={{ cursor: "pointer" }}>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(opt.id)}
                    onChange={() => onToggle(opt.id)}
                    style={{ marginRight: 6 }}
                  />
                  {opt.name}
                </label>
              </div>
            ))
          )}
        </div>

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
              userSelect: "none",
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
