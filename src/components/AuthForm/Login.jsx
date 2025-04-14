import React, { useState } from "react";
import "./Auth.css";
import Button from "../Common/Button.jsx";
import Popup from "../Common/Popup.jsx";
import {sellers} from "../../data/data.js";
import { useUser } from "../../contexts/UserContext.jsx";  // Import component Popup

function Login({ isOpen, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useUser();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    const foundUser = sellers.find(
      (u) => u.username === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      alert(`Chào mừng ${foundUser.name}!`);
      onClose();
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return (
    <Popup isOpen={isOpen} onClose={onClose} title="Đăng nhập">
      <form onSubmit={handleLogin} className="popup-login-form">
        <div className="form-group">
          <label>Tên tài khoản</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
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

        <p style={{ marginTop: "1rem", textAlign: "center" }}>
          Chưa có tài khoản?{" "}
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onClose();
              onSwitchToRegister();
            }}
            style={{ color: "#007bff", cursor: "pointer" }}
          >
            Đăng ký
          </a>
        </p>

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
