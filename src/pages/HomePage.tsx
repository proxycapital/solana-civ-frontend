import React, { useState } from "react";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress, { CircularProgressProps } from "@mui/material/CircularProgress";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import InitiateGameButton from "../components/InitiateGameButton";
import { useWorkspace } from "../context/AnchorContext";
import { useModalError } from "../context/ModalErrorContext";

function CircularProgressWithLabel(props: CircularProgressProps & { value: number }) {
  return (
    <Box sx={{ position: "relative", display: "inline-flex" }} style={{ marginRight: "0.5rem" }}>
      <CircularProgress sx={{ color: "#cab37d" }} thickness={4} size={33} variant="determinate" {...props} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color="text.secondary"
          style={{ color: "white", fontSize: "0.7rem" }}
        >{`${Math.round(props.value)}%`}</Typography>
      </Box>
    </Box>
  );
}

const HomePage: React.FC = () => {
  const workspace = useWorkspace();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { showModalError } = useModalError();
  const [progressAirdrop, setProgressAirdrop] = useState<number>(75);
  const [progressInitialize, setPreogressInitialize] = useState<number>(0);

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
            {/* user has old session */}
            {!showModalError ? (
              <>
                <InitiateGameButton
                  setShowButtons={setShowButtons}
                  updateStepStatus={updateStepStatus}
                  setErrorMsg={setErrorMsg}
                  setProgressAirdrop={setProgressAirdrop}
                  setPreogressInitialize={setPreogressInitialize}
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
                setProgressAirdrop={setProgressAirdrop}
                setPreogressInitialize={setPreogressInitialize}
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
          <>
            <Grid item xs={12} style={{ textAlign: "left", width: "200px", color: "#fff", marginTop: "0.75rem" }}>
              <div style={{ display: "flex", alignItems: "center" }}>
                {initializationSteps[0].status === "pending" && <CircularProgressWithLabel value={progressAirdrop} />}
                {initializationSteps[0].status === "failed" && "❌ "}
                <span>Requesting airdrop</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", marginTop: "1rem" }}>
                {initializationSteps[1].status === "pending" && (
                  <CircularProgressWithLabel value={progressInitialize} />
                )}
                {initializationSteps[1].status === "failed" && "❌ "}
                <span>Initializing game</span>
              </div>
            </Grid>
          </>
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
