import React, { useState } from "react";
import { useUser } from "../../../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import Login from "../AuthForm/Login";
import ReactMarkdown from "react-markdown";
import "./Forum.css";

const CreateNewThread = ({ categories = [], crops = [], regions = [] }) => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: [],
    crop: [],
    region: [],
    content: "",
    tags: [],
    images: [],
  });
  const [tagInput, setTagInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleMultiSelectChange = (e, fieldName) => {
    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
    setFormData((prev) => ({ ...prev, [fieldName]: selected }));
  };

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!formData.tags.includes(tagInput.trim())) {
        setFormData((prev) => ({ ...prev, tags: [...prev.tags, tagInput.trim()] }));
      }
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({ ...prev, tags: prev.tags.filter((tag) => tag !== tagToRemove) }));
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
    setFormData((prev) => ({ ...prev, images: files }));
  };

  const applyFormatting = (syntax) => {
    const textarea = document.getElementById("content-textarea");
    if (!textarea) return;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selected = formData.content.substring(start, end);
    const newText = syntax.replace("$$", selected || "Nội dung");
    const updatedContent =
      formData.content.substring(0, start) + newText + formData.content.substring(end);
    setFormData((prev) => ({ ...prev, content: updatedContent }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      setIsLoginOpen(true);
      return;
    }
    console.log("Thread Data:", formData);
    navigate("/forum");
  };

  return (
    <div className="thread-detail-container">
      <div className="thread-detail-card">
        <h1 className="thread-detail-title">📝 Tạo Bài Viết Mới</h1>
        <form onSubmit={handleSubmit} className="create-thread-form">
          <input
            type="text"
            name="title"
            placeholder="Tiêu đề bài viết"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />

          {/* Toolbar định dạng nội dung */}
          <div className="content-toolbar">
            <button type="button" onClick={() => applyFormatting("**$$**")}><b>B</b></button>
            <button type="button" onClick={() => applyFormatting("*$$*")}><i>I</i></button>
            <button type="button" onClick={() => applyFormatting("# $$")}>H1</button>
            <button type="button" onClick={() => applyFormatting("## $$")}>H2</button>
            <button type="button" onClick={() => applyFormatting("### $$")}>H3</button>
          </div>

          <textarea
            id="content-textarea"
            name="content"
            placeholder="Nội dung bài viết..."
            rows="6"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            required
          />

          {/* Tags */}
          {/* <div className="tag-input-container">
            <label>Thêm thẻ:</label>
            <input
              type="text"
              placeholder="Thêm thẻ (nhấn Enter)..."
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKeyDown}
            />
            <div className="tag-list">
              {formData.tags.map((tag, index) => (
                <span key={index} className="tag">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)}>×</button>
                </span>
              ))}
            </div>
          </div> */}

          {/* Chọn thể loại */}
          <div className="select-group">
            <label>Phân loại:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "category")} value={formData.category}>
              {categories.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Chọn giống cây */}
          <div className="select-group">
            <label>Giống cây:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "crop")} value={formData.crop}>
              {crops.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Chọn khu vực */}
          <div className="select-group">
            <label>Khu vực:</label>
            <select multiple onChange={(e) => handleMultiSelectChange(e, "region")} value={formData.region}>
              {regions.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>

          {/* Ảnh minh hoạ */}
          <div className="image-upload">
            <label>Ảnh minh hoạ:</label>
            <input type="file" multiple onChange={handleImageUpload} />
            <div className="image-preview-container">
              {imagePreviews.map((src, idx) => (
                <img key={idx} src={src} alt={`preview-${idx}`} className="image-preview" />
              ))}
            </div>
          </div>
        </form>
        <div style={{ textAlign: 'center' }}>
        <button type="submit" className="submit-button">Đăng bài viết</button>
        </div>
        
      </div>

      {/* Markdown Preview */}
      <div className="markdown-preview-container">
        <h3>Xem trước bài viết:</h3>
        <div className="preview-box">
          <h1>{formData.title}</h1>
          <ReactMarkdown>{formData.content.replace(/\n/g, '  \n')}</ReactMarkdown>
        </div>
      </div>

      <Login
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSwitchToRegister={() => navigate("/register")}
        isReady={true}
      />
    </div>
  );
};

export default CreateNewThread;
