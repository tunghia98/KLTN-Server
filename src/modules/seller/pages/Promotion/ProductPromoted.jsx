import React, { useState, useEffect } from "react";
import "./ProductPromoted.css";
import SellerProductMiniCard from "../../components/Products/SellerProductMiniCard.jsx";

function ProductPromoted({ onClose, onApply }) {
  const [search, setSearch] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [sellerproducts, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `https://kltn.azurewebsites.net/api/products/my-shop-products`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
        }
      );
      if (!res.ok) throw new Error("Lỗi tải sản phẩm");
      const products = await res.json();

      const productIds = products.map((p) => p.id);

      const imagesRes = await fetch(
        "https://kltn.azurewebsites.net/api/product-images/list-by-products",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          body: JSON.stringify(productIds),
        }
      );

      const imagesData = await imagesRes.json();

      const productsWithImages = products.map((product) => {
        const imagesForProduct = imagesData && imagesData[String(product.id)];

        return {
          ...product,
          imageUrls: Array.isArray(imagesForProduct)
            ? imagesForProduct.map((img) => img.imageUrl)
            : [],
        };
      });
      console.log("productsWithImages", productsWithImages);

      setProducts(productsWithImages);
    } catch (error) {
      console.error("Lỗi tải sản phẩm:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const removeProduct = (productId) => {
    setSelectedProducts((prev) => prev.filter((p) => p.id !== productId));
  };

  const handleApply = () => {
    onApply(selectedProducts);
    onClose();
  };

  const handleSelectProduct = (product) => {
    toggleProduct(product);
  };

  const filteredProducts = sellerproducts.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="promoted-popup-overlay">
      <div className="promoted-popup-content">
        <button className="close-btn" onClick={onClose}>
          X
        </button>
        <h1 className="title">Tất cả sản phẩm</h1>

        <input
          type="text"
          placeholder="Tìm sản phẩm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setSearchTerm(e.target.value);
          }}
          className="search-input"
        />

        <div className="product-promoted-list">
          {loading ? (
            <p>Đang tải sản phẩm...</p>
          ) : (
            filteredProducts.map((product) => {
              const isSelected = selectedProducts.some(
                (p) => p.id === product.id
              );
              return (
                <SellerProductMiniCard
                  key={product.id}
                  product={product}
                  fromPromotion={true}
                  onClick={handleSelectProduct}
                  isSelected={isSelected}
                />
              );
            })
          )}
        </div>

        <div className="selected-products-container">
          <h3>Sản phẩm đã chọn:</h3>
          {selectedProducts.length > 0 && (
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
          )}
        </div>

        <button className="btn-apply" onClick={handleApply}>
          Áp dụng
        </button>
      </div>
    </div>
  );
}

export default ProductPromoted;
