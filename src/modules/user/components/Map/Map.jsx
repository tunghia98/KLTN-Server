import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import toSlug from "../../../../utils/toSlug";
import redIconUrl from "../../../../assets/marker-icon-red.png";
import "./Map.css";

// Cấu hình icon mặc định
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

// Icon màu đỏ cho marker cửa hàng
const redIcon = new L.Icon({
  iconUrl: redIconUrl,
  iconRetinaUrl: redIconUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  shadowSize: [41, 41],
  className: "leaflet-red-icon",
});

const Map = () => {
  const [shops, setShops] = useState([]);
  const [userPosition, setUserPosition] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState(30);
  const [sortOrder, setSortOrder] = useState("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const mapRef = useRef(null);
  const markerRefs = useRef({});

  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (deg) => (deg * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  useEffect(() => {
    fetch("https://kltn.azurewebsites.net/api/shops/locations")
      .then((res) => res.json())
      .then((data) => setShops(data))
      .catch((err) => console.error("Fetch shop error:", err));
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserPosition(pos);
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    } else {
      alert("Trình duyệt không hỗ trợ định vị.");
    }
  }, []);

  const filteredShops =
    userPosition && shops.length > 0
      ? shops
          .filter((shop) => shop.latitude && shop.longitude)
          .map((shop) => {
            const distance = haversineDistance(
              userPosition.lat,
              userPosition.lng,
              shop.latitude,
              shop.longitude
            );
            return { ...shop, distance };
          })
          .filter((shop) => shop.distance <= distanceFilter)
          .filter((shop) =>
            shop.name.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .sort((a, b) =>
            sortOrder === "asc"
              ? a.distance - b.distance
              : b.distance - a.distance
          )
      : [];

  const handleMarkerClick = (shop) => {
    navigate(`/sellers/${shop.id}-${toSlug(shop.name)}`);
  };

  const focusToShop = (shop) => {
    const map = mapRef.current;
    const marker = markerRefs.current[shop.id];
    if (map && marker) {
      map.flyTo([shop.latitude, shop.longitude], 14, { duration: 1.2 });
      marker.openPopup();
    }
  };

  return (
    <div className="map">
      <h2>Bản đồ cửa hàng gần bạn</h2>

      <label htmlFor="distance-input">
        <strong>Khoảng cách (km):</strong>
      </label>
      <input
        id="distance-input"
        type="number"
        min={1}
        max={500}
        step={1}
        value={distanceFilter}
        onChange={(e) => setDistanceFilter(Number(e.target.value))}
        style={{
          padding: "8px",
          fontSize: "16px",
          borderRadius: "4px",
          border: "1px solid #ccc",
          marginBottom: "10px",
          width: "100px",
        }}
      />

      <div className="map-container">
        <div className="map-left">
          <MapContainer
            center={userPosition || [10.7769, 106.7009]}
            zoom={11}
            whenCreated={(mapInstance) => (mapRef.current = mapInstance)}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {userPosition && (
              <>
                <Marker position={[userPosition.lat, userPosition.lng]}>
                  <Popup>Vị trí của bạn</Popup>
                </Marker>
                <Circle
                  center={[userPosition.lat, userPosition.lng]}
                  radius={distanceFilter * 1000}
                  pathOptions={{
                    fillColor: "blue",
                    color: "blue",
                    fillOpacity: 0.2,
                  }}
                />
              </>
            )}

            {filteredShops.map((shop) => (
              <Marker
                key={shop.id}
                ref={(ref) => {
                  if (ref) markerRefs.current[shop.id] = ref;
                }}
                position={[shop.latitude, shop.longitude]}
                icon={redIcon}
              >
                <Popup>
                  <div style={{ textAlign: "center" }}>
                    <img
                      src={
                        shop.avatarUrl
                          ? `https://kltn.azurewebsites.net/api/Shops/shop-avatar/${shop.avatarUrl}`
                          : "/default-avatar.png"
                      }
                      alt={shop.name}
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                        borderRadius: "50%",
                        marginBottom: "5px",
                      }}
                    />
                    <p>
                      <span
                        style={{
                          cursor: "pointer",
                          color: "blue",
                          textDecoration: "underline",
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMarkerClick(shop);
                        }}
                      >
                        {shop.name}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="map-right">
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="sort-order">
              <strong>Sắp xếp:</strong>
            </label>
            <select
              id="sort-order"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{
                padding: "6px",
                fontSize: "14px",
                marginLeft: "10px",
              }}
            >
              <option value="asc">Gần → Xa</option>
              <option value="desc">Xa → Gần</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Tìm cửa hàng..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: "8px",
              width: "100%",
              fontSize: "14px",
              marginBottom: "10px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
          />

          <h3>Cửa hàng trong bán kính {distanceFilter} km</h3>
          {filteredShops.length > 0 ? (
            filteredShops.map((shop) => (
              <div
                key={shop.id}
                className="shop-item"
                onClick={() => focusToShop(shop)}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  cursor: "pointer",
                }}
              >
                <div style={{ display: "flex", alignItems: "center" }}>
                  <img
                    src={
                      shop.avatarUrl
                        ? `https://kltn.azurewebsites.net/api/Shops/shop-avatar/${shop.avatarUrl}`
                        : "/default-avatar.png"
                    }
                    alt={shop.name}
                    style={{
                      width: "50px",
                      height: "50px",
                      marginRight: "10px",
                      borderRadius: "50%",
                    }}
                  />
                  <div>
                    <strong>{shop.name}</strong>
                    <p style={{ fontSize: "12px", margin: 0 }}>
                      {shop.address || "Không có địa chỉ"}
                    </p>
                  </div>
                </div>
                <div style={{ minWidth: "80px", textAlign: "right" }}>
                  {shop.distance?.toFixed(2)} km
                </div>
              </div>
            ))
          ) : (
            <p>Không tìm thấy cửa hàng nào trong bán kính này.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Map;
