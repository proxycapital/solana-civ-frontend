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
import { ErrorCodes, useError } from "../hooks/error.hook";

type WindowAlignment = "left" | "right" | null;

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
  const [alignment, setAlignment] = useState<WindowAlignment>(null);
  const { program, provider } = useWorkspace();
  const { cities, fetchPlayerState } = useGameState();
  const { playSound } = useSound();
  const { type, movementRange, attack, experience, level } = unit;
  const displayType = type.charAt(0).toUpperCase() + type.slice(1);
  const { handleError } = useError();

  useEffect(() => {
    if (!unit.unitId && unit.unitId !== 0) return
  
    const element = document.getElementById(`unit-${unit?.unitId}`);

    if (element) {
      const rect = element.getBoundingClientRect();
      const distanceFromRight = window.innerWidth - rect.right;

      // the unit window is 240px wide defined in the css
      if (distanceFromRight < 400) {
        setAlignment("left");
      } else {
        setAlignment("right");
      }
    }
  }, [unit.unitId]);

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
      handleError({
        error,
        logMessage: "Failed to build a city",
        defaultError: ErrorCodes.CityBuildFailed,
      });
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
        error: undefined,
      });
      if (typeof signature === "string") {
        playSound("construction");
        console.log(`Upgrade land plot TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      handleError({
        error,
        logMessage: "Error upgrading land tile",
        defaultError: ErrorCodes.ErrorBuildingConstruction,
      });
    }
    await fetchPlayerState();
  };

  const handleUpgrade = async (unitId: number) => {
    const tx = upgradeUnit(provider!, program!, unitId);
    try {
      const signature = await toast.promise(tx, {
        pending: "Upgrading unit",
        success: "Unit upgraded",
        error: undefined,
      });
      if (typeof signature === "string") {
        playSound("upgrade");
        console.log(`Upgrade land plot TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      handleError({
        error,
        logMessage: "Error upgrading unit",
      });
    }

    await fetchPlayerState();
  };

  console.log('Ali', alignment)
  console.log('Type: ', type)

  if (!alignment) return <></>;

  return (
    <div className={`unit-info-window align-${alignment}`}>
      <img src={`/${type}.png`} className="avatar" alt={type} />
      <div className="unit-name desktop-only">
        <strong>{displayType}</strong>
      </div>
      {type !== "settler" && type !== "builder" && (
        <div className="unit-stats">
          <div className="flex-align-center">
            <img src="/icons/health.png" alt="" className="unit-icon" />
            Health
          </div>
          <b>{unit.health}/100</b>
        </div>
      )}
      <div className="unit-stats desktop-only">
        <div className="flex-align-center">
          <img src="/icons/movement.png" alt="" className="unit-icon" />
          Movements
        </div>
        <b>{movementRange}</b>
      </div>
      {attack !== 0 && (
        <div className="unit-stats">
          <div className="flex-align-center">
            <img src="/icons/attack.png" alt="" className="unit-icon" />
            Strength
          </div>
          <b>{attack}</b>
        </div>
      )}
      {experience !== 0 && level !== null && level !== undefined && level < config.expThresholds.length && (
        <div className={`unit-stats ${canUpgradeUnit(level || 0, experience || 0) && "desktop-only"}`}>
          <div className="flex-align-center">
            <img src="/icons/health.png" alt="" className="unit-icon" />
            XP
          </div>
          <b>
            {experience}/{config.expThresholds[level]}
          </b>
        </div>
      )}
  
      {type === "settler" && (
        <div className="gradient-wrapper">
          <Button
            className="unit-action-button"
            variant="outlined"
            onClick={() => handleFoundCity(unit.x, unit.y, unit.unitId)}
          >
            <img src="/icons/build.png" alt="" className="unit-icon" /> Build a City
          </Button>
        </div>
      )}
      {type === "builder" && (
        <div className="gradient-wrapper">
          <Button
            className="unit-action-button"
            variant="outlined"
            onClick={() => handleBuild(unit.x, unit.y, unit.unitId)}
          >
            <img src="/icons/build.png" alt="" className="unit-icon" /> Build
          </Button>
        </div>
      )}
      {canUpgradeUnit(level || 0, experience || 0) ? (
        <Tippy touch={false} content={config.unitUpgradeResult}>
            <div className="gradient-wrapper">
            <Button className="unit-action-button" variant="outlined" onClick={() => handleUpgrade(unit.unitId)}>
              <img src="/icons/health.png" alt="Health" className="unit-icon desktop-only" />
              Level Up
            </Button>
          </div>
        </Tippy>
      ) : null}
    </div>
  );
};

export default UnitInfoWindow;
