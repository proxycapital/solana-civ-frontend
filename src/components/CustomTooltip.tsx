import React from "react";

import { BuildingType } from "../Buildings";

const CustomTooltip: React.FC<BuildingType & { selectedTab: number }> = ({
  description,
  stats,
  requirement,
  tech,
  productionCost,
  selectedTab,
  goldCost,
  isUnlocked,
}) => {
  return (
    <div className="custom-tooltip">
      {/* <p className="header">{label}</p> */}
      {requirement && !isUnlocked ? (
        <p>
          Research required: <b>{tech}</b>
        </p>
      ) : (
        <>
          <p>{description}</p>

          {stats?.builds && (
            <span>
              <b>Builds:&nbsp;</b> {stats.builds}
            </span>
          )}
          {stats?.attack && (
            <span>
              <b>Attack:&nbsp;</b> {stats.attack}
            </span>
          )}
          {stats?.movement && (
            <span>
              <b>Movement:&nbsp;</b> {stats.movement}
            </span>
          )}
          {stats?.yield && (
            <span>
              <b>Yield:&nbsp; {stats.yield}</b>
            </span>
          )}
          {stats?.resourceCost && (
            <span>
              <b>{stats.resourceCost}</b>
              {stats?.resourceType && <img width="24" src={`./icons/${stats?.resourceType}.png`} alt={stats?.resourceType} />}
            </span>
          )}
          {stats?.maintenanceCost && (
            <span>
              Maintenance:&nbsp;<b>{stats.maintenanceCost} </b>
              <img width="24" src={`./icons/gold.png`} alt='gold' />
            </span>
          )}
          <span>
            {selectedTab === 0 ? (
              <span>
                Production cost: {productionCost}
                <img src="./icons/hammer.png" alt="gear" width="24" />
              </span>
            ) : (
              <>
                Cost: {goldCost}
                <img src="./icons/gold.png" alt="gold" width="24" />
              </>
            )}
          </span>
        </>
      )}
    </div>
  );
};

export default CustomTooltip