import { Button } from "@mui/material";
import "./Achievements.css";

type ItemType = {
  name: string;
  imageUrl: string;
};
  
const ItemCard = ({ name, imageUrl }: ItemType) => {
  return (
    <div className="achievements-item">
      <div className="item-title">{name}</div>
      <img src={imageUrl} alt={name} style={{ width: "100%", height: "150px", objectFit: "cover" }} />
      <p className="coming-soon">Coming soon</p>
      <Button variant="outlined" disabled onClick={() => { console.log("Click"); }} className="buy-button">
        Mint NFT
      </Button>
    </div>
  );
};

const Achievements = () => {
  const itemsForSale = [
    { name: "Pioneer Settler", imageUrl: "/achievements/early-bird.png" },
    { name: "Military Victory", imageUrl: "/achievements/military-victory.png" },
  ];
  
  return (
    <div style={{ padding: "20px" }}>
      <div className="achievements-items-row">
        {itemsForSale.map((item) => (
          <ItemCard key={item.name} name={item.name} imageUrl={item.imageUrl} />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
