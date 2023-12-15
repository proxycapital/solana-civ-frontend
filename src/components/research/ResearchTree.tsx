import { useState } from "react";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "react-toastify";

import { useGameState } from "../../context/GameStateContext";
import { useWorkspace } from "../../context/AnchorContext";
import ResearchBlock from "./ResearchBlock";
import { toCamelCase } from "../../utils";
import config from "../../config.json";
import { useEffect } from "react";
import "./ResearchTree.scss";
const researchData = config.science;

const ResearchTree = () => {
  const [researchQueue, setResearchQueue] = useState([])
  const { program, provider } = useWorkspace();
  const { technologies, fetchPlayerState } = useGameState();
  const column1 = researchData["Science and Economy Tree"];
  const column2 = researchData["Production and Agriculture Tree"];
  const column3 = researchData["Military Tree"];

  const researchedKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);

  useEffect(() => {
    getResearchQueue()
  }, [])

  const getResearchQueue = () => {
    const researchQueue = localStorage.getItem('researchQueue');
    if (!researchQueue) return

    setResearchQueue(JSON.parse(researchQueue))
  }

  const handleResearchQueue = (selectedResearchIndex: number, treeType: string) => {
    const allTreeResearches: any = researchData;
    const selectedResearchTree: Array<any> = allTreeResearches[treeType];
    const selectedResearchTreeKeys = selectedResearchTree.map((tech) => toCamelCase(String(Object.values(tech)[0])));

    let formatedResearches = [];
    if (technologies.currentResearch) {
      const currentResearchKey = Object.keys(technologies.currentResearch)[0];

      // click on same techology, that already in current research
      if (currentResearchKey === selectedResearchTreeKeys[selectedResearchIndex]) {
        if (localStorage.getItem('researchQueue')) {
          toast.warning("Research queue removed");
        }
        resetResearchQueue();
        return;
      }

      // add current research only if user select different tree
      if (!selectedResearchTreeKeys.includes(currentResearchKey)) {
        formatedResearches.push(currentResearchKey);
      }
    }
    
    const leftResearchesInTree = selectedResearchTreeKeys.filter((tech) => !researchedKeys.includes(String(tech)));
    const additionalResearch = leftResearchesInTree.length === selectedResearchTree.length ? 1 : 0;

    formatedResearches = [...formatedResearches, ...leftResearchesInTree.slice(0, selectedResearchIndex + additionalResearch)]
    
    if (formatedResearches.length === 1) return;
    
    localStorage.setItem('researchQueue', JSON.stringify(formatedResearches));
    getResearchQueue();

    toast.success("Research queue created");
  }

  // user click on research button
  const handleResearch = async (name: string) => {
    resetResearchQueue()
    
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

  const resetResearchQueue = () => {
    localStorage.removeItem('researchQueue');
    localStorage.removeItem('prevTech');
    setResearchQueue([]);
  }

  return (
    <div className="research-tree">
      <div className="research-column">
        {column1.map((data, index) => (
          <ResearchBlock
            {...data}
            {...technologies}
            researchQueue={researchQueue}
            treeType="Science and Economy Tree"
            onResearchClick={handleResearch}
            onResearchQueueClick={handleResearchQueue}
            key={`${data.name}-${index}`}
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
            researchQueue={researchQueue}
            treeType="Production and Agriculture Tree"
            onResearchClick={handleResearch}
            onResearchQueueClick={handleResearchQueue}
            key={`${data.name}-${index}`}
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
            researchQueue={researchQueue}
            treeType="Military Tree"
            onResearchClick={handleResearch}
            onResearchQueueClick={handleResearchQueue}
            key={`${data.name}-${index}`}
            index={index}
            prevResearched={index === 0 ? true : researchedKeys.includes(toCamelCase(column3[index - 1].name))}
          />
        ))}
      </div>
    </div>
  );
};

export default ResearchTree;
