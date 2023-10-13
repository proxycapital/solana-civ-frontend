import React, { useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { Connection, PublicKey, LAMPORTS_PER_SOL } from "@solana/web3.js";
import { useWorkspace } from "../context/AnchorContext";
import { initializeGame } from "../utils/solanaUtils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const { REACT_APP_HELIUS_RPC } = process.env;

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

  async function requestBackendAirdrop(address: string): Promise<boolean> {
    try {
      const response = await fetch("https://api.solciv.com/airdrop", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.success;
      } else {
        throw new Error("Failed to request airdrop from backend.");
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  const requestSolanaAirdrop = async (connection: Connection, address: PublicKey) => {
    const airdropSignature = await connection.requestAirdrop(address, 1 * LAMPORTS_PER_SOL);
    const latestBlockHash = await connection.getLatestBlockhash();
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: airdropSignature,
    });
  };

  async function registerPlayerAddress(address: string): Promise<boolean> {
    try {
      const response = await fetch("https://api.solciv.com/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ address }),
      });
      if (response.ok) {
        const data = await response.json();
        return data.success;
      } else {
        throw new Error("Failed to register player address.");
      }
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  }

  const createWalletAndStartGame = async () => {
    setShowButtons(false);
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
      await initializeGame(provider, program);
      await registerPlayerAddress(wallet.publicKey.toBase58());
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
            <Grid item xs={12} key={index} style={{ textAlign: "left", width: "200px", color: "#fff" }}>
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
            <p style={{ color: "#fff", textAlign: "center" }}>
              Address: <b>{workspace.provider?.publicKey.toBase58()}</b>
              <br />
              Devnet faucet:{" "}
              <a href="https://faucet.solana.com/" style={{ color: "#fff" }} rel="noreferrer" target="_blank">
                https://faucet.solana.com/
              </a>
            </p>
          </div>
        )}
      </Grid>
    </Container>
  );
};

export default HomePage;
