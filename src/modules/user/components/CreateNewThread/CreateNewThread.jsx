// src/components/CreateNewThread/CreateNewThread.jsx
import React, { useState, useEffect } from "react";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Editor from "./Editor.jsx";
import SelectionModal from "./SelectionModal.jsx";
import SelectedList from "./SelectedList.jsx";
import ImageUpload from "./ImageUpload.jsx";

const CreateNewThread = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const accessToken = localStorage.getItem("accessToken");
  const [formData, setFormData] = useState({
    title: "",
    category: [], // ✅ để là array
    crop: [],
    region: [],
    content: null,
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
        let res = await fetch(
          "https://kltn.azurewebsites.net/api/categoryforums"
        );
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

  // ❗ Chỉ cho chọn 1 giá trị cho mỗi loại
  const toggleSelection = (field, id) => {
    setFormData((prev) => ({
      ...prev,
      [field]: [id],
    }));
  };

  const handleImageChange = (e) => {
    const files = e.target.files ? Array.from(e.target.files) : [];
    setFormData((prev) => ({ ...prev, images: files }));
    console.log(formData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      alert("Bạn cần đăng nhập để đăng bài.");
      return;
    }
    if (!formData.content || !formData.title) {
      alert("Tiêu đề và nội dung không được để trống.");
      return;
    }
    if (
      !formData.category.length ||
      !formData.crop.length ||
      !formData.region.length
    ) {
      alert("Vui lòng chọn đầy đủ Phân loại, Giống cây và Khu vực.");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        content: JSON.stringify(formData.content), // chuyển thành chuỗi JSON
        categoryId: formData.category.length > 0 ? formData.category[0] : null,
        cropId: formData.crop.length > 0 ? formData.crop[0] : null,
        regionId: formData.region.length > 0 ? formData.region[0] : null,
        userId: Number(user.userId),
      };

      const response = await fetch(
        "https://kltn.azurewebsites.net/api/ForumPosts/create",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );
      console.log(payload);

      if (!response.ok) {
        let errorMessage = "Lỗi khi tạo bài viết";
        try {
          const text = await response.text(); // Đọc raw text trước
          if (text) {
            const errData = JSON.parse(text); // parse thủ công
            if (errData && errData.message) {
              errorMessage = errData.message;
            }
          }
        } catch (err) {
          console.warn("Không thể parse JSON lỗi:", err);
        }
        throw new Error(errorMessage);
      }

      alert("Tạo bài viết thành công!");
      navigate("/forum");
    } catch (error) {
      alert("Lỗi: " + error.message);
    }
  };
  // useEffect(() => {
  //   console.log("Đã chọn:", {
  //     category: formData.category,
  //     crop: formData.crop,
  //     region: formData.region,
  //   });
  // }, [formData.category, formData.crop, formData.region]);
  return (
    <div style={{ maxWidth: 800, margin: "auto", padding: 20 }}>
      <h2 style={{ textAlign: "center" }}>📝 Tạo Bài Viết Mới</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Tiêu đề
          <textarea
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
            rows={3}
            style={{
              width: "100%",
              padding: 8,
              margin: "8px 0 16px 0",
              boxSizing: "border-box",
              resize: "vertical",
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
            <SelectedList
              selectedIds={formData.category}
              options={categories}
            />
          </div>
          <div>
            <b>Giống cây:</b>{" "}
            <SelectedList selectedIds={formData.crop} options={crops} />
          </div>
          <div>
            <b>Khu vực:</b>{" "}
            <SelectedList selectedIds={formData.region} options={regions} />
          </div>
        </div>

        <Editor
          data={formData.content}
          onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
        />

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
          onConfirm={() => setShowCategoryModal(false)}
        />
      )}

      {showCropModal && (
        <SelectionModal
          title="Chọn Giống cây"
          options={crops}
          selectedIds={formData.crop}
          onToggle={(id) => toggleSelection("crop", id)}
          onClose={() => setShowCropModal(false)}
          onConfirm={() => setShowCropModal(false)}
        />
      )}

      {showRegionModal && (
        <SelectionModal
          title="Chọn Khu vực"
          options={regions}
          selectedIds={formData.region}
          onToggle={(id) => toggleSelection("region", id)}
          onClose={() => setShowRegionModal(false)}
          onConfirm={() => setShowRegionModal(false)}
        />
      )}
    </div>
  );
};

export default CreateNewThread;
