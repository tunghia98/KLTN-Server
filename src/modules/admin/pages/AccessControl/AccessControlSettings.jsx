import React, { useState } from "react";
import "./AccessControlSettings.css";

const defaultPermissions = {
  userManagement: false,
  sellerManagement: false,
  violationSupport: false,
  viewReports: false,
};

export default function AccessControlSettings() {
  const [selectedAdmin, setSelectedAdmin] = useState(null);
  const [permissions, setPermissions] = useState(defaultPermissions);

  const admins = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Trần Thị B" },
    { id: 3, name: "Phạm Văn C" },
  ];

  const handlePermissionChange = (permKey) => {
    setPermissions((prev) => ({
      ...prev,
      [permKey]: !prev[permKey],
    }));
  };

  const savePermissions = () => {
    if (!selectedAdmin) {
      alert("Vui lòng chọn quản trị viên!");
      return;
    }
    console.log(`Đã lưu phân quyền cho ${selectedAdmin.name}:`, permissions);
    alert(`Đã lưu phân quyền cho ${selectedAdmin.name}`);
    // TODO: Gửi dữ liệu lên server tại đây
  };

  const loadPermissions = (admin) => {
    // TODO: Load từ API theo `admin.id`
    setSelectedAdmin(admin);
    setPermissions(defaultPermissions); // hoặc permissions đã được gán trước đó
  };

  return (
    <div className="access-control">
      <h2>🔐 Thiết lập quyền truy cập</h2>

      <div className="admin-list">
        <h3>Chọn quản trị viên:</h3>
        <ul>
          {admins.map((admin) => (
            <li
              key={admin.id}
              className={selectedAdmin?.id === admin.id ? "active" : ""}
              onClick={() => loadPermissions(admin)}
            >
              {admin.name}
            </li>
          ))}
        </ul>
      </div>

      {selectedAdmin && (
        <div className="permission-settings">
          <h3>Phân quyền cho: {selectedAdmin.name}</h3>
          <label>
            <input
              type="checkbox"
              checked={permissions.userManagement}
              onChange={() => handlePermissionChange("userManagement")}
            />
            Quản lý người dùng
          </label>
          <label>
            <input
              type="checkbox"
              checked={permissions.sellerManagement}
              onChange={() => handlePermissionChange("sellerManagement")}
            />
            Quản lý nhà bán hàng
          </label>
          <label>
            <input
              type="checkbox"
              checked={permissions.violationSupport}
              onChange={() => handlePermissionChange("violationSupport")}
            />
            Quản lý vi phạm & hỗ trợ
          </label>
          <label>
            <input
              type="checkbox"
              checked={permissions.viewReports}
              onChange={() => handlePermissionChange("viewReports")}
            />
            Xem báo cáo & thống kê
          </label>

          <button onClick={savePermissions}>💾 Lưu phân quyền</button>
        </div>
      )}
    </div>
  );
}
