import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";
import "./SellerOnboarding.css";

const steps = [
  "Thiết lập shop",
  "Địa chỉ lấy hàng",
  "Thông tin thanh toán",
  "Hoàn tất",
];

export default function SellerOnboarding() {
  const [step, setStep] = useState(0);
  const [shopName, setShopName] = useState(""); // Thêm state cho tên shop
  const [isChecked, setIsChecked] = useState(false); // Quản lý trạng thái checkbox
  const [isCompleted, setIsCompleted] = useState(false); // Quản lý trạng thái hoàn tất
  const [error, setError] = useState(""); // Thêm state cho thông báo lỗi

  const nextStep = () => {
    // Kiểm tra tên shop ở bước 1
    if (step === 0 && !shopName.trim()) {
      setError("Tên shop không được để trống!");
      return;
    } else {
      setError(""); // Nếu tên shop hợp lệ, xóa lỗi
    }

    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const { isLoggedIn } = useUser();
  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, redirect đến trang login
    return <Navigate to="/login" />;
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleComplete = () => {
    if (isChecked) {
      setIsCompleted(true);
      alert("Hoàn tất đăng ký!");
    } else {
      alert("Vui lòng đồng ý các điều khoản trước khi hoàn tất.");
    }
  };

  return (
    <div className="onboarding-container">
      <h2 className="onboarding-title">Đăng ký bán hàng</h2>

      <div className="stepper">
        {steps.map((label, index) => (
          <div key={index} className="step">
            <div className={`circle ${step >= index ? "active" : ""}`}>
              {index + 1}
            </div>
            <div className="step-label">{label}</div>
          </div>
        ))}
      </div>

      <div className="step-content">
        {step === 0 && (
          <div>
            <label>Tên shop</label>
            <input
              type="text"
              placeholder="Nhập tên shop"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />
            {error && <p className="error-message">{error}</p>} {/* Hiển thị lỗi nếu có */}
          </div>
        )}
        {step === 1 && (
          <div className="address-form">
            <label>Thành phố / Tỉnh</label>
            <input type="text" placeholder="Nhập tỉnh/thành phố" />
            <label>Quận / Huyện</label>
            <input type="text" placeholder="Nhập quận/huyện" />
            <label>Phường / Xã</label>
            <input type="text" placeholder="Nhập phường/xã" />
            <label>Số nhà, tên đường</label>
            <input type="text" placeholder="123 đường Lê Lợi..." />
          </div>
        )}
        {step === 2 && (
          <div className="bank-info-form">
            <label>Ngân hàng</label>
            <input type="text" placeholder="Ví dụ: Vietcombank, BIDV, MB Bank..." />
            <label>Số tài khoản</label>
            <input type="text" placeholder="Nhập số tài khoản ngân hàng" />
          </div>
        )}
        {step === 3 && (
          <div className="completion-form">
            <h3>Hoàn tất đăng ký bán hàng</h3>
            <p>
              Để hoàn tất đăng ký bán hàng trên sàn, bạn cần đọc và đồng ý với{" "}
              <a href="/terms-and-conditions" target="_blank" rel="noopener noreferrer">
                các điều khoản và cam kết của sàn
              </a>.
            </p>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="terms-checkbox">Tôi đã đọc các điều khoản và hoàn tất đăng ký</label>
            </div>
          </div>
        )}
      </div>

      <div className="buttons">
        <button onClick={prevStep} disabled={step === 0}>
          Quay lại
        </button>
        {step < steps.length - 1 ? (
          <button onClick={nextStep}>Tiếp theo</button>
        ) : (
          <button onClick={handleComplete} disabled={!isChecked}>Hoàn tất</button>
        )}
      </div>
    </div>
  );
}
