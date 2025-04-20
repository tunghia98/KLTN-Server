import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Auth.css"; // Style riêng cho cả đăng nhập và đăng ký
import Button from "../../../../components/Common/Button";
import Popup from "../../../../components/Common/Popup"; // Import component Popup

function Register({ isOpen, onClose, onSwitchToLogin }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");

  if (!isOpen) return null;

  const handleRegister = (e) => {
    e.preventDefault();
    if (password !== confirmPass) {
      alert("Mật khẩu không khớp!");
      return;
    }
    console.log("Đăng ký:", { username, email, password });
    onClose();
  };

  return ReactDOM.createPortal(
    <Popup isOpen={isOpen} onClose={onClose} title="Đăng ký tài khoản">
      <form onSubmit={handleRegister} className="popup-login-form">
        <div className="form-group">
          <label>Tên đăng nhập</label>
          <input value={username} onChange={(e) => setUsername(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Xác nhận mật khẩu</label>
          <input type="password" value={confirmPass} onChange={(e) => setConfirmPass(e.target.value)} required />
        </div>

        <div className="form-actions">
          <Button type="submit" text="Đăng ký" btnStyle="auth"></Button>
        </div>

        {/* ✅ Dòng chuyển qua đăng nhập */}
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Bạn đã có tài khoản?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose();          // đóng popup đăng ký
              onSwitchToLogin(); // mở popup đăng nhập
            }}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            Đăng nhập
          </a>
        </p>
      </form>
    </Popup>,
    document.body
  );
}

export default Register;
