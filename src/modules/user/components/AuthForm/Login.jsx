import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Auth.css";
import Button from "../../../../components/Common/Button.jsx";
import Popup from "../../../../components/Common/Popup.jsx";
import { useNavigate } from "react-router-dom";
import { sellers, userAccounts } from "../../../../data/data.js"; // Thêm dữ liệu người dùng
import { useUser } from "../../../../contexts/UserContext.jsx";  // Import component Popup

function Login({ isOpen, onClose, onSwitchToRegister, isReady}) {
  const [email, setEmail] = useState(""); // Thay "username" bằng "email"
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const { setUser } = useUser();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await fetch("https://kltn.azurewebsites.net/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userName: email,
          password: password,
        }),
      });
  
      if (!response.ok) {
        const message = await response.text();
        alert(message || "Sai tài khoản hoặc mật khẩu!");
        return;
      }
  
      const data = await response.json();
  
      // Lưu token
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
  
      // ✅ Giải mã token KHÔNG có schema
      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
      const userId = payload["userId"];
      const username = payload["username"];
      const role = payload["role"]; // Đúng định dạng bạn tạo
  
      const loggedInUser = { userId, username, role };
  
      setUser(loggedInUser);
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(loggedInUser));
      }
  
      alert(`Chào mừng ${username}!`);
  
      // Điều hướng theo role
      if (role === "admin") {
        navigate("/admin/dashboard");
      } else if (role === "seller") {
        navigate("/seller/dashboard");
      } else {
        if(isReady===true){
          navigate("/onboarding");
        }else
        navigate("/");
      }
  
      onClose();
  
    } catch (err) {
      alert("Lỗi kết nối đến máy chủ!");
      console.error(err);
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
              href="/register"
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
