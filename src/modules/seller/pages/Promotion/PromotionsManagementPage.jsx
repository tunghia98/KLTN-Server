import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../../../../contexts/UserContext";
import ProductPromoted from "./ProductPromoted"; // Import popup chọn sản phẩm
import "./PromotionsManagementPage.css";

const PromotionsManagementPage = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [storePromotions, setStorePromotions] = useState([]);
  const [newPromo, setNewPromo] = useState({
    code: "",
    discount_type: "percentage",
    amount: "",
    start_date: "",
    end_date: "",
    condition: "",
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false); // Quản lý trạng thái popup

  useEffect(() => {
    if (!user || !user.id) {
      return;
    }
    const filteredPromotions = storePromotions.filter(
      (promo) => promo.seller_id === user.id
    );
    setStorePromotions(filteredPromotions);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewPromo((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddPromotion = async () => {
    // Kiểm tra dữ liệu bắt buộc
    if (!newPromo.code.trim()) {
      alert("Vui lòng nhập mã giảm giá");
      return;
    }
    if (
      !newPromo.amount ||
      isNaN(newPromo.amount) ||
      Number(newPromo.amount) <= 0
    ) {
      alert("Vui lòng nhập số tiền hoặc phần trăm giảm hợp lệ");
      return;
    }
    if (!newPromo.start_date || !newPromo.end_date) {
      alert("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    if (new Date(newPromo.start_date) > new Date(newPromo.end_date)) {
      alert("Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }

    try {
      // Dữ liệu gửi lên API
      const dataToSend = {
        seller_id: user.id,
        code: newPromo.code,
        discount_type: newPromo.discount_type,
        amount: Number(newPromo.amount),
        start_date: newPromo.start_date,
        end_date: newPromo.end_date,
        condition: newPromo.condition || null,
        product_ids: selectedProducts.map((p) => p.id), // nếu có sản phẩm áp dụng
      };

      const res = await fetch(
        "https://kltn.azurewebsites.net/api/Promotion/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(dataToSend),
        }
      );

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || "Thêm mã giảm giá thất bại");
      }

      alert("Thêm mã giảm giá thành công!");
      setNewPromo({
        code: "",
        discount_type: "percentage",
        amount: "",
        start_date: "",
        end_date: "",
        condition: "",
      });
      setSelectedProducts([]);

      // Tải lại danh sách mã giảm giá mới nhất
      fetchPromotions();
    } catch (error) {
      alert("Lỗi khi thêm mã giảm giá: " + error.message);
    }
  };

  const openPopup = () => {
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
  };

  const applySelectedProducts = (selected) => {
    setSelectedProducts(selected);
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const fetchPromotions = async () => {
    try {
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/Promotion/my-shop-promotions`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Lỗi tải mã khuyến mãi");
      const promotions = await res.json();
      setStorePromotions(promotions);
    } catch (error) {
      console.error("Lỗi tải mã khuyến mãi:", error);
    }
  };
  useEffect(() => {
    fetchPromotions();
  }, []);

  if (!user) return <div>Vui lòng đăng nhập để xem mã khuyến mãi.</div>;

  return (
    <div className="promotions-management-page">
      <h2>Mã khuyến mãi của cửa hàng {user.id}</h2>

      {/* Form thêm mã giảm giá mới */}
      <div className="add-promotion-form">
        <h3>Thêm mã giảm giá mới</h3>
        <input
          type="text"
          name="code"
          value={newPromo.code}
          onChange={handleChange}
          placeholder="Mã giảm giá"
        />

        <select
          name="discount_type"
          value={newPromo.discount_type}
          onChange={handleChange}
        >
          <option value="percentage">Phần trăm</option>
          <option value="fixed">Cố định</option>
        </select>

        {/* Hiển thị nhập tỷ lệ phần trăm hoặc số tiền giảm tùy theo loại giảm giá */}
        {newPromo.discount_type === "percentage" ? (
          <div>
            <input
              type="number"
              name="amount"
              value={newPromo.amount}
              onChange={handleChange}
              placeholder="Số phần trăm giảm"
            />
            <button onClick={openPopup}>
              Chọn sản phẩm áp dụng khuyến mãi
            </button>
          </div>
        ) : (
          <div>
            <input
              type="number"
              name="amount"
              value={newPromo.amount}
              onChange={handleChange}
              placeholder="Số tiền giảm"
            />
            <input
              type="text"
              name="condition"
              value={newPromo.condition}
              onChange={handleChange}
              placeholder="Giá trị đơn hàng hợp lệ"
            />
          </div>
        )}

        <input
          type="date"
          name="start_date"
          value={newPromo.start_date}
          onChange={handleChange}
        />
        <input
          type="date"
          name="end_date"
          value={newPromo.end_date}
          onChange={handleChange}
        />
        <button onClick={handleAddPromotion}>Thêm mã giảm giá</button>
      </div>

      {/* Danh sách các mã giảm giá hiện có */}
      <div className="promotions-list">
        <h3>Danh sách mã giảm giá</h3>
        {storePromotions.length === 0 ? (
          <p>Hiện tại chưa có mã giảm giá nào.</p>
        ) : (
          <ul>
            {storePromotions.map((promo) => (
              <li key={promo.id}>
                <div>
                  <strong>Mã: {promo.code}</strong> - Loại:{" "}
                  <strong>{promo.discount_type}</strong> - Giảm: {promo.amount}{" "}
                  {promo.discount_type === "percentage" ? "%" : ""}
                </div>
                <div>Bắt đầu: {promo.start_date}</div>
                <div>Hết hạn: {promo.end_date}</div>
                {promo.discount_type === "fixed" && promo.condition && (
                  <div>Điều kiện áp dụng: {promo.condition}</div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Hiển thị sản phẩm đã chọn */}
      <div className="selected-products-container">
        <h3>Sản phẩm đã chọn:</h3>
        {selectedProducts.length > 0 ? (
          <div className="applied-message">
            <ul>
              {selectedProducts.map((product) => (
                <li key={product.id}>
                  {product.name}
                  <button
                    onClick={() => removeProduct(product.id)}
                    className="remove-btn"
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>Chưa có sản phẩm nào được chọn.</p>
        )}
      </div>

      {/* Hiển thị popup nếu cần */}
      {isPopupOpen && (
        <ProductPromoted onClose={closePopup} onApply={applySelectedProducts} />
      )}
    </div>
  );
};

export default PromotionsManagementPage;
