import React from 'react'
import logo from "../../assets/logo-2-gra.png";
import { Link } from 'react-router-dom';
import "../../styles/global.css"
import './Footer.css'

function Footer(){
return (
    <footer>
        <div className="footer-detail">
            <div class="footer-grid-container">
                <div class="grid-item-logo">
                    <Link to="/"><img className="logo-footer" src={logo}></img></Link>
                </div>
                <div class="grid-item-service-customer">
                    <h4 className='title'>DỊCH VỤ KHÁCH HÀNG</h4>
                    <ul>
                        <li>Trang chủ</li>
                        <li>My Farm Forum</li>
                        <li>Hướng dẫn mua hàng, đặt hàng</li>
                        <li>Mua hàng</li>
                        <li>Đơn hàng</li>
                        <li>Trả hàng, hoàn tiền</li>
                        <li>Liên hệ My Farm</li>
                        <li>Chính sách bảo hành</li>
                    </ul>
                </div>
                <div class="grid-item-about">
                    <h4 className='title'>MY FARM</h4>
                    <ul>
                        <li>Về My Farm</li>
                        <li>Điều khoản</li>
                        <li>Chính sách bảo mật</li>
                        <li>Kênh người bán</li>
                        <li>Giảm giá</li>
                        <li>Liên hệ hợp tác</li>
                    </ul>
                </div>
                <div class="grid-item-payment-shipping">
                    <h4 className='title'>HÌNH THỨC THANH TOÁN</h4>
                    <div className='payment-method'>
                        COD
                    </div>
                    <h4 className='title'>ĐƠN VỊ VẬN CHUYỂN</h4>
                    <div className='shipping-company'></div>
                </div>
            </div>
        </div>
    </footer>
);
};
export default Footer