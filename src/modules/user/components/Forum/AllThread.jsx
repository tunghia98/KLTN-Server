import React, { useState, useEffect } from "react";
import ThreadList from "./ThreadList";
import Pagination from "../../../../components/Pagination/Pagination";
import "./Forum.css";

const AllThreads = ({ allthreads, categories, crops, regions }) => {
  const [category, setCategory] = useState(null); // categoryId (number)
  const [crop, setCrop] = useState(null);         // cropId (number)
  const [region, setRegion] = useState(null);     // regionId (number)
  const [threads, setThreads] = useState(allthreads || []);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    setThreads(allthreads || []);
  }, [allthreads]);

  useEffect(() => {
    filterThreads();
  }, [category, crop, region, allthreads]);

  const filterThreads = () => {
    const filtered = allthreads.filter((thread) => {
      return (
        (category ? thread.categoryId === Number(category) : true) &&
        (crop ? thread.cropId === Number(crop) : true) &&
        (region ? thread.regionId === Number(region) : true)
      );
    });
    setThreads(filtered);
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setCategory(value);
    setCurrentPage(1);
  };

  const handleCropChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setCrop(value);
    setCurrentPage(1);
  };

  const handleRegionChange = (e) => {
    const value = e.target.value ? Number(e.target.value) : null;
    setRegion(value);
    setCurrentPage(1);
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
      <div className="filter-form">
        <label>Phân loại: </label>
        <select onChange={handleCategoryChange} value={category || ""}>
          <option value="">Tất cả</option>
          {categories?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <label>Giống cây trồng: </label>
        <select onChange={handleCropChange} value={crop || ""}>
          <option value="">Tất cả</option>
          {crops?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>

        <label>Khu vực: </label>
        <select onChange={handleRegionChange} value={region || ""}>
          <option value="">Tất cả</option>
          {regions?.map((item) => (
            <option key={item.id} value={item.id}>{item.name}</option>
          ))}
        </select>
      </div>

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
