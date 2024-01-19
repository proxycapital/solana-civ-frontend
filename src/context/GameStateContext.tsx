import React, { createContext, useContext, useState, useEffect } from "react";
import { useWorkspace } from "../context/AnchorContext";
import { getPlayer, getGame, getNpcs } from "../utils/solanaUtils";
import { useModalError } from "./ModalErrorContext";

type Game = {
  turn: number;
  map: {terrain: number; discovered: boolean}[];
  defeat: boolean;
  victory: boolean;
};

type Resources = {
  gold: number;
  food: number;
  wood: number;
  stone: number;
  iron: number;
  science: number;
  sol: number;
  [key: string]: number | 0;
};

export type City = {
  cityId: number;
  x: number;
  y: number;
  name: string;
  population: number;
  health: number;
  wallHealth: number;
  attack: number;
  accumulatedProduction: number;
  buildings: any[];
  game: any;
  goldYield: number;
  foodYield: number;
  productionQueue: any[];
  productionYield: number;
  scienceYield: number;
  accumulatedFood: number;
  housing: number;
  controlledTiles: TileCoordinate[];
}

interface TileCoordinate {
  x: number;
  y: number;
}

interface GameStateContextType {
  fetchPlayerState: () => Promise<void>;
  fetchGameState: () => Promise<void>;
  fetchNpcs: () => Promise<void>;
  game: Game;
  technologies: {
    currentResearch: null | any;
    researchAccumulatedPoints: number;
    researchedTechnologies: any[];
  };
  cities: City[];
  controlledTiles: TileCoordinate[];
  upgradedTiles: any[];
  npcUnits: any[];
  npcCities: any[];
  resources: Resources;
  allUnits: any[];
}

interface BaseLayoutProps {
  children?: React.ReactNode;
}

const GameStateContext = createContext<GameStateContextType | undefined>(undefined);

export const useGameState = () => {
  const context = useContext(GameStateContext);
  if (!context) {
    throw new Error("useGameState must be used within a GameStateProvider");
  }
  return context;
};

export const GameStateProvider: React.FC<BaseLayoutProps> = ({ children }) => {
  const { program, provider } = useWorkspace();
  const { setShowModalError } = useModalError();
  const [resources, setResources] = useState({} as Resources);
  const [game, setGame] = useState({ turn: 1, map: [], defeat: false, victory: false } as Game);
  const [technologies, setTechnologies] = useState({
    currentResearch: null,
    researchAccumulatedPoints: 0,
    researchedTechnologies: [],
  });
  const [cities, setCities] = useState([] as any[]);
  const [controlledTiles, setControlledTiles] = useState<TileCoordinate[]>([]);
  const [upgradedTiles, setUpgradedTiles] = useState([] as any[]);
  const [allUnits, setUnits] = useState([] as any[]);
  const [npcUnits, setNpcUnits] = useState([] as any[]);
  const [npcCities, setNpcCities] = useState([] as any[]);

  const updateControlledTiles = (cities: City[]) => {
    const newControlledTiles: TileCoordinate[] = [];
    cities.forEach(city => {
      city.controlledTiles.forEach(tile => {
        newControlledTiles.push({ x: tile.x, y: tile.y });
      });
    });
    setControlledTiles(newControlledTiles);
  };

  const fetchGameState = async () => {
    try {
      const game = await getGame(provider, program);
      if (game) {
        setGame(game);
      }
    } catch (error) {
      console.error("Failed to fetch game state", error);
    }
  };

  const fetchNpcs = async () => {
    try {
      const npcs = await getNpcs(provider, program);
      if (npcs) {
        setNpcUnits(npcs.units);
        setNpcCities(npcs.cities);
      }
    } catch (error) {
      console.error("Failed to fetch npcs", error);
    }
  };

  const fetchPlayerState = async () => {
    try {
      const player = await getPlayer(provider, program);
      if (!player) {
        setShowModalError(true);
        return;
      }

      if (player) {
        if (player.balances) setResources(player.balances);
        if (player.units) setUnits(player.units);
        if (player.cities) {
          setCities(player.cities);
          updateControlledTiles(player.cities);
        }
        if (player.tiles) setUpgradedTiles(player.tiles);
        if (player.technologies) setTechnologies(player.technologies);
      }
    } catch (error) {
      console.error("Failed to fetch balance", error);
      // @todo: alert for player ?
    }
  };

  useEffect(() => {
    fetchGameState();
    fetchPlayerState();
    fetchNpcs();
  }, []);

  return (
    <GameStateContext.Provider
      value={{
        fetchPlayerState,
        fetchGameState,
        fetchNpcs,
        game,
        technologies,
        cities,
        controlledTiles,
        upgradedTiles,
        resources,
        npcUnits,
        npcCities,
        allUnits,
      }}
    >
      {children}
    </GameStateContext.Provider>
  );
};
