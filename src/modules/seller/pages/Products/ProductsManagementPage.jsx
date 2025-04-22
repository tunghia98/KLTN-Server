// ProductManagementPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsManagementPage.css";
import { useUser } from "../../../../contexts/UserContext.jsx";
import {products} from "../../../../data/data.js";

function ProductManagementPage() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [sellerproducts, setProducts] = useState(products.filter(
    (product) => product.sellerId === user.id
  ));

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      setProducts(sellerproducts.filter((p) => p.id !== id));
      // TODO: gọi API xoá sản phẩm ở backend nếu có
    }
  };
  const handleEdit = (product) => {
    navigate(`/seller/products/edit/${product.id}`, {state:{product}});
  }

  return (
    <div className="product-management">
      <h1>Quản lý sản phẩm</h1>
      <table className="product-table">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Giá</th>
            <th>Trạng thái</th>
            <th>Tồn kho</th>
            <th>Hành động</th>
            
          </tr>
        </thead>
        <tbody>
        {sellerproducts.map((product) => (
          <tr key={product.id}>
            <td>
              <img
                src={product.images[0]}
                alt={product.name}
                className="product-image"
              />
            </td>
            <td>{product.name}</td>
            <td>{product.price.toLocaleString()}₫</td>
            <td>{product.active ? "Đang bán" : "Tạm ẩn"}</td>
            <td>{product.quantity}</td>
            <td>
              <button 
              className="edit-btn"
              onClick={() => handleEdit(product)}
              >Sửa</button>
              <button
                className="delete-btn"
                onClick={() => handleDelete(product.id)}
              >
                Xoá
              </button>
            </td>
          </tr>
        ))}
        {sellerproducts.length === 0 && (
          <tr>
            <td colSpan="5">Chưa có sản phẩm nào.</td>
          </tr>
        )}
        </tbody>
      </table>
    </div>
  );
}

export default ProductManagementPage;