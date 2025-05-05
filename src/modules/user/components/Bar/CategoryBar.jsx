import React, { useState } from "react";
import "./Bar.css";

const CategoryBar = ({ categories, products, onCategoryClick, selectedCategory }) => {
    const ITEMS_PER_PAGE = 15;
    const [currentPage, setCurrentPage] = useState(0);
    const [searchTerm, setSearchTerm] = useState("");

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
        return <p>Không có dữ liệu danh mục sản phẩm.</p>;
    }

    // Đếm sản phẩm
    const categoryWithProductCount = categories.map((category) => {
        const productCount = products.filter((product) => product.categoryId === category.id).length;
        return { ...category, productCount };
    });

    // Thêm mục "Tất cả danh mục"
    const allCategory = { id: 0, name: "Tất cả sản phẩm", productCount: products.length };
    const categoriesWithAll = [allCategory, ...categoryWithProductCount];

    // Tìm kiếm
    const filteredCategories = categoriesWithAll.filter((cat) =>
        cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Phân trang
    const startIndex = currentPage * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    const visibleCategories = filteredCategories.slice(startIndex, endIndex);
    const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

    return (
        <div className="category-navbar">
            <div className="category-bar-header-flex">
                <h1 className="category-title">DANH MỤC SẢN PHẨM</h1>
                <input
                    type="text"
                    className="category-search-input"
                    placeholder="Tìm danh mục..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setCurrentPage(0);
                    }}
                />
            </div>

            <div className="category-tags-wrapper-container">
                <div className="category-tags-wrapper">
                    {visibleCategories.map((category, index) => (
                        <button
                            key={index}
                            className={`category-tag ${selectedCategory?.id === category.id ? "active" : ""
                                }`}
                            onClick={() => onCategoryClick(index, category)}
                        >
                            {category.name} ({category.productCount})
                        </button>
                    ))}
                </div>

                <div className="category-pagination">
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
                        onClick={() =>
                            setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))
                        }
                        disabled={currentPage >= totalPages - 1}
                    >
                        Trang sau →
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CategoryBar;
