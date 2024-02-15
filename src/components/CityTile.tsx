import { useGameState } from "../context/GameStateContext";

interface CityTileProps {
  cityName: string;
  wallHealth?: number;
  imageIndex: number;
  health?: number;
  population?: number;
}

const CityTile = ({ imageIndex, health, cityName, wallHealth, population }: CityTileProps) => {
  const { cities } = useGameState();

  const city = cities.find((city) => city.name === cityName);
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
    <div className="city-header primary-border-with-box-shadow">
      <div className="city-name-wrapper">
        {population && (
          <div className="population-container">
            <span className="population">{population}</span>
          </div>
        )}
        &nbsp;
        {cityName}
      </div>

      {wallMaxHealth && (
        <div className="city-wall-bar" style={wallHealth === 0 ? { padding: "1.5px" } : {}}>
          {wallHealth ? (
            <div
              className="city-wall-bar-fill"
              style={{ width: `${wallHealth !== wallMaxHealth ? (wallHealth! / wallMaxHealth) * 100 : 100}%` }}
            />
          ) : null}
        </div>
      )}
      <div className="city-health-bar">
        <div
          className="city-health-bar-fill"
          style={{ width: `${health && imageIndex !== 15 ? health : (100 * health!) / 1000}%` }}
        />
      </div>
    </div>
  );
};

export default CityTile;
