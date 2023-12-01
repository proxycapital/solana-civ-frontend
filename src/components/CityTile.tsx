import React from 'react'

interface CityTileProps {
  cityName: string,
  wallHealth?: number
  imageIndex: number,
  health?: number,
}

const CityTile = ({ imageIndex, health, cityName, wallHealth }: CityTileProps) => {
  return (
    <div className="city-header primary-border-with-box-shadow">
      {cityName}
      {wallHealth && (
        <div className="city-wall-bar">
          <div className="city-wall-bar-fill" style={{ width: `${ wallHealth && imageIndex !== 15 ? wallHealth : (100 * wallHealth! / 1000)}%` }} />
        </div>  
      )}
      <div className="city-health-bar">
        <div className="city-health-bar-fill" style={{ width: `${ health && imageIndex !== 15 ? health : (100 * health! / 1000)}%` }} />
      </div>
    </div>
  )
}

export default CityTile