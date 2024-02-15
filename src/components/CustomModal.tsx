import React, { useState, useEffect } from "react";
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

  return (
    <Modal open={isOpen} onClose={onClose} style={{ zIndex: "1000" }}>
      <Box
        className="custom-modal"
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          color: "white",
          p: 3,
          backdropFilter: "blur(8px)",
          minWidth: title === "New Research" ? "600px" : "100%",
          minHeight: title === "New Research" ? "50vh" : "100vh",
          borderRadius: title === "New Research" ? "8px" : 0,
          border: title === "New Research" ? "1px solid #927F61" : "none",
          padding: "0",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          outline: "none",
        }}
      >
        {(title !== "New Research" || isMobile) && (
          <IconButton
            onClick={onClose}
            className="close-button"
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              color: "#979797",
              padding: "5px 8px",
              borderRadius: "8px",
              border: "2px solid var(--light-gradient, #927f61)"
            }}
          >
            <FontAwesomeIcon icon={faClose} />
          </IconButton>
        )}
        <div className="line-container">
          <div className="star-icon left">
            <img src="/icons/star.png" width="12" alt="" />
          </div>
          <h2 className="title">{title}</h2>
          <div className="star-icon right">
            <img src="/icons/star.png" width="12" alt="" />
          </div>
        </div>
        {children}
      </Box>
    </Modal>
  );
};

export default CustomModal;
