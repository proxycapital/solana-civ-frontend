import React, { memo } from "react";
import { Modal } from "@mui/material";


const UpgradedTiles = {
  "lumberMill": 14,
  "farm": 12,
  "stoneQuarry": 11,
  "ironMine": 13,
}

const UpgradedTilesResources = {
  "lumberMill": "wood",
  "farm": "food",
  "stoneQuarry": "stone",
  "ironMine": "iron",
}

const UpgradedTilesNames = {
  "lumberMill": "Lumber Mill",
  "farm": "Farm",
  "stoneQuarry": "Stone Quarry",
  "ironMine": "Iron Mine", 
}

export type UpgradedTileType = "lumberMill" | "farm" | "stoneQuarry" | "ironMine"

interface UpgradedTileModalProps {
  show: boolean;
  onClose: () => void;
  selectedTileType: UpgradedTileType | null;
}

const UpgradedTileModal: React.FC<UpgradedTileModalProps> = ({ show, onClose, selectedTileType }) => {
  if (!selectedTileType) return <></>

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="upgraded-tile-modal-title"
      aria-describedby="upgraded-tile-modal-description"
    >
      <div className="modal upgraded-tile-modal">
        <img className="avatar" src={`./terrain/Layer ${UpgradedTiles[selectedTileType]}.png`} alt="upgraded-tile" />
        <div className="desktop-only">
          <strong>{UpgradedTilesNames[selectedTileType]}</strong>
        </div>
        <div className="line-container desktop-only">
          <img src="/icons/diamond.png" alt="" width="32" className="center-image" />
        </div>
        <div className="unit-stats">
          Income:&nbsp;
          <b>+2</b>
          <img width="32" src={`./icons/${UpgradedTilesResources[selectedTileType]}.png`} alt="resource type"/>
        </div>
      </div>
    </Modal>
  )
}

export default memo(UpgradedTileModal)