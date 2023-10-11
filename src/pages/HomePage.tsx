import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWorkspace } from "../context/AnchorContext";
import { initializeGame } from "../utils/solanaUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const workspace = useWorkspace();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [initializationSteps, setInitializationSteps] = useState([
    { name: "Requesting airdrop", status: "pending" },
    { name: "Initializing game", status: "pending" },
  ]);
  const [showButtons, setShowButtons] = useState(true);

  const updateStepStatus = (stepName: string, status: string) => {
    setInitializationSteps((steps) => steps.map((step) => (step.name === stepName ? { ...step, status } : step)));
  };

  const createWalletAndStartGame = async () => {
    setShowButtons(false);
    const connection = workspace.connection as Connection;
    const wallet = {
      publicKey: workspace.provider?.publicKey as PublicKey,
    };

    try {
      // get sol balance
      const balance = await connection.getBalance(wallet.publicKey);
      console.log("Balance: ", balance);
      if (balance >= 0.1 * LAMPORTS_PER_SOL) {
        updateStepStatus("Requesting airdrop", "completed");
      } else {
        const airdropSignature = await connection.requestAirdrop(wallet.publicKey, 1 * LAMPORTS_PER_SOL);

        const latestBlockHash = await connection.getLatestBlockhash();

        await connection.confirmTransaction({
          blockhash: latestBlockHash.blockhash,
          lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
          signature: airdropSignature,
        });
        updateStepStatus("Requesting airdrop", "completed");
      }
    } catch (error) {
      console.log("Error while requesting airdrop: ", error);
      updateStepStatus("Requesting airdrop", "failed");
      setErrorMsg(
        `Send devnet SOL to your in-game address and try again: ${wallet.publicKey.toBase58()}. Airdrop request failed: ${error}`
      );
      setShowButtons(true);
      return;
    }

    try {
      // @todo: add better checks for workspace/provider/program
      const provider = workspace.provider!;
      const program = workspace.program!;
      await initializeGame(provider, program);
      updateStepStatus("Initializing game", "completed");
    } catch (error) {
      console.log("Error while initializing the game: ", error);
      updateStepStatus("Initializing game", "failed");
      setErrorMsg(`Initializing game failed: ${error}`);
      setShowButtons(true);
      return;
    }

    navigate("/game");
  };

  return (
    <Container className="home-container">
      <Grid container direction="column" alignItems="center" justifyContent="center" className="center-grid">
        <Grid item xs={12}>
          <img src="/logo.png" alt="Logo" className="logo" />
        </Grid>
        {showButtons ? (
          <>
            <Grid item xs={12}>
              <Button
                variant="contained"
                color="primary"
                className="fixed-width-button"
                onClick={createWalletAndStartGame}
              >
                Play with bots
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Button disabled variant="contained" color="primary" className="fixed-width-button">
                <FontAwesomeIcon icon={faLock} />
                &nbsp; Multiplayer
              </Button>
            </Grid>
            <Grid item xs={12}>
              <div className="btn-text">
                <a href="https://github.com/proxycapital/solana-civ#game-design" target="_blank" rel="noreferrer">
                  Documentation
                </a>
              </div>
            </Grid>
            <Grid item xs={12}>
              <div className="btn-text">
                <a href="https://twitter.com/solanaciv" target="_blank" rel="noreferrer">
                  Twitter | X
                </a>
              </div>
            </Grid>
          </>
        ) : (
          initializationSteps.map((step, index) => (
            <Grid item xs={12} key={index} style={{ textAlign: "left", width: "200px", color: '#fff' }}>
              <pre>
                {step.status === "completed" && "✅ "}
                {step.status === "failed" && "❌ "}
                {step.status === "pending" && "⏳ "}
                {step.name}
              </pre>
            </Grid>
          ))
        )}
        {errorMsg && (
          <div className="error-container">
            <span className="error-message">{errorMsg}</span>
          </div>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
