import React from "react";
import Slider from "rc-slider";
import "rc-slider/assets/index.css"; // Nhớ import css của rc-slider

const PriceCollection = ({ priceRange, setPriceRange }) => {
  const handleSliderChange = (value) => {
    setPriceRange(value); // giá trị trả về là mảng [min, max]
  };

  return (
    <div className="filter-group price-filter">
      <label>
        Giá:
      </label>
      <Slider
        min={0}
        max={10000000}
        range
        value={priceRange}
        onChange={handleSliderChange}
        step={1000} // Điều chỉnh bước giá
        tipFormatter={(value) => `${value.toLocaleString()} VND`} // Hiển thị giá trị theo định dạng tiền tệ
      />
      <div className="price-range">
        <span>{priceRange[0].toLocaleString()} VND</span> -{" "}
        <span>{priceRange[1].toLocaleString()} VND</span>
      </div>
    </div>
  );
};

export default PriceCollection;
