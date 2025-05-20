// src/components/CreateNewThread/CreateNewThread.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Editor from "./Editor.jsx";
import PreviewContent from "./PreviewContent.jsx";
import SelectionModal from "./SelectionModal.jsx";
import SelectedList from "./SelectedList.jsx";
import ImageUpload from "./ImageUpload.jsx";

const CreateNewThread = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: [],
    crop: [],
    region: [],
    content: null,
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [regions, setRegions] = useState([]);

  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [showRegionModal, setShowRegionModal] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        let res = await fetch("https://kltn.azurewebsites.net/api/categoryforums");
        let catData = await res.json();
        setCategories(catData);

        res = await fetch("https://kltn.azurewebsites.net/api/crops");
        let cropData = await res.json();
        setCrops(cropData);

        res = await fetch("https://kltn.azurewebsites.net/api/regions");
        let regionData = await res.json();
        setRegions(regionData);
      } catch (e) {
        console.error(e);
      }
    }
    fetchData();
  }, []);

  const toggleSelection = (field, id) => {
    setFormData((prev) => {
      const arr = prev[field];
      if (arr.includes(id)) {
        return { ...prev, [field]: arr.filter((x) => x !== id) };
      } else {
        return { ...prev, [field]: [...arr, id] };
      }
    });
  };

  const handleImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn cần đăng nhập để đăng bài.");
      return;
    }
    if (!formData.content) {
      alert("Nội dung bài viết không được để trống.");
      return;
    }

    console.log("Form Data:", formData);
    navigate("/forum");
  };

  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>📝 Tạo Bài Viết Mới</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tiêu đề
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            style={{
              width: "100%",
              padding: 8,
              margin: "8px 0 16px 0",
              boxSizing: "border-box",
            }}
            placeholder="Tiêu đề bài viết"
          />
        </label>

        <div style={{ marginBottom: 16 }}>
          <button
            type="button"
            onClick={() => setShowCategoryModal(true)}
            style={{ marginRight: 8 }}
          >
            Chọn Phân loại
          </button>
          <button
            type="button"
            onClick={() => setShowCropModal(true)}
            style={{ marginRight: 8 }}
          >
            Chọn Giống cây
          </button>
          <button type="button" onClick={() => setShowRegionModal(true)}>
            Chọn Khu vực
          </button>
        </div>

        <div style={{ marginBottom: 16 }}>
          <div>
            <b>Phân loại:</b>{" "}
            <SelectedList selectedIds={formData.category} options={categories} />
          </div>
          <div>
            <b>Giống cây:</b>{" "}
            <SelectedList selectedIds={formData.crop} options={crops} />
          </div>
          <div>
            <b>Khu vực:</b> <SelectedList selectedIds={formData.region} options={regions} />
          </div>
        </div>

        <Editor
          data={formData.content}
          onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
        />

        <div style={{ marginTop: 16 }}>
          <h3>Xem trước nội dung</h3>
          <div
            style={{
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 10,
              minHeight: 150,
              overflowY: "auto",
            }}
          >
            <PreviewContent content={formData.content} />
          </div>
        </div>

        <ImageUpload images={formData.images} onChange={handleImageChange} />

        <button
          type="submit"
          style={{
            backgroundColor: "#4caf50",
            color: "white",
            padding: "10px 16px",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            fontSize: 16,
          }}
        >
          Đăng bài
        </button>
      </form>

      {showCategoryModal && (
        <SelectionModal
          title="Chọn Phân loại"
          options={categories}
          selectedIds={formData.category}
          onToggle={(id) => toggleSelection("category", id)}
          onClose={() => setShowCategoryModal(false)}
          onConfirm={() => setShowCategoryModal(false)} // Đóng modal khi xác nhận
        />
      )}

      {showCropModal && (
        <SelectionModal
          title="Chọn Giống cây"
          options={crops}
          selectedIds={formData.crop}
          onToggle={(id) => toggleSelection("crop", id)}
          onClose={() => setShowCropModal(false)}
              onConfirm={() => setShowCropModal(false)} // Đóng modal khi xác nhận
        />
      )}

      {showRegionModal && (
        <SelectionModal
          title="Chọn Khu vực"
          options={regions}
          selectedIds={formData.region}
          onToggle={(id) => toggleSelection("region", id)}
          onClose={() => setShowRegionModal(false)}
              onConfirm={() => setShowRegionModal(false)} // Đóng modal khi xác nhận
        />
      )}
    </div>
  );
};

export default CreateNewThread;
