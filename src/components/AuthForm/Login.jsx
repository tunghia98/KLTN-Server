import React, { useState } from "react";
import "./Auth.css";
import Button from "../Common/Button.jsx";
import Popup from "../Common/Popup.jsx";  // Import component Popup

function Login({ isOpen, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Đăng nhập với:", { email, password, rememberMe });
    onClose();
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Đăng nhập">
      <form onSubmit={handleLogin} className="popup-login-form">
        <div className="form-group">
          <label>Email</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <div className="form-group checkbox-group">
          <label>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
            />
            Ghi nhớ đăng nhập
          </label>
        </div>
        <div className="form-actions">
          <Button type="submit" text="Đăng nhập" btnStyle="auth"></Button>
        </div>

        {/* ✅ Liên kết chuyển sang đăng ký */}
        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Chưa có tài khoản?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose(); // đóng form đăng nhập
              onSwitchToRegister(); // mở form đăng ký
            }}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            Đăng ký
          </a>
        </p>

        {/* Bạn có thể thêm "Quên mật khẩu?" bên dưới nếu muốn */}
        <p style={{ marginTop: "0.5rem", textAlign: "center" }}>
          <a href="#" style={{ fontSize: "0.9rem", color: "#666" }}>
            Quên mật khẩu?
          </a>
        </p>
      </form>
    </Popup>
  );
}

export default Login;
