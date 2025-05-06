import React from "react";
import "./Collections.css";
import { sellers } from "../../../../data/data.js";

const getUniqueCities = () => {
  const citySet = new Set(sellers.map((seller) => seller.city));
  return Array.from(citySet);
};

const CityCollection = ({ selectedCities, setSelectedCities }) => {
  const cities = getUniqueCities();

  const handleCityChange = (city) => {
    if (selectedCities.includes(city)) {
      setSelectedCities(selectedCities.filter((c) => c !== city));
    } else {
      setSelectedCities([...selectedCities, city]);
    }
  };

  return (
    <div className="filter-group city-filter">
      {cities.map((city) => (
        <label key={city}>
          <input
            type="checkbox"
            checked={selectedCities.includes(city)}
            onChange={() => handleCityChange(city)}
          />
          {city}
        </label>
      ))}
    </div>
  );
};

export default CityCollection;
