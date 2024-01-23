import React, { useState } from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeXmark } from "@fortawesome/free-solid-svg-icons";
import { Slider } from "@mui/material";

import { useSound } from "../../context/SoundContext";
import "./Profile.scss";


const Profile = () => {
  const { musicVolume, toggleBackgroundMusic, toggleInGameEffects, changeBackgroundVolume } = useSound();
  const [isBackgroundMusicPlaying, setBackgroundMusicPlaying] = useState(() => {
    return localStorage.getItem("isBackgroundMusicPlaying") === "true";
  });
  const [isInGameMusicPlaying, setInGameMusicPlaying] = useState(() => {
    return localStorage.getItem("isInGameMusicPlaying") === "true";
  });
 
  const handleToggleBackgroundMusic = () => {
    toggleBackgroundMusic();
    setBackgroundMusicPlaying((prevState) => !prevState);
  };

  const handleToggleInGameMusic = () => {
    toggleInGameEffects();
    setInGameMusicPlaying((prevState) => !prevState);
  }

  const handleBackgroundVolume = (volume: number) => {
    changeBackgroundVolume(volume);
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
        <button onClick={handleToggleInGameMusic} className="music-toggle-button">
          <FontAwesomeIcon icon={isInGameMusicPlaying ? faVolumeHigh : faVolumeXmark} />
        </button>
        <span>Enable/Disable In-Game Effects</span>
      </div>
      <div className="option-container">
        <button onClick={handleToggleBackgroundMusic} className="music-toggle-button">
          <FontAwesomeIcon icon={isBackgroundMusicPlaying ? faVolumeHigh : faVolumeXmark} />
        </button>
        <span>Enable/Disable Background Music </span>
      </div>
      <div className="option-container">
        <span>Background Volume:</span>
        <Slider
          min={10}
          max={100}
          step={10}
          value={Number(musicVolume) * 100}
          onChange={(_, newValue) => handleBackgroundVolume(newValue as number)}
          defaultValue={50}
        />
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