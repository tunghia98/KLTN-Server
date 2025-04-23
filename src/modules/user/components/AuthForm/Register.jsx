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
  const [phoneNumber, setPhoneNumber] = useState("");
  if (!isOpen) return null;

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPass) {
            alert("Mật khẩu không khớp!");
            return;
        }

        try {
            const response = await fetch("https://kltn.azurewebsites.net/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email: email,
                    userName: username,
                    phoneNumber: phoneNumber, // Nếu bạn không cần, để trống hoặc cho nhập thêm field
                    password: password,
                    confirmPassword: confirmPass,
                }),
            });

            if (response.ok) {
                alert("Đăng ký thành công!");
                onClose();
                onSwitchToLogin(); // chuyển sang login
            } else {
                const errorText = await response.text();
                alert("Đăng ký thất bại: " + errorText);
            }
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            alert("Đã xảy ra lỗi khi đăng ký!");
        }
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
            <label>Số điện thoại</label>
            <input value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
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
