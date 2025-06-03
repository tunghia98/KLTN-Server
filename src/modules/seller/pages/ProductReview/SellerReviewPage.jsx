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

  const reviewsSample = [
    {
      id: 1,
      user: { name: "Nguyen Van A" }, // ✅ Sửa chỗ này thành object
      rating: 5,
      content: "Sản phẩm rất tốt, giao hàng nhanh!",
      date: "2025-06-01",
      replies: ["Cảm ơn bạn đã ủng hộ!"],
    },
    {
      id: 2,
      user: { name: "Tran Thi B" },
      rating: 4,
      content: "Chất lượng khá ổn, giá hợp lý.",
      date: "2025-05-28",
      replies: [],
    },
    {
      id: 3,
      user: { name: "Le Van C" },
      rating: 2,
      content: "Sản phẩm không đúng như mô tả.",
      date: "2025-05-30",
      replies: [
        "Chúng tôi xin lỗi vì sự cố này. Vui lòng liên hệ để được hỗ trợ.",
      ],
    },
    {
      id: 4,
      user: { name: "Pham Thi D" },
      rating: 3,
      content: "Tạm được, nhưng giao hàng hơi chậm.",
      date: "2025-06-02",
      replies: [],
    },
    {
      id: 5,
      user: { name: "Hoang Van E" },
      rating: 1,
      content: "Chất lượng kém, không hài lòng.",
      date: "2025-05-25",
      replies: [],
    },
  ];
  const count_tmp = reviewsSample.length;
  const value_tmp =
    count_tmp > 0
      ? reviewsSample.reduce((sum, r) => sum + r.rating, 0) / count_tmp
      : 0;
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
      } catch (error) {
        console.error("Lỗi tải sản phẩm:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchReviews = async () => {
      if (!selectedProduct) return;
      try {
        setLoading(true);
        const res = await fetch(
          `https://kltn.azurewebsites.net/api/reviews/product/${selectedProduct.id}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
            },
          }
        );
        if (!res.ok) throw new Error("Lỗi tải đánh giá");

        const allReviews = await res.json();

        const count = allReviews.length;
        const value =
          count > 0
            ? allReviews.reduce((sum, r) => sum + r.rating, 0) / count
            : 0;

        setProductRatings((prev) => ({
          ...prev,
          [selectedProduct.id]: { value, count },
        }));

        setReviews(allReviews);
      } catch (error) {
        console.error("Lỗi tải đánh giá:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
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

  const displayedReviews =
    reviews.length > 0 ? reviews : selectedProduct ? reviewsSample : [];

  const paginatedReviews = displayedReviews.slice(
    (currentPage - 1) * reviewsPerPage,
    currentPage * reviewsPerPage
  );
  useEffect(() => {
    if (selectedProduct) {
      setReviews(reviewsSample); // Ép để test
    }
  }, [selectedProduct]);

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
        {filteredProducts.map((product) => (
          <SellerProductMiniCard
            key={product.id}
            product={product}
            onClick={() => handleProductClick(product)}
            value={value_tmp}
            count={count_tmp}
            productReviews={reviewsSample}
          />
        ))}
      </div>

      {selectedProduct && (
        <>
          <ReviewList
            reviews={paginatedReviews}
            reply={reply}
            openReview={openReview}
            onReplyChange={handleReplyChange}
            onSubmitReply={handleSubmitReply}
            onToggleReply={toggleReplySection}
          />

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
              disabled={currentPage * reviewsPerPage >= displayedReviews.length}
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
