import React from "react";
import "../styles/PolicyPages.css"

const WarrantyPolicyPage = () => {
  return (
    <div className="policy-page">
      <h1>Chính Sách Bảo Hành</h1>
      <p>
        LÚA - CHỢ NÔNG không trực tiếp bảo hành sản phẩm. Mọi chính sách bảo hành do người bán cung cấp. Tuy nhiên, chúng tôi có hệ thống phản hồi để xử lý các khiếu nại về chất lượng sản phẩm.
      </p>
      <ul>
        <li>Nếu sản phẩm không đúng mô tả, bạn có thể phản hồi và báo cáo với chúng tôi.</li>
        <li>Chúng tôi sẽ kiểm tra và xử lý nhanh chóng trong vòng 48 giờ làm việc.</li>
        <li>Nếu người bán vi phạm nhiều lần, tài khoản sẽ bị khóa vĩnh viễn.</li>
      </ul>
    </div>
  );
};

export default WarrantyPolicyPage;
