import React from "react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faHammer } from "@fortawesome/free-solid-svg-icons";
import { foundCity, upgradeLandPlot } from "../utils/solanaUtils";
import { useWorkspace } from "../context/AnchorContext";
import { useGameState } from "../context/GameStateContext";
import { useSound } from "../context/SoundContext";

interface UnitInfoProps {
  unit: {
    x: number;
    y: number;
    unitId: number;
    type: string;
    movementRange: number;
    health: number;
    builds?: number;
    strength?: number;
  };
}

const UnitInfoWindow: React.FC<UnitInfoProps> = ({ unit }) => {
  const { program, provider } = useWorkspace();
  const { fetchPlayerState } = useGameState();
  const { playSound } = useSound();
  const { type, movementRange, builds, strength } = unit;
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);

  const handleFoundCity = async (x: number, y: number, unitId: number) => {
    const unit = { x, y, unitId };
    try {
      const tx = foundCity(provider!, program!, unit);
      const signature = await toast.promise(tx, {
        pending: "Founding a city",
        success: "City founded",
        error: "Error founding city",
      });
      if (typeof signature === "string") {
        playSound("construction");
        console.log(`Found a city TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      console.log("Error founding city: ", error);
    }
    await fetchPlayerState();
  };

  const handleBuild = async (x: number, y: number, unitId: number) => {
    const unit = { x, y, unitId };
    const tx = upgradeLandPlot(provider!, program!, unit);
    try {
      const signature = await toast.promise(tx, {
        pending: "Building construction",
        success: "Construction complete",
        error: "Error building construction",
      });
      if (typeof signature === "string") {
        playSound("construction");
        console.log(`Upgrade land plot TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      console.log("Error upgrading land tile: ", error);
    }
    await fetchPlayerState();
  };
  return (
    <div className="unit-info-window">
      <img src={`/${type}.png`} alt={type} />
      <div>
        <strong>{displayType}</strong>
      </div>
      <div>HP: {unit.health}/100</div>
      <div>
        Movements: {movementRange}/{movementRange}
      </div>
      {builds !== undefined && <div>Builds: {builds}/1</div>}
      {strength !== undefined && <div>Strength: {strength}</div>}
      {type === "settler" && (
        <Button className="unit-action-button" variant="outlined" onClick={() => handleFoundCity(unit.x, unit.y, unit.unitId)}>
          Found a City
        </Button>
      )}
      {type === "builder" && (
        <Button className="unit-action-button" variant="outlined" onClick={() => handleBuild(unit.x, unit.y, unit.unitId)}>
          Build
        </Button>
      )}
    </div>
  );
};

export default UnitInfoWindow;
