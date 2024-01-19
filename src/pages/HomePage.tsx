import React, { useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InitiateGameButton from '../components/InitiateGameButton'
import { useWorkspace } from "../context/AnchorContext";
import { useModalError } from "../context/ModalErrorContext";

const HomePage: React.FC = () => {
  const workspace = useWorkspace();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { showModalError } = useModalError();

  const [initializationSteps, setInitializationSteps] = useState([
    { name: "Requesting airdrop", status: "pending" },
    { name: "Initializing game", status: "pending" },
  ]);
  const [showButtons, setShowButtons] = useState(true);

  const updateStepStatus = (stepName: string, status: string) => {
    setInitializationSteps((steps) => steps.map((step) => (step.name === stepName ? { ...step, status } : step)));
  };

  return (
    <Container className="home-container">
      <Grid container direction="column" alignItems="center" justifyContent="center" className="center-grid">
        <Grid item xs={12}>
          <img src="/logo.png" alt="Logo" className="logo" />
        </Grid>
        {showButtons ? (
          <>
            {/* @todo: get loading state to fix initial showing of 2 buttons */}
            {/* user has old session */}
            {!showModalError ? (
              <>
                <InitiateGameButton
                  setShowButtons={setShowButtons}
                  updateStepStatus={updateStepStatus}
                  setErrorMsg={setErrorMsg}
                  label="New Game"
                />
                <InitiateGameButton
                  setShowButtons={setShowButtons}
                  updateStepStatus={updateStepStatus}
                  setErrorMsg={setErrorMsg}
                  label="Continue"
                />
              </>
            ) : (
              // no user session
              <InitiateGameButton
                setShowButtons={setShowButtons}
                updateStepStatus={updateStepStatus}
                setErrorMsg={setErrorMsg}
              />
            )}
            
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
