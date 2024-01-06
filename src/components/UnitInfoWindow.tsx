import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import Tippy from "@tippyjs/react";

import config from "../config.json";
import { foundCity, upgradeLandPlot, healUnit, upgradeUnit } from "../utils/solanaUtils";
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

      if(distanceFromRight < 300) {
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

  const handleHealing = async (unitId: number) => {
    const tx = healUnit(provider!, program!, unitId);
    try {
      await toast.promise(tx, {
        pending: "Healing unit",
        success: "Unit healed",
        error: "Error healing unit",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("NotEnoughResources")) {
          toast.error("Not enough of food to heal unit");
        }
      }
      console.log("Error healing unit: ", error);
    }
    await fetchPlayerState();
  };

  const handleUpgrade = async (unitId: number) => {
    const tx = upgradeUnit(provider!, program!, unitId);
    try {
      await toast.promise(tx, {
        pending: "Upgrading unit",
        success: "Unit upgraded",
        error: "Error upgrading unit",
      });
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes("NoMovementPoints")) {
          toast.error("No movement points left this turn");
        }
      }
      console.log("Error upgrading unit: ", error);
    }
    await fetchPlayerState();
  };

  return (
    <div className={`unit-info-window align-${alignment}`}>
      <img src={`/${type}.png`} className="avatar" alt={type} />
      <div className="desktop-only">
        <strong>{displayType}</strong>
      </div>
      <div className="line-container desktop-only">
        <img src="/icons/diamond.png" alt="" width="32" className="center-image" />
      </div>
      <div className="unit-stats">
        <img src="/icons/health.png" alt="" className="unit-icon" /> Health:&nbsp;<b>{unit.health}/100</b>
      </div>
      <div className="unit-stats">
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
        <div className="unit-stats">
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
          <img src="/icons/build.png" alt="" className="unit-icon" /> Found a City
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
      {unit.health < 100 && false && (
        <Button className="unit-action-button" variant="outlined" onClick={() => handleHealing(unit.unitId)}>
          <img src="/icons/health.png" alt="Health" className="unit-icon" />
          Heal ({100 - unit.health}
          <img src="icons/food.png" alt="Food" className="unit-icon" />)
        </Button>
      )}
      {canUpgradeUnit(level || 0, experience || 0) ? (
        <Tippy content={config.unitUpgradeResult}>
          <Button className="unit-action-button" variant="outlined" onClick={() => handleUpgrade(unit.unitId)}>
            <img src="/icons/health.png" alt="Health" className="unit-icon" />
            Level Up
          </Button>
        </Tippy>
      ) : null}
    </div>
  );
};

export default UnitInfoWindow;
