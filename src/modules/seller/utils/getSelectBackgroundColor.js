const getSelectBackgroundColor = (status) => {
  switch (status) {
    case "Đang giao":
      return "#ffec99"; // Màu vàng nhạt
    case "Đã giao":
      return "#a5e6a5"; // Màu xanh lá nhạt
    case "Đã xác nhận":
      return "#99ccff"; // Màu xanh dương nhạt
    case "Đã huỷ":
      return "#f8d7da"; // Màu đỏ nhạt
    case "Khả dụng":
      return "green"; // Màu xanh lá nhạt
    case "Tạm ẩn":
      return "red"; // Màu đỏ nhạt
    default:
      return "#fff"; // Màu mặc định
  }
};
export default getSelectBackgroundColor;
