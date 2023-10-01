import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Tippy from '@tippyjs/react';
import { toast } from "react-toastify";

import { useGameState } from "../context/GameStateContext";
import { useSound } from "../context/SoundContext";
import { useWorkspace } from "../context/AnchorContext";
import { addToProductionQueue } from '../utils/solanaUtils';
import { AllUnits, UnitType } from '../Units'
import { AllBuildings, BuildingType } from '../Buildings'

interface CityModalProps {
  show: boolean;
  onClose: () => void;
  cityId: number | null;
}

const CustomTooltip: React.FC<BuildingType & { selectedTab: number }> = ({
  description, label, requirement, selectedTab,
}) => {
  return (
    <div className="custom-tooltip">
      <p className="header">{label}</p>
      {requirement ? (
        <p>LOCKED: {requirement}</p>
      ) : (
        <>
          <p>{description}</p>
          <span>
            {selectedTab === 0 ? (
              <>
                Cost: 240
                <img src="./icons/gear.png" alt="gear" width="24" />
              </>
            ) : (
              <>
                Cost: 200
                <img src="./icons/gold.png" alt="gold" width="24" />
              </>
            )}
          </span>
        </>
      )}
    </div>
  )
}

const CityModal: React.FC<CityModalProps> = ({ cityId, show, onClose }) => {
  const { program, provider } = useWorkspace();
  const { playSound } = useSound();
  const { fetchPlayerState, cities } = useGameState();
  const [selectedTab, setSelectedTab] = useState(0)
  const [buildingsToBuild, setBuildingsToBuild] = useState<BuildingType[]>([])

  const cityData = cities.find((city) => city.cityId === cityId);

  // remove buildings from Buildings
  useEffect(() => {
    if (!cityData) return
    let buildingsToBuild = AllBuildings.filter((building1) => !cityData?.buildings.some((building2: any) => building1.type === Object.keys(building2)[0]))
    buildingsToBuild = buildingsToBuild.filter((building1) => !cityData?.productionQueue.some((building2: any) => building1.type === Object.keys(building2["building"]["0"])[0]))

    setBuildingsToBuild(buildingsToBuild);
  }, [cityData]);

  useEffect(() => {
    if (!show) setSelectedTab(0)
  }, [show])

  const handleAddToProductionQueue = async (item: BuildingType, type: 'building' | 'unit') => {
    try {
      const tx = addToProductionQueue(provider!, program!, Number(cityId), { [type]: { "0": { [item.type]: {} } } });
      const signature = await toast.promise(tx, {
        pending: "Adding to production queue",
        success: "Added to production queue",
        error: "Error adding to production queue",
      });
      if (typeof signature === "string") {
        playSound("construction");
        console.log(`Add to production queue TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      console.log("Error adding to production queue: ", error);
    }
    await fetchPlayerState();
  };

  const handleRemoveFromProductionQueue = async (item: BuildingType | UnitType, type: 'building' | 'unit') => {

  }

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="village-modal-title"
      aria-describedby="village-modal-description"
    >
      <>
        {cityData?.productionQueue?.length > 0 ? (
          <div className="modal production-queue-modal">
            <h3 className="primary-border-with-box-shadow">Queue</h3>
            {cityData?.productionQueue?.map((productionItem: any) => {
              const item = productionItem["building"] ? productionItem["building"]["0"] : productionItem["unit"]["0"]
              const itemType = Object.keys(item)[0];
              let itemData: BuildingType | UnitType | undefined
              if (productionItem["building"]) {
                itemData = AllBuildings.find((building) => building.type === itemType)
              } else {
                itemData = AllUnits.find((unit) => unit.type === itemType)
              }

              return (
                <div className="production-item primary-border-with-box-shadow">
                  {productionItem["building"] ? (
                    <Box className="body-item">
                      <img src={`/${itemData?.type}.png`} alt={itemData?.label} width="50" />
                      <Typography variant="body1">{itemData?.label}</Typography>
                      <span
                        onClick={() => itemData && handleRemoveFromProductionQueue(itemData, 'unit')}
                        className="remove-button primary-border-with-box-shadow"
                      >
                        Remove
                      </span>
                    </Box>
                  ) : (
                    <Box className="body-item">
                      <img src={`/${itemData?.type}.png`} alt={itemData?.label} width="50" />
                      <Typography variant="body1">{itemData?.label}</Typography>
                      <span
                        onClick={() => itemData && handleRemoveFromProductionQueue(itemData, 'unit')}
                        className="remove-button primary-border-with-box-shadow"
                      >
                        Remove
                      </span>
                    </Box>
                  )}
                </div>
              )}
            )}
          </div>
        ) : null}
        <div className="modal village-modal">
          <div onClick={onClose} role="button" className="close-icon">
            <img width="32" src="./icons/close.png" alt="Close" />
          </div>
          <Tabs
            TabIndicatorProps={{ style: { background: '#ccc', height: '2.5px' }}}
            className="modal-header-tabs" 
            value={selectedTab}
            onChange={(_e, newValue) => setSelectedTab(newValue)}
            centered
          >
            <Tab label="Production"/>
            <Tab label="Insta Buy"/>
          </Tabs>
      
          <h3 className="primary-border-with-box-shadow">Buildings</h3>
          <div className="modal-body">
            {buildingsToBuild.map((building) => (
              <Tippy
                key={building.type}
                placement="left"
                content={<CustomTooltip {...building} selectedTab={selectedTab} />}
              >
                <Box
                  onClick={() => handleAddToProductionQueue(building, 'building')}
                  className={`body-item ${building.requirement ? 'locked' : ''} primary-border-with-box-shadow`}
                >
                  <img src={`/${building.type}.png`} alt={building.label} width="50" />
                  <Typography variant="body1">{building.label}</Typography>
                  <div className="number-of-turns">
                    {selectedTab === 0 ? (
                      <>
                        <span>{building.numberOfTurns}</span>
                        <img src="./icons/hourglass.png" width="20" alt="hourglass" />
                      </>
                    ) : (
                      <>
                        <span>{building.goldCost}</span>
                        <img src="./icons/gold.png" width="20" alt="gold" />
                      </>
                    )}
                  </div>
                </Box>
              </Tippy>
            ))}
          </div>
          <h3 className="primary-border-with-box-shadow units-header">Units</h3>
          <div className="modal-body">
            {AllUnits.map((unit) => (
              <Tippy
                key={unit.type}
                placement="left"
                content={<CustomTooltip {...unit} selectedTab={selectedTab} />}
              >
                <Box
                  onClick={() => handleAddToProductionQueue(unit, 'unit')}
                  className="body-item primary-border-with-box-shadow" key={unit.type}
                >
                  <img src={`/${unit.type}.png`} alt={unit.label} width="50" />
                  <Typography variant="body1">{unit.label}</Typography>
                  <div className="number-of-turns">
                    {selectedTab === 0 ? (
                      <>
                        <span>{unit.numberOfTurns}</span>
                        <img src="./icons/hourglass.png" width="20" alt="hourglass" />
                      </>
                    ) : (
                      <>
                        <span>{unit.goldCost}</span>
                        <img src="./icons/gold.png" width="20" alt="gold" />
                      </>
                    )}
                  </div>
                </Box>
              </Tippy>
            ))}
          </div>
        </div>
      </>
    </Modal>
  );
};

export default CityModal;
