import React from "react";
import { useEffect } from "react";

export default function ThreadTagManager() {
    const [categories, setCategories] = React.useState([]);
     useEffect(() => {
        const fetchCategories = async () => {
          try {
              const res = await fetch("https://kltn.azurewebsites.net/api/categoryforums");
            if (!res.ok) throw new Error("Lỗi tải danh mục");
            const data = await res.json();
            setCategories(data);
          } catch (error) {
            console.error("Lỗi lấy danh mục:", error);
          }
        };
        fetchCategories();
      }, []);
    
  return (
    <div>
      <h2>Tùy chỉnh thẻ bài viết</h2>
      {/* Bạn có thể thêm form quản lý thẻ ở đây sau */}
      <p>Chức năng tùy chỉnh thẻ sẽ được phát triển.</p>
    </div>
  );
}
