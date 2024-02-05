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
import { addToProductionQueue, removeFromProductionQueue, purchaseWithGold, repairWall } from "../utils/solanaUtils";
import { AllUnits, UnitType } from "../Units";
import { AllBuildings, BuildingType } from "../Buildings";
import CustomTooltip from "./CustomTooltip";
import { getUnitOrBuildingStats } from "../utils";
import { ErrorCodes, useError } from "../hooks/error.hook";

interface CityModalProps {
  show: boolean;
  onClose: () => void;
  cityId: number | null;
}

const CityModal: React.FC<CityModalProps> = ({ cityId, show, onClose }) => {
  const { program, provider } = useWorkspace();
  const { playSound } = useSound();
  const { fetchPlayerState, cities, technologies } = useGameState();
  const { handleError } = useError();

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
      (building) => !existingBuildings.has(building.type) && !buildingsInQueue.has(building.type),
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

  const getFoodNeededForGrowth = (population: number) => {
    return Math.floor(0.1082 * Math.pow(population, 2) + 10.171 * population + 1.929);
  };

  const handleAddToProductionQueue = async (item: BuildingType, type: "building" | "unit") => {
    try {
      const tx = addToProductionQueue(provider!, program!, Number(cityId), { [type]: { "0": { [item.type]: {} } } });
      const signature = await toast.promise(tx, {
        pending: "Adding to production queue",
        success: "Added to production queue",
        error: undefined,
      });
      if (typeof signature === "string") {
        playSound("construction");
        console.log(`Add to production queue TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error: any) {
      handleError({
        error,
        logMessage: "Error adding to production queue",
        defaultError: ErrorCodes.ErrorProductionQueue,
        defaultErrorsParams: {
          cityId,
        },
      });
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

  const handleRepairWall = async () => {
    try {
      const tx = repairWall(provider!, program!, Number(cityId));
      const signature = await toast.promise(tx, {
        pending: "Repairing city",
        success: "City repaired",
        error: "Error during city repair",
      });
      if (typeof signature === "string") {
        console.log(`Repair City, TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error: any) {
      handleError({
        error,
        logMessage: "Error repairing city",
        defaultError: ErrorCodes.RepairFailed,
        defaultErrorsParams: {
          cityId,
        },
      });
    }
    await fetchPlayerState();
  };

  const handlePurchaseWithGold = async (item: BuildingType | UnitType, type: "building" | "unit") => {
    try {
      const tx = purchaseWithGold(provider!, program!, Number(cityId), { [type]: { "0": { [item.type]: {} } } });
      const signature = await toast.promise(tx, {
        pending: `Buying ${item.label}`,
        success: `Bought ${item.label}`,
        error: undefined,
      });
      if (typeof signature === "string") {
        console.log(`Buy ${item.label} TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      }
    } catch (error) {
      handleError({
        error,
        logMessage: `Error buying ${item.label}`,
        defaultError: ErrorCodes.PurchaseFailed,
        defaultErrorsParams: {
          label: item.label,
        },
      });
    }
    await fetchPlayerState();
  };

  const cityBuildings = city?.buildings.map((building) => {
    return Object.keys(building)[0];
  });

  let wallMaxHealth = null;
  if (cityBuildings?.includes("wallIndustrial")) {
    wallMaxHealth = 200;
  } else if (cityBuildings?.includes("wallRenaissance")) {
    wallMaxHealth = 150;
  } else if (cityBuildings?.includes("wallMedieval")) {
    wallMaxHealth = 100;
  } else if (cityBuildings?.includes("wall")) {
    wallMaxHealth = 50;
  }

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
                    <p className="ready-in-text">
                      {itemData?.productionCost &&
                        (Math.round((itemData.productionCost - city.accumulatedProduction) / city.productionYield) <=
                        0 ? (
                          <span>Ready next turn</span>
                        ) : (
                          <span>
                            Ready in&nbsp;
                            <b>
                              {Math.round(
                                (itemData.productionCost - city.accumulatedProduction) / city.productionYield,
                              )}
                            </b>{" "}
                            turns
                          </span>
                        ))}
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
              <div className="city-resource-info">
                <img width="24" src="./icons/food.png" alt="apple" />
                <span className="alegreya-regular-14">
                  {city.foodYield - city.population * 2 >= 0 ? "+" : ""}
                  {city.foodYield - city.population * 2}
                </span>
              </div>
              <div className="divider" />
              <div className="city-resource-info">
                <img width="24" src="./icons/science.png" alt="scienct" />
                <span className="alegreya-regular-14">+{city.scienceYield}</span>
              </div>
              <div className="divider" />
              <div className="city-resource-info">
                <img width="24" src="./icons/gold.png" alt="gold" />
                <span className="alegreya-regular-14">+{city.goldYield}</span>
              </div>
              <div className="divider" />
              <div className="city-resource-info">
                <img width="24" src="./icons/hammer.png" alt="hummer" />
                <span className="alegreya-regular-14">+{city.productionYield}</span>
              </div>
            </div>
            <div className="line-container">
              <img src="/icons/diamond.png" alt="" width="24" className="center-image" />
            </div>
            <div className="city-stats">
              <div className="flex-align-center">
                <img width="20" src="/icons/population.png" alt="population" />
                <div className="city-population">
                  <span className="alegreya-regular-14">Population:</span>
                  {city.population < city.housing && (
                    <div>
                      <span className="food-for-growth-text">
                        ({city.accumulatedFood}/{getFoodNeededForGrowth(city.population)} food for growth)
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <b>
                {city.population} of {city.housing}
              </b>
            </div>
            <div className="city-stats">
              <div className="flex-align-center">
                <img width="20" src="/icons/health.png" alt="health" />
                <span className="alegreya-regular-14">Health</span>
              </div>
              {/* <span className="test"></span> */}
              <b>{city.health}/100</b>
            </div>
            {/* only show if user has any level of wall */}
            {wallMaxHealth && (
              <div className="city-stats">
                <div className="flex-align-center">
                  <img width="20" src="/icons/wall.png" alt="health" />
                  <span className="alegreya-regular-14">Wall</span>
                </div>
                <b>
                  {city.wallHealth}/ {wallMaxHealth}
                </b>
              </div>
            )}
            <div className="city-stats">
              <div className="flex-align-center">
                <img width="20" src="/icons/attack.png" alt="strength" />
                <span className="alegreya-regular-14">Defence</span>
              </div>
              <b>{city.attack}</b>
            </div>
            {wallMaxHealth && wallMaxHealth !== city.wallHealth && (
              <Button
                className={`unit-action-button ${city.wallHealth === wallMaxHealth && "disabled"}`}
                variant="outlined"
                onClick={handleRepairWall}
              >
                <img src="/icons/build.png" alt="" className="unit-icon" />
                Repair Wall ({(wallMaxHealth - city.wallHealth) * 2}
                <img className="unit-icon" src="/icons/wood.png" alt="stone" /> +{" "}
                {(wallMaxHealth - city.wallHealth) * 2}
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
                  const stats = getUnitOrBuildingStats(String(unit.label));

                  if (!stats) return <></>;

                  // no Tippy for mobile
                  return !isMobile ? (
                    <Tippy
                      key={unit.type}
                      placement="right"
                      content={<CustomTooltip {...unit} isUnlocked={isUnlocked} selectedTab={selectedTab} />}
                    >
                      <Box
                        onClick={() => {
                          if (!isUnlocked) {
                            toast.error(`You need to research "${unit.tech}"`, { autoClose: 3000 });
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
                  ) : (
                    // mobile view
                    <Box
                      onClick={() => {
                        if (!isUnlocked) {
                          toast.error(`You need to research "${unit.tech}"`, { autoClose: 3000 });
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
                      <div className="name-and-turns">
                        <img src={`/${unit.type}.png`} alt={unit.label} width="50" />
                        <div style={{ textAlign: "center" }}>
                          <Typography style={{ fontSize: "1.2rem", marginBottom: "0.3rem" }} variant="body1">
                            {unit.label}
                          </Typography>
                          {isUnlocked ? (
                            <>
                              {stats.type === "unit" && (
                                <div className="unit-stats-mobile">
                                  {unit.label === "Builder" && (
                                    <span style={{ fontSize: "0.9rem" }}>{unit.description}</span>
                                  )}
                                  {unit.label === "Settler" && (
                                    <span style={{ fontSize: "0.9rem" }}>{unit.description}</span>
                                  )}
                                  {unit.label !== "Builder" && unit.label !== "Settler" && (
                                    <>
                                      <div>
                                        {stats.attack}
                                        <img width="19" src="./icons/attack.png" alt="axe" />
                                      </div>
                                      <div>
                                        {stats.movement}
                                        <img width="19" src="./icons/movement.png" alt="foot" />
                                      </div>
                                      <div>
                                        {stats.maintenance}
                                        <img width="19" src="./icons/gold.png" alt="gold" />
                                      </div>
                                    </>
                                  )}
                                </div>
                              )}
                            </>
                          ) : (
                            <span>Unlocks: {unit.tech}</span>
                          )}
                        </div>
                        <div className="number-of-turns">
                          {selectedTab === 0 ? (
                            <>
                              <span>
                                {city ? `${Math.round(unit.productionCost / city.productionYield)} Turns` : ""}
                              </span>
                            </>
                          ) : (
                            <>
                              <span>{unit.goldCost}</span>
                              <img src="./icons/gold.png" width="20" alt="gold" />
                            </>
                          )}
                        </div>
                      </div>
                    </Box>
                  );
                })}
              </div>
              <h3 className="">Buildings</h3>
              <div className="modal-body">
                {buildingsToBuild.map((building) => {
                  const isUnlocked = building.requirement ? researchedTechnologies.has(building.requirement) : true;

                  const stats = getUnitOrBuildingStats(String(building.label));
                  if (!stats) console.log(building.label);

                  // if (!stats) return <></>;
                  // no Tippy for mobile
                  return !isMobile ? (
                    <Tippy
                      key={building.type}
                      placement="left"
                      content={<CustomTooltip {...building} isUnlocked={isUnlocked} selectedTab={selectedTab} />}
                    >
                      <Box
                        onClick={() => {
                          if (!isUnlocked) {
                            toast.error(`You need to research "${building.tech}"`, { autoClose: 3000 });
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
                              <span>{city ? Math.round(building.productionCost / city.productionYield) : ""}</span>
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
                  ) : (
                    // mobile view
                    <Box
                      onClick={() => {
                        if (!isUnlocked) {
                          toast.error(`You need to research "${building.tech}"`, { autoClose: 3000 });
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
                      <div className="name-and-turns">
                        <Typography variant="body1">{building.label}</Typography>
                        <div className="number-of-turns">
                          {selectedTab === 0 ? (
                            <>
                              <span>{city ? Math.round(building.productionCost / city.productionYield) : ""}</span>
                              <img src="./icons/hourglass.png" width="20" alt="hourglass" />
                            </>
                          ) : (
                            <>
                              <span>{building.goldCost}</span>
                              <img src="./icons/gold.png" width="20" alt="gold" />
                            </>
                          )}
                        </div>
                      </div>
                      {isUnlocked ? (
                        <>
                          {stats.type === "building" && (
                            <div>
                              +{stats.income} {stats.resourceName}{" "}
                              {stats.extra && `| +${stats.extraValue} ${stats.extra}`}
                            </div>
                          )}
                          {stats.type === "wall" && (
                            <span>
                              {stats.health} HP and {stats.attack} attack
                            </span>
                          )}
                        </>
                      ) : (
                        <span style={{ margin: "0.5rem" }}>Unlocks: {building.tech}</span>
                      )}
                    </Box>
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
