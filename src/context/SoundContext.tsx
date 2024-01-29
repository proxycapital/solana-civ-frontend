import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Howl } from "howler";

type SoundType = "attack" | "construction" | "background" | "upgrade";

interface BaseLayoutProps {
  children?: React.ReactNode;
}

interface SoundContextType {
  musicVolume: number | string;
  playSound: (name: SoundType) => Promise<void>;
  pauseSound: (name: SoundType) => Promise<void>;
  toggleBackgroundMusic: () => void;
  toggleInGameEffects: () => void;
  changeBackgroundVolume: (volume: number) => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isBackgroundMusicPlaying, setBackgroundMusicPlaying] = useState(() => {
    return localStorage.getItem("isBackgroundMusicPlaying") === "true";
  });
  const [isInGameMusicPlaying, setInGameMusicPlaying] = useState(() => {
    return localStorage.getItem("isInGameMusicPlaying") !== "false";
  });
  const [musicVolume, setMusicVolume] = useState(() => {
    return localStorage.getItem("backgroundMusicVolume") || 0.3;
  });

  const sounds = {
    attack: new Audio("/sounds/attack.mp3"),
    construction: new Audio("/sounds/construction.mp3"),
    upgrade: new Audio("/sounds/upgrade.mp3"),
  };

  const backgroundSound = useRef<Howl | null>(null);

  useEffect(() => {
    backgroundSound.current = new Howl({
      src: ["/sounds/background.mp3"],
      loop: true,
      autoplay: false,
      volume: musicVolume as number,
      onload: () => {
        if (isBackgroundMusicPlaying) {
          backgroundSound.current!.play();
        }
      },
    });
    return () => {
      backgroundSound.current!.unload();
    };
  }, []);

  const playSound = async (name: SoundType) => {
    if (name === "background" && backgroundSound.current) {
      backgroundSound.current.play();
    } else if (name !== "background" && isInGameMusicPlaying) {
      sounds[name]?.play();
    }
  };

  const changeBackgroundVolume = (volume: number) => {
    const vol = (volume / 100).toFixed(1);
    setMusicVolume(vol);
    localStorage.setItem("backgroundMusicVolume", String(vol));
    Howler.volume(Number(vol));
  }

  const pauseSound = async (name: SoundType) => {
    if (name === "background" && backgroundSound.current) {
      backgroundSound.current.pause();
    } else if (name !== "background") {
      sounds[name]?.pause();
    }
  };

  const toggleBackgroundMusic = () => {
    setBackgroundMusicPlaying((prev) => {
      const newState = !prev;
      localStorage.setItem("isBackgroundMusicPlaying", String(newState));
      newState ? playSound("background") : pauseSound("background");
      return newState;
    });
  };

  const toggleInGameEffects = () => {
    setInGameMusicPlaying((prev) => {
      const newState = !prev;
      localStorage.setItem("isInGameMusicPlaying", String(newState));
      return newState;
    });
  }

  return (
    <SoundContext.Provider
      value={{
        musicVolume,
        playSound,
        pauseSound,
        toggleBackgroundMusic,
        toggleInGameEffects,
        changeBackgroundVolume,
      }}>
        {children}
    </SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
