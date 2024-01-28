import { useState, useEffect } from "react";
import * as anchor from "@coral-xyz/anchor";
import { toast } from "react-toastify";

import { useGameState } from "../../context/GameStateContext";
import { useWorkspace } from "../../context/AnchorContext";
import ResearchBlock from "./ResearchBlock";
import { toCamelCase } from "../../utils";
import config from "../../config.json";
import "./ResearchTree.scss";

import resetResearchStorage from "../../utils/storage";

const researchData = config.science;

const ResearchTree = () => {
  const [researchQueue, setResearchQueue] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const { program, provider } = useWorkspace();
  const { technologies, fetchPlayerState } = useGameState();
  const column1 = researchData["Science and Economy Tree"];
  const column2 = researchData["Production and Agriculture Tree"];
  const column3 = researchData["Military Tree"];

  const researchedKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    getResearchQueue()
  }, [])

  const getResearchQueue = () => {
    const researchQueue = localStorage.getItem('researchQueue');
    if (!researchQueue) return

    setResearchQueue(JSON.parse(researchQueue))
  }

  const handleResearchQueue = (selectedResearchIndex: number, treeType: string, name: string) => {
    const allTreeTechs: any = researchData;
    const selectedTechTree: Array<any> = allTreeTechs[treeType];
    const selectedTechTreeKeys = selectedTechTree.map((tech) => toCamelCase(String(Object.values(tech)[0])));

    let formatedResearches = [];
    if (technologies.currentResearch) {
      const currentResearchKey = Object.keys(technologies.currentResearch)[0];

      // select same techology, that already in current research
      if (currentResearchKey === selectedTechTreeKeys[selectedResearchIndex]) {
        if (localStorage.getItem('researchQueue')) {
          toast.warning("Research queue removed");
        }
        resetResearchQueue();
        return;
      }

      // add current research only if user select different tree
      if (!selectedTechTreeKeys.includes(currentResearchKey)) {
        formatedResearches.push(currentResearchKey);
      }
    }
    
    const leftTechsInTree = selectedTechTreeKeys.filter((tech) => !researchedKeys.includes(String(tech)));

    formatedResearches = [...formatedResearches, ...leftTechsInTree.slice(0, leftTechsInTree.indexOf(toCamelCase(name)) + 1)]
  
    if (formatedResearches.length === 1) {
      handleResearch(formatedResearches[0]);
      return
    };
    
    localStorage.setItem('researchQueue', JSON.stringify(formatedResearches));
    getResearchQueue();

    toast.success("Research queue created");
  }

  // select only 1 research
  const handleResearch = async (name: string) => {
    resetResearchQueue()
    
    const technology = { [name]: {} } as any;

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
      if (!error.message) {
        toast.warning("Research: Something went wrong");
        console.log(error);
      }
      if (error.message.includes("CannotResearch")) {
        toast.error("You need to research the previous technology first!", { autoClose: 3000 });
      }
      if (error.message.includes("ResearchAlreadyCompleted")) {
        toast.error("You already researched this technology!", { autoClose: 3000 });
      }
      if (error.message.includes("AlreadyResearching")) {
        toast.error("Other research already in progress", { autoClose: 3000 });
      }
    }
    await fetchPlayerState();
  };

  const resetResearchQueue = () => {
    resetResearchStorage();
    setResearchQueue([]);
  }

  return (
    <div className="research-tree">
      <div className="research-column">
        {column1.map((data, index) => (
          <ResearchBlock
            {...data}
            {...technologies}
            isMobile={isMobile}
            researchQueue={researchQueue}
            treeType="Science and Economy Tree"
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
            isMobile={isMobile}
            researchQueue={researchQueue}
            treeType="Production and Agriculture Tree"
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
            isMobile={isMobile}
            researchQueue={researchQueue}
            treeType="Military Tree"
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
