export async function getProductReviews() {
  // Giả lập API lấy đánh giá sản phẩm
  return [
    {
      id: 1,
      productName: "Sản phẩm A",
      reviewContent: "Sản phẩm tuyệt vời!",
      rating: 5,
      reviewerName: "Nguyễn Văn A",
    },
    {
      id: 2,
      productName: "Sản phẩm B",
      reviewContent: "Chất lượng ổn.",
      rating: 3,
      reviewerName: "Nguyễn Thị B",
    },
  ];
}

export async function getOrderReviews() {
  // Giả lập API lấy đánh giá đơn hàng
  return [
    {
      id: 1,
      orderId: "ĐH123",
      reviewContent: "Giao hàng nhanh chóng.",
      rating: 4,
      reviewerName: "Nguyễn Văn C",
    },
    {
      id: 2,
      orderId: "ĐH124",
      reviewContent: "Hàng bị lỗi.",
      rating: 2,
      reviewerName: "Nguyễn Thị D",
    },
  ];
}
