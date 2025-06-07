import React, { useEffect, useState } from "react";
import Popup from "../../../../components/Common/Popup";

export default function ThreadTagManager() {
  const [categories, setCategories] = useState([]);
  const [regions, setRegions] = useState([]);
  const [crops, setCrops] = useState([]);

  const [searchCategory, setSearchCategory] = useState("");
  const [searchRegion, setSearchRegion] = useState("");
  const [searchCrop, setSearchCrop] = useState("");

  // Quản lý popup
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [popupType, setPopupType] = useState(null); // 'category' | 'region' | 'crop'
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [catRes, regionRes, cropRes] = await Promise.all([
        fetch("https://kltn.azurewebsites.net/api/categoryforums"),
        fetch("https://kltn.azurewebsites.net/api/regions"),
        fetch("https://kltn.azurewebsites.net/api/crops"),
      ]);

      if (!catRes.ok || !regionRes.ok || !cropRes.ok)
        throw new Error("Lỗi khi tải dữ liệu");

      const [catData, regionData, cropData] = await Promise.all([
        catRes.json(),
        regionRes.json(),
        cropRes.json(),
      ]);

      setCategories(catData);
      setRegions(regionData);
      setCrops(cropData);
    } catch (error) {
      console.error("Lỗi tải dữ liệu:", error);
    }
  };

  const filterList = (list, keyword) =>
    list.filter((item) =>
      item.name.toLowerCase().includes(keyword.toLowerCase())
    );

  const openPopup = (type) => {
    setPopupType(type);
    setNewName("");
    setError(null);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setPopupType(null);
    setNewName("");
    setError(null);
  };

  const handleSubmit = async () => {
    if (!newName.trim()) {
      setError("Tên không được để trống.");
      return;
    }

    setError(null);
    setLoading(true);

    let url = "";
    switch (popupType) {
      case "category":
        url = "https://kltn.azurewebsites.net/api/CategoryForums/create";
        break;
      case "region":
        url = "https://kltn.azurewebsites.net/api/Regions/create";
        break;
      case "crop":
        url = "https://kltn.azurewebsites.net/api/Crops/create";
        break;
      default:
        setError("Loại không hợp lệ.");
        setLoading(false);
        return;
    }

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newName.trim(), description: "" }),
      });
      if (!res.ok) throw new Error("Thêm mới thất bại");

      await fetchAllData();
      closePopup();
    } catch (err) {
      console.error(err);
      setError("Không thể thêm mới. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const listStyle = {
    maxHeight: "200px",
    overflowY: "auto",
    paddingRight: "4px",
    listStyle: "none",
    paddingLeft: 0,
    margin: 0,
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Tùy chỉnh thẻ bài viết</h2>
      <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
        {/* Phân loại */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Phân loại</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm phân loại..."
              value={searchCategory}
              onChange={(e) => setSearchCategory(e.target.value)}
              style={{
                padding: "4px 8px",
                fontSize: "13px",
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              style={{ padding: "4px 8px", fontSize: "13px" }}
              onClick={() => openPopup("category")}
            >
              + Thêm mới
            </button>
          </div>
          <ul style={listStyle}>
            {filterList(categories, searchCategory).map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>

        {/* Khu vực */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Khu vực</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm khu vực..."
              value={searchRegion}
              onChange={(e) => setSearchRegion(e.target.value)}
              style={{
                padding: "4px 8px",
                fontSize: "13px",
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              style={{ padding: "4px 8px", fontSize: "13px" }}
              onClick={() => openPopup("region")}
            >
              + Thêm mới
            </button>
          </div>
          <ul style={listStyle}>
            {filterList(regions, searchRegion).map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>

        {/* Giống cây trồng */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <h3>Giống cây trồng</h3>
          <div style={{ display: "flex", gap: "8px", marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Tìm kiếm giống cây..."
              value={searchCrop}
              onChange={(e) => setSearchCrop(e.target.value)}
              style={{
                padding: "4px 8px",
                fontSize: "13px",
                flex: 1,
                border: "1px solid #ccc",
                borderRadius: "4px",
              }}
            />
            <button
              style={{ padding: "4px 8px", fontSize: "13px" }}
              onClick={() => openPopup("crop")}
            >
              + Thêm mới
            </button>
          </div>
          <ul style={listStyle}>
            {filterList(crops, searchCrop).map((item) => (
              <li key={item.id}>{item.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Popup thêm mới */}
      <Popup
        isOpen={isPopupOpen}
        onClose={closePopup}
        title={
          popupType === "category"
            ? "Thêm mới phân loại"
            : popupType === "region"
            ? "Thêm mới khu vực"
            : popupType === "crop"
            ? "Thêm mới giống cây trồng"
            : ""
        }
      >
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <input
            type="text"
            placeholder="Nhập tên..."
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            disabled={loading}
            style={{ padding: "6px 8px", fontSize: "14px" }}
          />
          {error && <div style={{ color: "red" }}>{error}</div>}
          <div
            style={{ display: "flex", justifyContent: "flex-end", gap: "8px" }}
          >
            <button
              onClick={closePopup}
              disabled={loading}
              style={{ padding: "6px 12px", fontSize: "14px" }}
            >
              Đóng
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              style={{ padding: "6px 12px", fontSize: "14px" }}
            >
              {loading ? "Đang thêm..." : "Thêm"}
            </button>
          </div>
        </div>
      </Popup>
    </div>
  );
}
