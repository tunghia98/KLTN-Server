import React, { useState, useEffect } from "react";
import { useUser } from "../../../../contexts/UserContext.jsx";
import { useNavigate, Link } from "react-router-dom";
import UserInfoForm from "./UserInfoForm";
import AddressList from "./AddressList";
import AddressForm from "./AddressForm";
import "./UserProfile.css";
import OrderHistory from "../OrderHistory/OrderHistory.jsx";
import ChatList from "../../../../components/Chat/ChatList.jsx";
import ChatContent from "../../../../components/Chat/ChatContent.jsx";

const UserProfile = () => {
  const { logout } = useUser();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("user-info");

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
  const [chatList, setChatList] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const accessToken = localStorage.getItem("accessToken");

  useEffect(() => {
    if (!currentUserId) return;

    fetch("https://kltn.azurewebsites.net/api/conversations/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
      .then((res) => res.json())
      .then((conversations) => {
        setChatList(conversations);
        // Nếu chưa chọn chat nào, chọn chat đầu tiên mặc định
        if (conversations.length > 0 && !selectedChat) {
          setSelectedChat(conversations[0].id);
        }
      })
      .catch(() => alert("Không lấy được danh sách cuộc trò chuyện"));
  }, [accessToken, currentUserId, selectedChat]);

  const fetchUser = async () => {
    try {
      const res = await fetch("https://kltn.azurewebsites.net/api/Users/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (!res.ok) throw new Error("Không lấy được thông tin người dùng");

      const data = await res.json();
      setCurrentUserId(data.id || data.userId);
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
      const res = await fetch(
        "https://kltn.azurewebsites.net/api/addresses/user",
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );

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
      await fetch(
        `https://kltn.azurewebsites.net/api/addresses/${editingAddress}`,
        {
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
        }
      );
      alert("Đã cập nhật địa chỉ thành công!");
    } else {
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

    await fetchAddresses();
    setForm({ province: "", district: "", ward: "", street: "" });
    setEditingAddress(null);
    setShowAddressForm(false);
  };

  return (
    <div className="profile-container">
      <aside className="profile-user-layout-aside">
        <ul className="management-layout-menu-list">
          <li
            className={`profile-user-menu-item ${
              activeTab === "user-info" ? "active" : ""
            }`}
          >
            <Link to="#info" onClick={() => setActiveTab("user-info")}>
              Thông tin cá nhân
            </Link>
          </li>
          <li
            className={`profile-user-menu-item ${
              activeTab === "address" ? "active" : ""
            }`}
          >
            <Link to="#address" onClick={() => setActiveTab("address")}>
              Địa chỉ
            </Link>
          </li>
          <li
            className={`profile-user-menu-item ${
              activeTab === "order-history" ? "active" : ""
            }`}
          >
            <Link
              to="#order-history"
              onClick={() => setActiveTab("order-history")}
            >
              Lịch sử đơn hàng
            </Link>
          </li>
          <li>
            <Link to="#chat" onClick={() => setActiveTab("chat")}>
              Lịch sử tư vấn
            </Link>
          </li>
        </ul>
        <div className="text-right mt-8">
          <button className="btn-danger" onClick={handleLogout}>
            Đăng xuất
          </button>
        </div>
      </aside>

      {activeTab === "user-info" && (
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
      )}

      {activeTab === "address" && (
        <div className="address-section-container">
          <AddressList
            addresses={addresses}
            onAddClick={() => setShowAddressForm(true)}
            handleEditAddress={handleEditAddress}
          />
          {showAddressForm && (
            <AddressForm
              form={form}
              setForm={setForm}
              onSubmit={handleAddressSubmit}
            />
          )}
        </div>
      )}

      {activeTab === "order-history" && <OrderHistory />}

      {activeTab === "chat" && (
        <div className="chat-section-wrapper">
          <div className="chat-app">
            <div className="chat-list">
              <ChatList
                chats={chatList}
                onSelectChat={setSelectedChat}
                currentUserId={currentUserId}
              />
            </div>
            <div className="chat-content">
              {selectedChat ? (
                <ChatContent
                  chatId={selectedChat.id}
                  currentUserId={currentUserId}
                  conversation={selectedChat}
                />
              ) : (
                <p>Chọn một cửa hàng để bắt đầu trò chuyện.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
