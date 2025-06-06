import React, { useState, useEffect } from "react";
import ReviewList from "../../components/Review/ReviewList";
import SellerProductMiniCard from "../../components/Products/SellerProductMiniCard";
import "./SellerReviewPage.css";

const SellerReviewPage = ({ sellerId }) => {
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const reviewsPerPage = 5;
  const [reply, setReply] = useState({});
  const [openReview, setOpenReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [productRatings, setProductRatings] = useState({});

  useEffect(() => {
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

        setProducts(productsWithImages);

        // Fetch rating cho từng sản phẩm
        const ratingsMap = {};
        for (const product of products) {
          try {
            const res = await fetch(
              `https://kltn.azurewebsites.net/api/ProductReviews/product/${product.id}`
            );
            if (!res.ok) throw new Error("Lỗi đánh giá");
            const reviews = await res.json();
            const count = reviews.length;
            const value =
              count > 0
                ? reviews.reduce((sum, r) => sum + r.rating, 0) / count
                : 0;
            ratingsMap[product.id] = { value, count };
          } catch (err) {
            ratingsMap[product.id] = { value: 0, count: 0 };
          }
        }
        setProductRatings(ratingsMap);
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReviews = async (idProduct) => {
      try {
        setLoading(true);
        const res = await fetch(
          `https://kltn.azurewebsites.net/api/ProductReviews/product/${idProduct}`
        );
        if (!res.ok) throw new Error("Lỗi tải đánh giá");

        const allReviews = await res.json();

        // Chuyển đổi sang định dạng ReviewList cần
        const formattedReviews = allReviews.map((r) => ({
          id: r.id,
          rating: r.rating,
          content: r.content,
          date: r.createdAt,
          userId: r.userId, // có thể thay bằng tên thật nếu API trả về
          replyAt: r.replyAt,
          shopReply: r.shopReply,
        }));

        const count = formattedReviews.length;
        const value =
          count > 0
            ? formattedReviews.reduce((sum, r) => sum + r.rating, 0) / count
            : 0;

        setProductRatings((prev) => ({
          ...prev,
          [idProduct]: { value, count },
        }));

        setReviews(formattedReviews);
      } catch (error) {
        console.error("Lỗi tải đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };

    if (selectedProduct?.id) {
      fetchReviews(selectedProduct.id);
    }
  }, [selectedProduct]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleReplyChange = (reviewId, replyText) => {
    setReply((prev) => ({ ...prev, [reviewId]: replyText }));
  };

  const handleSubmitReply = (reviewId) => {
    const updatedReviews = reviews.map((review) =>
      review.id === reviewId
        ? { ...review, replies: [...review.replies, reply[reviewId]] }
        : review
    );
    setReviews(updatedReviews);
    setReply((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const toggleReplySection = (reviewId) => {
    setOpenReview((prev) => (prev === reviewId ? null : reviewId));
  };

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setCurrentPage(1);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const value =
    selectedProduct && productRatings[selectedProduct.id]
      ? productRatings[selectedProduct.id].value
      : 0;
  const count =
    selectedProduct && productRatings[selectedProduct.id]
      ? productRatings[selectedProduct.id].count
      : 0;

  const paginatedReviews = reviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );

  return (
    <div className="seller-review-page">
      <h2>Đánh giá sản phẩm của bạn</h2>

      <input
        type="text"
        placeholder="Tìm sản phẩm..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      <div className="product-summary">
        {filteredProducts.map((product) => {
          const ratingData = productRatings[product.id] || {
            value: 0,
            count: 0,
          };
          return (
            <SellerProductMiniCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
              value={ratingData.value}
              count={ratingData.count}
              productReviews={product.id === selectedProduct?.id ? reviews : []}
            />
          );
        })}
      </div>

      {selectedProduct && (
        <>
          <div className="pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>{currentPage}</span>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage * reviewsPerPage >= reviews.length}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SellerReviewPage;
