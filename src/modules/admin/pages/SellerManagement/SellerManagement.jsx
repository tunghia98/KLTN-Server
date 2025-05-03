import React, { useEffect, useState } from "react";
import "./SellerManagement.css";

export default function SellerManagement() {
    const [sellers, setSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");

        fetch("https://kltn.azurewebsites.net/api/shops/summary", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(async (res) => {
                const text = await res.text();
                if (!res.ok) {
                    throw new Error("Lỗi API: " + res.status);
                }

                return JSON.parse(text);
            })
            .then(data => {
                setSellers(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Lỗi tải nhà bán hàng:", err);
                setLoading(false);
            });
    }, []);


    const approveSeller = async (id) => {
        try {
            const res = await fetch(`https://kltn.azurewebsites.net/api/shops/approve/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (!res.ok) throw new Error("Phê duyệt thất bại");

            setSellers((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status: "hoạt động" } : s))
            );
        } catch (err) {
            console.error("Lỗi khi phê duyệt:", err);
        }
    };


    const lockSeller = async (id) => {
        try {
            const res = await fetch(`https://kltn.azurewebsites.net/api/shops/lock/${id}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (!res.ok) throw new Error("Khóa thất bại");

            setSellers((prev) =>
                prev.map((s) => (s.id === id ? { ...s, status: "bị khóa" } : s))
            );
        } catch (err) {
            console.error("Lỗi khi khoá shop:", err);
        }
    };

  return (
    <div className="seller-container">
      <h2>Quản lý nhà bán hàng</h2>
      <table className="seller-table">
        <thead>
          <tr>
            <th>Tên cửa hàng</th>
            <th>Chủ sở hữu</th>
            <th>Trạng thái</th>
            <th>Doanh thu</th>
            <th>Sản phẩm</th>
            <th>Đơn hàng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {sellers.map((s) => (
            <tr key={s.id}>
              <td>{s.name}</td>
                  <td>{s.ownerName}</td>
              <td>{s.status}</td>
                  <td>{s.totalRevenue}</td>
                  <td>{s.totalProducts}</td>
                  <td>{s.totalOrders    }</td>
              <td>
                      {s.status === "chờ phê duyệt" || !s.status ? (
                          <button onClick={() => approveSeller(s.id)}>Phê duyệt</button>
                      ) : s.status === "hoạt động" ? (
                          <button onClick={() => lockSeller(s.id)}>Khoá</button>
                      ) : (
                          <button onClick={() => approveSeller(s.id)}>Mở lại</button>
                      )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
