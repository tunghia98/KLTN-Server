import React from 'react';
import './Popup.css'; // Tạo các style cơ bản cho popup
import Button from './Button.jsx'; // Giả sử bạn đã có component Button

const Popup = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={onClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {title && <div className="popup-header"><h3>{title}</h3></div>}
        <div className="popup-body">{children}</div>
        <div className="popup-footer">
          <Button onClick={onClose} text="Đóng" btnStyle="close" type="button" ></Button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
