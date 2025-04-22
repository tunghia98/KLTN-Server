import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import './EditProductPage.css';
import getSelectBackgroundColor from "../../utils/getSelectBackgroundColor.js";

export default function EditProductPage() {
  const { state } = useLocation();
  const [product, setProduct] = useState(state?.product || { images: [] });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (e) => {
    const value = e.target.value;  // Không ép boolean
    setProduct((prev) => ({ ...prev, status: value }));
  };  

  const handleReplaceImage = (e, index) => {
    const file = e.target.files[0];
    if (!file) return;

    setProduct((prev) => {
      const updatedImages = [...prev.images];
      updatedImages[index] = file;
      return { ...prev, images: updatedImages };
    });
  };

  const handleSave = () => {
    console.log("Lưu sản phẩm:", product);
    // Thực hiện API hoặc các hành động lưu dữ liệu tại đây
  };

  if (!product) return <div>Đang tải dữ liệu sản phẩm...</div>;

  return (
    <div className="edit-product-container">
      <div className="edit-product-card">
        <h2>Sửa Thông Tin Sản Phẩm</h2>

        <div className="edit-product-group">
          <label>Tên sản phẩm</label>
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
          />
        </div>

        <div className="edit-product-group">
          <label>Giá tiền (VNĐ)</label>
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
          />
        </div>

        <div className="edit-product-group">
          <label>Số lượng tồn kho</label>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleInputChange}
          />
        </div>

        <div className="edit-product-group">
          <label>Trạng thái</label>
          <select
            name="status"
            value={product.status}
            onChange={handleStatusChange}
            style={{ color: getSelectBackgroundColor(product.status) }}
          >
            <option value="Khả dụng">Khả dụng</option>
            <option value="Tạm ẩn">Tạm ẩn</option>
          </select>

        </div>

        <div className="edit-product-group">
          <label>Hình ảnh sản phẩm</label>
          <div className="image-preview">
            {product.images.map((img, index) => (
              <div key={index} className="image-item">
                <img
                  src={img instanceof File ? URL.createObjectURL(img) : img}
                  alt={`Ảnh sản phẩm ${index + 1}`}
                />
                <label className="custom-file-label">
                  Đổi
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(e) => handleReplaceImage(e, index)}
                  />
                </label>
              </div>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "center" }}>
        <button onClick={handleSave} className="btn-apply">Lưu thay đổi</button>
        </div>
          
        
      </div>
    </div>
  );
}
