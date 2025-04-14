import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate, Link } from "react-router-dom";
import { faCircleUser, faMagnifyingGlass, faLocationDot, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import Login from "../AuthForm/Login"; 
import Register from "../AuthForm/Register";
import logo from "../../assets/logo-2-gra.png";
import "./Header.css";
import { useUser } from "../../contexts/UserContext.jsx";

function Header() {
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isRegisterOpen, setRegisterOpen] = useState(false);
  const { user } = useUser();

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
                <span><Link to="/profile">Sửa thông tin</Link></span>
              ) : (
                <span><a href="#" onClick={() => setLoginOpen(true)}>Đăng nhập</a></span>
              )}
            </div>
          </li>

          <li>
            <div className="header-cart">
              <FontAwesomeIcon icon={faShoppingCart} className="icon-cart" />
              <span><Link to="/cart">Giỏ hàng</Link></span>
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
