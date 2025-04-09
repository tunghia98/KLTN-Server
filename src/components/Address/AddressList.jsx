import React from "react";
import AddressItem from "./AddressItem.jsx";
import "./Address.css"; 

const AddressList = ({ addresses, selectedId, onSelect, onEdit, onDelete }) => {
  return (
    <div className="address-list">
      {addresses.map((address) => (
        <AddressItem 
          key={address.id} 
          address={address} 
          isSelected={address.id === selectedId} 
          onSelect={onSelect} 
          onEdit={onEdit} 
          onDelete={onDelete} 
        />
      ))}
    </div>
  );
};

export default AddressList;
