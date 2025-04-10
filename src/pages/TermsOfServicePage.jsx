import React from "react";
import "../styles/PolicyPages.css"

const TermsOfServicePage = () => {
  return (
    <div className="policy-page">
      <h1>Điều Khoản Sử Dụng</h1>
      <p>
        Chào mừng bạn đến với LÚA - CHỢ NÔNG. Khi sử dụng trang web này, bạn đồng ý tuân thủ các điều khoản và điều kiện sau:
      </p>
      <ul>
        <li>Chúng tôi không chịu trách nhiệm cho bất kỳ giao dịch nào giữa người mua và người bán.</li>
        <li>Người bán tự chịu trách nhiệm về sản phẩm và dịch vụ mà họ cung cấp.</li>
        <li>Chúng tôi có quyền khóa tài khoản người bán nếu phát hiện vi phạm về chất lượng sản phẩm hoặc hành vi gian lận.</li>
        <li>Không được sử dụng website cho mục đích trái pháp luật.</li>
      </ul>
    </div>
  );
};

export default TermsOfServicePage;
