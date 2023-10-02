import React from "react";
import Modal from "@mui/material/Modal";
import { Box } from "@mui/system";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import * as anchor from "@coral-xyz/anchor";
import { useWorkspace } from "../context/AnchorContext";

interface GameOverModalProps {
    isOpen: boolean;
    onClose: () => void;
  }
  
  const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onClose }) => {
    const { program, provider } = useWorkspace();

    const handleEndGame = async() => {
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
            console.error("Failed to close game", error);
            alert(error);
            return;
          }
          // redirect to reset the context & local state
          window.location.href = "/";
    };

    return (
        <Modal
        open={isOpen} 
        onClose={onClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box className="modal-end-game">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            You Lost!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            It seems you don’t have any more cities and units left.
          </Typography>
          <Button onClick={handleEndGame} variant="contained" color="error" sx={{ mt: 2 }}>
            End Game
          </Button>
        </Box>
      </Modal>
    );

};

export default GameOverModal;