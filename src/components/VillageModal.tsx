import React from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tippy from '@tippyjs/react';

import { Units } from '../Units'
import { Buildings, BuildingType } from '../Buildings'

interface VillageModalProps {
  show: boolean;
  onClose: () => void;
}


const CustomTooltip: React.FC<BuildingType> = ({ description, label, requirement }) => {
  return (
    <div className="custom-tooltip">
      <p className="header">{label}</p>
      {requirement ? (
        <p>LOCKED: {requirement}</p>
      ) : (
        <>
          <p>{description}</p>
          <span>
            {/* as a production cost */}
            Cost: 240
            <img src="./icons/gear.png" alt="gold" width="24" />
          </span>
        </>
      )}
    </div>
  )
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
        <div onClick={onClose} role="button" className="close-icon">
          <img width="32" src="./icons/close.png" alt="Close" />
        </div>
        <div className="modal-header">
          <h2>Choose Production</h2>
        </div>
        <h3 className="primary-border-with-box-shadow">Buildings</h3>
        <div className="modal-body">
          {Buildings.map((building) => (
            <Tippy
              key={building.type}
              placement="left"
              content={<CustomTooltip {...building} />}
            >
              <Box className={`body-item ${building.requirement ? 'locked' : ''} primary-border-with-box-shadow`}>
                <img src={`/${building.type}.png`} alt={building.label} width="50" />
                <Typography variant="body1">{building.label}</Typography>
                <div className="number-of-turns">
                  <span>{building.numberOfTurns}</span>
                  <img src="./icons/hourglass.png" width="20" alt="hourglass" />
                </div>
              </Box>
            </Tippy>
          ))}
        </div>
        <h3 className="primary-border-with-box-shadow units-header">Units</h3>
        <div className="modal-body">
          {Units.map((unit) => (
            <Tippy
              key={unit.type}
              placement="left"
              content={<CustomTooltip {...unit} />}
            >
              <Box className="body-item primary-border-with-box-shadow" key={unit.type}>
                <img src={`/${unit.type}.png`} alt={unit.label} width="50" />
                <Typography variant="body1">{unit.label}</Typography>
                <div className="number-of-turns">
                  <span>{unit.numberOfTurns}</span>
                  <img src="./icons/hourglass.png" width="20" alt="hourglass" />
                </div>
              </Box>
            </Tippy>
          ))}
        </div>
      </div>
    </Modal>
  );
};

export default VillageModal;
