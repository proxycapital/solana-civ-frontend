import React, { useState } from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import Tippy from "@tippyjs/react";

import ResearchTree from "./research/ResearchTree";
import Quests from "./quests/Quests";
import Leaderboard from "./leaderboard/Leaderboard";
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
    <>
     {/* Second row of navigation */}
     <div className="bottom-nav">
        <div className="nav-buttons-box">
          <Tippy key="research" content="Research" placement="bottom">
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Research");
              }}
            >
              <img src="/icons/science.png" width="42" alt="Research" />
            </Button>
          </Tippy>
          
          <Tippy key="quests" content="Quests" placement="bottom">
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Quests");
              }}
            >
              <img src="/icons/quests.png" width="42" alt="Quests" />
            </Button>
          </Tippy>
      
          <Tippy key="leaderboard" content="Leaderboard" placement="bottom">
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Leaderboard");
              }}
            >
              <img src="/icons/leaderboard.png" width="42" alt="Leaderboard" />
            </Button>
          </Tippy>

          <Tippy key="help" content="Help" placement="bottom">
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Help");
              }}
            >
              <span style={{fontSize: "40px", lineHeight: "30px"}}>?</span>
            </Button>
          </Tippy>
        </div>
      </div>
      <div className="top-nav-wrapper">
        {/* First AppBar for balances & end turn buttons */}
        <AppBar position="static" className="top-navigation" style={{ border: "none" }}>
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
            <div style={{ marginLeft: "auto" }}>
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

        {/* Modal */}
        <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalContent}>
          <div>
            {modalContent === "Research" && <ResearchTree />}
            {modalContent === "Quests" && <Quests />}
            {modalContent === "Leaderboard" && <Leaderboard />}
          </div>
        </CustomModal>
      </div>
    </>
  );
};

export default TopMenu;
