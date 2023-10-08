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
    // ... more steps
  ]);

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    console.log(status);
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
        styles={{
          options: {
            backgroundColor: "rgb(34, 47, 59)",
            textColor: "#fff",
            primaryColor: '#512da8',
          },
        }}
      />
    </div>
  );
};

export default GamePage;
