import React, {useEffect, useState } from "react";
import { useNavigate} from "react-router-dom";
import LastestThreads from "../../components/Forum/LastestThread.jsx";
import PopularThreads from "../../components/Forum/PopularThread.jsx";
import AllThread from "../../components/Forum/AllThread.jsx"; 
import "../../components/Forum/Forum.css";

function ForumPage() {
  const navigate = useNavigate(); // Hook để điều hướng
  const [threads, setThreads] = useState([]);
  const [categories, setCategories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [regions, setRegions] = useState([]);
  const handleOnClick = () => {
    navigate("/forum/create", { state: { threads, crops, regions } }) // Chuyển hướng đến trang tạo bài viết
  };
  useEffect(() => {
    const fetchAllThreads = async () => {
      try {
        const res = await fetch("https://kltn.azurewebsites.net/api/forumposts");
        if (!res.ok) throw new Error("Lỗi tải chủ đề");
        const data = await res.json();
          setThreads(data);
      } catch (error) {
        console.error("Lỗi lấy chủ đề:", error);
      }
    };
    
    fetchAllThreads();
  }, []); // Chỉ chạy 1 lần khi component mount
  // Lấy danh mục
  useEffect(() => {
    const fetchCategories = async () => {
      try {
          const res = await fetch("https://kltn.azurewebsites.net/api/categoryforums");
        if (!res.ok) throw new Error("Lỗi tải danh mục");
        const data = await res.json();
        setCategories(data);
      } catch (error) {
        console.error("Lỗi lấy danh mục:", error);
      }
    };
    fetchCategories();
  }, []);

  // Lấy giống cây trồng
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const res = await fetch("https://kltn.azurewebsites.net/api/crops");
        if (!res.ok) throw new Error("Lỗi tải giống cây trồng");
        const data = await res.json();
        setCrops(data);
      } catch (error) {
        console.error("Lỗi lấy giống cây trồng:", error);
      }
    };
    fetchCrops();
  }, []);

  // Lấy khu vực
  useEffect(() => {
    const fetchRegions = async () => {
      try {
        const res = await fetch("https://kltn.azurewebsites.net/api/regions");
        if (!res.ok) throw new Error("Lỗi tải khu vực");
        const data = await res.json();
        setRegions(data);
      } catch (error) {
        console.error("Lỗi lấy khu vực:", error);
      }
    };
    fetchRegions();
  }, []);

  return (
    <div className="forum-page">
      <div>
        <h1 className="forum-main-title">🌾 Diễn Đàn Nông Nghiệp 🌾</h1>
        
      </div>

      <div className="forum-layout">
        {/* Sidebar */}
        <div className="forum-sidebar">
          <LastestThreads threads={threads}/>
          <PopularThreads threads={threads}/>
        </div>

        {/* Main Content */}
        <div className="forum-content">
        <button className="forum-create-thread" onClick={handleOnClick}>Tạo bài viết</button>
          <AllThread allthreads={threads} categories={categories} crops={crops} regions={regions}/>
          
        </div>
      </div>
    </div>
  );
}

export default ForumPage;
