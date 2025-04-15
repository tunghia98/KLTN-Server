import React from "react";
import "./Address.css";
import Button from "../../../../components/Common/Button.jsx"; // Assuming you have a Button component

const AddressItem = ({ address, isSelected, onSelect, onEdit, onDelete }) => (
  <div className={`address-item ${isSelected ? "selected" : ""}`}>
    <input 
      type="radio" 
      checked={isSelected} 
      onChange={() => onSelect(address.id)} 
    />
    <div className="info">
      <p>{address.name} - {address.phone}</p>
      <p>{address.detail}</p>
      <span className="item-selected" hidden={!address.isDefault}>Mặc định</span> {/* Thay đổi ở đây */}
    </div>
    <div className="actions">
      <Button text="Sửa" onClick={() => onEdit(address)} btnStyle="edit"></Button>
      <Button text="Xóa" onClick={() => onDelete(address.id)} btnStyle="delete"></Button>
    </div>
  </div>
);

export default AddressItem;
