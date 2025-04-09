import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from "react-router-dom";
import { faCircleUser, faMagnifyingGlass, faLocationDot, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import Login from "../AuthForm/Login"; 
import logo from "../../assets/logo-2-gra.png";
import Register from "../AuthForm/Register"; // Import PopupLogin
import "./Header.css";

function Header() {
    const [isLoginOpen, setLoginOpen] = useState(false);
    const [isRegisterOpen, setRegisterOpen] = useState(false);
  
    return (
      <header>
        <nav>
          <ul>
            <Link to="/"><img className="header-logo" src={logo} alt="Logo"  /></Link>
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
                <span><a href="#" onClick={() => setLoginOpen(true)}>Đăng nhập</a></span>
              </div>
            </li>
            <li>
              <div className="header-cart">
                <FontAwesomeIcon icon={faShoppingCart} className="icon-cart" />
                <span><a>Giỏ hàng</a></span>
              </div>
            </li>
          </ul>
        </nav>
  
        <div className="sub-header">
          <ul>
            <li><a>Tất cả sản phẩm</a></li>
            <li><a>Bán chạy</a></li>
            <li><a>Diễn đàn</a></li>
            <li><a>Chính sách</a></li>
            <li><a>Liên hệ</a></li>
          </ul>
        </div>
  
        {/* Popups */}
        <Login
            isOpen={isLoginOpen}
            onClose={() => setLoginOpen(false)}
            onSwitchToRegister={() => setRegisterOpen(true)}
        />

        <Register
            isOpen={isRegisterOpen}
            onClose={() => setRegisterOpen(false)}
            onSwitchToLogin={() => setLoginOpen(true)}
        />
      </header>
    );
  }
  
  export default Header;