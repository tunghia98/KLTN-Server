import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toSlug from "../../../../utils/toSlug";
import "./Bar.css";

const ITEMS_PER_PAGE = 5; // số nhà cung cấp mỗi trang

const SellerBar = () => {
  const [sellers, setSellers] = useState([]);
  const [loadingSellers, setLoadingSellers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const navigate = useNavigate();

  const handleOnClick = (seller) => {
    navigate(`/sellers/${seller.id}-${toSlug(seller.name)}`);
  };

  const fetchSellers = async () => {
    try {
      setLoadingSellers(true);
      const res = await fetch("https://kltn.azurewebsites.net/api/shops");
      if (!res.ok) throw new Error("Lỗi tải nhà bán hàng");

      let data = await res.json();
      data = data.map((item) => ({
        ...item,
        slug: item.slug ? item.slug : toSlug(item.name),
      }));

      setSellers(data);
    } catch (error) {
      console.error("Lỗi tải nhà bán hàng:", error);
    } finally {
      setLoadingSellers(false);
    }
  };

  useEffect(() => {
    fetchSellers();
  }, []);

  // Lọc theo từ khoá tìm kiếm
  const filteredSellers = sellers.filter((seller) =>
    seller.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredSellers.length / ITEMS_PER_PAGE);
  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleSellers = filteredSellers.slice(startIndex, endIndex);

  return (
    <div className="seller-bar">
      <div className="category-bar-header-flex">
        <h1 className="seller-title">Các Nhà Cung Cấp Sản Phẩm</h1>
        <input
          type="text"
          className="category-search-input"
          placeholder="Tìm nhà bán hàng..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(0);
          }}
        />
      </div>

      <div className="seller-list">
        {loadingSellers ? (
          <p>Đang tải nhà bán hàng...</p>
        ) : (
          visibleSellers.map((seller, index) => (
            <div
              key={index}
              className="seller-card"
              onClick={() => handleOnClick(seller)}
            >
              <h3>{seller.name}</h3>
            </div>
          ))
        )}
      </div>

      {!loadingSellers && totalPages > 1 && (
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
      )}
    </div>
  );
};

export default SellerBar;
