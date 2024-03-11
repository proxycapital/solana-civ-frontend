import React, { useState, useEffect } from "react";
import Tippy from "@tippyjs/react";

import config from "../config.json"

interface TerrainProps {
  isControlled: boolean;
  discovered: boolean;
  imageIndex: number;
  overlayImageIndex?: number;
  turn: number;
}

// Weighted random index selection for terrain tile images
// Used to initialize the map that will be stored in PDA
export function weightedRandomTile() {
  const weightedIndices = [1, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 5, 6, 7, 8, 8, 8];
  const randomIndex = Math.floor(Math.random() * weightedIndices.length);
  return weightedIndices[randomIndex];
}

// Mapping of tile indices to their type
export const TileType = {
  0: "Empty",
  1: "Iron",
  2: "Forest",
  3: "Plains",
  4: "Plains",
  5: "Rocks",
  6: "Field",
  7: "Pasture",
  8: "Plains",
  9: "Plains",
  10: "Village",
  11: "Stone Quarry",
  12: "Farm",
  13: "Iron Mine",
  14: "Lumber Mill",
  15: "NPC Village",
  16: "Pasture",
  [config.seaTerrain]: "Sea",
  20: "Empty",
};

const yieldTypes: { [key: string]: string } = {
  "Lumber Mill": "wood",
  "Stone Quarry": "stone",
  Farm: "food",
  "Iron Mine": "iron",
  Pasture: "horses",
};

const Terrain: React.FC<TerrainProps> = ({ isControlled, discovered, imageIndex, overlayImageIndex, turn }) => {
  const [nextTurn, setNextTurn] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  useEffect(() => {
    setNextTurn(true);
    setTimeout(() => {
      setNextTurn(false);
    }, 2000);
  }, [turn]);

  useEffect(() => {
    if (discovered) {
      setFadeIn(true);
      setTimeout(() => {
        setFadeIn(false);
      }, 1000);
    }
  }, [discovered]);

  const tileType = TileType[imageIndex as keyof typeof TileType];
  const overlayTileType = TileType[overlayImageIndex as keyof typeof TileType];
  const imageUrl = !discovered && imageIndex === 15 ? `/terrain/Layer 2.png` : `/terrain/Layer ${imageIndex}.png`;
  const overlayImageUrl = overlayImageIndex !== undefined ? `/terrain/Layer ${overlayImageIndex}.png` : "";

  return (
    <div>
      {discovered && overlayImageIndex !== undefined && (
        <>
          {yieldTypes[overlayTileType] && nextTurn && (
            <div className="yield-effect">
              +2&nbsp;
              <img
                src={`/icons/${yieldTypes[overlayTileType]}.png`}
                alt={yieldTypes[overlayTileType]}
                className="yield-icon"
              />
            </div>
          )}
          <Tippy touch={false} content={`${overlayTileType}`}>
            <img
              src={overlayImageUrl}
              className={`terrain-overlay ${tileType.toLowerCase()}`}
              alt={`${tileType}-overlay`}
              draggable="false"
            />
          </Tippy>
        </>
      )}
      {discovered && imageIndex !== null && (
        <div className={`terrain-container ${isControlled ? "controlled" : ""} ${fadeIn ? "fade-in" : ""}`}>
          <img src={imageUrl} className={`terrain ${tileType.toLowerCase()}`} alt={tileType} draggable="false" />
        </div>
      )}
      {!discovered && (
        <div>
          <img
            src="/terrain/clouds.png"
            style={{ position: "absolute", width: "200px", height: "140px", pointerEvents: "none", top: 0, zIndex: 10 }}
            className="terrain undiscovered"
            alt="undiscovered"
            draggable="false"
          />
          <img src={imageUrl} className={`terrain undiscovered`} alt={tileType} draggable="false" />
        </div>
      )}
    </div>
  );
};

export default React.memo(Terrain);
