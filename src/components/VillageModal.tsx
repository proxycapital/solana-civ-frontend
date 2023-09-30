import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

import { Units } from '../units'
import { Buildings } from '../buildings'

interface VillageModalProps {
  show: boolean;
  onClose: () => void;
}

const VillageModal: React.FC<VillageModalProps> = ({ show, onClose }) => {
  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="village-modal-title"
      aria-describedby="village-modal-description"
    >
      <div className="modal village-modal">
        <div className="modal-header">
          <h2>Choose Production</h2>
          <div className="close-icon" />
        </div>
        <h3 className="primary-border-with-box-shadow">Buildings</h3>
        <div className="modal-body">
          {Buildings.map((building) => (
            <Box className="body-item primary-border-with-box-shadow" key={building.type}>
              <img src={`/${building.type}.png`} alt={building.label} width="50" />
              <Typography variant="body1">{building.label}</Typography>
              <div className="number-of-turns">
                <span>{building.numberOfTurns}</span>
                <img src="./icons/hourglass.png" width="20" alt="hourglass" />
              </div>
            </Box>
          ))}
        </div>
        <h3 className="primary-border-with-box-shadow units-header">Units</h3>
        <div className="modal-body">
          {Units.map((unit) => (
            <Box className="body-item primary-border-with-box-shadow" key={unit.type}>
              <img src={`/${unit.type}.png`} alt={unit.label} width="50" />
              <Typography variant="body1">{unit.label}</Typography>
              <div className="number-of-turns">
                <span>{unit.numberOfTurns}</span>
                <img src="./icons/hourglass.png" width="20" alt="hourglass" />
              </div>
            </Box>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default VillageModal;
