import React,{useStat} from 'react';
import logo from "../../../../assets/logo-footer.png";
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../../../contexts/UserContext';
import Login from "../AuthForm/Login.jsx"
import './Footer.css';

function Footer() {
    const navigate = useNavigate();
    const { isLoggedIn } = useUser();
    const handleClick = () => {
        if (isLoggedIn) {
          navigate("/onboarding");
        } else {
          navigate("/login");
        }
      };
    return (
        <footer>
            <div className="footer-detail">
                <div className="footer-grid-container">
                    <div className="grid-item-logo">
                        <Link to="/"><img className="logo-footer" src={logo} alt="Logo" /></Link>
                    </div>

                    <div className="grid-item-service-customer">
                        <h4 className="title">DỊCH VỤ KHÁCH HÀNG</h4>
                        <ul>
                            <li><Link to="/">Trang chủ</Link></li>
                            <li><Link to="/forum">My Farm Forum</Link></li>
                            <li><Link to="/huong-dan">Hướng dẫn mua hàng, đặt hàng</Link></li>
                            <li><Link to="/mua-hang">Mua hàng</Link></li>
                            <li><Link to="/don-hang">Đơn hàng</Link></li>
                            <li><Link to="/tra-hang">Trả hàng, hoàn tiền</Link></li>
                            <li><Link to="/contact">Liên hệ LÚA</Link></li>
                            <li><Link to="/warranty-policy">Chính sách bảo hành</Link></li>
                        </ul>
                    </div>

                    <div className="grid-item-about">
                        <h4 className="title">LÚA - CHỢ NÔNG</h4>
                        <ul>
                            <li><Link to="/about">Giới thiệu</Link></li>
                            <li><Link to="/terms-of-service">Điều khoản</Link></li>
                            <li><Link to="/privacy-policy">Chính sách bảo mật</Link></li>
                            <li onClick={handleClick}>Kênh người bán</li>
                            <li><Link to="/discounts">Giảm giá</Link></li>
                            <li><Link to="/partnership">Liên hệ hợp tác</Link></li>
                        </ul>
                    </div>

                    <div className="grid-item-payment-shipping">
                        <h4 className="title">HÌNH THỨC THANH TOÁN</h4>
                        <div className="payment-method">
                            COD
                        </div>
                        <h4 className="title">ĐƠN VỊ VẬN CHUYỂN</h4>
                        <div className="shipping-company">
                            {/* Logo hoặc tên đơn vị vận chuyển */}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
