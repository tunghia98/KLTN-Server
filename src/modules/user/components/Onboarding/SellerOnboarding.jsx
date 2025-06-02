import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";
import "./SellerOnboarding.css";

const steps = [
  "Thiết lập shop",
  "Địa chỉ lấy hàng",
  "Thông tin thanh toán",
  "Hoàn tất",
  "Thanh toán",
];

export default function SellerOnboarding() {
  const [step, setStep] = useState(0);
  const nextStep = () => {
    if (step === 0) {
      if (!shopName.trim()) {
        setError("Tên shop không được để trống!");
        return;
      }
      if (!shopAvatar) {
        setError("Bạn phải chọn logo cửa hàng!");
        return;
      }
    } else if (step === 1) {
      if (
        !province.trim() ||
        !district.trim() ||
        !ward.trim() ||
        !street.trim()
      ) {
        setError("Vui lòng nhập đầy đủ địa chỉ lấy hàng.");
        return;
      }
    } else if (step === 2) {
      if (!bankName.trim() || !bankAccount.trim()) {
        setError("Vui lòng nhập đầy đủ thông tin thanh toán.");
        return;
      }
    }
    // Nếu qua validate -> clear lỗi
    setError("");
    setStep((s) => Math.min(s + 1, steps.length - 1));
  };

  const [shopName, setShopName] = useState(""); // Thêm state cho tên shop
  const [isChecked, setIsChecked] = useState(false); // Quản lý trạng thái checkbox
  const [isCompleted, setIsCompleted] = useState(false); // Quản lý trạng thái hoàn tất
  const [error, setError] = useState(""); // Thêm state cho thông báo lỗi
  const [shopAvatar, setShopAvatar] = useState(null);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [province, setProvince] = useState("");
  const [district, setDistrict] = useState("");
  const [ward, setWard] = useState("");
  const [street, setStreet] = useState("");
  const [bankName, setBankName] = useState("");
  const [bankAccount, setBankAccount] = useState("");
  const [hasPaid, setHasPaid] = useState(false); // kiểm tra đã thanh toán
  const prevStep = () => setStep((s) => Math.max(s - 1, 0));
  const { isLoggedIn } = useUser();
  const navigate = useNavigate();
  if (!isLoggedIn) {
    // Nếu chưa đăng nhập, redirect đến trang login
    return <Navigate to="/login" />;
  }
  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };
  const handleComplete = async () => {
    if (!isChecked) {
      alert("Vui lòng đồng ý các điều khoản trước khi hoàn tất.");
      return;
    } // Redirect đến trang dashboard của người bán

    const baseUrl = "https://kltn.azurewebsites.net"; // Cố định domain API
    const userId = localStorage.getItem("userId");
    try {
      // 1. Gửi yêu cầu tạo shop
      const createShopResponse = await fetch(`${baseUrl}/api/shops/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          shopName: shopName,
          avatarUrl: null,
        }),
      });

      if (!createShopResponse.ok) {
        throw new Error("Tạo shop thất bại");
      }

      const createShopResult = await createShopResponse.json();
      const shopId = createShopResult.shopId;

      // 2. Upload logo cửa hàng nếu có
      if (shopAvatar) {
        const formData = new FormData();
        formData.append("file", shopAvatar);

        const uploadAvatarResponse = await fetch(
          `${baseUrl}/api/shops/upload-shop-avatar`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: formData,
          }
        );

        if (!uploadAvatarResponse.ok) {
          console.warn("Upload avatar thất bại, nhưng sẽ tiếp tục.");
        }
      }

      // 3. Thêm địa chỉ shop
      const addAddressResponse = await fetch(
        `${baseUrl}/api/addresses/shop/${shopId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify({
            street: street,
            ward: ward,
            district: district,
            province: province,
          }),
        }
      );

      if (!addAddressResponse.ok) {
        throw new Error("Thêm địa chỉ thất bại");
      }

      // 4. Lưu tài khoản ngân hàng vào Wallet
      const addWalletResponse = await fetch(`${baseUrl}/api/userwallets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify({
          walletType: "bank",
          walletName: bankName,
          walletNumber: bankAccount,
        }),
      });

      if (!addWalletResponse.ok) {
        throw new Error("Thêm tài khoản ngân hàng thất bại");
      }

      alert("Đăng ký shop thành công!");
      setIsCompleted(true);
      navigate("/seller/dashboard");
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra trong quá trình đăng ký. Vui lòng thử lại.");
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
        {error && <p className="error-message">{error}</p>}
        {step === 0 && (
          <div>
            <label>Tên shop</label>
            <input
              type="text"
              placeholder="Nhập tên shop"
              value={shopName}
              onChange={(e) => setShopName(e.target.value)}
            />

            <label>Logo cửa hàng</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setShopAvatar(file);
                  setPreviewAvatar(URL.createObjectURL(file));
                }
              }}
            />
            {previewAvatar && (
              <img
                src={previewAvatar}
                alt="Shop Avatar"
                style={{
                  maxWidth: "150px",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              />
            )}
          </div>
        )}
        {step === 1 && (
          <div className="address--form">
            <label>Thành phố / Tỉnh</label>
            <input
              type="text"
              placeholder="Nhập tỉnh/thành phố"
              value={province}
              onChange={(e) => setProvince(e.target.value)}
            />

            <label>Quận / Huyện</label>
            <input
              type="text"
              placeholder="Nhập quận/huyện"
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
            />

            <label>Phường / Xã</label>
            <input
              type="text"
              placeholder="Nhập phường/xã"
              value={ward}
              onChange={(e) => setWard(e.target.value)}
            />

            <label>Số nhà, tên đường</label>
            <input
              type="text"
              placeholder="Nhập số nhà, tên đường"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
            />
          </div>
        )}
        {step === 2 && (
          <div className="bank-info-form">
            <label>Ngân hàng</label>
            <input
              type="text"
              placeholder="Tên ngân hàng"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />

            <label>Số tài khoản</label>
            <input
              type="text"
              placeholder="Số tài khoản ngân hàng"
              value={bankAccount}
              onChange={(e) => setBankAccount(e.target.value)}
            />
          </div>
        )}
        {step === 3 && (
          <div className="completion-form">
            <h3>Hoàn tất đăng ký bán hàng</h3>
            <p>
              Để hoàn tất đăng ký bán hàng trên sàn, bạn cần đọc và đồng ý với{" "}
              <a
                href="/terms-and-conditions"
                target="_blank"
                rel="noopener noreferrer"
              >
                các điều khoản và cam kết của sàn
              </a>
              .
            </p>

            <div className="checkbox-container">
              <input
                type="checkbox"
                id="terms-checkbox"
                checked={isChecked}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="terms-checkbox">
                Tôi đã đọc các điều khoản và hoàn tất đăng ký
              </label>
            </div>
          </div>
        )}
        {step === 4 && (
          <div className="payment-step">
            <h3>Thanh toán phí đăng ký bán hàng</h3>
            <p>
              Bạn cần thanh toán <strong>200.000đ</strong> để hoàn tất đăng ký
              bán hàng.
            </p>

            {!hasPaid ? (
              <div>
                {/* TODO: Tích hợp ví thanh toán hoặc hướng dẫn chuyển khoản */}
                <p>Quét mã QR để thanh toán:</p>
                <img
                  src="./QR.jpg"
                  alt="QR code"
                  style={{ width: 400, margin: "0 auto",  }}
                />
              </div>
            ) : (
              <div>
                <p>✅ Bạn đã xác nhận thanh toán.</p>
                <button onClick={handleComplete}>Hoàn tất</button>
              </div>
            )}
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
          <>
            <button onClick={handleComplete}>Hoàn tất</button>
          </>
        )}
      </div>
    </div>
  );
}
