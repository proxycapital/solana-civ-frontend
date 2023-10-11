import * as anchor from "@coral-xyz/anchor";
import { toast } from "react-toastify";
import { useGameState } from "../../context/GameStateContext";
import { useWorkspace } from "../../context/AnchorContext";
import ResearchBlock from "./ResearchBlock";
import "./ResearchTree.scss";

import config from "../../config.json";
const researchData = config.science;

function toCamelCase(str: string) {
  return str
    .replace(/[^a-zA-Z\s]/g, "")
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

const ResearchTree = () => {
  const { program, provider } = useWorkspace();
  const { technologies, fetchPlayerState } = useGameState();
  const column1 = researchData["Science and Economy Tree"];
  const column2 = researchData["Production and Agriculture Tree"];
  const column3 = researchData["Military Tree"];

  const handleResearch = async (name: string) => {
    const key = toCamelCase(name);
    const technology = { [key]: {} } as any;

    const [gameKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("GAME"), provider!.publicKey.toBuffer()],
      program!.programId
    );
    const [playerKey] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("PLAYER"), gameKey.toBuffer(), provider!.publicKey.toBuffer()],
      program!.programId
    );
    const accounts = {
      playerAccount: playerKey,
    };
    try {
      const tx = program!.methods.startResearch(technology).accounts(accounts).rpc();
      await toast.promise(tx, {
        pending: "Starting new research...",
        success: "Research started!",
        error: "Failed to start research",
      });
    } catch (error: any) {
      console.log(error);
      if (error.message.includes("CannotResearch")) {
        toast.error("You need to research the previous technology first!", {});
      }
      if (error.message.includes("ResearchAlreadyCompleted")) {
        toast.error("You already researched this technology!");
      }
      if (error.message.includes("AlreadyResearching")) {
        toast.error("Other research already in progress");
      }
    }
    await fetchPlayerState();
  };
  const researchedKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);

  return (
    <div className="research-tree">
      <div className="research-column">
        {column1.map((data, index) => (
          <ResearchBlock
            {...data}
            {...technologies}
            onResearchClick={handleResearch}
            index={index}
            prevResearched={index === 0 ? true : researchedKeys.includes(toCamelCase(column1[index - 1].name))}
          />
        ))}
      </div>
      <div className="research-column">
        {column2.map((data, index) => (
          <ResearchBlock
            {...data}
            {...technologies}
            onResearchClick={handleResearch}
            index={index}
            prevResearched={index === 0 ? true : researchedKeys.includes(toCamelCase(column2[index - 1].name))}
          />
        ))}
      </div>
      <div className="research-column">
        {column3.map((data, index) => (
          <ResearchBlock
            {...data}
            {...technologies}
            onResearchClick={handleResearch}
            index={index}
            prevResearched={index === 0 ? true : researchedKeys.includes(toCamelCase(column3[index - 1].name))}
          />
        ))}
      </div>
    </div>
  );
};

export default ResearchTree;
