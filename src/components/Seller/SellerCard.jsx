import "./SellerCard.css";

function SellerCard({ seller }) { // Nhận đúng object seller
  if (!seller || !seller.seller || seller.seller.length === 0) {
    return <p>Không có người bán nào</p>;
  }

  return (
    <div className="SellerCard">
      {seller.seller.map((item) => (
        <div key={item.id} className="seller-card">
          <img className="seller-image" src={item.image} alt={item.name} />
          <h3 className="seller-name">{item.name}</h3>
          <h4 className="seller-address">{item.address}</h4>
        </div>
      ))}
    </div>
  );
}

export default SellerCard;
