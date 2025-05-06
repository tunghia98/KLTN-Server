import { useState, useEffect } from "react";
import "./ProductFilter.css";
import CategoryCollection from "../CategoryProducts/CategoryCollection.jsx";
import BrandCollection from "../CategoryProducts/BrandCollection.jsx";
import SellerCollection from "../CategoryProducts/SellerCollection.jsx";
import CityCollection from "../CategoryProducts/CityCollection.jsx";
import PriceCollection from "../CategoryProducts/PriceCollection.jsx";

const ProductFilter = ({ onFilter }) => {
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedSellers, setSelectedSellers] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);

  useEffect(() => {
    onFilter({
      crops: selectedCrops,
      brands: selectedBrands,
      sellers: selectedSellers,
      cities: selectedCities,
      priceRange,
    });
  }, [
    selectedCrops,
    selectedBrands,
    selectedSellers,
    selectedCities,
    priceRange,
    onFilter,
  ]);

  return (
    <div className="product-filter">
      <h3 className="filter-title">Lọc theo loại cây trồng</h3>
      <CategoryCollection
        selectedCrops={selectedCrops}
        setSelectedCrops={setSelectedCrops}
      />

      <h3 className="filter-title">Lọc theo thương hiệu</h3>
      <BrandCollection
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
      />

      <h3 className="filter-title">Lọc theo người bán</h3>
      <SellerCollection
        selectedSellers={selectedSellers}
        setSelectedSellers={setSelectedSellers}
      />

      <h3 className="filter-title">Lọc theo thành phố</h3>
      <CityCollection
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
      />

      <h3 className="filter-title">Lọc theo giá</h3>
      <PriceCollection
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      />
    </div>
  );
};

export default ProductFilter;
