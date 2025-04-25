import React from "react";

const AddressForm = ({ form, setForm, onSubmit }) => (
    <form className="address-form" onSubmit={onSubmit}>
        <h3>Nhập địa chỉ mới</h3>
        {["province", "district", "ward", "street"].map((field, index) => (
            <label key={index}>
                <strong>{field === "province" ? "Tỉnh/Thành" : field === "district" ? "Quận/Huyện" : field === "ward" ? "Phường/Xã" : "Số nhà, tên đường"}</strong>
                <input
                    type="text"
                    placeholder={`Nhập ${field}`}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                />
            </label>
        ))}
        <button className="btn mt-2" type="submit">💾 Lưu địa chỉ</button>
    </form>
);

export default AddressForm;
