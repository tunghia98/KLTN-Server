import React from "react";

const UserInfoForm = ({ formData, setFormData, handleSubmit, handleAvatarChange, previewAvatar, userInfo }) => {
    return (
    <div className="user-info-flex">
      {/* Avatar bên trái */}
      <div className="avatar-preview-container">
        <label>Ảnh đại diện</label>
        {(previewAvatar || userInfo?.avatarUrl) && (
          <img
            src={
              previewAvatar ||
              (userInfo?.avatarUrl
                ? `https://localhost:7135/api/Users/avatar/${userInfo.avatarUrl}`
                : `/default-avatar.png`)
            }
            alt="Avatar Preview"
            className="avatar-preview mt-2"
          />
        )}
        <input type="file" accept="image/*" onChange={handleAvatarChange} />
      </div>

      {/* Form bên phải */}
      <form onSubmit={handleSubmit} className="edit-form">
        <h2>✏️ Chỉnh sửa thông tin cá nhân</h2>

        <label>Họ tên</label>
        <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />

        <label>Email</label>
        <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

        <label>SĐT</label>
        <input type="tel" value={formData.phoneNumber} onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })} />

        <label>Ngày sinh</label>
        <input type="date" value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} />

        <label>Giới tính</label>
        <select value={formData.gender} onChange={(e) => setFormData({ ...formData, gender: e.target.value })}>
          <option value="">-- Chọn giới tính --</option>
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select >

    <div className="form-action-wrapper">
        < button className ="btn" type="submit">💾 Lưu thông tin</button>
        </div >
      </form >
    </div >
  );
};

export default UserInfoForm;
