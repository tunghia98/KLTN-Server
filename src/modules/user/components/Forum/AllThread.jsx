import React, { useState} from "react";
import ThreadList from "./ThreadList";
import Pagination from "../../../../components/Pagination/Pagination";
import "./Forum.css";

function AllThreads({ categories, crops, regions }) {
  const [category,setCategory]=useState("");
  const [crop,setCrop]=useState("");
  const [region,setRegion]=useState("");
  const [threads, setThreads] = useState([]);
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const itemsPerPage = 5; // Số lượng chủ đề mỗi trang
  const filteredThreads = threads.filter((thread) => {
    return (
      (category ? thread.category === category : true) &&
      (crop ? thread.crop === crop : true) &&
      (region ? thread.region === region : true)
    );
  });
  const indexOfLastThread = currentPage * itemsPerPage;
  const indexOfFirstThread = indexOfLastThread - itemsPerPage;
  const currentThreads = filteredThreads.slice(indexOfFirstThread, indexOfLastThread);
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };
  return (
    <div className="forum-container">
      <h2 className="forum-title">Tất Cả Chủ Đề</h2>
      <div className="filter-form">
        <label>Phân loại: </label>
        <select onChange={(e) => setCategory(e.target.value)} value={category}>
          <option value="">Tất cả</option>
          {categories.length > 0 ? (
            categories.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))
          ) : (
            <option value="">Chưa có dữ liệu</option>
          )}
        </select>

        <label>Giống cây trồng: </label>
        <select onChange={(e) => setCrop(e.target.value)} value={crop}>
          <option value="">Tất cả</option>
          {crops.length > 0 ? (
            crops.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))
          ) : (
            <option value="">Chưa có dữ liệu</option>
          )}
        </select>

        <label>Khu vực: </label>
        <select onChange={(e) => setRegion(e.target.value)} value={region}>
          <option value="">Tất cả</option>
          {regions.length > 0 ? (
            regions.map((item) => (
              <option key={item.id} value={item.name}>
                {item.name}
              </option>
            ))
          ) : (
            <option value="">Chưa có dữ liệu</option>
          )}
        </select>
      </div>
      
      <ThreadList threads={currentThreads} /> {/* Hiển thị threads của trang hiện tại */}

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredThreads.length}
        itemsPerPage={itemsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
}

export default AllThreads;
