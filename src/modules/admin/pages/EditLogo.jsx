// src/pages/AdminDashboard/EditLogo.jsx
import React, { useState } from 'react';

const EditLogo = () => {
  const [logo, setLogo] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setLogo(URL.createObjectURL(file));
  };

  const handleSave = () => {
    // Xử lý lưu ảnh (có thể upload lên server)
    alert('Logo đã được cập nhật!');
  };

  return (
    <div>
      <h2>Chỉnh sửa ảnh đại diện</h2>
      <div>
        {logo ? (
          <img src={logo} alt="Logo" style={{ width: 200, height: 200 }} />
        ) : (
          <p>Chưa có ảnh đại diện</p>
        )}
        <input type="file" accept="image/*" onChange={handleImageChange} />
        <button onClick={handleSave}>Lưu ảnh</button>
      </div>
    </div>
  );
};

export default EditLogo;
