// ProductManagementPage.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ProductsManagementPage.css";
import { useUser } from "../../../../contexts/UserContext.jsx";

function ProductManagementPage() {
    const { user } = useUser();
    const navigate = useNavigate();
    const [sellerproducts, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await fetch(`https://kltn.azurewebsites.net/api/products/my-shop-products`, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                }
            });
            if (!res.ok) throw new Error('Lỗi tải sản phẩm');
            const products = await res.json();

            const productIds = products.map(p => p.id);

            const imagesRes = await fetch('https://kltn.azurewebsites.net/api/product-images/list-by-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
                },
                body: JSON.stringify(productIds)
            });

            const imagesData = await imagesRes.json();

            const productsWithImages = products.map(product => ({
                ...product,
                imageUrls: imagesData[product.id]?.map(img => img.imageUrl) || []
            }));

            setProducts(productsWithImages);
        } catch (error) {
            console.error("Lỗi tải sản phẩm:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Bạn có chắc chắn muốn xoá sản phẩm này không?")) {
            try {
                const res = await fetch(`https://kltn.azurewebsites.net/api/products/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    }
                });
                if (!res.ok) throw new Error('Lỗi xoá sản phẩm');
                alert('Xoá sản phẩm thành công!');
                fetchProducts();
            } catch (error) {
                console.error("Lỗi khi xoá sản phẩm:", error);
                alert('Xoá sản phẩm thất bại.');
            }
        }
    };

    const handleEdit = (product) => {
        navigate(`/seller/products/edit/${product.id}`, { state: { product } });
    }

    const handleImportCSV = async (e) => {
        const file = e.target.files[0];
        if (!file) {
            alert("Vui lòng chọn file CSV.");
            return;
        }

        try {
            const formData = new FormData();
            formData.append('file', file);

            const res = await fetch('https://kltn.azurewebsites.net/api/products/upload-csv', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('accessToken')}`
                    // ❗ Không đặt 'Content-Type' ở đây, để fetch tự đặt boundary cho multipart/form-data
                },
                body: formData
            });

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText || "Lỗi upload CSV.");
            }

            const result = await res.text();
            alert("Import CSV thành công: " + result);

            // 👉 Nếu muốn tự động refresh lại danh sách sản phẩm sau khi import thành công
            // fetchProducts();  (nếu bạn có hàm fetchProducts)
        } catch (error) {
            console.error("Lỗi import CSV:", error);
            alert(error.message || "Có lỗi khi upload CSV.");
        }
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

            {loading ? (
                <p>Loading...</p>
            ) : (
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
                                    {product.imageUrls?.[0] ? (
                                        <img
                                            src={`https://kltn.azurewebsites.net/api/product-images/file/${product.imageUrls[0]}`}
                                            alt="Ảnh sản phẩm"
                                            className="product-image"
                                        />
                                    ) : (
                                        <img
                                            src="https://kltn.azurewebsites.net/api/product-images/file/7a2843f5-2a5a-46e2-8eea-080b51bada6b.png"
                                            alt="Ảnh mặc định"
                                            className="product-image"
                                        />
                                    )}
                                </td>
                                <td>{product.name}</td>
                                <td>{product.price.toLocaleString()}₫</td>
                                <td>{product.status === "Khả dụng" ? "Khả dụng" : "Tạm ẩn"}</td>
                                <td>{product.quantity}</td>
                                <td>
                                    <button className="edit-btn" onClick={() => handleEdit(product)}>Sửa</button>
                                    <button className="delete-btn" onClick={() => handleDelete(product.id)}>Xoá</button>
                                </td>
                            </tr>
                        ))}
                        {sellerproducts.length === 0 && (
                            <tr>
                                <td colSpan="6">Chưa có sản phẩm nào.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default ProductManagementPage;
