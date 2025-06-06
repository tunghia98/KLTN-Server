import React, { useState } from "react";
import ReactDOM from "react-dom";
import "./Auth.css"; // style chung
import Button from "../../../../components/Common/Button";
import Popup from "../../../../components/Common/Popup";

function Forgot({ isOpen, onClose, onSwitchToLogin }) {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleForgot = async (e) => {
        e.preventDefault();

        if (!username.trim() || !email.trim()) {
            setError("Vui lòng nhập đầy đủ tên đăng nhập và email.");
            return;
        }

        setError("");
        setLoading(true);

        try {
            const response = await fetch(
                "https://kltn.azurewebsites.net/api/auth/forgot-password",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userName: username, email }),
                }
            );

            if (response.ok) {
                alert("Mật khẩu đã được đặt lại. Vui lòng kiểm tra email.");
                onClose();
                onSwitchToLogin();
            } else {
                const errorText = await response.text();
                setError(errorText || "Có lỗi xảy ra. Vui lòng thử lại.");
            }
        } catch (err) {
            console.error(err);
            setError("Lỗi kết nối đến máy chủ.");
        } finally {
            setLoading(false);
        }
    };

    return ReactDOM.createPortal(
        <Popup isOpen={isOpen} onClose={onClose} title="Quên mật khẩu">
            <form onSubmit={handleForgot} className="popup-login-form">
                <div className="form-group">
                    <label>Tên đăng nhập</label>
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        autoFocus
                    />
                </div>
                <div className="form-group">
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}

                <div className="form-actions">
                    <Button type="submit" text={loading ? "Đang gửi..." : "Xác nhận"} btnStyle="auth" disabled={loading} />
                </div>

                <p style={{ marginTop: "1rem", textAlign: "center" }}>
                    Bạn đã có tài khoản?{" "}
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault();
                            onClose();
                            onSwitchToLogin();
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

export default Forgot;
