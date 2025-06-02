import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import {
  faCircleUser,
  faMagnifyingGlass,
  faLocationDot,
  faShoppingCart,
  faArrowRightFromBracket,
  faBars,
  faShop,
} from "@fortawesome/free-solid-svg-icons";
import Login from "../AuthForm/Login";
import Register from "../AuthForm/Register";
import logo from "../../../../assets/logo-2-gra.png";
import "./Header.css";
import { useUser } from "../../../../contexts/UserContext.jsx";
import { useCart } from "../../../../contexts/CartContext";

function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { user, setUser } = useUser();
  const { cartItems } = useCart();
  const totalProducts = cartItems.length;

  const handleSwitchToRegister = () => {
    setLoginOpen(false);
    setRegisterOpen(true);
  };

  const handleSwitchToLogin = () => {
    setRegisterOpen(false);
    setLoginOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("user");
    setUser(null);
  };
  return (
    <header className="header">
      {/* Main Nav */}
      <nav className="main-nav">
        <div className="nav-left">
          <Link to="/">
            <img className="header-logo" src={logo} alt="Logo" />
          </Link>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
        >
          <FontAwesomeIcon icon={faBars} />
        </button>

        <div className={`nav-right ${isMobileMenuOpen ? "open" : ""}`}>
          <div className="header-search">
            <input type="text" className="search-text" />
            <span className="search-btn">
              <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
          </div>

          <div className="header-location">
            <FontAwesomeIcon icon={faLocationDot} className="icon-location" />
            <Link to="/location-map">Vị trí</Link>
          </div>

          <div className="header-login">
            <FontAwesomeIcon icon={faCircleUser} className="icon-login" />
            {user ? (
              <Link to="/profile">Thông tin</Link>
            ) : (
              <Link to="/login" onClick={() => setLoginOpen(true)}>
                Đăng nhập
              </Link>
            )}
          </div>

          <div className="header-cart">
            <FontAwesomeIcon icon={faShoppingCart} className="icon-cart" />
            <Link to="/cart">Giỏ hàng</Link>
            {totalProducts > 0 && (
              <span className="cart-badge">{totalProducts}</span>
            )}
          </div>
          {user && user.role === "seller" && (
            <div className="header-cart">
              <FontAwesomeIcon icon={faShop} className="icon-cart" />
              <Link to="/seller/dashboard">Cửa hàng</Link>
            </div>
          )}
          {user && user.role === "admin" && (
            <div className="header-cart">
              <FontAwesomeIcon icon={faShop} className="icon-cart" />
              <Link to="/admin/dashboard">Quản trị</Link>
            </div>
          )}

          {user && (
            <div className="header-logout">
              <FontAwesomeIcon
                icon={faArrowRightFromBracket}
                className="icon-cart"
              />
              <Link to="/" onClick={handleLogout}>
                Đăng xuất
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Submenu */}
      <div className={`sub-header ${isMobileMenuOpen ? "open" : ""}`}>
        <ul>
          <li>
            <Link to="/products">Tất cả sản phẩm</Link>
          </li>
          <li>
            <a>Bán chạy</a>
          </li>
          <li>
            <Link to="/forum">Diễn đàn</Link>
          </li>
          <li>
            <a>Chính sách</a>
          </li>
          <li>
            <a>Liên hệ</a>
          </li>
        </ul>
      </div>

      {/* Login/Register popup */}
      <Login
        isOpen={isLoginOpen}
        onClose={() => setLoginOpen(false)}
        onSwitchToRegister={handleSwitchToRegister}
      />
      <Register
        isOpen={isRegisterOpen}
        onClose={() => setRegisterOpen(false)}
        onSwitchToLogin={handleSwitchToLogin}
      />
    </header>
  );
}

export default Header;
