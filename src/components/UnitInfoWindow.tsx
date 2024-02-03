import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Tippy from "@tippyjs/react";

import config from "../config.json";
import { foundCity, upgradeLandPlot, upgradeUnit } from "../utils/solanaUtils";
import { canUpgradeUnit } from "../utils";
import { useWorkspace } from "../context/AnchorContext";
import { useGameState } from "../context/GameStateContext";
import { useSound } from "../context/SoundContext";

type WindowAlignment = 'left' | 'right' | null;

interface UnitInfoProps {
  unit: {
    x: number;
    y: number;
    unitId: number;
    type: string;
    movementRange: number;
    health: number;
    builds?: number;
    attack?: number;
    experience?: number;
    level?: number;
  };
}

const UnitInfoWindow: React.FC<UnitInfoProps> = ({ unit }) => {
  const [alignment, setAlignment] = useState<WindowAlignment>(null)
  const { program, provider } = useWorkspace();
  const { cities, fetchPlayerState } = useGameState();
  const { playSound } = useSound();
  const { type, movementRange, attack, experience, level } = unit;
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);

  useEffect(() => {
    const element = document.getElementById(`unit-${unit?.unitId}`);
    if(element) {
      const rect = element.getBoundingClientRect();
      const distanceFromRight = window.innerWidth - rect.right;

      // the unit window is 240px wide defined in the css
      if(distanceFromRight < 400) {
        setAlignment('left');
      } else {
        setAlignment('right');
      }
    }
  }, []);

  const getUnusedCityName = () => {
    const usedNames = cities.map((city) => city.name);
    const availableNames = config.cityNames.filter((name) => !usedNames.includes(name));
    if (availableNames.length === 0) {
      return "City";
    }
    const randomIndex = Math.floor(Math.random() * availableNames.length);
    return availableNames[randomIndex];
  };

  const handleFoundCity = async (x: number, y: number, unitId: number) => {
    const data = { x, y, unitId, name: getUnusedCityName() };
    try {
      const tx = foundCity(provider!, program!, data);
      const signature = await toast.promise(tx, {
        pending: "Founding a city",
        success: "City founded",
        error: undefined,
      });
      if (typeof signature === "string") {
        playSound("construction");
        console.log(`Built a city. TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      if (error instanceof Error && error.message.includes("WithinControlledTerritory")) {
        toast.error("Settler can build new cities only in neutral tiles", { autoClose: 3000 });
      } else {
        // Display a generic error message
        toast.error("Failed to build a city");
      }
      console.log("Failed to build a city: ", error);
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
      if (error instanceof Error) {
        if (error.message.includes("TileNotControlled")) {
          toast.error("Tile is not controlled", { autoClose: 3000 });
        }
      }
    }
    await fetchPlayerState();
  };

  const handleUpgrade = async (unitId: number) => {
    const tx = upgradeUnit(provider!, program!, unitId);
    try {
      const signature = await toast.promise(tx, {
        pending: "Upgrading unit",
        success: "Unit upgraded",
        error: "Error upgrading unit",
      });
      if (typeof signature === "string") {
        playSound("upgrade");
        console.log(`Upgrade land plot TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("NoMovementPoints")) {
          toast.error("No movement points left this turn", { autoClose: 3000 });
        }
      }
      console.log("Error upgrading unit: ", error);
    }
    
    await fetchPlayerState();
  };

  if(!alignment) return <></>;

  return (
    <div className={`unit-info-window align-${alignment}`}>
      <img src={`/${type}.png`} className="avatar" alt={type} />
      <div className="desktop-only">
        <strong>{displayType}</strong>
      </div>
      <div className="line-container desktop-only">
        <img src="/icons/diamond.png" alt="" width="24" className="center-image" />
      </div>
      {(type !== "settler" && type !== "builder") && (
        <div className="unit-stats">
          <img src="/icons/health.png" alt="" className="unit-icon" /> Health:&nbsp;<b>{unit.health}/100</b>
        </div>
      )}
      <div className="unit-stats desktop-only">
        <img src="/icons/movement.png" alt="" className="unit-icon" />
        Movements:&nbsp;
        <b>{movementRange}</b>
      </div>
      {attack !== 0 && (
        <div className="unit-stats">
          <img src="/icons/attack.png" alt="" className="unit-icon" />
          Strength:&nbsp;<b>{attack}</b>
        </div>
      )}
      {experience !== 0 && level !== null && level !== undefined && level < config.expThresholds.length && (
        <div className={`unit-stats ${canUpgradeUnit(level || 0, experience || 0) && "desktop-only"}`}>
          XP:&nbsp;
          <b>
            {experience}/{config.expThresholds[level]}
          </b>
        </div>
      )}

      {type === "settler" && (
        <Button
          className="unit-action-button"
          variant="outlined"
          onClick={() => handleFoundCity(unit.x, unit.y, unit.unitId)}
        >
          <img src="/icons/build.png" alt="" className="unit-icon" /> Build a City
        </Button>
      )}
      {type === "builder" && (
        <Button
          className="unit-action-button"
          variant="outlined"
          onClick={() => handleBuild(unit.x, unit.y, unit.unitId)}
        >
          <img src="/icons/build.png" alt="" className="unit-icon" /> Build
        </Button>
      )}
      {canUpgradeUnit(level || 0, experience || 0) ? (
        <Tippy touch={false} content={config.unitUpgradeResult}>
          <Button className="unit-action-button" variant="outlined" onClick={() => handleUpgrade(unit.unitId)}>
            <img src="/icons/health.png" alt="Health" className="unit-icon desktop-only" />
            Level Up
          </Button>
        </Tippy>
      ) : null}
    </div>
  );
};

export default UnitInfoWindow;
