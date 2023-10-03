import React from "react";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { Box } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";

interface CustomModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const CustomModal: React.FC<CustomModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <Modal open={isOpen} onClose={onClose} style={{ zIndex: "20000" }}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "rgba(0, 0, 0, 0.8)",
          color: "white",
          p: 3,
          backdropFilter: "blur(8px)",
          minWidth: "100%",
          minHeight: "100vh",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 0,
            right: 0,
            padding: "10px 15px",
            color: "#979797",
            borderRadius: "0",
            border: "1px solid #979797",
          }}
        >
          <FontAwesomeIcon icon={faClose} />
        </IconButton>
        <h2
          style={{
            border: "1px solid #fff",
            borderRadius: "5px",
            padding: "10px 15px",
          }}
        >
          {title}
        </h2>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
