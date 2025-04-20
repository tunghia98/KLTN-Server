import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Auth.css";
import Button from "../../../../components/Common/Button.jsx";
import Popup from "../../../../components/Common/Popup.jsx";
import { useNavigate } from "react-router-dom";
import { sellers, userAccounts } from "../../../../data/data.js"; // Thêm dữ liệu người dùng
import { useUser } from "../../../../contexts/UserContext.jsx";  // Import component Popup

function Login({ isOpen, onClose, onSwitchToRegister }) {
  const [email, setEmail] = useState(""); // Thay "username" bằng "email"
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Tìm người dùng trong dữ liệu
    const foundUser = userAccounts.find(
      (u) => u.username === email && u.password === password
    );

    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('user', JSON.stringify(foundUser));
      alert(`Chào mừng ${foundUser.name}!`);
    
      // Điều hướng dựa trên role
      if (foundUser.role === "admin") {
        navigate("/admin/dashboard");
      } else if (foundUser.role === "seller") {
        navigate("/seller/dashboard");
        onClose();
      } else {
        onClose();
      }
    } else {
      alert("Sai tài khoản hoặc mật khẩu!");
    }
  };

  return ReactDOM.createPortal(
    <Popup isOpen={isOpen} onClose={onClose} title="Đăng nhập" redirectTo="/">
      <form onSubmit={handleLogin} className="popup-login-form">
        <div className="form-group">
          <label>Tên tài khoản</label>
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Sử dụng email để tìm kiếm
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
        <div className="checkbox-group">
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
        <div className="auth-options">
          <p style={{ marginTop: "0.5rem", textAlign: "center" }}>
            <a href="#" style={{ fontSize: "0.9rem", color: "#666" }}>
              Quên mật khẩu?
            </a>
          </p>
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
        </div>
      </form>
    </Popup>,
    document.body
  );
}

export default Login;
