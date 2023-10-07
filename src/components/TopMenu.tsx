import React, { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Button from "@mui/material/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import Box from "@mui/material/Box";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { useWallet } from "@solana/wallet-adapter-react";

import ResearchTree from "./research/ResearchTree";
import Quests from "./quests/Quests";
import Leaderboard from "./leaderboard/Leaderboard";
import Marketplace from "./marketplace/Marketplace";
import CustomModal from "./CustomModal";
import EndTurnButton from "./EndTurnButton";
import { useGameState } from "../context/GameStateContext";
import { useWorkspace } from "../context/AnchorContext";
import { useSound } from "../context/SoundContext";
import { withdrawGems } from "../utils/solanaUtils";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface TopMenuProps {
  debug: boolean;
  setDebug: React.Dispatch<React.SetStateAction<boolean>>;
}

const TopMenu: React.FC<TopMenuProps> = ({ debug, setDebug }) => {
  const { provider, program } = useWorkspace();
  const { wallet } = useWallet();
  const { resources, fetchPlayerState } = useGameState();
  const { toggleBackgroundMusic } = useSound();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    if (!wallet?.adapter.publicKey) {
      toast.error("You need to connect your wallet");
      return;
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleWithdrawal = async () => {
    if (!wallet?.adapter.publicKey) {
      toast.error("You need to connect your wallet");
      return;
    }
    setOpenDialog(false);
    try {
      const tx = withdrawGems(provider!, program!, wallet.adapter.publicKey);
      const signature = await toast.promise(tx, {
        pending: "Withdrawing gems...",
        success: "Withdrawal successful",
        error: "Failed to withdraw gems",
      });
    } catch (err) {
      if (err instanceof Error) {
        if (err.message.includes("NotEnoughGems")) {
          toast.error("Your balance is 0 gems");
        }
      }
      console.error(err);
    }
    await fetchPlayerState();
  };

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

          <Tippy key="marketplace" content="Marketplace" placement="bottom">
            <Button
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Marketplace");
              }}
            >
              <img src="/icons/marketplace.png" width="42" alt="Marketplace" />
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
                if (resourceKey === "gems") return null;
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
              <div className="vertical-divider" />
              <Tippy key="gems" content="Click to withdraw">
                <div className="balance-box">
                  <Button style={{ padding: 0, margin: 0, color: "#fff" }} onClick={handleOpenDialog}>
                    <img src="/icons/gems.png" width="32" alt="Gems" />
                    {resources.gems}
                  </Button>
                </div>
              </Tippy>
            </div>
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <button onClick={handleToggleBackgroundMusic} className="music-toggle-button">
                <FontAwesomeIcon icon={isMusicPlaying ? faVolumeHigh : faVolumeXmark} />
              </button>
              <EndTurnButton />
              <WalletMultiButton />
            </div>
          </Toolbar>
        </AppBar>

        {/* Modal */}
        <CustomModal isOpen={isModalOpen} onClose={handleCloseModal} title={modalContent}>
          <div style={{ width: "100%", maxWidth: "1000px" }}>
            {modalContent === "Research" && <ResearchTree />}
            {modalContent === "Quests" && <Quests />}
            {modalContent === "Leaderboard" && <Leaderboard />}
            {modalContent === "Marketplace" && <Marketplace />}
          </div>
        </CustomModal>

        {/* Withdrawal confirmation */}
        <ThemeProvider theme={darkTheme}>
          <Dialog
            open={openDialog}
            onClose={handleCloseDialog}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <Box className="confirmation-modal">
              <DialogTitle id="alert-dialog-title">{"Withdrawal confirmation"}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-description">
                  Do you want to withdraw <b>{resources.gems} gems</b> to the connected wallet?
                  <br />
                  {wallet?.adapter.publicKey?.toBase58()}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={handleCloseDialog} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleWithdrawal} color="primary" autoFocus>
                  Confirm
                </Button>
              </DialogActions>
            </Box>
          </Dialog>
        </ThemeProvider>
      </div>
    </>
  );
};

export default TopMenu;
