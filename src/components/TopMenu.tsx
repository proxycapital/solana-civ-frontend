import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import Tippy from '@tippyjs/react';

import CustomModal from "./CustomModal";
import EndTurnButton from "./EndTurnButton";
import { useGameState } from "../context/GameStateContext";
import { useSound } from "../context/SoundContext";

interface TopMenuProps {
  debug: boolean;
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu: React.FC<TopMenuProps> = ({ debug, setDebug }) => {
  const { resources, game } = useGameState();
  const { toggleBackgroundMusic } = useSound();

  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");

  const handleOpenModal = (content: string) => {
    setModalContent(content);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setModalContent("");
  };

  const [isMusicPlaying, setMusicPlaying] = useState(() => {
    return localStorage.getItem("isMusicPlaying") === "true";
  });

  const handleToggleBackgroundMusic = () => {
    toggleBackgroundMusic();
    setMusicPlaying((prevState) => !prevState);
  };

  return (
    <div style={{ display: "flex", justifyContent: "space-between", margin: "20px" }}>
      {/* First AppBar for balances */}
      <AppBar
        position="static"
        className="top-navigation"
        style={{ flex: "2", marginRight: "10px", borderRadius: "8px" }}
      >
        <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
          <div className="balance-container">
            {Object.keys(resources).map((resourceKey) => {
              const displayName = resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1);
              const imagePath = `/icons/${resourceKey}.png`;
              const value = resources[resourceKey];

              return (
                <Tippy key={resourceKey} content={displayName}>
                  <div className="balance-box">
                    <img src={imagePath} width="32" alt={displayName} />
                    {resourceKey === "sol" ? value.toFixed(2) : value}
                  </div>
                </Tippy>
              );
            })}
            <Tippy key="gems" content="Gems - can be withdrawn to a personal wallet">
              <div className="balance-box">
                <img src="/icons/gems.png" width="32" alt="Gems" />
                {resources.gems}
              </div>
            </Tippy>
          </div>
          <div className="button-container">
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Research");
              }}
            >
              Research
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Quests");
              }}
            >
              Quests
            </Button>
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Leaderboard");
              }}
            >
              Leaderboard
            </Button>
          </div>
          <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalContent}>
            <div>
              {modalContent === "Research" && <div>Research Content</div>}
              {modalContent === "Quests" && <div>Quests Content</div>}
              {modalContent === "Leaderboard" && <div>Leaderboard Content</div>}
            </div>
          </CustomModal>
        </Toolbar>
      </AppBar>

      {/* Second AppBar for Debug and End Turn */}
      <AppBar
        position="static"
        className="top-navigation"
        style={{ flex: "1", marginLeft: "10px", borderRadius: "8px" }}
      >
        <Toolbar>
          <div style={{ marginLeft: "auto" }}>
            {/* <Switch
              checked={debug}
              onChange={() => setDebug(!debug)}
              name="debug"
              color="default"
              inputProps={{ "aria-label": "Debug mode" }}
            /> */}
            <Typography variant="h6" style={{ display: "inline", marginRight: "20px" }}>
              Day {game.turn}
            </Typography>
            <EndTurnButton />
            <button onClick={handleToggleBackgroundMusic} className="music-toggle-button">
              <FontAwesomeIcon icon={isMusicPlaying ? faVolumeHigh : faVolumeXmark} />
            </button>
          </div>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default TopMenu;
