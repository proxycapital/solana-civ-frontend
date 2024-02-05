import React from "react";
import "./Quests.scss";

interface IQuests {
  status: string;
  title: string;
  description: string;
  reward: string;
}

const QuestBlock = ({ status, title, description, reward }: IQuests) => {
  return (
    <div className={`quest-block ${status}`}>
      <img src={`/icons/${status}.png`} alt={status} className="quest-status" />
      <div className="quest-content">
        <h4>{title}</h4>
        <p>{description}</p>
        <p>Reward: {reward}</p>
      </div>
    </div>
  );
};

export default QuestBlock;
