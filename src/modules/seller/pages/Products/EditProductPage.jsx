// EditProductPageFull.jsx
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import './EditProductPage.css';
import getSelectBackgroundColor from "../../utils/getSelectBackgroundColor.js";
import { Autocomplete, TextField } from "@mui/material";

export default function EditProductPage() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const isEditing = !!state?.product;

    const [product, setProduct] = useState(state?.product ?? {
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        categoryId: '',
        status: "Khả dụng",
        brand: '',
        images: []
    });

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProduct((prev) => ({ ...prev, [name]: value }));
    };

    const handleStatusChange = (e) => {
        const value = e.target.value;
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
    const uploadImage = async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('https://kltn.azurewebsites.net/api/product-images/upload-file', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            },
            body: formData
        });

        if (!res.ok) throw new Error('Upload ảnh thất bại');
        const data = await res.json();
        return data.imageUrl;
    };

    const handleSave = async () => {
        if (!product.name || !product.price || !product.quantity || !product.categoryId) {
            alert("Vui lòng điền đầy đủ thông tin sản phẩm!");
            return;
        }

        setLoading(true);

        try {
            const url = isEditing
                ? `https://kltn.azurewebsites.net/api/products/${product.id}`
                : `https://kltn.azurewebsites.net/api/products/create`;
            const method = isEditing ? "PUT" : "POST";

            const payload = {
                name: product.name.trim(),
                description: product.description.trim(),
                price: parseFloat(product.price),
                quantity: parseInt(product.quantity),
                categoryId: parseInt(product.categoryId),
                status: product.status,
                brand: product.brand.trim() // ✅ thêm dòng này
            };

            console.log("Payload gửi lên:", payload);

            // Gửi yêu cầu tạo/cập nhật sản phẩm
            const res = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                },
                body: JSON.stringify(payload)
            });

            if (!res.ok) {
                const errorData = await res.text();
                throw new Error(errorData.message || 'Lỗi lưu sản phẩm');
            }

            const result = await res.text();
            const productId = isEditing ? product.id : result.productId;

            // Nếu có ảnh mới thì upload ảnh
            if (product.images.length > 0) {
                const newFiles = product.images.filter(img => img instanceof File);

                if (newFiles.length > 0) {
                    const uploadedUrls = [];

                    for (const file of newFiles) {
                        const uploadedUrl = await uploadImage(file);
                        uploadedUrls.push(uploadedUrl);
                    }

                    // Chỉ gán các ảnh mới vừa upload thôi
                    for (const imageUrl of uploadedUrls) {
                        await fetch('https://kltn.azurewebsites.net/api/product-images', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                            },
                            body: JSON.stringify({ productId, imageUrl })
                        });
                    }
                }
            }
            alert(isEditing ? "Cập nhật sản phẩm thành công!" : "Tạo sản phẩm thành công!");
            navigate('/seller/products');
        } catch (error) {
            console.error("Lỗi khi lưu sản phẩm:", error);
            alert(error.message || 'Có lỗi xảy ra khi lưu sản phẩm.');
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("https://kltn.azurewebsites.net/api/categories");
                if (!res.ok) throw new Error('Lỗi tải danh mục');
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Lỗi lấy danh mục:", error);
            }
        };

        fetchCategories();
    }, []);
    useEffect(() => {
        const fetchProductImages = async () => {
            if (!isEditing) return; // Nếu đang thêm mới thì bỏ qua

            try {
                const res = await fetch(`https://kltn.azurewebsites.net/api/product-images/product/${product.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!res.ok) throw new Error('Lỗi lấy ảnh sản phẩm');
                const images = await res.json();
                setProduct(prev => ({
                    ...prev,
                    images: images.map(img => img.imageUrl)
                }));
            } catch (error) {
                console.error('Lỗi tải ảnh sản phẩm:', error);
            }
        };

        fetchProductImages();
    }, [isEditing, product.id]);
    const handleDeleteImage = async (index) => {
        const img = product.images[index];

        if (img instanceof File) {
            // Nếu là File mới upload => chỉ xóa trên UI
            setProduct(prev => ({
                ...prev,
                images: prev.images.filter((_, i) => i !== index)
            }));
        } else {
            // Nếu là ảnh cũ (server) => gọi API xoá ảnh
            try {
                const filename = img; // img chính là tên file (ví dụ: abc123.png)

                // Lấy danh sách ảnh từ server để tìm imageId
                const res = await fetch(`https://kltn.azurewebsites.net/api/product-images/product/${product.id}`, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });

                if (!res.ok) throw new Error('Lỗi lấy danh sách ảnh');

                const images = await res.json();
                const image = images.find(x => x.imageUrl.endsWith(filename));

                if (image) {
                    await fetch(`https://kltn.azurewebsites.net/api/product-images/${image.id}`, {
                        method: 'DELETE',
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                        }
                    });

                    // Sau khi server xoá xong, update UI
                    setProduct(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                    }));
                } else {
                    console.error('Không tìm thấy ảnh cần xóa!');
                }
            } catch (error) {
                console.error('Lỗi xoá ảnh:', error);
                alert('Xóa ảnh thất bại.');
            }
        }
    };


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
                        renderInput={(params) => <TextField {...params} label="Chọn danh mục" />}
                        renderOption={(props, option) => (
                            <li {...props} key={option.id}>
                                {option.name}
                            </li>
                        )}
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
                    <label>Nhãn hiệu</label>
                    <input
                        type="text"
                        name="brand"
                        value={product.brand}
                        onChange={handleInputChange}
                        placeholder="Nhập nhãn hiệu "
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
                    <div style={{ marginBottom: "10px" }}>
                        <label className="custom-file-label">
                            ➕ Thêm ảnh
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (!file) return;
                                    setProduct(prev => ({
                                        ...prev,
                                        images: [...prev.images, file]
                                    }));
                                }}
                            />
                        </label>
                    </div>

                    <div className="image-preview">
                        {product.images?.map((img, index) => (
                            <div key={index} className="image-item" style={{ position: "relative" }}>
                                <img
                                    src={
                                        img instanceof File
                                            ? URL.createObjectURL(img)
                                            : `https://kltn.azurewebsites.net/api/product-images/file/${img}`
                                    }
                                    alt={`Ảnh sản phẩm ${index + 1}`}
                                    className="product-image"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = "/no-image.png";
                                    }}
                                />
                                <button
                                    type="button"
                                    className="delete-btn"
                                    style={{
                                        position: "absolute",
                                        top: "2px",
                                        right: "2px",
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "50%",
                                        width: "20px",
                                        height: "20px",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                        lineHeight: "20px",
                                        textAlign: "center",
                                        padding: 0
                                    }}
                                    onClick={() => handleDeleteImage(index)}
                                >
                                    ×
                                </button>

                            </div>
                        ))}
                    </div>


                </div>

                <div style={{ display: "flex", justifyContent: "center", marginTop: 20 }}>
                    <button onClick={handleSave} className="btn-apply" disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu'}
                    </button>
                </div>
            </div>
        </div>
    );
}
