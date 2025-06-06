import React, { useState } from "react";

const UserInfoForm = ({
  formData,
  setFormData,
  handleSubmit,
  handleAvatarChange,
  previewAvatar,
    userInfo,
    showPasswordForm,
    setShowPasswordForm,
    handleChangePassword,
}) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="user-info-flex" style={{ display: "flex", gap: "2rem" }}>
      {/* Avatar bên trái */}
      <div className="avatar-preview-container">
        <label>Ảnh đại diện</label>
        {(previewAvatar || userInfo?.avatarUrl) && (
          <img
            src={
              previewAvatar ||
              (userInfo?.avatarUrl
                ? `https://kltn.azurewebsites.net/api/Users/avatar/${userInfo.avatarUrl}`
                : `/default-avatar.png`)
            }
            alt="Avatar Preview"
            className="avatar-preview mt-2"
            style={{
              width: "150px",
              height: "150px",
              objectFit: "cover",
              borderRadius: "50%",
            }}
          />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      {/* Bên phải: Chia 2 khối */}
      <div style={{ display: "flex", flex: 1, gap: "2rem" }}>
        {/* Form thông tin */}
        <form onSubmit={handleSubmit} className="edit-form" style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h2>✏️ Chỉnh sửa thông tin</h2>
            <span
              onClick={() => setShowPasswordForm(!showPasswordForm)}
              style={{
                color: "#007bff",
                cursor: "pointer",
                fontSize: "0.9rem",
                textDecoration: "underline",
              }}
            >
              {showPasswordForm ? "Ẩn đổi mật khẩu" : "🔐 Đổi mật khẩu"}
            </span>
          </div>

          <label>Họ tên</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />

          <label>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

          <label>SĐT</label>
          <input
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />

          <label>Ngày sinh</label>
          <input
            type="date"
            value={formData.birthDate}
            onChange={(e) =>
              setFormData({ ...formData, birthDate: e.target.value })
            }
          />

          <label>Giới tính</label>
          <select
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">-- Chọn giới tính --</option>
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>

          <div className="form-action-wrapper" style={{ marginTop: "1rem" }}>
            <button className="btn" type="submit">
              💾 Lưu thông tin
            </button>
          </div>
        </form>

        {/* Form đổi mật khẩu - hiển thị khi showPasswordForm true */}
        {showPasswordForm && (
          <div
            className="change-password-fields"
            style={{
              flex: 1,
              border: "1px solid #ccc",
              padding: "1rem",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              height: "fit-content",
            }}
          >
            <h2>🔒 Đổi mật khẩu</h2>

                      <div style={{ position: "relative" }}>
                          <label>Mật khẩu hiện tại</label>
                          <input
                              type={showCurrentPassword ? "text" : "password"}
                              name="currentPassword"
                              value={passwordData.currentPassword}
                              onChange={handlePasswordChange}
                              style={{ paddingRight: "2rem" }}
                          />
                          <span
                              onMouseEnter={() => setShowCurrentPassword(true)}
                              onMouseLeave={() => setShowCurrentPassword(false)}
                              style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "35px",
                                  cursor: "pointer",
                                  fontSize: "1rem",
                                  color: "#666",
                              }}
                          >
                              👁️
                          </span>
                      </div>

                      <div style={{ position: "relative" }}>
                          <label>Mật khẩu mới</label>
                          <input
                              type={showNewPassword ? "text" : "password"}
                              name="newPassword"
                              value={passwordData.newPassword}
                              onChange={handlePasswordChange}
                              style={{ paddingRight: "2rem" }}
                          />
                          <span
                              onMouseEnter={() => setShowNewPassword(true)}
                              onMouseLeave={() => setShowNewPassword(false)}
                              style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "35px",
                                  cursor: "pointer",
                                  fontSize: "1rem",
                                  color: "#666",
                              }}
                          >
                              👁️
                          </span>
                      </div>

                      <div style={{ position: "relative" }}>
                          <label>Nhập lại mật khẩu mới</label>
                          <input
                              type={showConfirmPassword ? "text" : "password"}
                              name="confirmPassword"
                              value={passwordData.confirmPassword}
                              onChange={handlePasswordChange}
                              style={{ paddingRight: "2rem" }}
                          />
                          <span
                              onMouseEnter={() => setShowConfirmPassword(true)}
                              onMouseLeave={() => setShowConfirmPassword(false)}
                              style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "35px",
                                  cursor: "pointer",
                                  fontSize: "1rem",
                                  color: "#666",
                              }}
                          >
                              👁️
                          </span>
                      </div>


            <div style={{ marginTop: "1rem" }}>
                          <button
                              className="btn btn-warning"
                              type="button"
                              onClick={() => handleChangePassword(passwordData)} // truyền dữ liệu lên cha
                          >
                              ✅ Xác nhận đổi mật khẩu
                          </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInfoForm;
