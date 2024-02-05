import Tippy from "@tippyjs/react";

import { useGameState } from "../../context/GameStateContext";
import { capitalizeWords } from "../../utils";
import { AllBuildings } from "../../Buildings";
import { AllUnits } from "../../Units";
import ResearchTippy from "./ResearchTippy";
import "./ResearchTree.scss";

const NewResearch = () => {
  const { technologies } = useGameState();

  const technologiesKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);
  const lastResearch = technologiesKeys ? capitalizeWords(technologiesKeys[technologiesKeys.length - 1]) : "";

  /* @todo: some technologies unlock more than 1 building, e.g. "Agriculture" */
  const newBuildingUnlocked = AllBuildings.find((building) => building.tech === lastResearch);
  const newUnitUnlocked = AllUnits.find((unit) => unit.tech === lastResearch);

  return (
    <div className="new-research-block">
      <h3>
        You have researched <span className="bold-text">{lastResearch}</span>!
        <br />
        {newBuildingUnlocked?.label && (
          <span>
            Now you can build&nbsp;
            <Tippy touch={false} placement="bottom" content={ResearchTippy(newBuildingUnlocked?.label)}>
              <span className="underline-text">{newBuildingUnlocked?.label}</span>
            </Tippy>
            .
          </span>
        )}
        {newUnitUnlocked?.label && (
          <span>
            Now you can train new unit - &nbsp;
            <Tippy touch={false} placement="bottom" content={ResearchTippy(newUnitUnlocked?.label)}>
              <span className="underline-text">{newUnitUnlocked?.label}</span>
            </Tippy>
            .
          </span>
        )}
      </h3>
    </div>
  );
};

export default NewResearch;
