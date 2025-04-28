// ProductManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsManagementPage.css";
import { useUser } from "../../../../contexts/UserContext.jsx";

function ProductManagementPage() {
  const { user } = useUser();
  const navigate = useNavigate();
    const [sellerproducts, setProducts] = useState([]);
    const fetchProducts = async () => {
        try {
            const res = await fetch(`https://localhost:7135/api/products/my-shop-products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!res.ok) throw new Error('Lỗi tải sản phẩm');
            const data = await res.json();
            setProducts(data);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
        }
    };
  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
      setProducts(sellerproducts.filter((p) => p.id !== id));
      // TODO: gọi API xoá sản phẩm ở backend nếu có
    }
  };
  const handleEdit = (product) => {
    navigate(`/seller/products/edit/${product.id}`, {state:{product}});
  }
    const handleImportCSV = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        console.log("Đã chọn file CSV:", file);
        // TODO: Xử lý đọc file CSV tại đây hoặc gửi file lên server
    };
    useEffect(() => {
        fetchProducts();
    }, []);
  return (
    <div className="product-management">
          <h1>Quản lý sản phẩm</h1>
          <div className="product-management-actions">
              <button className="add-product-btn" onClick={() => navigate('/seller/products/edit/new', { state: { product: null } })}>
                  ➕ Thêm sản phẩm
              </button>
              <button className="import-csv-btn" onClick={() => document.getElementById('csvInput').click()}>
                  📄 Thêm sản phẩm từ CSV
              </button>
              <input
                  type="file"
                  accept=".csv"
                  id="csvInput"
                  style={{ display: 'none' }}
                  onChange={(e) => handleImportCSV(e)}
              />
          </div>

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
                        src={product.imageUrls[0]}
                        alt={product.name}
                        className="product-image"
                    />
            </td>
            <td>{product.name}</td>
            <td>{product.price.toLocaleString()}₫</td>
                <td>{product.status == "Khả dụng" ? "Khả dụng" : "Tạm ẩn"}</td>
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