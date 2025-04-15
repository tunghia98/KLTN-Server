import React, { useState, useRef } from "react";
import Slider from "react-slick";
import ProductCard from "../ProductCard/ProductCard.jsx";
import "./ProductBestSeller.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { faChevronRight, faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 🔥 Component nhận cả bestsellers và danh sách products
const ProductBestSellers = ({ bestsellers = [], products = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const sliderRef = useRef(null);

  // 🔄 Chuyển bestsellers (chỉ có productId) thành danh sách sản phẩm chi tiết
  const bestsellerProducts = Array.isArray(bestsellers)
    ? bestsellers
        .map(bs => products.find(p => p.id === bs.productId))
        .filter(p => p) // loại bỏ sản phẩm không tìm thấy
    : [];

  const visibleProducts = bestsellerProducts.slice(0, 10); // chỉ lấy 10 sản phẩm
  const slidesToShow = Math.min(4, visibleProducts.length);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow,
    slidesToScroll: 1,
    beforeChange: (oldIndex, newIndex) => setCurrentSlide(newIndex),
    nextArrow: (
      <SampleNextArrow
        currentSlide={currentSlide}
        slideCount={visibleProducts.length}
        slidesToShow={slidesToShow}
        sliderRef={sliderRef}
      />
    ),
    prevArrow: <SamplePrevArrow currentSlide={currentSlide} />,
  };

  return (
    <div className="product-category">
      <Slider ref={sliderRef} {...settings} className="category-items">
        {visibleProducts.length > 0 ? (
          visibleProducts.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))
        ) : (
          <p>Không có sản phẩm nào</p>
        )}
      </Slider>
      <hr className="product-category-line" />
    </div>
  );
};

const SampleNextArrow = ({ onClick, currentSlide, slideCount, slidesToShow, sliderRef }) => {
  return (
    <button
      className="custom-next-arrow"
      onClick={() => {
        if (currentSlide >= slideCount - slidesToShow) {
          sliderRef.current?.slickGoTo(0);
        } else {
          onClick();
        }
      }}
      style={{
        position: "absolute",
        right: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "24px",
      }}
    >
      <FontAwesomeIcon icon={faChevronRight} />
    </button>
  );
};

const SamplePrevArrow = ({ onClick, currentSlide }) => {
  return (
    <button
      className="custom-prev-arrow"
      onClick={onClick}
      style={{
        display: currentSlide === 0 ? "none" : "block",
        position: "absolute",
        left: "-40px",
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 2,
        background: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "24px",
      }}
    >
      <FontAwesomeIcon icon={faChevronLeft} />
    </button>
  );
};

export default ProductBestSellers;
