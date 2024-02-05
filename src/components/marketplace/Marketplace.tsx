import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import "./Marketplace.css";

type ItemType = {
  assetName: string;
  imageUrl: string;
  price: number;
};

const ItemCard = ({ assetName, imageUrl, price }: ItemType) => {
  return (
    <div className="store-item">
      <div className="item-title">{assetName}</div>
      <img src={imageUrl} alt={assetName} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      {price !== 0 && (
        <Button
          variant="outlined"
          onClick={() => {
            toast.warning("Coming soon");
          }}
          className="buy-button"
        >
          {price} gems
        </Button>
      )}
      {price === 0 && <p className="coming-soon">Coming soon</p>}
    </div>
  );
};

const Marketplace = () => {
  const itemsForSale = [
    { assetName: "Small Lootbox", imageUrl: "/misc/lootbox_sm.png", price: 10 },
    { assetName: "Large Lootbox", imageUrl: "/misc/lootbox_lg.png", price: 150 },
    { assetName: "Whitelist", imageUrl: "/misc/scroll.png", price: 200 },
    { assetName: "Texture Pack", imageUrl: "/misc/texturepack.png", price: 0 },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div className="store-items-row">
        {itemsForSale.map((item) => (
          <ItemCard key={item.assetName} assetName={item.assetName} imageUrl={item.imageUrl} price={item.price} />
        ))}
      </div>
    </div>
  );
};

export default Marketplace;
