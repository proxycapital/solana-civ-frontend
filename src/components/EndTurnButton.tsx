import React, { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHourglassEnd, faSkullCrossbones } from "@fortawesome/free-solid-svg-icons";
import { useWorkspace } from "../context/AnchorContext";
import { useGameState } from "../context/GameStateContext";
import toCamelCase from "../utils";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface EndTurnButtonProps {
  setShowOnboardingType: (onboardingType: "production" | "research" | null) => void;
}

const EndTurnButton: React.FC<EndTurnButtonProps> = ({ setShowOnboardingType }) => {
  const { program, provider } = useWorkspace();
  const { game, technologies, cities, allUnits, fetchPlayerState, fetchGameState, fetchNpcs } = useGameState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClosingGame, setIsClosingGame] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [prevResearchedTechnologies, setPrevResearchedTechnologies] = useState<any[]>([]);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleResearchFinished = async () => {
    await fetchPlayerState(); // not sure that I need to here
    console.log("Current technologies: ", technologies);
    // when where is no currentResearch + researchedTechnologies.length increased by one
    if (!technologies.currentResearch && technologies.researchedTechnologies.length > prevResearchedTechnologies.length) {
      console.log("Some research is completed, need to check diff")
      // show modal + drop item from localStorage and reset it
    }
  }

  const startResearchAuto = async (technologyName: any) => {   
    const technology = { [technologyName]: {} } as any;

    const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("GAME"), provider!.publicKey.toBuffer()],
      program!.programId
    );
    const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("PLAYER"), gameKey.toBuffer(), provider!.publicKey.toBuffer()],
      program!.programId
    );
    const accounts = {
      playerAccount: playerKey,
    };
    try {
      const tx = program!.methods.startResearch(technology).accounts(accounts).rpc();
      // @todo: maybe move it in the center of the screen and show during loading process
      await toast.promise(tx, {
        pending: "Starting new research...",
        success: "Research started!",
        error: "Failed to start research",
      });
    } catch (error: any) {
      console.log(error);
      console.log("Cannot start auto-research")
    }
  }

  const endTurn = async () => {
    for (let city of cities) {
      if (city.productionQueue.length === 0 && allUnits.length < 20) {
        toast.warning("You need to select production in all your cities");
        setShowOnboardingType("production");
        return;
      }
    }

    const researchQueue = localStorage.getItem('researchQueue');

    if (!researchQueue) {
      if (!technologies.currentResearch && technologies.researchedTechnologies.length < 17) {
        toast.warning("You need to select a technology to research");
        setShowOnboardingType("research");
        return;
      }
    } else {
      const researchQueueArr = JSON.parse(researchQueue);

      // if there is no currentResearch - we need to make tx ourselves 
      if (!technologies.currentResearch) {
        console.log("Tech to start: ", researchQueueArr[0]);
        await startResearchAuto(researchQueueArr[0]);
      } else {
        console.log("Waiting until research will complete");
      }
      // if there is any currentResearch - no need to do something 

      // also if we just research last reseatch from researchQueue - we need to reset it and still show alert
    }

    setIsProcessing(true);
    console.time("End turn");
    try {
      const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("GAME"), provider!.publicKey.toBuffer()],
        program!.programId
      );
      const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("PLAYER"), gameKey.toBuffer(), provider!.publicKey.toBuffer()],
        program!.programId
      );
      const [npcKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("NPC"), gameKey.toBuffer()],
        program!.programId
      );
      const accounts = {
        game: gameKey,
        playerAccount: playerKey,
        npcAccount: npcKey,
        player: provider!.publicKey,
      };
      const tx = await program!.methods.endTurn().accounts(accounts).rpc();
      console.log(`End turn TX: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
      await fetchPlayerState();
      await fetchGameState();
      await fetchNpcs();
      setShowOnboardingType(null);
      setPrevResearchedTechnologies([...technologies.researchedTechnologies]);
    } catch (error) {
      console.error("Failed to end turn", error);
    }
    console.timeEnd("End turn");
    setIsProcessing(false);

    // show in Modal if some researches are complete
    setTimeout(() =>  handleResearchFinished, 100);
  };

  const confirmCloseGame = async () => {
    handleCloseDialog();
    setIsClosingGame(true);
    setIsProcessing(true);
    try {
      const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("GAME"), provider!.publicKey.toBuffer()],
        program!.programId
      );
      const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("PLAYER"), gameKey.toBuffer(), provider!.publicKey.toBuffer()],
        program!.programId
      );
      const [npcKey] = anchor.web3.PublicKey.findProgramAddressSync(
        [Buffer.from("NPC"), gameKey.toBuffer()],
        program!.programId
      );
      const accounts = {
        game: gameKey,
        playerAccount: playerKey,
        npcAccount: npcKey,
        player: provider!.publicKey,
      };
      await program!.methods.closeGame().accounts(accounts).rpc();
    } catch (error) {
      setIsProcessing(false);
      console.error("Failed to close game", error);
      alert(error);
      return;
    }
    // redirect to reset the context & local state
    window.location.href = "/";
  };

  return (
    <>
      <Button onClick={endTurn} disabled={isProcessing} variant="outlined" className="end-turn-button">
        <FontAwesomeIcon icon={faHourglassEnd} />
        &nbsp; End Turn {game.turn}
      </Button>
      <Button onClick={handleOpenDialog} variant="outlined" className="end-game-button">
        <FontAwesomeIcon icon={faSkullCrossbones} />
      </Button>
      {isProcessing && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10000,
          }}
        >
          <span style={{ color: "white", fontSize: "20px" }}>
            {!isClosingGame && "Waiting for moves of your opponent..."}
            {isClosingGame && "Closing game accounts. Please wait..."}
          </span>
        </div>
      )}
      <ThemeProvider theme={darkTheme}>
        <Dialog
          open={openDialog}
          onClose={handleCloseDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <Box className="confirmation-modal">
            <DialogTitle id="alert-dialog-title">{"End Game Confirmation"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are you sure that you want to end the game?
                <br />
                All your progress will be lost 💀💀💀
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseDialog} color="primary">
                Cancel
              </Button>
              <Button onClick={confirmCloseGame} color="primary" autoFocus>
                Confirm
              </Button>
            </DialogActions>
          </Box>
        </Dialog>
      </ThemeProvider>
    </>
  );
};

export default EndTurnButton;
