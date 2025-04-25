import React, { useState } from "react";
import "./WebsiteCustomization.css";

export default function WebsiteCustomization() {
  const [logo, setLogo] = useState("");
  const [background, setBackground] = useState("");
  const [slogan, setSlogan] = useState("");
  const [themeColor, setThemeColor] = useState("#ffffff");

  const handleLogoChange = (e) => {
    setLogo(URL.createObjectURL(e.target.files[0]));
  };

  const handleBackgroundChange = (e) => {
    setBackground(URL.createObjectURL(e.target.files[0]));
  };

  const handleSloganChange = (e) => {
    setSlogan(e.target.value);
  };

  const handleThemeColorChange = (e) => {
    setThemeColor(e.target.value);
  };

  return (
    <div className="website-customization-container">
      <h2>🖌 Tùy chỉnh giao diện website</h2>

      <div className="logo-upload">
        <h3>Thay đổi Logo</h3>
        <input type="file" onChange={handleLogoChange} />
        {logo && <img src={logo} alt="Logo" className="uploaded-logo" />}
      </div>

      <div className="background-upload">
        <h3>Thay đổi ảnh nền trang chủ</h3>
        <input type="file" onChange={handleBackgroundChange} />
        {background && <img src={background} alt="Background" className="uploaded-background" />}
      </div>

      <div className="slogan-input">
        <h3>Cập nhật Slogan</h3>
        <input
          type="text"
          value={slogan}
          onChange={handleSloganChange}
          placeholder="Nhập slogan..."
        />
      </div>

      <div className="color-picker">
        <h3>Chỉnh sửa màu sắc giao diện</h3>
        <label>Màu nền:</label>
        <input
          type="color"
          value={themeColor}
          onChange={handleThemeColorChange}
        />
      </div>

      <button className="save-button">Lưu thay đổi</button>
    </div>
  );
}
