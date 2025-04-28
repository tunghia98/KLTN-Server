import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import './EditProductPage.css';
import getSelectBackgroundColor from "../../utils/getSelectBackgroundColor.js";
import { useEffect } from "react";
import { Autocomplete, TextField } from "@mui/material";
export default function EditProductPage() {
    const { state } = useLocation();
    const isEditing = !!state?.product;
    const [product, setProduct] = useState(state?.product ?? {
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        categoryId: '',
        status: "Khả dụng",
        images: []
    });
    const [categories, setCategories] = useState([]);
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

    const handleSave = async () => {
        try {
            const url = isEditing ? `https://localhost:7135/api/products/${product.id}` : 'https://localhost:7135/api/products/create';
            const method = isEditing ? 'PUT' : 'POST';

            const payload = {
                name: product.name,
                description: product.description,
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity),
                categoryId: parseInt(product.categoryId),
                status: product.status,
                imageUrls: product.images.filter(img => typeof img === "string") // chỉ lấy link ảnh
            };

            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) throw new Error('Lỗi lưu sản phẩm');

            alert('Lưu sản phẩm thành công!');
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm:", error);
            alert('Có lỗi xảy ra khi lưu sản phẩm.');
        }
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://localhost:7135/api/categories")
                if (!res.ok) throw new Error('Lỗi tải danh mục');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };

        fetchCategories();
    }, []);


  return (
    <div className="edit-product-container">
      <div className="edit-product-card">
         <h2>{isEditing ? "Sửa Thông Tin Sản Phẩm" : "Thêm Sản Phẩm Mới"}</h2>

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
                  <label>Danh mục sản phẩm</label>
                  <Autocomplete
                      options={categories}
                      getOptionLabel={(option) => option.name}
                      isOptionEqualToValue={(option, value) => option.id === value.id}
                      filterOptions={(options, { inputValue }) =>
                          options.filter((option) =>
                              option.name.toLowerCase().includes(inputValue.toLowerCase())
                          )
                      }
                      value={categories.find(c => c.id === product.categoryId) || null}
                      onChange={(event, newValue) => {
                          setProduct(prev => ({
                              ...prev,
                              categoryId: newValue ? newValue.id : ''
                          }));
                      }}
                      renderOption={(props, option) => (
                          <li {...props} key={option.id}>
                              {option.name}
                          </li>
                      )}
                      renderInput={(params) => <TextField {...params} label="Chọn danh mục" />}
                      fullWidth
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
                      name="quantity"
                      value={product.quantity}
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
                  <label>Mô tả chi tiết</label>
                  <textarea
                      name="description"
                      value={product.description}
                      onChange={handleInputChange}
                      rows="4"
                      placeholder="Nhập mô tả chi tiết sản phẩm..."
                      style={{ width: '100%', minHeight: '150px', resize: 'vertical' }}
                  />
              </div>
        <div className="edit-product-group">
          <label>Hình ảnh sản phẩm</label>
                  <div className="image-preview">
                      {product.images?.map((img, index) => (
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
        <button onClick={handleSave} className="btn-apply">Lưu</button>
        </div>
          
        
      </div>
    </div>
  );
}
