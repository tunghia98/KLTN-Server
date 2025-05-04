import React, { useState } from "react";
import "./Categories.css";
import { useNavigate } from "react-router-dom";
import Button from "../../../../components/Common/Button";
import ProductCard from "../../components/ProductCard/ProductCard";

const CategoryProducts = ({ category, products, currentPage, setCurrentPage }) => {
    const navigate = useNavigate();
    const ITEMS_PER_PAGE = 10;


    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(startIndex, endIndex);

    const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);

    const handleClick = () => {
        navigate(`/products/${category.slug || "all"}`);
    };

    return (
        <div className="category-products">
            <div className="category-label-tag">{category.name}</div>

            <div className="product-list">
                {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))
                ) : (
                    <p>Không có sản phẩm nào trong danh mục này.</p>
                )}
            </div>

            <div className="product-pagination">
                <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
                    disabled={currentPage === 0}
                >
                    ← Trang trước
                </button>
                <span className="pagination-info">
                    Trang <strong>{currentPage + 1}</strong> / {totalPages}
                </span>
                <button
                    className="pagination-btn"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
                    disabled={currentPage >= totalPages - 1}
                >
                    Trang sau →
                </button>
            </div>
        </div>
    );
};

export default CategoryProducts;
