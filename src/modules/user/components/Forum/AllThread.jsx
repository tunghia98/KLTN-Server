import React, { useState, useEffect } from "react";
import ThreadList from "./ThreadList";
import Pagination from "../../../../components/Pagination/Pagination";
import ForumSearchFilter from "./ForumSearchFilter";
import { useUser } from "../../../../contexts/UserContext";
import "./Forum.css";

const AllThreads = ({ allthreads, categories, crops, regions }) => {
  const [category, setCategory] = useState(null);
  const [crop, setCrop] = useState(null);
  const [region, setRegion] = useState(null);
  const [threads, setThreads] = useState(allthreads || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const { user } = useUser();
  const [userThreads, setUserThreads] = useState([]);
  const [showUserThreads, setShowUserThreads] = useState(false);
  const itemsPerPage = 8;

  // Fetch user threads once userId is available
  useEffect(() => {
    if (!user?.userId) return;

    const fetchUserThreads = async () => {
      try {
        const res = await fetch(
          "https://kltn.azurewebsites.net/api/forumposts"
        );
        if (!res.ok) throw new Error("Lỗi tải chủ đề");
        const data = await res.json();

        const foundThreads = data.filter(
          (thread) => String(thread.userId) === String(user.userId)
        );

        setUserThreads(foundThreads);
      } catch (error) {
        console.error("Lỗi lấy chủ đề:", error);
      }
    };

    fetchUserThreads();
  }, [user?.userId]);

  // Filter threads every time filter params or showUserThreads/userThreads/allthreads change
  useEffect(() => {
    const sourceThreads = showUserThreads ? userThreads : allthreads || [];
    const keyword = searchKeyword.toLowerCase().trim();

    const filtered = sourceThreads.filter((thread) => {
      const matchesCategory = category
        ? thread.categoryId === Number(category)
        : true;
      const matchesCrop = crop ? thread.cropId === Number(crop) : true;
      const matchesRegion = region ? thread.regionId === Number(region) : true;
      const matchesKeyword = keyword
        ? thread.title?.toLowerCase().includes(keyword)
        : true;
      return matchesCategory && matchesCrop && matchesRegion && matchesKeyword;
    });

    console.log("Filtered threads count:", filtered.length);
    setThreads(filtered);
    setCurrentPage(1);
  }, [
    category,
    crop,
    region,
    searchKeyword,
    allthreads,
    userThreads,
    showUserThreads,
  ]);

  const handleCategoryChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setCategory(value);
  };

  const handleCropChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setCrop(value);
  };

  const handleRegionChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setRegion(value);
  };

  const indexOfLastThread = currentPage * itemsPerPage;
  const indexOfFirstThread = indexOfLastThread - itemsPerPage;
  const currentThreads = threads.slice(indexOfFirstThread, indexOfLastThread);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <div className="forum-container">
      <h2 className="forum-title">Tất Cả Chủ Đề</h2>

      <ForumSearchFilter
        categories={categories}
        crops={crops}
        regions={regions}
        category={category}
        crop={crop}
        region={region}
        searchKeyword={searchKeyword}
        handleCategoryChange={handleCategoryChange}
        handleCropChange={handleCropChange}
        handleRegionChange={handleRegionChange}
        handleSearchChange={setSearchKeyword}
        threads={threads}
        userThreads={userThreads}
        showUserThreads={showUserThreads}
        setShowUserThreads={setShowUserThreads}
      />

      <ThreadList threads={currentThreads} />

      <Pagination
        currentPage={currentPage}
        totalItems={threads.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default AllThreads;
