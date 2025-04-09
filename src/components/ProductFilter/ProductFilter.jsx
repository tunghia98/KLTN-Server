import { useState, useEffect } from "react";
import "./ProductFilter.css";
import CategoryCollection from "../CategoryProducts/CategoryCollection.jsx";
import BrandCollection from "../CategoryProducts/BrandCollection.jsx";
import SellerCollection from "../CategoryProducts/SellerCollection.jsx";
// import CityCollection from "../CityCollection/CityCollection.jsx";
// import PriceCollection from "../PriceCollection/PriceCollection.jsx";

const ProductFilter = ({ onFilter }) => {
  const [selectedCrops, setSelectedCrops] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]); // <- phải khởi tạo là []
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
      <CategoryCollection
        selectedCrops={selectedCrops}
        setSelectedCrops={setSelectedCrops}
      />

      <BrandCollection
        selectedBrands={selectedBrands}
        setSelectedBrands={setSelectedBrands}
      />

      <SellerCollection
        selectedSellers={selectedSellers}
        setSelectedSellers={setSelectedSellers}
      />

      {/* <CityCollection
        selectedCities={selectedCities}
        setSelectedCities={setSelectedCities}
      />
      <PriceCollection
        priceRange={priceRange}
        setPriceRange={setPriceRange}
      /> */}
    </div>
  );
};

export default ProductFilter;
