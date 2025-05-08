import React, { useState } from "react";
import { useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { faCircleUser, faMagnifyingGlass, faLocationDot, faShoppingCart, faArrowRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import Login from "../AuthForm/Login"; 
import Register from "../AuthForm/Register"; // Import Register
import logo from "../../../../assets/logo-2-gra.png";
import "./Header.css";
import { useUser } from "../../../../contexts/UserContext.jsx";
import { useCart } from "../../../../contexts/CartContext";
import toSlug from "../../../../utils/toSlug.js"; // Import hàm toSlug
import Dropdown from "./Dropdown.jsx";
function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const { user, setUser } = useUser();
    const { cartItems } = useCart();
    const totalProducts = cartItems.length;
  // Hàm chuyển qua trang đăng ký từ đăng nhập
  const handleSwitchToRegister = () => {
    setLoginOpen(false);   // Đóng Login Popup
    setRegisterOpen(true);  // Mở Register Popup
  };

  // Hàm chuyển qua trang đăng nhập từ đăng ký
  const handleSwitchToLogin = () => {
    setRegisterOpen(false);  // Đóng Register Popup
    setLoginOpen(true);      // Mở Login Popup
  };
  const handleLogout = () => {
    localStorage.removeItem("accessToken"); 
    localStorage.removeItem("user"); 
    setUser(null); 
  }
  
  return (
    <header>
      <nav>
        <ul>
          <Link to="/"><img className="header-logo" src={logo} alt="Logo" /></Link>
          <li>
            <div className="header-search">
              <input type="text" className="search-text" />
              <span type="submit" className="search-btn">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </span>
            </div>
          </li>
          <li>
            <div className="header-location">
              <FontAwesomeIcon icon={faLocationDot} className="icon-location" />
              <span><a>Vị trí</a></span>
            </div>
          </li>

          <li>
            <div className="header-login">
              <FontAwesomeIcon icon={faCircleUser} className="icon-login" />
              {user ? (
                <span><Link to="/profile">Thông tin</Link></span>
              ) : (
                <span><Link to="/login" onClick={() => setLoginOpen(true)}>Đăng nhập</Link></span>
              )}
            </div>
          </li>

                  <li>
                      <div className="header-cart">
                          <FontAwesomeIcon icon={faShoppingCart} className="icon-cart" />
                          <span><Link to="/cart">Giỏ hàng</Link></span>
                          {totalProducts > 0 && <span className="cart-badge">{totalProducts}</span>}
                      </div>
                  </li>
          {user ? (
                          <li>
                          <div className="header-logout">
                            <FontAwesomeIcon icon={faArrowRightFromBracket} className="icon-cart" />
                            <span><Link to="/" onClick={handleLogout}>Đăng xuất</Link></span>
                          </div>
                        </li>
              ) : null}

        </ul>
      </nav>

      <div className="sub-header">
        <ul>
        <li className="dropdown">
          <a>Tất cả sản phẩm</a>
            <Dropdown/>
        </li>

          <li><a>Bán chạy</a></li>
          <li><Link to="/forum">Diễn đàn</Link></li>
          <li><a>Chính sách</a></li>
          <li><a>Liên hệ</a></li>
        </ul>
      </div>

      {/* Mở Login Popup */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister} // Truyền hàm chuyển qua đăng ký
      />

      {/* Mở Register Popup */}
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin} // Truyền hàm chuyển qua đăng nhập
      />
    </header>
  );
}

export default Header;
