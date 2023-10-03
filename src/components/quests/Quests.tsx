import React from 'react';
import QuestBlock from './QuestBlock';
import './Quests.css';

const Quests = () => {
  const questData = [
    {
        title: "Found a city",
        description: "You can found a city by clicking on the 'Found a city' button when Settler unit is selected.",
        status: "completed",
        reward: "-",
    },
    {
        title: "Build a farm",
        description: "Select Builder unit and move to the land tile with apples icon. You can build a farm by clicking on the 'Build' button when Builder unit is selected.",
        status: "pending",
        reward: "-",
    },
    {
        title: "Kill a barbarian",
        description: "You can fight with barbarians using your military units. Settlers and Builders cannot fight. Find barbarians exploring the map.",
        status: "pending",
        reward: "1 gem",
    }
];
  return (
    <div className="quests">
      {questData.map(quest => <QuestBlock {...quest} />)}
    </div>
  );
}

export default Quests;
