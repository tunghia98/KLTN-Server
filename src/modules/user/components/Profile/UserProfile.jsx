import React, { useState, useEffect } from "react";
import { useUser } from "../../../../contexts/UserContext.jsx";
import { useNavigate } from "react-router-dom";
import UserInfoForm from "./UserInfoForm";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";
import "./UserProfile.css";

const UserProfile = () => {
    const { logout } = useUser();
    const navigate = useNavigate();

    const [userInfo, setUserInfo] = useState(null);
    const [previewAvatar, setPreviewAvatar] = useState(null);
    const [editingAddress, setEditingAddress] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        birthDate: "",
        gender: "",
        avatarFile: null,
    });

    const [addresses, setAddresses] = useState([]);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [form, setForm] = useState({
        province: "",
        district: "",
        ward: "",
        street: "",
    });
    const handleEditAddress = (addr) => {
        setForm({
            street: addr.street,
            ward: addr.ward,
            district: addr.district,
            province: addr.province,
        });
        setEditingAddress(addr.id);
        setShowAddressForm(true);
    };


    const fetchUser = async () => {
        try {
            const res = await fetch("https://kltn.azurewebsites.net/api/Users/me", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (!res.ok) throw new Error("Không lấy được thông tin người dùng");

            const data = await res.json();
            setUserInfo(data);
            setFormData({
                name: data.name || "",
                email: data.email || "",
                phoneNumber: data.phoneNumber || "",
                birthDate: data.birthDate?.substring(0, 10) || "",
                gender: data.gender || "",
                avatarFile: null,
            });
        } catch (err) {
            console.error(err);
            logout();
            navigate("/login");
        }
    };

    const fetchAddresses = async () => {
        try {
            const res = await fetch("https://kltn.azurewebsites.net/api/addresses/user", {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (!res.ok) throw new Error("Không lấy được địa chỉ");

            const data = await res.json();
            setAddresses(data);
        } catch (err) {
            console.error(err);
            alert("Lỗi khi tải địa chỉ");
        }
    };

    useEffect(() => {
        fetchUser();
        fetchAddresses();
    }, []);

    const handleLogout = () => {
        logout();
        navigate("/");
    };

    const handleProfileSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        await fetch("https://kltn.azurewebsites.net/api/users/profile", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                name: formData.name,
                email: formData.email,
                phoneNumber: formData.phoneNumber,
                birthDate: formData.birthDate,
                gender: formData.gender,
            }),
        });

        if (formData.avatarFile) {
            const uploadForm = new FormData();
            uploadForm.append("file", formData.avatarFile);
            await fetch("https://kltn.azurewebsites.net/api/users/upload-avatar", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: uploadForm,
            });
        }

        alert("Đã cập nhật thông tin!");
        fetchUser();
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData({ ...formData, avatarFile: file });
            setPreviewAvatar(URL.createObjectURL(file));
        }
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("accessToken");

        if (editingAddress) {
            // Nếu đang sửa
            await fetch(`https://kltn.azurewebsites.net/api/addresses/${editingAddress}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    street: form.street,
                    ward: form.ward,
                    district: form.district,
                    province: form.province,
                }),
            });
            alert("Đã cập nhật địa chỉ thành công!");
        } else {
            // Nếu thêm mới
            await fetch("https://kltn.azurewebsites.net/api/addresses/user", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    street: form.street,
                    ward: form.ward,
                    district: form.district,
                    province: form.province,
                }),
            });
            alert("Đã thêm địa chỉ thành công!");
        }

        await fetchAddresses(); // Reload danh sách
        setForm({ city: "", district: "", ward: "", street: "" });
        setEditingAddress(null); // Reset lại editing mode
        setShowAddressForm(false);
    };


    return (
        <div className="profile-container">
            <h1 className="profile-title">👤 Thông Tin Cá Nhân</h1>

            <div className="profile-form-wrapper">
                <div className="profile-form-container">
                    <UserInfoForm
                        formData={formData}
                        setFormData={setFormData}
                        handleSubmit={handleProfileSubmit}
                        handleAvatarChange={handleAvatarChange}
                        previewAvatar={previewAvatar}
                        userInfo={userInfo}
                    />
                </div>
            </div>

            <div className="address-section-container">
                <AddressList addresses={addresses}
                    onAddClick={() => setShowAddressForm(true)}
                    handleEditAddress={handleEditAddress} />
                {showAddressForm && (
                    <AddressForm
                        form={form}
                        setForm={setForm}
                        onSubmit={handleAddressSubmit}
                    />
                )}
            </div>

            <div className="text-right mt-8">
                <button className="btn-danger" onClick={handleLogout}>Đăng xuất</button>
            </div>
        </div>
    );
};

export default UserProfile;
