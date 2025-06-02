import React, { useState, useEffect } from "react";
import "./Checkout.css";
import { useNavigate } from "react-router-dom";

const ShippingInfo = ({ addresses = [], onAddressChange }) => {
    const navigate = useNavigate();
    const [selectedId, setSelectedId] = useState(addresses[0]?.id || "");

    const formatAddress = (addr) =>
        `${addr.street}, ${addr.ward}, ${addr.district}, ${addr.province}`;

    const handleSelectChange = (e) => {
        const newId = e.target.value;
        setSelectedId(newId);
        if (onAddressChange) {
            onAddressChange(newId);
        }
    };

    useEffect(() => {
        if (addresses.length > 0 && !selectedId) {
            const firstId = addresses[0].id;
            setSelectedId(firstId);
            if (onAddressChange) {
                onAddressChange(firstId);
            }
        }
    }, [addresses, selectedId, onAddressChange]);

    const handleClick = () => {
        navigate("/profile");
    };

    const selectedAddress = addresses.find((addr) => addr.id === selectedId);

    if (addresses.length === 0) {
        return (
            <>
                <p>Chưa có địa chỉ giao hàng.</p>
                <button className="change-btn" onClick={handleClick}>
                    Thêm địa chỉ
                </button>
            </>
        );
    }

    return (
        <div className="shipping-info">
            <h3>Giao tới</h3>
            <select value={selectedId} onChange={handleSelectChange} className="shipping-select">
                {addresses.map((addr) => (
                    <option key={addr.id} value={addr.id} className="shipping-option">
                        {formatAddress(addr)}
                    </option>
                ))}
            </select>

            {selectedAddress && (
                <>
                    <p>{selectedAddress.name}</p>
                    <p>{selectedAddress.detail}</p>
                </>
            )}
        </div>
    );
};

export default ShippingInfo;
