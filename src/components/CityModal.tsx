import React, { useEffect, useState } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import Tippy from "@tippyjs/react";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";

import { useGameState } from "../context/GameStateContext";
import { useSound } from "../context/SoundContext";
import { useWorkspace } from "../context/AnchorContext";
import { addToProductionQueue, removeFromProductionQueue, purchaseWithGold, repairCity } from "../utils/solanaUtils";
import { AllUnits, UnitType } from "../Units";
import { AllBuildings, BuildingType } from "../Buildings";
import CustomTooltip from "./CustomTooltip";

interface CityModalProps {
  show: boolean;
  onClose: () => void;
  cityId: number | null;
}

const CityModal: React.FC<CityModalProps> = ({ cityId, show, onClose }) => {
  const { program, provider } = useWorkspace();
  const { playSound } = useSound();
  const { fetchPlayerState, cities, technologies } = useGameState();

  const [researchedTechnologies, setResearchTechnologies] = useState(new Set<string>());
  const [selectedTab, setSelectedTab] = useState(0);
  const [buildingsToBuild, setBuildingsToBuild] = useState<BuildingType[]>([]);

  const city = cities.find((city) => city.cityId === cityId);

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

  useEffect(() => {
    if (!city) return;

    const unlockedTech = new Set(technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]));
    setResearchTechnologies(unlockedTech);

    const extractBuildingType = (building: any) => {
      if (building["building"]) {
        return Object.keys(building["building"]["0"])[0];
      }
      return Object.keys(building)[0];
    };

    const existingBuildings = new Set(city.buildings.map(extractBuildingType));
    const buildingsInQueue = new Set(city.productionQueue.map(extractBuildingType));

    const buildingsToBuild = AllBuildings.filter(
      (building) => !existingBuildings.has(building.type) && !buildingsInQueue.has(building.type)
    );

    const sortedBuildings = buildingsToBuild.sort((a, b) => {
      const isAUnlocked = a.requirement ? unlockedTech.has(a.requirement) : true;
      const isBUnlocked = b.requirement ? unlockedTech.has(b.requirement) : true;
      return +isBUnlocked - +isAUnlocked;
    });

    setBuildingsToBuild(sortedBuildings);
  }, [city, technologies.researchedTechnologies]);

  useEffect(() => {
    if (!show) setSelectedTab(0);
  }, [show]);

  const handleAddToProductionQueue = async (item: BuildingType, type: "building" | "unit") => {
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
    } catch (error: any) {
      console.log("Error adding to production queue: ", error);
      if (error.message.includes("QueueFull")) {
        toast.error("Production queue is currently at full capacity.");
      }
      if (error.message.includes("TechnologyNotResearched")) {
        toast.error("You need to unlock this technology via Research.");
      }
      if (error.message.includes("InsufficientResources")) {
        toast.error("Not enough resources. See unit tooltip for more info.");
      }
      if (error.message.includes("InsufficientGoldForMaintenance")) {
        toast.error("You don't have enough of gold for unit maintenance.");
      }
    }
    await fetchPlayerState();
  };

  const handleRemoveFromProductionQueue = async (item: BuildingType | UnitType, itemIndex: number) => {
    try {
      const tx = removeFromProductionQueue(provider!, program!, Number(cityId), itemIndex);
      const signature = await toast.promise(tx, {
        pending: "Removing from production queue",
        success: "Removed from production queue",
        error: "Error removing from production queue",
      });
      if (typeof signature === "string") {
        console.log(`Remove from production queue TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error: any) {
      console.log("Error removing from production queue: ", error);
    }
    await fetchPlayerState();
  };

  const handleRepairCity = async () => {
    try {
      const tx = repairCity(provider!, program!, Number(cityId));
      const signature = await toast.promise(tx, {
        pending: 'Repairing city',
        success: 'City repaired',
        error: 'Error during city repair',
      });
      if (typeof signature === "string") {
        console.log(`Repair City, TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error: any) {
      console.log(error.message)
      if (error.message.includes("NotDamagedCity")) {
        await toast.error("Cannt repair full HP city");
      }
      if (error.message.includes("InsufficientStone")) {
        await toast.error("Not enough stone");  
      }
      if (error.message.includes("InsufficientWood")) {
        await toast.error("Not enough wood");  
      }
      console.log(`Error repairing city ${cityId}: `, error);
    }
    await fetchPlayerState();
  };

  const handlePurchaseWithGold = async (item: BuildingType | UnitType, type: "building" | "unit") => {
    try {
      const tx = purchaseWithGold(provider!, program!, Number(cityId), { [type]: { "0": { [item.type]: {} } } });
      const signature = await toast.promise(tx, {
        pending: `Buying ${item.label}`,
        success: `Bought ${item.label}`,
        error: `Error during buying ${item.label}`,
      });
      if (typeof signature === "string") {
        console.log(`Buy ${item.label} TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error: any) {
      if (error.message.includes("InsufficientGold")) {
        await toast.error("Insufficient Gold Balance");
      }
      console.log(`Error buying ${item.label}: `, error);
    }
    await fetchPlayerState();
  };

  return (
    <Modal
      open={show}
      onClose={onClose}
      aria-labelledby="village-modal-title"
      aria-describedby="village-modal-description"
    >
      <>
        {city?.productionQueue && city?.productionQueue?.length > 0 ? (
          <div className="modal production-queue-modal">
            <h3 className="">Production Queue</h3>
            {city?.productionQueue?.map((productionItem: any, index: number) => {
              const item = productionItem["building"] ? productionItem["building"]["0"] : productionItem["unit"]["0"];
              const itemType = Object.keys(item)[0];
              let itemData: BuildingType | UnitType | undefined;
              if (productionItem["building"]) {
                itemData = AllBuildings.find((building) => building.type === itemType);
              } else {
                itemData = AllUnits.find((unit) => unit.type === itemType);
              }

              return (
                <div key={`production-queue-item-${index}`} className="production-item primary-border-with-box-shadow">
                  <Box className="body-item">
                    {!productionItem["building"] && (
                      <img src={`/${itemData?.type}.png`} alt={itemData?.label} width="50" />
                    )}
                    <Typography variant="body1">{itemData?.label}</Typography>
                    <span
                      onClick={() => itemData && handleRemoveFromProductionQueue(itemData, index)}
                      className="remove-button primary-border-with-box-shadow"
                    >
                      Remove
                    </span>
                  </Box>
                  {index === 0 && (
                    <p style={{ margin: 0, textAlign: "center" }}>
                      Ready in&nbsp;
                      <b>
                        {itemData?.productionCost
                          ? Math.round(
                              (itemData?.productionCost - city.accumulatedProduction) / city.productionYield
                            )
                          : ""}
                      </b>{" "}
                      turns
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        ) : null}

        {/* short info about city */}
        {city ? (
          <div className="modal-city-info primary-border-with-box-shadow">
            <div className="city-name">
              <h2>{city.name}</h2>
            </div>
            <div className="city-resources-income">
              <div>
                <img width="32" src="./icons/food.png" alt="apple" />
                <span>+{city.foodYield}</span>
              </div>
              <div>
                <img width="32" src="./icons/science.png" alt="scienct" />
                <span>+{city.scienceYield}</span>
              </div>
              <div>
                <img width="32" src="./icons/gold.png" alt="gold" />
                <span>+{city.goldYield}</span>
              </div>
              <div>
                <img width="32" src="./icons/hammer.png" alt="hummer" />
                <span>+{city.productionYield}</span>
              </div>
            </div>
            <div className="line-container">
              <img src="/icons/diamond.png" alt="" width="32" className="center-image" />
            </div>
            <div className="city-stats">
              <img src="/icons/health.png" alt="health" /> Health:&nbsp;<b>{city.health}/100</b>
            </div>
            <div className="city-stats">
              <img src="/icons/health.png" alt="health" /> Health:&nbsp;<b>{city.wallHealth}/100</b>
            </div>
            <div className="city-stats">
              <img src="/icons/health.png" alt="population" /> Population:&nbsp;<b>{city.population}</b>
            </div>
            <div className="city-stats">
              <img src="/icons/attack.png" alt="strength" />
              Strength:&nbsp;<b>{city.attack}</b>
            </div>
            {city.health < 100 && (
              <Button
                className={`unit-action-button ${city.health === 100 && 'disabled'}`}
                variant="outlined"
                onClick={handleRepairCity}
              >
                <img src="/icons/build.png" alt="" className="unit-icon" />
                Repair ({(100 - city.health) * 2}
                  <img className="unit-icon" src="/icons/wood.png" alt="stone" /> + {(100 - city.health) * 2}
                  <img className="unit-icon stone-icon" src="/icons/stone.png" alt="stone" />)
              </Button>
            )}
          </div>
        ) : null}

        <div className="modal city-modal">
          <div className="city-modal-header">
            <div onClick={onClose} role="button" className="close-icon">
              <img width="32" src="./icons/close.png" alt="Close" />
            </div>
            <Tabs
              TabIndicatorProps={{ style: { background: "#ccc", height: "2.5px" } }}
              className="modal-header-tabs"
              value={selectedTab}
              onChange={(_e, newValue) => setSelectedTab(newValue)}
              centered
            >
              <Tab label="Production" />
              <Tab label="Purchase" />
              {isMobile && <Tab label="Queue" />}
            </Tabs>
          </div>
          {/* {isMobile && selectedTab === 2 && (
            <span> Queue</span>
          )} */}
          {selectedTab !== 2 && (
            <div className="city-modal-body">
              <h3 className="">Units</h3>
              <div className="modal-body">
                {AllUnits.map((unit) => {
                  const isUnlocked = unit.requirement ? researchedTechnologies.has(unit.requirement) : true;
                  return (
                    <Tippy
                      key={unit.type}
                      placement="left"
                      content={<CustomTooltip {...unit} isUnlocked={isUnlocked} selectedTab={selectedTab} />}
                    >
                      <Box
                        onClick={() => {
                          if (!isUnlocked) {
                            toast.error(`You need to research "${unit.tech}"`);
                            return;
                          }
                          if (selectedTab === 0) {
                            handleAddToProductionQueue(unit, "unit");
                            return;
                          }
                          handlePurchaseWithGold(unit, "unit");
                        }}
                        className={`body-item ${!isUnlocked ? "locked" : ""} primary-border-with-box-shadow`}
                        key={unit.type}
                      >
                        <img src={`/${unit.type}.png`} alt={unit.label} width="50" />
                        <Typography variant="body1">{unit.label}</Typography>
                        <div className="number-of-turns">
                          {selectedTab === 0 ? (
                            <>
                              <span>
                                {city ? `${Math.round(unit.productionCost / city.productionYield)} Turns` : ""}
                              </span>
                              {/* <img src="./icons/hourglass.png" width="20" alt="hourglass" /> */}
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
                  );
                })}
              </div>
              <h3 className="">Buildings</h3>
              <div className="modal-body">
                {buildingsToBuild.map((building) => {
                  const isUnlocked = building.requirement ? researchedTechnologies.has(building.requirement) : true;
                  return (
                    <Tippy
                      key={building.type}
                      placement="left"
                      content={<CustomTooltip {...building} isUnlocked={isUnlocked} selectedTab={selectedTab} />}
                    >
                      <Box
                        onClick={() => {
                          if (!isUnlocked) {
                            toast.error(`You need to research "${building.tech}"`);
                            return;
                          }
                          if (selectedTab === 0) {
                            handleAddToProductionQueue(building, "building");
                            return;
                          }
                          handlePurchaseWithGold(building, "building");
                        }}
                        className={`body-item ${!isUnlocked ? "locked" : ""} primary-border-with-box-shadow`}
                      >
                        <Typography variant="body1">{building.label}</Typography>
                        <div className="number-of-turns">
                          {selectedTab === 0 ? (
                            <>
                              <span>
                                {city ? Math.round(building.productionCost / city.productionYield) : ""}
                              </span>
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
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </>
    </Modal>
  );
};

export default CityModal;
