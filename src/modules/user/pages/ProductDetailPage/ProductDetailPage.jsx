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
      <ProductDetail product={product} seller={seller} />
    </div>
  );
}

export default ProductDetailPage;
