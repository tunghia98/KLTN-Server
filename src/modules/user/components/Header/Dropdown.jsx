import React from 'react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import "./Dropdown.css";
import toSlug from '../../../../utils/toSlug.js'; // Import hàm toSlug

const Dropdown = () => {
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(false);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoadingCategories(true);
                const res = await fetch("https://kltn.azurewebsites.net/api/categories/used");
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

    return (
        <div className="dropdown-menu">
            <div className='dropdown-container'>
            <div className='dropdown-column'>
            <span>Phân loại</span>
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    to={`/products/${cat.slug}`}
                    className="dropdown-item"
                >
                    {cat.name}
                </Link>
            ))}
            </div>
            <div className='dropdown-column'>
            <span>Phân loại</span>
            {categories.map((cat) => (
                <Link
                    key={cat.id}
                    to={`/products/${cat.slug}`}
                    className="dropdown-item"
                >
                    {cat.name}
                </Link>
            ))}
            </div>
            </div>

        </div>
    );
};

export default Dropdown;
