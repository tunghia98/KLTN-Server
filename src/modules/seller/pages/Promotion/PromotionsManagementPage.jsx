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
    type: "",
    value: "",
    condition: "",
    startDate: "",
    endDate: "",
    productId: [],
  });
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useEffect(() => {
    if (!user || !user.id) return;
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
      !newPromo.value ||
      isNaN(newPromo.value) ||
      Number(newPromo.value) <= 0
    ) {
      alert("Vui lòng nhập số tiền hoặc phần trăm giảm hợp lệ");
      return;
    }
    if (!newPromo.startDate || !newPromo.endDate) {
      alert("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    if (new Date(newPromo.startDate) > new Date(newPromo.endDate)) {
      alert("Ngày bắt đầu phải trước ngày kết thúc");
      return;
    }

    try {
      // Dữ liệu gửi lên để tạo mã giảm giá
      const dataToSend = {
        code: newPromo.code,
        type: newPromo.type,
        value: Number(newPromo.value),
        startDate: newPromo.startDate,
        endDate: newPromo.endDate,
      };

      const res = await fetch("https://kltn.azurewebsites.net/api/promotions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
        body: JSON.stringify(dataToSend),
      });

      const promotionResult = await res.json();

      if (!res.ok) {
        throw new Error(promotionResult.message || "Thêm mã giảm giá thất bại");
      }

      const promotionId = promotionResult.id; // hoặc promotionResult.promotionId nếu API trả vậy
      console.log("Promotion ID:", promotionId);
      alert("Thêm mã giảm giá thành công!");
      for (const product of selectedProducts) {
        const productToSend = {
          promotionId: promotionId,
          productId: product.id,
        };

        const resProduct = await fetch(
          "https://kltn.azurewebsites.net/api/ProductPromotions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
            body: JSON.stringify(productToSend),
          }
        );

        if (!resProduct.ok) {
          const errorData = await resProduct.json();
          throw new Error(
            errorData.message || `Thêm sản phẩm ID ${product.id} thất bại`
          );
        }
      }

      alert("Thêm sản phẩm áp dụng thành công!");

      // Reset form
      setNewPromo({
        code: "",
        type: "",
        value: "",
        conditon:"",
        startDate: "",
        endDate: "",
        productId: [],
      });

      setSelectedProducts([]);

      // Reload lại danh sách khuyến mãi
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

  const fetchPromotions = async (sellerId) => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/StorePromotions/by-shop/${sellerId}`,
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchPromotions(parseInt(user.userId, 10));
    }
  }, [user]);
  console.log("User ID:", user.userId, typeof user.userId);

  if (!user) return <div>Vui lòng đăng nhập để xem mã khuyến mãi.</div>;
  console.log(selectedProducts);

  return (
    <div className="promotions-management-page">
      <h2>Mã khuyến mãi của cửa hàng {user.id}</h2>

      <div className="add-promotion-form">
        <h3>Thêm mã giảm giá mới</h3>
        <input
          type="text"
          name="code"
          value={newPromo.code}
          onChange={handleChange}
          placeholder="Mã giảm giá"
        />

        <select name="type" value={newPromo.type} onChange={handleChange}>
          <option value="">-- Chọn loại giảm giá --</option>
          <option value="percent">Phần trăm</option>
          <option value="order">Cố định</option>
        </select>

        {newPromo.type === "percent" ? (
          <div>
            <input
              type="number"
              name="value"
              value={newPromo.value}
              onChange={handleChange}
              placeholder="Số phần trăm giảm"
            />
            <button onClick={openPopup}>
              Chọn sản phẩm áp dụng khuyến mãi
            </button>
          </div>
        ) : newPromo.type === "order" ? (
          <div>
            <input
              type="number"
              name="value"
              value={newPromo.value}
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
        ) : null}

        <input
          type="date"
          name="startDate"
          value={newPromo.startDate}
          onChange={handleChange}
        />
        <input
          type="date"
          name="endDate"
          value={newPromo.endDate}
          onChange={handleChange}
        />
        <button onClick={handleAddPromotion}>Thêm mã giảm giá</button>
      </div>

      <div className="promotions-list">
        <h3>Danh sách mã giảm giá</h3>
        {loading ? (
          <p>Đang tải...</p>
        ) : storePromotions.length === 0 ? (
          <p>Hiện tại chưa có mã giảm giá nào.</p>
        ) : (
          <ul>
            {storePromotions.map(
              (promo) =>
                console.log(promo) || (
                  <li key={promo.id}>
                    <div>
                      <strong>Mã: {promo.code}</strong> - Loại:{" "}
                      <strong>{promo.type}</strong> - Giảm: {promo.value}{" "}
                      {promo.type === "percent" ? "%" : ""}
                    </div>
                    <div>Bắt đầu: {promo.startDate}</div>
                    <div>Hết hạn: {promo.endDate}</div>
                    {promo.type === "order" && promo.condition && (
                      <div>Điều kiện áp dụng: {promo.condition}</div>
                    )}
                  </li>
                )
            )}
          </ul>
        )}
      </div>

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

      {isPopupOpen && (
        <ProductPromoted onClose={closePopup} onApply={applySelectedProducts} />
      )}
    </div>
  );
};

export default PromotionsManagementPage;
