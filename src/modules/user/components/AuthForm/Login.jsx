import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Auth.css";
import Button from "../../../../components/Common/Button.jsx";
import Popup from "../../../../components/Common/Popup.jsx";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext.jsx";

function Login({ isOpen, onClose, onSwitchToRegister, isReady }) {
  const [email, setEmail] = useState("");
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
        toast.error(message || "Sai tài khoản hoặc mật khẩu!");
        return;
      }

      const data = await response.json();
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);

      const payload = JSON.parse(atob(data.accessToken.split(".")[1]));
      const userId = payload["userId"];
      const username = payload["username"];
      let role = "";
        const rolea = payload["role"]; // Đúng định dạng bạn tạo
        if (rolea.includes("buyer"))
            role = "buyer";
        if (rolea.includes("seller"))
            role = "seller";
        if (rolea.includes("admin"))
            role = "admin";
      const decodedUser = { userId, username, role };
      setUser(decodedUser);
        localStorage.setItem("user", JSON.stringify(decodedUser));
      if (rememberMe) {
        localStorage.setItem("user", JSON.stringify(decodedUser));
      }

      toast.success(`Đăng nhập thành công!`);

    setTimeout(() => {
      if (role.includes("admin")) {
        navigate("/admin/dashboard");
      } else if (role.includes("seller")) {
        navigate("/seller/dashboard");
      } else {
        if (isReady === true) {
          navigate("/onboarding");
        } else {
          navigate("/");
        }
      }
      onClose();
    }, 1500); 

    } catch (err) {
      toast.error("Lỗi kết nối đến máy chủ!");
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
          <Button type="submit" text="Đăng nhập" btnStyle="auth" />
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

      {/* ToastContainer nên được đặt trong chính component nếu không dùng ở App */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        pauseOnHover
        draggable
      />
    </Popup>,
    document.body
  );
}

export default Login;
