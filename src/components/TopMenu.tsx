import React, { useState } from "react";
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
import Joyride, { STATUS } from "react-joyride";

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

const researchSteps = [
  { target: ".nav-buttons-box.research button", content: <div>Open Research Tree and selected of the researches</div> },
];

const productionSteps = [
  { target: ".terrain.village", content: <div>Click on city and add unit or building to production queue</div> },
];

const CustomBalanceTooltip = ({ resource, displayName, totalValues }: any) => {
  if (totalValues[resource]) {
    return (
      <span>
        {displayName} (+{totalValues[resource]})
      </span>
    );
  }
  return <span>{displayName}</span>;
};
const TopMenu: React.FC<TopMenuProps> = ({ debug, setDebug }) => {
  const { provider, program } = useWorkspace();
  const { wallet } = useWallet();
  const { resources, fetchPlayerState, cities, upgradedTiles } = useGameState();
  const { toggleBackgroundMusic } = useSound();
  const [isModalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState("");
  const [openDialog, setOpenDialog] = useState(false);
  const [showOnboardingType, setShowOnboardingType] = useState<"production" | "research" | null>(null);

  let totalFoodYield = 0;
  let totalScienceYield = 0;
  let totalGoldYield = 0;
  let totalWoodYield = 0;
  let totalStoneYield = 0;
  let totalIronYiled = 0;

  upgradedTiles.forEach((upgradedTile) => {
    const tileType = Object.keys(upgradedTile.tileType)[0];
    console.log(tileType);

    if (tileType === "farm") {
      totalFoodYield += 2;
    }
    if (tileType === "lumberMill") {
      totalWoodYield += 2;
    }
    if (tileType === "stoneQuarry") {
      totalStoneYield += 2;
    }
    if (tileType === "ironMine") {
      totalIronYiled += 2;
    }
  });

  cities.forEach((city) => {
    totalFoodYield += city.foodYield;
    totalScienceYield += city.scienceYield;
    totalGoldYield += city.goldYield;
  });

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
      await toast.promise(tx, {
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
        <div className="nav-buttons-box research">
          <Tippy key="research" content="Research" placement="left">
            <Button
              className="tutorial-research-button"
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Research");
                setShowOnboardingType(null);
              }}
            >
              <img src="/icons/science.png" width="42" alt="Research" />
            </Button>
          </Tippy>

          <Tippy key="quests" content="Quests" placement="left">
            <Button
              className="quests-button"
              variant="text"
              color="inherit"
              onClick={() => {
                handleOpenModal("Quests");
              }}
            >
              <img src="/icons/quests.png" width="42" alt="Quests" />
            </Button>
          </Tippy>

          <Tippy key="leaderboard" content="Leaderboard" placement="left">
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

          <Tippy key="marketplace" content="Marketplace" placement="left">
            <Button
              className="marketplace-button"
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
        <AppBar position="static" className="top-navigation">
          <Toolbar style={{ display: "flex", justifyContent: "space-between" }}>
            <div className="balance-container">
              <div className="star-icon">
                <img src="/icons/star.png" width="12" alt="" />
              </div>
              {Object.keys(resources).map((resourceKey) => {
                if (resourceKey === "gems") return null;

                const displayName = resourceKey.charAt(0).toUpperCase() + resourceKey.slice(1);
                const imagePath = `/icons/${resourceKey}.png`;
                const value = resources[resourceKey];

                return (
                  <Tippy
                    key={resourceKey}
                    content={
                      <CustomBalanceTooltip
                        resource={resourceKey}
                        displayName={displayName}
                        totalValues={{
                          food: totalFoodYield,
                          science: totalScienceYield,
                          gold: totalGoldYield,
                          stone: totalStoneYield,
                          wood: totalWoodYield,
                          iron: totalIronYiled,
                        }}
                      />
                    }
                  >
                    <div className={`balance-box ${resourceKey}-resource`}>
                      <img src={imagePath} width="32" alt={displayName} />
                      {resourceKey === "sol" ? value.toFixed(2) : value}
                    </div>
                  </Tippy>
                );
              })}
              <div className="vertical-divider" />
              <Tippy key="gems" content="Click to withdraw">
                <div className="balance-box gems-resource">
                  <Button style={{ padding: 0, margin: 0, color: "#fff" }} onClick={handleOpenDialog}>
                    <img src="/icons/gems.png" width="32" alt="Gems" />
                    {resources.gems}
                  </Button>
                </div>
              </Tippy>
              <div className="star-icon">
                <img src="/icons/star.png" width="12" alt="" />
              </div>
            </div>
            <div style={{ marginLeft: "auto", display: "flex" }}>
              <button onClick={handleToggleBackgroundMusic} className="music-toggle-button">
                <FontAwesomeIcon icon={isMusicPlaying ? faVolumeHigh : faVolumeXmark} />
              </button>
              <EndTurnButton setShowOnboardingType={setShowOnboardingType} />
              <div className="wallet-button-tutorial">
                <WalletMultiButton className="wallet-button" />
              </div>
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
      <Joyride
        run={showOnboardingType}
        steps={showOnboardingType === "production" ? productionSteps : researchSteps}
        styles={{
          options: {
            backgroundColor: "rgb(34, 47, 59)",
            textColor: "#fff",
            primaryColor: "#512da8",
          },
        }}
        callback={(state: any) => {
          if ([STATUS.SKIPPED, STATUS.FINISHED].includes(state.status)) {
            setShowOnboardingType(null);
          }
        }}
      />
    </>
  );
};

export default TopMenu;
