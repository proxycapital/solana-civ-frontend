import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { Slider } from "@mui/material";

import { useSound } from "../../context/SoundContext";
import "./Profile.scss";

// disable full music
// disable only background
// disable only in-game effects music (with example)
// divide toggleBack - to toggleOnlyBack and toogleGameEffects
// change background sound 
const Profile = () => {
  const { toggleBackgroundMusic } = useSound();
  const [isMusicPlaying, setMusicPlaying] = useState(() => {
    return localStorage.getItem("isMusicPlaying") === "true";
  });


  const handleToggleBackgroundMusic = () => {
    toggleBackgroundMusic();
    setMusicPlaying((prevState) => !prevState);
  };

  const handleToggleInGameMusic = () => {

  }

  const userStats = {
    games: 8981,
    wins: 3123,
    defeat: 1231,
    abandoned: 300,
    mostPlayedCiv: "Singapure",
  }

  return (
    <div className="profile">
      <h2>Settings:</h2>
      <div className="option-container">
        <button onClick={handleToggleBackgroundMusic} className="music-toggle-button">
          <FontAwesomeIcon icon={isMusicPlaying ? faVolumeHigh : faVolumeXmark} />
        </button>
        <span>Enable/Disable Background Music </span>
      </div>
      <div className="option-container">
        <button onClick={handleToggleInGameMusic} className="music-toggle-button">
          <FontAwesomeIcon icon={isMusicPlaying ? faVolumeHigh : faVolumeXmark} />
        </button>
        <span>Enable/Disable In-Game effects</span>
      </div>
      <div className="option-container">
        {/* should be a slider */}
        <span>Change sound</span>
        <Slider disabled defaultValue={30} aria-label="Disabled slider" />
      </div>
      
      <div className="line-container">
        <img src="/icons/diamond.png" alt="" width="24" className="center-image" />
      </div>
      
      <div>
        <h2>Game Stats:</h2>
        <div className="profile-stats">
          <span>Total Played games - <b>{userStats.games}</b></span>
          <span>Wins: <b>{userStats.wins}</b> ({((userStats.wins / userStats.games) * 100).toFixed(2)}%)</span>
          <span>Defeats: <b>{userStats.defeat}</b> ({((userStats.defeat / userStats.games) * 100).toFixed(2)}%)</span>
          <span>Abandoned: <b>{userStats.abandoned}</b> ({((userStats.abandoned / userStats.games) * 100).toFixed(2)}%)</span>
        </div>
      </div>
    </div>
  )
}

export default Profile