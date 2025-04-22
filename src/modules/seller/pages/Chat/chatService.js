export async function getMessages() {
  // Giả lập API lấy tin nhắn
  return [
    {
      id: 1,
      senderName: "Nguyễn Thị A",
      content: "Chào, sản phẩm này có hỗ trợ bảo hành không?",
      isBuyer: true,
    },
    {
      id: 2,
      senderName: "Cửa hàng",
      content: "Chúng tôi có bảo hành 12 tháng cho sản phẩm này.",
      isBuyer: false,
    },
  ];
}

export async function sendMessage(content) {
  // Giả lập API gửi tin nhắn
  console.log("Gửi tin nhắn:", content);
}
