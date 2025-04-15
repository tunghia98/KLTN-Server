// src/utils/toSlug.js
export default function toSlug(str) {
  return str
    .normalize("NFD") // Chuyển chuỗi thành dạng chuẩn Unicode
    .replace(/[\u0300-\u036f]/g, "") // Loại bỏ các dấu thanh
    .toLowerCase() // Chuyển sang chữ thường
    .trim() // Loại bỏ khoảng trắng ở đầu và cuối
    .replace(/đ/g, "d") // Thay chữ "đ" thành "d"
    .replace(/[^a-z0-9\s-]/g, "") // Loại bỏ các ký tự không phải chữ cái, số, khoảng trắng và dấu "-"
    .replace(/\s+/g, "-") // Thay khoảng trắng liên tiếp bằng dấu "-"
    .replace(/-+/g, "-"); // Loại bỏ dấu "-" liên tiếp
}
