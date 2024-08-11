import React from "react";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import "../styles/HomePage.css";

const HomePage: React.FC = () => {
  return (
    <Container maxWidth={false} disableGutters className="container">
      {/* Top Menu */}
      <Box component="header" className="header">
        <Box className="menu-items">
          <Typography variant="h6" color="white">
            Quests
          </Typography>
          <Typography variant="h6" color="white">
            Leaderboard
          </Typography>
          <Typography variant="h6" color="white">
            Profile
          </Typography>
        </Box>
        <Box className="balance">
          <Box style={{ display: "flex", alignItems: "center", color: "white" }}>
            <img src="/icons/sol.png" alt="Solana" />
            <Typography variant="h6">0.25</Typography>
          </Box>
          <Box style={{ display: "flex", alignItems: "center", color: "white" }}>
            <img src="/icons/gems.png" alt="Gems" />
            <Typography variant="h6">100</Typography>
          </Box>
        </Box>
      </Box>

      {/* Main Content */}
      <Box className="main-content">
        <Grid container justifyContent="center" alignItems="center" spacing={2} className="grid-container">
          <Grid item xs={12} md={4} className="grid-item">
            <Box className="block">
              <Typography variant="h5" color="white" fontWeight="bold">
                PLAYGROUND
              </Typography>
              <Typography variant="body1" color="white">
                Play with a bot to learn basics
              </Typography>
              <img src="/viking.png" alt="Viking" className="viking" />
            </Box>
          </Grid>

          <Grid item xs={12} md={4} className="grid-item">
            <Box className="block">
              <Typography variant="h5" color="white" fontWeight="bold">
                MISSIONS
              </Typography>
              <Typography variant="body1" color="white">
                Complete story missions to earn gems.
              </Typography>
              <Box className="label">
                Get 300 <img src="/icons/gems.png" alt="Gems" style={{ width: "1rem", verticalAlign: "middle" }} />
              </Box>
              <img src="/empress.png" alt="Empress" className="empress" />
            </Box>
          </Grid>

          <Grid item xs={12} md={2} className="grid-item">
            <Box className="block block-lootbox">
              <img src="/lootbox-lvl0.png" alt="Lootbox" className="lootbox" />
              <Box className="lootbox-label">
                Pre-season lootbox
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Footer */}
      <Box component="footer" className="footer"></Box>
    </Container>
  );
};

export default HomePage;
