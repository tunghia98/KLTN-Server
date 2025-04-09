import React, { useState, useEffect } from "react";
import "./Address.css";
import Button from "../Common/Button.jsx";

const AddressForm = ({ initialData, onSave, onCancel, onUpdate }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    phone: "",
    detail: "",
    isDefault: false, // Trạng thái mặc định của địa chỉ
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        id: initialData.id || null,
        name: initialData.name || "",  // Cung cấp giá trị mặc định nếu không có
        phone: initialData.phone || "",
        detail: initialData.detail || "",
        isDefault: initialData.isDefault || false, // Giá trị mặc định cho checkbox
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.id) {
      onUpdate(formData); // Nếu có ID, thực hiện cập nhật
    } else {
      onSave(formData); // Nếu không có ID, thực hiện lưu mới
    }
  };

  return (
    <form onSubmit={handleSubmit} className="address-form">
      <div>
        <label htmlFor="name">Họ và tên</label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name || ""}  // Nếu formData.name là undefined, sẽ thay bằng chuỗi rỗng
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="phone">Số điện thoại</label>
        <input
          type="text"
          id="phone"
          name="phone"
          value={formData.phone || ""}  // Cung cấp giá trị mặc định
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="detail">Địa chỉ</label>
        <textarea
          id="detail"
          name="detail"
          value={formData.detail || ""}  // Cung cấp giá trị mặc định
          onChange={handleChange}
        />
      </div>
      <div>
      <div className="default-address-check">
        <input
            type="checkbox"
            className="default-check"
            name="isDefault"
            checked={formData.isDefault}
            onChange={(e) => setFormData(prev => ({ ...prev, isDefault: e.target.checked }))}
        />
        <span>Đặt làm địa chỉ mặc định</span>
        </div>


        <Button type="button" text="Hủy bỏ" btnStyle="cancel" onClick={onCancel} />
        <Button type="submit" text={formData.id ? "Cập nhật" : "Thêm"} btnStyle="save" />
      </div>
    </form>
  );
};

export default AddressForm;
