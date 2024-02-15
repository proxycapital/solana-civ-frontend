import React, { memo } from "react";
import { Modal } from "@mui/material";

const UpgradedTiles = {
  lumberMill: 14,
  farm: 12,
  stoneQuarry: 11,
  ironMine: 13,
  pasture: 16,
};

const UpgradedTilesResources = {
  lumberMill: "wood",
  farm: "food",
  stoneQuarry: "stone",
  ironMine: "iron",
  pasture: "horses",
};

const UpgradedTilesNames = {
  lumberMill: "Lumber Mill",
  farm: "Farm",
  stoneQuarry: "Stone Quarry",
  ironMine: "Iron Mine",
  pasture: "Pasture",
};

export type UpgradedTileType = "lumberMill" | "farm" | "stoneQuarry" | "ironMine" | "pasture";

interface UpgradedTileModalProps {
  show: boolean;
  onClose: () => void;
  selectedTileType: UpgradedTileType | null;
}

const UpgradedTileModal: React.FC<UpgradedTileModalProps> = ({ show, onClose, selectedTileType }) => {
  if (!selectedTileType) return <></>;

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="upgraded-tile-modal-title"
      aria-describedby="upgraded-tile-modal-description"
    >
      <div className="modal upgraded-tile-modal">
        <img className="avatar" src={`./terrain/Layer ${UpgradedTiles[selectedTileType]}.png`} alt="upgraded-tile" />
        <div>
          <strong>{UpgradedTilesNames[selectedTileType]}</strong>
        </div>
        <div className="line-container desktop-only">
          <img src="/icons/diamond.png" alt="" width="24" className="center-image" />
        </div>
        <div className="unit-stats">
          <b>+2</b>
          <img width="32" src={`./icons/${UpgradedTilesResources[selectedTileType]}.png`} alt="resource type" />
          <b>/ turn</b>
        </div>
      </div>
    </Modal>
  );
};

export default memo(UpgradedTileModal);
