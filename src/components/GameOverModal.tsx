import React from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import { useGameState } from "../context/GameStateContext";
import { useWorkspace } from "../context/AnchorContext";
import { handleEndGame } from "../utils/solanaUtils";

interface GameOverModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onClose }) => {
  const { program, provider } = useWorkspace();
  const { game } = useGameState();

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box className="modal-end-game">
        <Typography id="modal-modal-title" variant="h6" component="h2">
          {game.defeat ? "You Lost!" : "🎉 You Won! 🎉"}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {game.defeat
            ? "It seems you don’t have any more cities and units left."
            : "You have defeated all the enemy units and destroyed all the cities!"}
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          {game.defeat
            ? "Better luck next time!"
            : "Do not forget to withdraw your gems! After a successful withdrawal, you can conclude this match by clicking the Skull button."}
        </Typography>
        {game.defeat && (
          <Button
            onClick={() => handleEndGame(provider!, program!, "/")}
            variant="contained"
            color="error"
            sx={{ mt: 2 }}
          >
            End Game
          </Button>
        )}
      </Box>
    </Modal>
  );
};

export default GameOverModal;
