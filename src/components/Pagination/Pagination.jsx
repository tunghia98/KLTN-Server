import React from "react";
import "./Pagination.css";

const Pagination = ({ currentPage, totalItems, itemsPerPage, onPageChange }) => {
  const pageNumbers = [];
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const range = 2; // Số trang hiển thị xung quanh trang hiện tại

  // Tính toán phạm vi các trang cần hiển thị
  let startPage = Math.max(currentPage - range, 1);
  let endPage = Math.min(currentPage + range, totalPages);

  // Đảm bảo rằng luôn có ít nhất 5 trang hiển thị
  if (endPage - startPage < 4) {
    if (startPage === 1) {
      endPage = Math.min(startPage + 4, totalPages);
    } else {
      startPage = Math.max(endPage - 4, 1);
    }
  }

  // Tạo dãy số trang cần hiển thị
  for (let i = startPage; i <= endPage; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="pagination">
      <button
        className={`pagination-button ${currentPage === 1 ? "disabled" : ""}`}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Hiển thị trang đầu tiên nếu cần */}
      {startPage > 1 && (
        <>
          <button className="pagination-number" onClick={() => onPageChange(1)}>
            1
          </button>
          {startPage > 2 && <span className="pagination-ellipsis">...</span>}
        </>
      )}

      {/* Hiển thị các trang trong phạm vi */}
      {pageNumbers.map((number) => (
        <button
          key={number}
          className={`pagination-number ${currentPage === number ? "active" : ""}`}
          onClick={() => onPageChange(number)}
        >
          {number}
        </button>
      ))}

      {/* Hiển thị trang cuối cùng nếu cần */}
      {endPage < totalPages && (
        <>
          {endPage < totalPages - 1 && <span className="pagination-ellipsis">...</span>}
          <button className="pagination-number" onClick={() => onPageChange(totalPages)}>
            {totalPages}
          </button>
        </>
      )}

      <button
        className={`pagination-button ${currentPage === totalPages ? "disabled" : ""}`}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
