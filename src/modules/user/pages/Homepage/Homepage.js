import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import ProductBestSellers from "../../components/ProductBestSeller/ProductBestSeller.jsx";
import Slideshow from "../../components/Slideshow/Slideshow.jsx";
import { sellers, bestsellers } from "../../../../data/data.js";
import CategoryBar from "../../components/Bar/CategoryBar.jsx";
import CategoryProducts from "../../components/CategoryProducts/CategoryProducts";
import SellerBar from "../../components/Bar/SellerBar.jsx";
import "./Homepage.css";
import toSlug from "../../../../utils/toSlug.js";

const Homepage = () => {
    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState({ id: 0, name: "Tất cả danh mục" });
    const [loadingCategories, setLoadingCategories] = useState(true);
    const location = useLocation();
    const navigate = useNavigate();

    // Fetch tất cả sản phẩm
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await fetch("https://kltn.azurewebsites.net/api/products");
                if (!res.ok) throw new Error("Lỗi tải sản phẩm");
                const data = await res.json();
                setProducts(data);
            } catch (err) {
                console.error("Lỗi khi lấy sản phẩm:", err);
            }
        };
        fetchProducts();
    }, []);

    // Fetch danh mục
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await fetch("https://kltn.azurewebsites.net/api/categories");
                if (!res.ok) throw new Error("Lỗi tải danh mục");
                let data = await res.json();
                data = data.map((item) => ({
                    ...item,
                    slug: item.slug ? item.slug : toSlug(item.name),
                }));
                setCategories(data);
            } catch (error) {
                console.error("Lỗi tải danh mục:", error);
            } finally {
                setLoadingCategories(false);
            }
        };
        fetchCategories();
    }, []);

    // Cuộn lên khi thay đổi path
    useEffect(() => {
        window.scrollTo(0, 0);
    }, [location.pathname]);

    const filteredProducts =
        selectedCategory?.id === 0
            ? products
            : products.filter((product) => product.categoryId === selectedCategory.id);

    return (
        <div className="homepage">
            <Slideshow />
            <div className="homepage-product">
                <h1 className="title">TOP SẢN PHẨM BÁN CHẠY</h1>
                <ProductBestSellers bestsellers={bestsellers} products={products} />
            </div>

            <CategoryBar
                categories={categories}
                products={products}
                onCategoryClick={(index, category) => setSelectedCategory(category)}
                selectedCategory={selectedCategory}
            />

            {selectedCategory && (
                <div className="homepage-category-products">
                    <CategoryProducts category={selectedCategory} products={filteredProducts} />
                </div>
            )}
            <SellerBar />
        </div>
    );
};

export default Homepage;
