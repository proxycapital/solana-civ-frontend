import React, { useEffect, useState } from "react";
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
import Tippy from "@tippyjs/react";

import { useWorkspace } from "../context/AnchorContext";
import { useGameState } from "../context/GameStateContext";
import resetResearchStorage from "../utils/storage";

import config from "../config.json";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

interface EndTurnButtonProps {
  setShowOnboardingType: (onboardingType: "production" | "research" | null) => void;
  openNewResearchModal: () => void;
}

const EndTurnButton: React.FC<EndTurnButtonProps> = ({ setShowOnboardingType, openNewResearchModal }) => {
  const { program, provider } = useWorkspace();
  const { game, technologies, cities, allUnits, fetchPlayerState, fetchGameState, fetchNpcs } = useGameState();
  const [isProcessing, setIsProcessing] = useState(false);
  const [isClosingGame, setIsClosingGame] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space" && !isProcessing) {
        event.preventDefault();
        endTurn();
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [isProcessing]);

  useEffect(() => {
    async function handleResearchComplete() {
      const numberOfResearchedTech = technologies.researchedTechnologies.length;
      let prevResearchedTech: any = localStorage.getItem("prevTech");
      prevResearchedTech = prevResearchedTech ? JSON.parse(prevResearchedTech) : [];

      const numberOfPrevResearchedTech = prevResearchedTech.length;

      if (numberOfResearchedTech - numberOfPrevResearchedTech === 1) {
        const researchedKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);
        const prevResearchedKeys = prevResearchedTech.map((tech: any) => Object.keys(tech)[0]);

        const newTechnology = researchedKeys.filter((tech) => !prevResearchedKeys.includes(tech));

        if (newTechnology.length === 1) {
          localStorage.setItem("prevTech", JSON.stringify(technologies.researchedTechnologies));

          // show modal
          openNewResearchModal();

          const researchQueue: any = localStorage.getItem("researchQueue");
          const researchQueueArr: Array<any> = JSON.parse(researchQueue);
          if (!researchQueueArr) return;

          if (researchQueueArr.length === 1) {
            // last research was finished
            resetResearchStorage();
            return;
          }

          const newResearchQueue = researchQueueArr.filter((tech) => tech !== newTechnology[0]);

          if (newResearchQueue.length !== researchQueueArr.length) {
            localStorage.setItem("researchQueue", JSON.stringify(newResearchQueue));
          }
        }
      }
    }
    handleResearchComplete();
  }, [technologies.researchedTechnologies]);

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
      console.log("Cannot start auto-research");
    }
  };

  const endTurn = async () => {
    for (let city of cities) {
      if (city.productionQueue.length === 0) {
        toast.warning(`${city.name}: production queue is empty`);
        setShowOnboardingType("production");
      }
    }

    const researchQueue = localStorage.getItem("researchQueue");

    if (!researchQueue) {
      const totalTechnologies =
        config.science["Science and Economy Tree"].length +
        config.science["Production and Agriculture Tree"].length +
        config.science["Military Tree"].length;
      if (!technologies.currentResearch && technologies.researchedTechnologies.length < totalTechnologies) {
        toast.warning("You need to select a technology to research");
        setShowOnboardingType("research");
        return;
      }
    } else {
      const researchQueueArr = JSON.parse(researchQueue);

      // if no currentResearch - we need to make tx ourselves
      if (!technologies.currentResearch) {
        await startResearchAuto(researchQueueArr[0]);
      }
    }

    setIsProcessing(true);
    console.time("End turn");
    localStorage.setItem("prevTech", JSON.stringify(technologies.researchedTechnologies));

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
      // const tx = await program!.methods.endTurn().accounts(accounts).rpc({skipPreflight: true});

      const instruction = await program!.methods.endTurn().accounts(accounts).instruction();
      const computeBudgetInstruction = anchor.web3.ComputeBudgetProgram.setComputeUnitLimit({
        units: 1000000,
      });
      const addPriorityFee = anchor.web3.ComputeBudgetProgram.setComputeUnitPrice({
        microLamports: 1,
      });
      const transaction = new anchor.web3.Transaction();
      transaction.add(computeBudgetInstruction);
      transaction.add(addPriorityFee);
      transaction.add(instruction);
      const tx = await provider!.sendAndConfirm(transaction);

      console.log(`End turn TX: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
      await fetchPlayerState();
      await fetchGameState();
      await fetchNpcs();
      setShowOnboardingType(null);
    } catch (error) {
      console.error("Failed to end turn", error);
    }
    console.timeEnd("End turn");
    setIsProcessing(false);
  };

  const confirmCloseGame = async () => {
    resetResearchStorage();
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
      <Tippy key="gems" content="Hotkey: 'Spacebar'">
        <Button onClick={endTurn} disabled={isProcessing} variant="outlined" className="end-turn-button">
          <FontAwesomeIcon icon={faHourglassEnd} />
          &nbsp; End Turn {game.turn}
        </Button>
      </Tippy>
      <Tippy content="End Game">
        <Button onClick={handleOpenDialog} variant="outlined" className="end-game-button">
          <FontAwesomeIcon icon={faSkullCrossbones} />
        </Button>
      </Tippy>
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
