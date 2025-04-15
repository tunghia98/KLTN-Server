import React, { useState, useEffect } from "react";
import "./AddressPage.css";
import AddressList from "../../components/Address/AddressList.jsx";
import AddressForm from "../../components/Address/AddressForm.jsx";
import Popup from "../../../../components/Common/Popup.jsx";
import Button from "../../../../components/Common/Button.jsx";
import {useAddress} from "../../../../contexts/AddressContext.jsx"
import { v4 as uuidv4 } from 'uuid';

const AddressPage = () => {
  const initialAddresses = [
    { id: 1, name: "Nguyễn Hoàng Kiều Ngân", phone: "0859763025", detail: "36 Trịnh Đình Thảo, P. Hòa Thạnh, Q. Tân Phú, HCM", isDefault: true },
    { id: 2, name: "Trần Minh Tâm", phone: "0901234567", detail: "19 Nguyễn Văn Linh, P. Tân Hưng, Q. 7, HCM" },
  ];

  // Đọc danh sách địa chỉ từ localStorage nếu có
  const storedAddresses = JSON.parse(localStorage.getItem("addresses")) || initialAddresses;
  const [addresses, setAddresses] = useState(storedAddresses);

  const [selectedId, setSelectedId] = useState(initialAddresses[0]?.id || null);
  const [showForm, setShowForm] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const { setDefaultAddress } = useAddress();

  useEffect(() => {
    const defaultAddr = addresses.find((addr) => addr.isDefault);
    setDefaultAddress(defaultAddr);
  }, [addresses]);
  
  

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
    const addressToAdd = {
      ...newAddress,
      id: uuidv4(),
    };

    let updatedAddresses;

    if (newAddress.isDefault) {
      updatedAddresses = addresses.map(addr => ({
        ...addr,
        isDefault: false,
      }));
    } else {
      updatedAddresses = [...addresses];
    }

    updatedAddresses.push(addressToAdd);
    setAddresses(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    if (newAddress.isDefault) {
      setSelectedId(addressToAdd.id);
    }
    setShowForm(false);
  };
  const handleUpdate = (updatedAddress) => {
    let updatedAddresses = addresses.map((addr) => {
      if (addr.id === updatedAddress.id) {
        return updatedAddress;
      } else if (updatedAddress.isDefault) {
        return { ...addr, isDefault: false };
      } else {
        return addr;
      }
    });
  
    setAddresses(updatedAddresses);
    localStorage.setItem("addresses", JSON.stringify(updatedAddresses));
    if (updatedAddress.isDefault) {
      setDefaultAddress(updatedAddress); // <-- cập nhật vào context
    }
  
    setEditingAddress(null);
    setShowForm(false);
  };

  const handleDelete = (id) => {
    const newAddresses = addresses.filter(addr => addr.id !== id);
    setAddresses(newAddresses);

    // Nếu địa chỉ bị xóa là mặc định thì reset selectedId
    if (id === selectedId) {
      const defaultAddr = newAddresses.find(addr => addr.isDefault);
      setSelectedId(defaultAddr ? defaultAddr.id : newAddresses[0]?.id || null);
    }
  };

  const handleSelectDefault = (selectedId) => {
    const updatedAddresses = addresses.map((addr) => ({
      ...addr,
      isDefault: addr.id === selectedId,
    }));
    setAddresses(updatedAddresses);
  
    // Gán địa chỉ mặc định vào context
    const defaultAddr = updatedAddresses.find((a) => a.isDefault);
    setDefaultAddress(defaultAddr);
  };

  return (
    <div className="address-page">
      <h2>Chọn địa chỉ giao hàng</h2>

      <AddressList
        addresses={addresses}
        selectedId={selectedId}
        onSelect={handleSelectDefault}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />

      <Button text="Thêm địa chỉ mới" onClick={handleAdd} btnStyle="add" />

      <Popup
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title={editingAddress ? "Sửa địa chỉ" : "Thêm địa chỉ"}
      >
        <AddressForm
          initialData={editingAddress}
          onSave={handleSave}
          onCancel={() => setShowForm(false)}
          onUpdate={handleUpdate}
        />
      </Popup>
    </div>
  );
};

export default AddressPage;
