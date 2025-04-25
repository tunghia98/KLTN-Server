import React from "react";

const AddressList = ({ addresses, onAddClick, handleEditAddress }) => {
    const formatAddress = (addr) =>
        `${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}, Việt Nam`;

    return (
        <div className="address-list">
            <h2>📍 Sửa địa chỉ giao hàng</h2>
            {addresses.length === 0 ? (
                <p>Chưa có địa chỉ nào</p>
            ) : (
                addresses.map((addr) => (
                    <div key={addr.id} className="address-card">
                        <div>{formatAddress(addr)}</div>
                        <button className="btn-outline" onClick={() => handleEditAddress(addr)}>✏️ Sửa</button>
                    </div>
                ))
            )}
            <button className="btn mt-4" onClick={onAddClick}>
                ➕ Thêm địa chỉ mới
            </button>
        </div>
    );
};


export default AddressList;
