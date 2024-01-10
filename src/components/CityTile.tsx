import { useGameState } from "../context/GameStateContext";
import { getFoodNeededForGrowth } from "../utils";

interface CityTileProps {
  cityId: number;
  npc: boolean | undefined;
}

const CityTile = ({ cityId, npc }: CityTileProps) => {
  const { cities, npcCities } = useGameState();

  const city = npc ? npcCities.find(city => city.cityId === cityId) : cities.find(city => city.cityId === cityId);

  if (!city) {
    return null;
  }

  const { population, name, health, wallHealth, foodYield, accumulatedFood, productionQueue, productionYield } = city;
  const cityBuildings = city?.buildings.map((building: string) => {
    return Object.keys(building)[0];
  });
  let wallMaxHealth = 0;
  if (cityBuildings?.includes("wallIndustrial")) {
    wallMaxHealth = 200;
  } else if (cityBuildings?.includes("wallRenaissance")) {
    wallMaxHealth = 150;
  } else if (cityBuildings?.includes("wallMedieval")) {
    wallMaxHealth = 100;
  } else if (cityBuildings?.includes("wall")) {
    wallMaxHealth = 50;
  }

  const renderPopulation = () => {
    if (npc || !population) {
      return null;
    }

    const growthTurns = foodYield - 2 * population <= 0
      ? "-"
      : Math.round((getFoodNeededForGrowth(population) - accumulatedFood) / (foodYield - population * 2));

    return (
      <span className="city-population">
        <span className="population-number">{population}</span>
        <span className="population-growth">
          <sup>{growthTurns}</sup>
        </span>
      </span>
    );
  };

  const renderProduction = () => {
    if (npc) {
      return null;
    }

    return (
      <span className="city-production">
        <span className="production-product">
          <img src="./icons/hammer.png" alt="hummer" />
        </span>
        <span className="production-turns">
          <sup>-</sup>
        </span>
      </span>
    );
  };

  const renderWallHealth = () => {
    if (wallMaxHealth === 0) {
      return null;
    }

    return (
      <div className="city-wall-bar" style={wallHealth === 0 ? { padding: "1.5px" } : {}}>
        {wallHealth > 0 && (
          <div
            className="city-wall-bar-fill"
            style={{ width: `${wallHealth !== wallMaxHealth ? (wallHealth / wallMaxHealth) * 100 : 100}%` }}
          />
        )}
      </div>
    );
  };

  const renderCityHealth = () => (
    <div className="city-health-bar">
      <div
        className="city-health-bar-fill"
        style={{ width: `${health && !npc ? health : (100 * health) / 1000}%` }}
      />
    </div>
  );

  return (
    <div className="city-header primary-border-with-box-shadow">
      <div className="city-name-wrapper">
        {renderPopulation()}
        <span className="city-name">{name}</span>
        {renderProduction()}
      </div>
      {renderWallHealth()}
      {renderCityHealth()}
    </div>
  );
};

export default CityTile;