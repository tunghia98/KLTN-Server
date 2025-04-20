import React from 'react';
import './Popup.css';  // Tạo các style cơ bản cho popup
import Button from './Button.jsx';  // Giả sử bạn đã có component Button
import { useNavigate } from 'react-router-dom';  // Import useNavigate từ React Router

const Popup = ({ isOpen, onClose, title, children, redirectTo }) => {
  const navigate = useNavigate();

  const handleClose = () => {
    if (redirectTo) {
      navigate(redirectTo);
      onClose();  // Điều hướng tới path đã cho
    } else {
      onClose();  // Nếu không có path, chỉ đóng popup
    }
  };

  if (!isOpen) return null;

  return (
    <div className="popup-overlay" onClick={handleClose}>
      <div className="popup-content" onClick={(e) => e.stopPropagation()}>
        {title && <div className="popup-header"><h3>{title}</h3>
        <Button onClick={handleClose} text="Đóng" btnStyle="close" type="button" /></div>}
        <div className="popup-body">{children}</div>
        <div className="popup-footer">   
        </div>
      </div>
    </div>
  );
};

export default Popup;
