import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";
import "./SellerOnboarding.css";

const steps = [
  "Thiết lập shop",
  "Thêm sản phẩm",
  "Địa chỉ lấy hàng",
  "Vận chuyển",
  "Tài khoản ngân hàng",
];

export default function SellerOnboarding() {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((s) => Math.min(s + 1, steps.length - 1));
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));

  const { isLoggedIn } = useUser();
  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, redirect đến trang login
    return <Navigate to="/login" />;
  }
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
            <input type="text" placeholder="Nhập tên shop" />
          </div>
        )}
        {step === 1 && (
          <div>
            <label>Tên sản phẩm</label>
            <input type="text" placeholder="Sản phẩm đầu tiên" />
          </div>
        )}
        {step === 2 && (
          <div>
            <label>Địa chỉ lấy hàng</label>
            <input type="text" placeholder="Ví dụ: 123, Xã Y, Tỉnh Z" />
          </div>
        )}
        {step === 3 && (
          <div>
            <label>Chọn đơn vị vận chuyển</label>
            <select>
              <option>GHN</option>
              <option>GHTK</option>
              <option>J&T Express</option>
              <option>Shopee Xpress</option>
            </select>
          </div>
        )}
        {step === 4 && (
          <div>
            <label>Tài khoản ngân hàng</label>
            <input type="text" placeholder="123456789 - Vietcombank" />
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
          <button onClick={() => alert("Hoàn tất đăng ký!")}>Hoàn tất</button>
        )}
      </div>
    </div>
  );
}
