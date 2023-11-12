import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { useWallet } from "@solana/wallet-adapter-react";
import { useWorkspace } from "../../context/AnchorContext";
import "./Achievements.css";

type ItemType = {
  name: string;
  description: string;
  rarity: string;
  imageUrl: string;
  id: number;
};

const Achievements = () => {
  const { wallet } = useWallet();
  const workspace = useWorkspace();

  async function claimAchievement(id: number): Promise<boolean> {
    if (!wallet?.adapter.publicKey) {
      toast.error("You need to connect your wallet");
      return false;
    }
    try {
      const address = wallet?.adapter.publicKey.toBase58();
      const burner = workspace.provider?.publicKey.toBase58();
      const response = await fetch("https://api.solciv.com/claim-achievement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, burner, address }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.success;
      } else {
        toast.error("Something went wrong");
        return false;
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Something went wrong");
      return false;
    }
  }

  const ItemCard = ({ id, name, description, rarity, imageUrl }: ItemType) => {
    return (
      <div className="achievements-item">
        <div className="item-title">{name}</div>
        <img src={imageUrl} alt={name} style={{ width: "100%", objectFit: "cover" }} />
        <p className="item-description">{description}</p>
        <Button
          variant="outlined"
          onClick={async () => {
            const result = await claimAchievement(id);
            console.log(result);
          }}
          className="buy-button"
        >
          Mint NFT
        </Button>
      </div>
    );
  };

  const achievements = [
    {
      name: "Pioneer Settler",
      description:
        "This legendary achievement is exclusive to the first 1,000 players of Solciv. Build two cities to unlock!",
      rarity: "Legendary",
      imageUrl: "/achievements/early-bird.png",
      id: 1,
    },
    {
      name: "One of us",
      description: "Available to early followers. Unlock this achievement by joining our legion on Twitter.",
      rarity: "Common",
      imageUrl: "/achievements/twitter.png",
      id: 3,
    },
    {
      name: "Military Victory",
      description:
        "You chose the path of chaos and annihilated all your enemies. Achieve victory in the demo by defeating the barbarians.",
      rarity: "Common",
      imageUrl: "/achievements/military-victory.png",
      id: 2,
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <div className="achievements-items-row">
        {achievements.map((item) => (
          <ItemCard
            key={item.name}
            name={item.name}
            rarity={item.rarity}
            description={item.description}
            imageUrl={item.imageUrl}
            id={item.id}
          />
        ))}
      </div>
    </div>
  );
};

export default Achievements;
