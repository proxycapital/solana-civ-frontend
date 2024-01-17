import React, { createContext, useContext, useState, useEffect, useRef } from "react";
import { Howl } from "howler";

type SoundType = "attack" | "construction" | "background";

interface BaseLayoutProps {
  children?: React.ReactNode;
}

interface SoundContextType {
  playSound: (name: SoundType) => Promise<void>;
  pauseSound: (name: SoundType) => Promise<void>;
  toggleBackgroundMusic: () => void;
}

const SoundContext = createContext<SoundContextType | undefined>(undefined);

export const SoundProvider: React.FC<BaseLayoutProps> = ({ children }) => {
  const [isMusicPlaying, setMusicPlaying] = useState(() => {
    return localStorage.getItem("isMusicPlaying") === "true";
  });
  const sounds = {
    attack: new Audio("/sounds/attack.mp3"),
    construction: new Audio("/sounds/construction.mp3"),
  };

  const backgroundSound = useRef<Howl | null>(null);

  useEffect(() => {
    backgroundSound.current = new Howl({
      src: ["/sounds/background.mp3"],
      loop: true,
      autoplay: false,
      volume: 0.3,
      onload: () => {
        if (isMusicPlaying) {
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
    } else if (name !== "background" && isMusicPlaying) {
      sounds[name]?.play();
    }
  };

  const pauseSound = async (name: SoundType) => {
    if (name === "background" && backgroundSound.current) {
      backgroundSound.current.pause();
    } else if (name !== "background") {
      sounds[name]?.pause();
    }
  };

  const toggleBackgroundMusic = () => {
    setMusicPlaying((prev) => {
      const newState = !prev;
      localStorage.setItem("isMusicPlaying", String(newState));
      newState ? playSound("background") : pauseSound("background");
      return newState;
    });
  };

  return (
    <SoundContext.Provider value={{ playSound, pauseSound, toggleBackgroundMusic }}>{children}</SoundContext.Provider>
  );
};

export const useSound = () => {
  const context = useContext(SoundContext);
  if (!context) {
    throw new Error("useSound must be used within a SoundProvider");
  }
  return context;
};
