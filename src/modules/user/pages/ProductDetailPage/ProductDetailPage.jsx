import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import ProductDetail from "../../components/ProductDetail/ProductDetail";
import toSlug from "../../../../utils/toSlug";

function ProductDetailPage() {
  const { productSlug } = useParams();
  const [product, setProduct] = useState();
  const [seller, setSeller] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [productId, ...productNameArray] = productSlug.split("-");
  const productNameSlug = productNameArray.join("-");
  const [sellerAddress, setSellerAddress] = useState(null);
  const fetchProduct = async (productId, productSlug) => {
    try {
        const res = await fetch(`https://kltn.azurewebsites.net/api/Products/${productId}`);
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm");
        const data = await res.json();
        const imagesRes = await fetch("https://kltn.azurewebsites.net/api/product-images/list-by-products", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify([productId]), // chỉ 1 ID
        });

        const imagesData = await imagesRes.json();

        // Gộp ảnh vào sản phẩm
        const productWithImages = {
            ...data,
            imageUrls: imagesData[data.id]?.map((img) => img.imageUrl) || [],
        };
        setProduct(productWithImages);
      // if (!res.ok) throw new Error("Không thể tải sản phẩm");
      // const data = await res.json();
      
      // const found = data.find(
      //   (p) =>
      //     p.id.toString() === productId 
      //   &&
      //     toSlug(p.name) === productSlug
      // );

      if (!data) throw new Error("Không tìm thấy sản phẩm");
      fetchSeller(data.shopId);
    } catch (err) {
      setError(err.message);
    }
  };
    const handleRate = async (rating) => {
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
            alert("Vui lòng đăng nhập để đánh giá.");
            return;
        }

        try {
            const res = await fetch(``, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify({ rating }),
            });

            if (!res.ok) throw new Error(await res.text());

            alert("✅ Cảm ơn bạn đã đánh giá!");
            // Có thể gọi lại API để load rating mới
        } catch (err) {
            console.error("❌ Lỗi khi gửi đánh giá:", err.message);
            alert("Đánh giá thất bại.");
        }
    };
  const fetchSeller = async (sellerId) => {
    try {
      const res = await fetch("https://kltn.azurewebsites.net/api/Shops");
      if (!res.ok) throw new Error("Không thể tải nhà cung cấp");
      const data = await res.json();
      const foundSeller = data.find((s) => s.id === sellerId);
      if (!foundSeller) throw new Error("Không tìm thấy nhà cung cấp");
      setSeller(foundSeller);
    } catch (err) {
      setError(err.message);
    }
  };
  const fetchSellerAddress = async (sellerId) => {
    try {
      const res = await fetch(`https://kltn.azurewebsites.net/api/addresses/Shop/${sellerId}`);
      if (!res.ok) throw new Error("Không lấy được địa chỉ");
      const data = await res.json();
      setSellerAddress(data[0]); // ✅ lấy địa chỉ đầu tiên
    } catch (err) {
      console.error(err);
      alert("Lỗi khi tải địa chỉ");
    }
  };

    useEffect(() => {
  if (seller?.id) {
    fetchSellerAddress(seller.id);
  }
}, [seller]);
useEffect(() => {
}, [sellerAddress]);
  useEffect(() => {
    const loadProductAndSeller = async () => {
      if (!productSlug) return;

      setLoading(true);
      setError(null);



      await fetchProduct(productId, productNameSlug);
      setLoading(false);
    };

    loadProductAndSeller();
  }, [productSlug]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Không tìm thấy sản phẩm.</p>;
  if (!seller) return <p>Không tìm thấy nhà cung cấp.</p>;

  return (
    <div>
      <ProductDetail product={product} seller={seller} sellerAddress={sellerAddress} />
    </div>
  );
}

export default ProductDetailPage;
