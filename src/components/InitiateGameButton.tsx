import React, { useState, useEffect } from 'react'
import { Button, Grid, Modal, Box, Typography } from '@mui/material'
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useNavigate } from "react-router-dom";
import Tippy from '@tippyjs/react';

import { useWorkspace } from '../context/AnchorContext';
import { requestBackendAirdrop, requestSolanaAirdrop, registerPlayerAddress } from '../utils/initiateGame'
import { handleEndGame, initializeGame } from '../utils/solanaUtils';
import { useModalError } from '../context/ModalErrorContext';

const { REACT_APP_HELIUS_RPC } = process.env;

interface InitiateGameButtonProps {
  setShowButtons: (showButtons: boolean) => void;
  updateStepStatus: (step: string, status: string) => void;
  setErrorMsg: (errorMsg: string) => void;
  label?: string
}

const InitiateGameButton = ({ setShowButtons, updateStepStatus, setErrorMsg, label = "New Game" }: InitiateGameButtonProps) => {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  const { showModalError, setShowModalError } = useModalError();
  const [selectLevelVisible, setSelectLevelVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const createWalletAndStartGame = async (level: number) => {
    setShowButtons(false);

    // user already have some game session
    if (!showModalError) {
      await handleEndGame(workspace.provider!, workspace.program!);
    }

    const connection = workspace.connection as Connection;
    const wallet = {
      publicKey: workspace.provider?.publicKey as PublicKey,
    };
    const minAmount = 0.25;
    try {
      const balance = await connection.getBalance(wallet.publicKey);
      if (balance < minAmount * LAMPORTS_PER_SOL) {
        try {
          // First airdrop attempt
          await requestSolanaAirdrop(connection, wallet.publicKey);
        } catch (error1) {
          console.log("First airdrop attempt failed:", error1);
          try {
            // Second airdrop attempt using a different RPC
            const heliusConnection = new Connection(
              REACT_APP_HELIUS_RPC || "https://api.devnet.solana.com",
              "confirmed"
            );
            await requestSolanaAirdrop(heliusConnection, wallet.publicKey);
          } catch (error2) {
            console.log("Second airdrop attempt failed:", error2);
            // Third airdrop attempt using backend
            const backendSuccess = await requestBackendAirdrop(wallet.publicKey.toBase58());
            if (!backendSuccess) {
              throw new Error("All airdrop attempts failed. Please fund your wallet using web faucet:");
            }
          }
        }
        updateStepStatus("Requesting airdrop", "completed");
      }
    } catch (error) {
      console.log("Error while requesting airdrop: ", error);
      updateStepStatus("Requesting airdrop", "failed");
      setErrorMsg(`Airdrop request failed: ${error}`);
      setShowButtons(true);
      return;
    }

    try {
      const provider = workspace.provider!;
      const program = workspace.program!;
      await initializeGame(provider, program, level);
      await registerPlayerAddress(wallet.publicKey.toBase58());
      updateStepStatus("Initializing game", "completed");
      setShowModalError(false);
    } catch (error) {
      console.log("Error while initializing the game: ", error);
      updateStepStatus("Initializing game", "failed");
      setErrorMsg(`Initializing game failed: ${error}`);
      setShowButtons(true);
      return;
    }

    label === "Initiate" ? navigate(0) : navigate("/game");
  }
  
  return (
    <>
      <Grid item xs={12}>
        <Button
          variant="contained"
          color="primary"
          className="fixed-width-button"
          onClick={() => {
            if (label === "Continue") {
              navigate("/game");
            } else {
              setSelectLevelVisible(true);
            }
          }}
        >
          {label}
        </Button>
      </Grid>
      <Modal
        open={selectLevelVisible} 
        onClose={() => setSelectLevelVisible(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-end-game modal-select-levels" style={{background: "rgb(49 44 38)"}}>
          <div className="modal-header">
            <div onClick={() => setSelectLevelVisible(false)} role="button" className="close-icon">
              <img width="32" src="./icons/close.png" alt="Close" />
            </div>
          </div>
          <Typography id="modal-modal-description" fontSize="1.2rem">
             Select difficulty: 
          </Typography>   
          <Box className="modal-levels-buttons">
            <Tippy
              key="level 1"
              placement="right"
              disabled={!!isMobile}
              content={<span><span className="bold-text">x0.5</span> gems multiplier. <br />Barbarians spawn every 20 turns</span>}
            >
              <Button
                variant="contained"
                color="primary"
                className="fixed-width-button"
                onClick={() => createWalletAndStartGame(0)}
              >
                Easy
              </Button>
            </Tippy>
            <Tippy
              key="level 2"
              placement="right"
              disabled={!!isMobile}
              content={<span><span className="bold-text">x1</span> gems multiplier. <br />Barbarians spawn every 15 turns</span>}
            >
              <Button
                variant="contained"
                color="primary"
                className="fixed-width-button"
                onClick={() => createWalletAndStartGame(1)}
              >
                Medium
              </Button>
            </Tippy>
            <Tippy
              key="level 3"
              placement="right"
              disabled={!!isMobile}
              content={<span><span className="bold-text">x2</span> gems multiplier. <br />Barbarians spawn every 10 turns</span>}
            >
              <Button
                variant="contained"
                color="primary"
                className="fixed-width-button"
                onClick={() => createWalletAndStartGame(2)}
              >
                Hard
              </Button>
            </Tippy>
          </Box>
        </Box>
      </Modal>
    </>
  )
}

export default InitiateGameButton