import React, { useRef, useEffect, useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { ToastContainer, toast } from "react-toastify";

import Terrain, { TileType } from "./Terrain";
import CityTile from './CityTile';
import UnitTile from "./UnitTile";
import UnitInfoWindow from "./UnitInfoWindow";
import CityModal from "./CityModal";
import UpgradedTileModal, { UpgradedTileType } from "./UpgradedTileModal";
import { City, useGameState } from "../context/GameStateContext";
import { useWorkspace } from "../context/AnchorContext";
import { useSound } from "../context/SoundContext";
import { getMap } from "../utils/solanaUtils";
import GameOverModal from "./GameOverModal";
import TileMenu from "./TileMenu";
import { useError } from "../hooks/error.hook";

interface GameMapProps {
  debug: boolean;
  logMessage: (message: string, type?: "error" | undefined) => void;
}

interface Tile {
  discovered: boolean;
  x: number;
  y: number;
  imageIndex: number;
  overlayImageIndex?: number;
  cityName?: string | undefined;
  population?: number;
  health?: number;
  wallHealth?: number;
  type: string;
}

interface TileCoordinate {
  x: number;
  y: number;
}

export interface Unit {
  unitId: number;
  npc?: boolean;
  health: number;
  x: number;
  y: number;
  type: string;
  isSelected: boolean;
  movementRange: number;
  experience: number;
  attack: number;
  level: number;
}

const GameMap: React.FC<GameMapProps> = ({ debug, logMessage }) => {
  const rows = 20;
  const cols = 20;
  const isDragging = useRef(false);
  const initialScrollDone = useRef(false);
  const [dataLoaded, setDataLoaded] = useState(false);
  const [showVillageModal, setShowVillageModal] = useState(false);
  const [showUpgradedTileModal, setShowUpgradedTileModal] = useState(true);
  const {
    fetchPlayerState,
    fetchGameState,
    fetchNpcs,
    game,
    cities,
    controlledTiles,
    upgradedTiles,
    npcUnits,
    npcCities,
    allUnits,
  } = useGameState();
  const { program, provider } = useWorkspace();
  const { playSound } = useSound();

  const [showGameoverModal, setShowGameoverModal] = useState(false);
  const [tiles, setTiles] = useState([] as Tile[]);
  const [units, setUnits] = useState<Unit[]>(allUnits);
  const [selectedCityId, setSelectedCity] = useState<number | null>(null);
  const [selectedTileType, setSelectedTileType] = useState<UpgradedTileType | null>(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [selectedTile, setSelectedTile] = useState<{ x: number, y: number } | null>(null)
  const [unitsTile, setUnitsTile] = useState<Array<Unit | City | any>>([])
  const { handleError } = useError()

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const containerRef = useRef<HTMLDivElement | null>(null);
  let dragStart = { x: 0, y: 0 };

  useEffect(() => {
    const updatedUnits = allUnits.map((unit) => ({ ...unit, isSelected: false, type: Object.keys(unit.unitType)[0] }));
    // add also npcUnits with flag npc=true
    npcUnits.forEach((unit) => {
      updatedUnits.push({ ...unit, isSelected: false, type: Object.keys(unit.unitType)[0], npc: true });
    });
    setUnits(updatedUnits);
  }, [allUnits, npcUnits]);

  useEffect(() => {
    if (game.defeat === true || game.victory === true) {
      setShowGameoverModal(true);
    }
  }, [game]);

  useEffect(() => {
    (async () => {
      await fetchPlayerState();
      await fetchNpcs();
      setDataLoaded(true);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const map = await getMap(provider, program); // game.map ?
      if (!map) {
        return;
      }
      let newTiles = [];
      // extract coordinates of all cities into set
      const cityCoordinates = new Set();
      cities.forEach((city) => {
        cityCoordinates.add(`${city.x},${city.y}`);
      });
      // npc cities
      const npcCityCoordinates = new Set();
      npcCities.forEach((city) => {
        npcCityCoordinates.add(`${city.x},${city.y}`);
      });
      // extract coordinates of all upgraded saving also tileType
      const upgradedCoordinates = new Set();
      upgradedTiles.forEach((tile) => {
        upgradedCoordinates.add(`${tile.x},${tile.y},${Object.keys(tile.tileType)[0]}`);
      });

      for (let row = 0; row < 20; row++) {
        for (let col = 0; col < 20; col++) {
          const index = row * 20 + col;
          // if there is a city at this coordinate, render it
          if (cityCoordinates.has(`${col},${row}`)) {
            const cityData = cities.find((city) => city.x === col && city.y === row);
            newTiles.push({
              discovered: map[index] ? map[index].discovered : false,
              x: col,
              y: row,
              imageIndex: 10,
              type: "Village",
              cityName: cityData?.name,
              population: cityData?.population,
              wallHealth: cityData?.wallHealth,
              health: cityData?.health,
              cityId: cityData?.cityId,
            });
            continue;
          }
          // NPC cities
          if (npcCityCoordinates.has(`${col},${row}`)) {
            const npcCityData = npcCities.find((city) => city.x === col && city.y === row);
            newTiles.push({
              discovered: map[index] ? map[index].discovered : false,
              x: col,
              y: row,
              imageIndex: 15,
              type: "NPC Village",
              cityName: npcCityData.name,
              health: npcCityData.health,
              cityId: npcCityData.cityId,
            });
            continue;
          }
          // if there is an upgraded tile at this coordinate, render it
          let overlayImageIndex;
          if (upgradedCoordinates.has(`${col},${row},stoneQuarry`)) {
            overlayImageIndex = 11;
          }
          if (upgradedCoordinates.has(`${col},${row},farm`)) {
            overlayImageIndex = 12;
          }
          if (upgradedCoordinates.has(`${col},${row},ironMine`)) {
            overlayImageIndex = 13;
          }
          if (upgradedCoordinates.has(`${col},${row},lumberMill`)) {
            overlayImageIndex = 14;
          }
          if (upgradedCoordinates.has(`${col},${row},pasture`)) {
            overlayImageIndex = 16;
          }

          const tile = map[index];
          if (tile) {
            newTiles.push({
              discovered: tile.discovered,
              x: col,
              y: row,
              imageIndex: tile.terrain,
              overlayImageIndex,
              type: TileType[tile.terrain as keyof typeof TileType],
            });
          } else {
            console.error("No tile at", col, row);
          }
        }
      }
      setTiles(newTiles);
    })();
  }, [cities, upgradedTiles, npcCities, game.map]);

  useEffect(() => {
    if (dataLoaded && !initialScrollDone.current) {
      let element = document.getElementById("unit-0");
      if (!element) {
        element = document.querySelector(".village");
      }
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
        initialScrollDone.current = true;
      }
    }
  }, [dataLoaded]);

  const startDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault();
    isDragging.current = true;
    dragStart.x = event.clientX;
    dragStart.y = event.clientY;
  };

  const whileDrag = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (isDragging.current && containerRef.current) {
      const dx = event.clientX - dragStart.x;
      const dy = event.clientY - dragStart.y;
      containerRef.current.scrollLeft -= dx;
      containerRef.current.scrollTop -= dy;
      dragStart = { x: event.clientX, y: event.clientY };
    }
  };

  const endDrag = () => {
    isDragging.current = false;
  };

  const isInRange = (unit: any, x: number, y: number): boolean => {
    // do not consider "in range" the tile with the selected unit
    if (unit.x === x && unit.y === y) {
      return false;
    }
    return unit.isSelected && isWithinDistance(unit.x, unit.y, x, y, unit.movementRange);
  };

  const isWithinDistance = (x1: number, y1: number, x2: number, y2: number, distance: number) => {
    // const withinDistance = Math.abs(x1 - x2) <= distance && Math.abs(y1 - y2) <= distance;
    const withinDistance = Math.abs(x1 - x2) + Math.abs(y1 - y2) <= distance;
    const targetTile = tiles.find((t) => t.x === x2 && t.y === y2);
    const blockedTileTypes = ["NPC Village"];
    if (targetTile && blockedTileTypes.includes(targetTile.type)) {
      return false;
    }
    return withinDistance;
  };

  const moveUnit = async (selectedUnit: Unit, x: number, y: number) => {
    const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("GAME"), provider!.publicKey.toBuffer()],
      program!.programId
    );
    const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("PLAYER"), gameKey.toBuffer(), provider!.publicKey.toBuffer()],
      program!.programId
    );
    const accounts = {
      game: gameKey,
      playerAccount: playerKey,
      player: provider!.publicKey,
    };
    try {
      const tx = program!.methods.moveUnit(selectedUnit.unitId, x, y).accounts(accounts).rpc();
      const signature = await toast.promise(tx, {
        pending: "Moving unit...",
        success: "Unit moved",
        error: "Failed to move unit",
      });
      console.log(`Move unit TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      logMessage(`Unit #${selectedUnit.unitId} ${selectedUnit.type} moved to (${x}, ${y})`);
    } catch (error) {
      console.error("Failed to move unit", error);
    }
    await fetchPlayerState();
    await fetchGameState();
  };

  const selectUnit = (x: number, y: number, type: string) => {
    const newUnits = units.map((unit) => {
      if (unit.x === x && unit.y === y && unit.type === type && !unit.npc) {
        return { ...unit, isSelected: !unit.isSelected };
      } else {
        return { ...unit, isSelected: false };
      }
    });
    setUnits(newUnits);
  };

  const attackUnit = async (attackingUnit: Unit, defendingUnit: Unit) => {
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
    try {
      const tx = program!.methods.attackUnit(attackingUnit.unitId, defendingUnit.unitId).accounts(accounts).rpc();
      const signature = await toast.promise(tx, {
        pending: "Attacking enemy...",
        success: "Enemy attacked",
        error: undefined,
      });
      console.log(`Attack TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      logMessage(`Unit #${attackingUnit.unitId} attacked barbarian`);
      playSound("attack");
    } catch (error) {
      handleError({
        error,
        logMessage: "Failed to attack unit",
      });
    }
    await fetchPlayerState();
    await fetchNpcs();
  };

  const attackCity = async (attackingUnit: Unit, defendingCity: { cityId: number }) => {
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
    try {
      const tx = program!.methods.attackCity(attackingUnit.unitId, defendingCity.cityId).accounts(accounts).rpc();
      const signature = await toast.promise(tx, {
        pending: "Attacking barbarian village...",
        success: "Barbarian village attacked",
        error: "Failed to attack barbarian village",
      });
      console.log(`Attack TX: https://explorer.solana.com/tx/${signature}?cluster=devnet`);
      logMessage(`Unit #${attackingUnit.unitId} attacked barbarian village`);
      playSound("attack");
    } catch (error) {
      handleError({
        error,
        logMessage: "Failed to attack village",
      });
    }
    await fetchPlayerState();
    await fetchNpcs();
  };

  const canAttack = (unit: Unit) => {
    // @todo: move this to Unit class
    const cannotAttack = ["settler", "builder"];
    return !cannotAttack.includes(unit.type);
  };

  const unitAction = async (x: number, y: number, type: string) => {
    const selectedUnit = units.find((unit) => unit.isSelected);
    const targetUnit = units.find((unit) => unit.x === x && unit.y === y);
    const targetNpcCity = npcCities.find((city) => city.x === x && city.y === y);

    // If the target tile is empty, and the new coords
    // within the selected unit's movement range, move the unit.
    if (
      selectedUnit &&
      !targetUnit &&
      !targetNpcCity &&
      isWithinDistance(selectedUnit.x, selectedUnit.y, x, y, selectedUnit.movementRange)
    ) {
      return moveUnit(selectedUnit, x, y);
    }

    // If the target tile is occupied by an NPC unit,
    // and the selected unit can attack, attack the unit.
    if (selectedUnit && targetUnit && targetUnit.npc && canAttack(selectedUnit)) {
      if (selectedUnit.movementRange === 0) {
        toast.error("Unit has no moves left", { autoClose: 3000 });
      } else {
        return attackUnit(selectedUnit, targetUnit);
      }
    }

    if (selectedUnit && targetNpcCity && canAttack(selectedUnit)) {
      if (selectedUnit.movementRange === 0) {
        toast.error("Unit has no moves left", { autoClose: 3000 });
      } else {
        return attackCity(selectedUnit, targetNpcCity);
      }
    }
    // else simply select the unit at clicked tile
    return selectUnit(x, y, type);
  };

  const handleTileClick = (col: number, row: number, unitsInTile:  Unit[]) => {
    // get all units, cities and upgraded tiles in the tile
    const upgradedUnitsInTile = upgradedTiles.filter((t) => t.x === col && t.y === row);

    const citiesInTile = cities.filter((c) => c.x === col && c.y === row);

    const playerUnits = unitsInTile.filter((unit) => !unit.npc);

    const tileUnits: Array<Unit | City | any> = [...playerUnits, ...upgradedUnitsInTile, ...citiesInTile];

    if(tileUnits.length === 0) {
      setUnitsTile([]);
      setSelectedTile(null);
    }

    if(playerUnits.length === 1 && tileUnits.length === 1) {
      unitAction(col, row, playerUnits[0].type || "unknown");
      return;
    }

    // if there is more than one unit in the tile and the selected unit is not in the tile, show menu
    if(tileUnits.length > 1 && (!selectedUnit || !playerUnits.find(unit => selectedUnit.unitId === unit.unitId && !unit.isSelected)) ) {
      if(selectedTile?.x  === col && selectedTile?.y === row) {
        setSelectedTile(null)
        return;
      }

      setUnits(prevState => {
        return prevState.map((unit) => ({...unit, isSelected: false}))
      })

      setSelectedTile({x: col, y: row})

      setUnitsTile(tileUnits);
      return;
    }

    if(selectedUnit) {
      unitAction(col, row, selectedUnit?.type || "unknown");
    }

    // don't show modal if unit will move to upgraded tile
    if (selectedUnit) {
      return;
    }

    const tile: any = tiles.find((t) => t.x === col && t.y === row);

    if (tile && tile.type === "Village") {
      setShowVillageModal(true);
      setSelectedCity(tile.cityId);
      return;
    }


    const upgradedTile: { tileType: { [key: string]: {} }; x: number; y: number } = upgradedTiles.find(
      (ut) => ut.x === col && ut.y === row
    );

    if (upgradedTile) {
      const upgradedTileName: UpgradedTileType = Object.keys(upgradedTile.tileType)[0] as UpgradedTileType;
      setSelectedTileType(upgradedTileName);
      setShowUpgradedTileModal(true);
    }
  };

  const handleMenuSelected = (unitTile: Unit | City | any) => {
    // check if is a unit
    if(unitTile.unitId !== undefined) {
      setUnits(prevState => {
        return prevState.map((unit) => {
          if(unit.unitId === unitTile.unitId) {
            return {...unit, isSelected: true}
          }
          return {...unit, isSelected: false}
        })
      })
    }

    // check if is a city
    if (unitTile.cityId !== undefined) {
      setShowVillageModal(true);
      setSelectedCity(unitTile.cityId);
      return;
    }

    // check if is an upgraded tile
    if(unitTile.tileType) {
      const upgradedTileName = Object.keys(unitTile.tileType)[0] as UpgradedTileType;
      setSelectedTileType(upgradedTileName);
      setShowUpgradedTileModal(true);
    }
  }

  const isTileControlled = (tile: TileCoordinate): boolean => {
    return controlledTiles.some((controlledTile) => controlledTile.x === tile.x && controlledTile.y === tile.y);
  };

  const selectedUnit = units.find((unit) => unit.isSelected);

  return (
    <div className="game-container" ref={containerRef}>
      {showVillageModal && (
        <CityModal show={showVillageModal} onClose={() => setShowVillageModal(false)} cityId={selectedCityId} />
      )}
      {showUpgradedTileModal && (
        <UpgradedTileModal
          show={showUpgradedTileModal}
          onClose={() => setShowUpgradedTileModal(false)}
          selectedTileType={selectedTileType}
        />
      )}
      {selectedUnit && (
        <UnitInfoWindow
          unit={selectedUnit}
          // type={selectedUnit.type}
          // remainingMoves={selectedUnit.movementRange}
          // movementRange={selectedUnit.movementRange}
          // builds={selectedUnit.type === 'worker' ? 1 : undefined}
          // strength={selectedUnit.type === 'warrior' ? 10 : undefined}
        />
      )}
      <div
        className={`game-map no-select`}
        onMouseDown={startDrag}
        onMouseMove={whileDrag}
        onMouseUp={endDrag}
        onMouseLeave={endDrag}
      >
        {Array.from({ length: rows * cols }, (_, index) => {
          const row = Math.floor(index / cols);
          const col = index % cols;
          /* render the tile or default Plains */
          const currentTile = tiles.find((t) => t.x === col && t.y === row) || {
            discovered: false,
            imageIndex: 20,
            type: "Empty",
            x: col,
            y: row,
          };
          const currentUnits = units.filter((u) => u.x === col && u.y === row);
          const isInRangeForAnyUnit = units.some((u) => isInRange(u, col, row));
          // @todo: refactor this to be more generic
          let resourceAvailable;
          if (currentTile.type === "Forest") {
            resourceAvailable = "wood";
          } else if (currentTile.type === "Field") {
            resourceAvailable = "food";
          } else if (currentTile.type === "Rocks") {
            resourceAvailable = "stone";
          } else if (currentTile.type === "Iron") {
            resourceAvailable = "iron";
          } else if (currentTile.type === "Pasture") {
            resourceAvailable = "horses";
          }
          const isControlled = isTileControlled({ x: col, y: row });

          return (
            <div
              key={index}
              className={`game-tile ${isInRangeForAnyUnit ? "in-range" : ""}`}
              onClick={() => handleTileClick(col, row, currentUnits)}
            >
              {col === selectedTile?.x && row === selectedTile?.y && <TileMenu units={unitsTile} onClick={handleMenuSelected} /> }
              {/* <p style={{color: 'red', textAlign: 'center', zIndex: 100000}}>({col}, {row})</p> */}
              {currentTile.discovered && currentTile.cityName && (
                <CityTile
                  imageIndex={currentTile.imageIndex}
                  cityName={currentTile.cityName}
                  wallHealth={currentTile.wallHealth}
                  health={currentTile.health}
                  population={currentTile.population}
                />
              )}
              <Terrain
                isControlled={isControlled}
                discovered={currentTile.discovered}
                //x={col}
                //y={row}
                imageIndex={currentTile.imageIndex}
                overlayImageIndex={currentTile.overlayImageIndex}
                //cityName={currentTile.cityName}
                //wallHealth={currentTile.wallHealth}
                //health={currentTile.health}
                turn={game.turn}
              />
              {currentTile.discovered &&
                selectedUnit &&
                (selectedUnit.type === "builder" || selectedUnit.type === "settler") &&
                resourceAvailable && (
                  <div className={`land-plot-resource ${isControlled ? "upgradable" : ""}`}>
                    <img src={`/icons/${resourceAvailable}.png`} alt="" />
                  </div>
                )}
              {currentTile.discovered && currentUnits.map((currentUnit) => <UnitTile key={currentUnit.unitId} turn={game.turn} {...currentUnit} onClick={() => ""} />)}
            </div>
          );
        })}
      </div>
      {/* <MobileMapControls isSelectedUnit={!!selectedUnit} /> */}

      <ToastContainer
        style={{ top: isMobile ? "5px" : "70px", zIndex: 100000 }}
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        draggable
        pauseOnHover
        theme="dark"
      />
      {showGameoverModal && (
        <GameOverModal
          isOpen={showGameoverModal}
          onClose={() => {
            setShowGameoverModal(false);
          }}
        />
      )}
    </div>
  );
};

export default GameMap;
