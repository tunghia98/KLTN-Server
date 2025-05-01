import React, { useEffect, useState } from "react";
import "./UserManagement.css";

export default function UserManagement() {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("https://kltn.azurewebsites.net//api/users/buyers", {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("accessToken")}`
            }
        })
            .then(res => {
                if (!res.ok) throw new Error("Failed to fetch");
                return res.json();
            })
            .then(data => {
                setUsers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải dữ liệu:", err);
                setLoading(false);
            });
    }, []);
    const updateStatus = async (userId, newStatus) => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await fetch(`https://kltn.azurewebsites.net/api/users/${userId}/status`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(newStatus)
            });

            if (!res.ok) throw new Error("Cập nhật trạng thái thất bại");

            // ✅ Sau khi cập nhật, cập nhật lại local state
            setUsers((prev) =>
                prev.map((u) =>
                    u.id === userId ? { ...u, status: newStatus } : u
                )
            );
        } catch (err) {
            console.error("Lỗi khi cập nhật trạng thái:", err);
        }
    };

    return (
        <div className="user-container">
            <h2>Danh sách tài khoản Buyer</h2>
            {loading ? (
                <p>Đang tải...</p>
            ) : (
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Họ và tên</th>
                            <th>Email</th>
                            <th>SĐT</th>
                            <th>Giới tính</th>
                            <th>Trạng thái</th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(u => (
                            <tr key={u.id}>
                                <td>{u.name}</td>
                                <td>{u.email}</td>
                                <td>{u.phoneNumber}</td>
                                <td>{u.gender}</td>
                                <td>{u.status}</td>
                                <td>
                                    <td>
                                        <button onClick={() => updateStatus(u.id, "bị khóa")}>Khoá</button>
                                        <button onClick={() => updateStatus(u.id, "hoạt động")}>Hoạt động</button>
                                    </td>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
