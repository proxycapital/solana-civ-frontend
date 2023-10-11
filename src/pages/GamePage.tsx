import React, { useState } from "react";
import Joyride, { STATUS } from "react-joyride";

import TopMenu from "../components/TopMenu";
import GameMap from "../components/GameMap";
import Console from "../components/Console";

interface Message {
  time: string;
  message: string;
  type?: "error" | undefined;
}

const GamePage: React.FC = () => {
  const [debug, setDebug] = useState(false);
  const [messages, setMessages] = useState<Array<Message>>([]);

  const [run, setRun] = useState(true);
  const [steps, setSteps] = useState([
    {
      target: ".top-nav-wrapper",
      content: (
        <span>
          Welcome to SolCiv alpha test! ❤️ <br />
          This is a tutorial to help you get started.
        </span>
      ),
      disableBeacon: true,
    },
    {
      target: ".balance-container",
      content: (
        <span>
          <p>
            Here you can see your resources. <b>Gold</b>, <b>food</b> and <b>science</b> produced by your cities and
            buildings in the city.
          </p>
          <p>
            <b>Wood</b>, <b>stone</b>, <b>iron</b> can be earned only by upgrading tiles on the map. You earn resources every turn.
          </p>
        </span>
      ),
    },
    {
      target: ".sol-resource",
      content: (
        <span>
          We have created a burner wallet for you and deposited some devnet SOL. <br />
          So you don't need to confirm manually every transaction, there will be plenty of them as the game is fully
          on-chain.
        </span>
      ),
    },
    {
      target: ".gems-resource",
      content: (
        <span>
          You will be earning gems by playing the game: defeat barbarians, complete quests, etc.<br />
          Gems can be withdrawn to your personal wallet at any time.
        </span>
      ),
    },
    {
      target: ".end-turn-button",
      content: "When you finished your turn and have nothing else to do, click here to start new turn.",
    },
    {
      target: ".end-game-button",
      content: "You can also end the game at any time by clicking here. Be careful, you will lose all your progress! Click here only if you want to start from scratch.",
    },
    {
      target: ".wallet-button-tutorial",
      content: "You need to connect the wallet only if you want to withdraw gems. For the rest in-game actions, the auto-generated burner wallet will be used for your convenience.",
    },
    {
      target: ".tutorial-research-button",
      content: "Here you can research new technologies. Each technology unlocks new buildings and units. You can research only one technology at a time. Researching takes time and it depends on amount of science that your cities produce.",
    },
    {
      target: ".unit-builder",
      content: "Builder unit can upgrade tiles on the map. Four upgrades are available: Lumber Mill for wood, Quarry for stone, Mine for iron and Farm for food.",
    },
    {
      target: ".unit-warrior",
      content: "Warrior unit can attack barbarians and other players. You can also use it to defend your cities. This is most basic unit in the game. Later you will be able to research more advanced units.",
    },
    {
      target: ".unit-settler",
      content: "Settler unit can found new cities. Each city can build units and buildings. You will be defeated if you lose all your cities and units. Start by selecting your Settler and founding a new city. Click the 'Found a City' button in the unit's card.",
    },
  ]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false);
    }
  };

  const logMessage = (message: string, type?: "error" | undefined) => {
    const now = new Date();
    const time = `${now.getHours()}:${now.getMinutes()}, ${now.getDate()} ${now.toLocaleString("default", {
      month: "short",
    })} ${now.getFullYear()}`;

    setMessages((prevMessages) => {
      const newMessages = [...prevMessages, { time, message, type }];

      // Only keep the last 10 messages
      if (newMessages.length > 10) {
        newMessages.shift();
      }

      return newMessages;
    });
  };
  return (
    <div className="full-screen">
      <TopMenu debug={debug} setDebug={setDebug} />
      {debug && <Console messages={messages} />}
      <GameMap debug={debug} logMessage={logMessage} />
      <Joyride
        steps={steps}
        run={true}
        continuous={true}
        disableBeacon={true}
        callback={handleJoyrideCallback}
        className="joyride-modal"
        styles={{
          options: {
            backgroundColor: "#36302a",
            textColor: "#fff",
            primaryColor: '#C8AA6E',
            border: "2px solid #C8AA6E",
          },
          main: {
            border: "2px solid #C8AA6E",
          }
        }}
      />
    </div>
  );
};

export default GamePage;
