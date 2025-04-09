import React, { useState, useEffect } from "react";
import "./AddressPage.css";
import AddressList from "../../components/Address/AddressList.jsx";
import AddressForm from "../../components/Address/AddressForm.jsx";
import Popup from "../../components/Common/Popup.jsx";
import Button from "../../components/Common/Button.jsx";

const AddressPage = () => {
  const initialAddresses = [
    { id: 1, name: "Nguyễn Hoàng Kiều Ngân", phone: "0859763025", detail: "36 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, HCM", isDefault: true },
    { id: 2, name: "Trần Minh Tâm", phone: "0901234567", detail: "19 Nguyễn Văn Linh, P. Tân Hưng, Q. 7, HCM" },
  ];

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedId, setSelectedId] = useState(initialAddresses[0]?.id || null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);

  const handleAdd = () => {
    setEditingAddress(null);
    setShowForm(true);
  };

  const handleEdit = (address) => {
    setEditingAddress(address);
    setSelectedId(address.id);
    setShowForm(true);
  };

  const handleSave = (newAddress) => {
    setAddresses(prevAddresses => 
      prevAddresses.map(addr => ({
        ...addr,
        isDefault: newAddress.isDefault ? addr.id === newAddress.id : addr.isDefault
      }))
    );
  
    setShowForm(false);
  };
  

  const handleDelete = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const handleSelect = (id) => {
    setSelectedId(id);
  };

  const handleUpdate = (data) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((addr) =>
        addr.id === data.id ? { ...addr, ...data } : addr
      )
    );
    setShowForm(false);
  };

  return (
    <div className="address-page">
      <h2>Chọn địa chỉ giao hàng</h2>

      <AddressList 
        addresses={addresses} 
        selectedId={selectedId} 
        onSelect={handleSelect} 
        onEdit={handleEdit} 
        onDelete={handleDelete} 
      />

      <Button text="Thêm địa chỉ mới" onClick={handleAdd} btnStyle="add"></Button>

      <Popup isOpen={showForm} onClose={() => setShowForm(false)} title={editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ"}>
        <AddressForm 
          initialData={editingAddress}  // Truyền editingAddress thay vì initialAddresses
          onSave={handleSave} 
          onCancel={() => setShowForm(false)} 
          onUpdate={handleUpdate}
        />
      </Popup>
    </div>
  );
};

export default AddressPage;
