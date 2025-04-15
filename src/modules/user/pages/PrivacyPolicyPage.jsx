import React from "react";
import "../styles/PolicyPages.css"

const PrivacyPolicyPage = () => {
  return (
    <div className="policy-page">
      <h1>Chính Sách Bảo Mật</h1>
      <p>
        LÚA - CHỢ NÔNG cam kết bảo vệ thông tin cá nhân của bạn. Chúng tôi thu thập và xử lý thông tin theo đúng quy định pháp luật.
      </p>
      <ul>
        <li>Chúng tôi không chia sẻ thông tin cá nhân của bạn cho bên thứ ba mà không có sự cho phép.</li>
        <li>Dữ liệu được lưu trữ an toàn và chỉ sử dụng cho mục đích phục vụ người dùng.</li>
        <li>Bạn có quyền yêu cầu chỉnh sửa hoặc xóa thông tin bất kỳ lúc nào.</li>
      </ul>
    </div>
  );
};

export default PrivacyPolicyPage;
