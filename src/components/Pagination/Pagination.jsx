import "./Pagination.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    return (
        <div className="product-pagination">
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                {"<"}
            </button>
            <span>Trang {currentPage} / {totalPages}</span>
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                {">"}
            </button>
        </div>
    );
};

export default Pagination;
