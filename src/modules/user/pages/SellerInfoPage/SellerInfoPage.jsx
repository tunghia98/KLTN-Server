import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ProductCard from "../../components/ProductCard/ProductCard";
import Pagination from "../../../../components/Pagination/Pagination";
import "./SellerInfoPage.css";
import { Autocomplete, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
const SellerPage = () => {
  const { sellerSlug } = useParams();
  const [seller, setSeller] = useState(null);
  const [sellerProducts, setSellerProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);  // New state for categories
  const [selectedCategory, setSelectedCategory] = useState("all");  // New state for selected category
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedSort, setSelectedSort] = useState("default");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sellerAddress, setSellerAddress] = useState(null);
  const [owner, setOwner] = useState(null);
  const productsPerPage = 12;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

  const [sellerId, ...sellerNameArray] = sellerSlug.split("-");
  const sellerNameSlug = sellerNameArray.join("-");
  const categoryOptions = [{ label: "Tất cả danh mục", value: "all" }, ...categories.map(c => ({ label: c, value: c }))];
    const brandOptions = [{ label: "Tất cả nhãn hiệu", value: "all" }, ...brands.map(b => ({ label: b, value: b }))];

    const selectedCategoryOption = categoryOptions.find(opt => opt.value === selectedCategory) || categoryOptions[0];
    const selectedBrandOption = brandOptions.find(opt => opt.value === selectedBrand) || brandOptions[0];
  // Fetch Seller Information
  const fetchSeller = async (sellerId) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/Shops/${sellerId}`);
      if (!res.ok) throw new Error("Không thể tải nhà cung cấp");
      const data = await res.json();
      if (!data) throw new Error("Không tìm thấy nhà cung cấp");
      setSeller(data);

    } catch (err) {
      setError(err.message);
    }
  };

    const fetchSellerProducts = async () => {
        try {
            setLoading(true);

            // 1. Fetch products, categories, brands song song
            const [productRes, categoryRes, brandRes] = await Promise.all([
                fetch(`https://kltn.azurewebsites.net/api/Products/by-shop/${sellerId}`),
                fetch(`https://kltn.azurewebsites.net/api/Categories/by-shop/${sellerId}`),
                fetch(`https://kltn.azurewebsites.net/api/Categories/brands/by-shop/${sellerId}`),
            ]);

            if (!productRes.ok || !categoryRes.ok || !brandRes.ok) {
                throw new Error("Không thể tải dữ liệu");
            }

            const products = await productRes.json();
            const categories = await categoryRes.json();
            const brandNames = await brandRes.json(); // ["AgriTool", "Adidas", "Nike"]

            const brands = brandNames.map((name, index) => ({
                id: index + 1,        // hoặc dùng index nếu không có ID thực
                name,
            }));
            // 2. Lấy danh sách productIds để fetch ảnh
            const productIds = products.map(p => p.id);

            // 3. Fetch hình ảnh cho các productIds (POST)
            const imagesRes = await fetch('https://kltn.azurewebsites.net/api/product-images/list-by-products', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    // Nếu cần token, thêm header Authorization ở đây
                },
                body: JSON.stringify(productIds),
            });

            if (!imagesRes.ok) throw new Error("Lỗi tải hình ảnh sản phẩm");

            const imagesData = await imagesRes.json();

            // 4. Ghép ảnh vào từng sản phẩm
            const productsWithImages = products.map(product => ({
                ...product,
                imageUrls: imagesData[product.id]?.map(img => img.imageUrl) || []
            }));

            // 5. Set state
            setSellerProducts(productsWithImages);
            setFilteredProducts(productsWithImages);
            setCategories(categories.map(c => c.name));
            setBrands(brands.map(b => b.name)); // Giả sử API trả object brand, map lấy name
        } catch (err) {
            setError(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };
    const fetchSellerAddress = async (sellerId) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/addresses/Shop/${sellerId}`);
      if (!res.ok) throw new Error("Không lấy được địa chỉ");
      const data = await res.json();
      setSellerAddress(data[0]); // ✅ lấy địa chỉ đầu tiên
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải địa chỉ");
    }
    };
      useEffect(() => {
    if (seller?.id) {
      fetchSellerAddress(seller.id);
    }
  }, [seller]);
    const fetchOwner = async (ownerId) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/users/${ownerId}`);
      if (!res.ok) throw new Error("Không thể tải thông tin người dùng");
      const data = await res.json();
      setOwner(data);
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải thông tin người dùng");
    }
  };
  useEffect(() => {
    if (seller?.ownerId) {
      fetchOwner(seller.ownerId);
    }
  }, [seller]);
  // Fetch Brands and Categories from Products
  //const fetchBrandsAndCategories = () => {
  //  const uniqueBrands = [...new Set(sellerProducts.map((product) => product.brand))];
  //  const uniqueCategories = [...new Set(sellerProducts.map((product) => product.category))];  // Extract categories
  //  setBrands(uniqueBrands);
  //  setCategories(uniqueCategories);  // Set categories
  //};

  useEffect(() => {
    fetchSeller(sellerId);
    fetchSellerProducts();
  }, [sellerId]);

  //useEffect(() => {
  //  fetchBrandsAndCategories();
  //}, [sellerProducts]);

  // Handle Filter Changes
  const handleCategoryFilterChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleBrandFilterChange = (e) => {
    setSelectedBrand(e.target.value);
  };

  const handleSortChange = (e) => {
    setSelectedSort(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchKeyword(e.target.value);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  // Apply Filters and Sorting
  useEffect(() => {
    let filtered = [...sellerProducts];

    // Lọc theo danh mục (category)
      if (selectedCategory !== "all") {
          filtered = filtered.filter((product) => product.categoryName === selectedCategory);
      }

    // Lọc theo từ khóa tìm kiếm
    if (searchKeyword.trim() !== "") {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchKeyword.toLowerCase())
      );
    }

    // Lọc theo nhãn hiệu
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    // Sắp xếp
    if (selectedSort !== "default") {
      if (selectedSort === "bestseller") {
        filtered = filtered.sort((a, b) => b.sold - a.sold);
      }
      if (selectedSort === "price-high") {
        filtered = filtered.sort((a, b) => b.price - a.price);
      }
      if (selectedSort === "price-low") {
        filtered = filtered.sort((a, b) => a.price - b.price);
      }
    }

    setFilteredProducts(filtered);
  }, [selectedCategory, selectedBrand, selectedSort, searchKeyword, sellerProducts]);
    const handleCreateConversation = async () => {
        const accessToken = localStorage.getItem("accessToken");
        setLoading(true);
        try {
            const res = await fetch("https://kltn.azurewebsites.net/api/conversations/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`
                },
                body: JSON.stringify({ UserBId: seller.ownerId }),
            });
            if (!res.ok) {
                const error = await res.text();
                alert("Lỗi tạo cuộc trò chuyện: " + error);
                return;
            }
            const data = await res.json();
            navigate(`/profile`);
            alert("Tạo cuộc trò chuyện thành công!");
        } catch (err) {
            alert("Lỗi mạng hoặc server.");
        } finally {
            setLoading(false);
        }
    };

  return (
    <div className="seller-page">
      <div className="seller-info">
        <img
          src={
            seller?.avatarUrl
              ? `https://kltn.azurewebsites.net/api/Shops/shop-avatar/${seller.avatarUrl}`
              : "https://kltn.azurewebsites.net/api/Shops/shop-avatar/default.png"
          }
          alt={seller?.name || "Shop"}
        />
        <div className="seller-info-details">
          <div>
            <h3>{seller?.name}</h3>
            <p>{sellerAddress?.district+", "+sellerAddress?.province}</p>
            <p>{owner?.phoneNumber}</p>
          </div>
                  <button className="contact-button" onClick={handleCreateConversation} disabled={loading}>
                      {loading ? "Đang tạo..." : "Tư Vấn"}
                  </button>
          <p>Đây là trang của người bán chuyên cung cấp sản phẩm nông nghiệp chất lượng cao.</p>
        </div>
      </div>

      <div className="seller-filters">
        <div className="filter-item">
                  <div className="filter-item">
                      <label htmlFor="category">Lọc theo danh mục: </label>
                      <Autocomplete
                          options={categoryOptions}
                          getOptionLabel={(option) => option.label}
                          value={selectedCategoryOption}
                          onChange={(event, newValue) => {
                              setSelectedCategory(newValue ? newValue.value : "all");
                          }}
                          isOptionEqualToValue={(option, value) => option.value === value.value}
                          renderInput={(params) => (
                              <TextField {...params} label="Chọn danh mục" variant="outlined" size="small" />
                          )}
                          style={{ width: 250 }}
                      />
                  </div>

        </div>

              <div className="filter-item">
                  <label htmlFor="brand">Lọc theo nhãn hiệu: </label>
                  <Autocomplete
                      options={brandOptions}
                      getOptionLabel={(option) => option.label}
                      value={selectedBrandOption}
                      onChange={(event, newValue) => {
                          setSelectedBrand(newValue ? newValue.value : "all");
                      }}
                      isOptionEqualToValue={(option, value) => option.value === value.value}
                      renderInput={(params) => (
                          <TextField {...params} label="Chọn nhãn hiệu" variant="outlined" size="small" />
                      )}
                      style={{ width: 250 }}
                  />
              </div>

        <div className="filter-item">
          <label htmlFor="sort">Sắp xếp: </label>
          <select id="sort" value={selectedSort} onChange={handleSortChange}>
            <option value="default">Chọn sắp xếp</option>
            <option value="bestseller">Bán chạy nhất</option>
            <option value="price-high">Giá cao đến thấp</option>
            <option value="price-low">Giá thấp đến cao</option>
          </select>
        </div>

        <div className="search-bar">
          <input
            type="text"
            placeholder="Tìm sản phẩm theo tên..."
            value={searchKeyword}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="seller-products">
        <h2>Sản phẩm đang bán</h2>
        <div className="product-grid">
          {filteredProducts.length === 0 ? (
            <p>Không có sản phẩm nào phù hợp với bộ lọc của bạn</p>
          ) : (
            currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredProducts.length}
        itemsPerPage={productsPerPage}
        onPageChange={handlePageChange}
      />
    </div>
  );
};

export default SellerPage;
