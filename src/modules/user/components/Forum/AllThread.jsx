import React, { useState, useEffect } from "react";
import ThreadList from "./ThreadList";
import Pagination from "../../../../components/Pagination/Pagination";
import ForumSearchFilter from "./ForumSearchFilter";
import "./Forum.css";

const AllThreads = ({ allthreads, categories, crops, regions }) => {
  const [category, setCategory] = useState(null); // categoryId (number)
  const [crop, setCrop] = useState(null);         // cropId (number)
  const [region, setRegion] = useState(null);     // regionId (number)
  const [threads, setThreads] = useState(allthreads || []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const itemsPerPage = 8;

  useEffect(() => {
    setThreads(allthreads || []);
  }, [allthreads]);

  useEffect(() => {
    filterThreads();
  }, [category, crop, region, searchKeyword, allthreads]);

  const filterThreads = () => {
    const keyword = searchKeyword.toLowerCase().trim();

    const filtered = allthreads.filter((thread) => {
      const matchesCategory = category ? thread.categoryId === Number(category) : true;
      const matchesCrop = crop ? thread.cropId === Number(crop) : true;
      const matchesRegion = region ? thread.regionId === Number(region) : true;
      const matchesKeyword = keyword
        ? (thread.title?.toLowerCase().includes(keyword))
        : true;

      return matchesCategory && matchesCrop && matchesRegion && matchesKeyword;
    });

    setThreads(filtered);
    setCurrentPage(1); // Reset page when filters change
  };

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
