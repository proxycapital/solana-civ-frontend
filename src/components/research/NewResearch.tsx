
import { useGameState } from "../../context/GameStateContext";
import { capitalizeWords } from "../../utils";
import { AllBuildings } from "../../Buildings";
import { AllUnits } from "../../Units";

const NewResearch = () => {
  const { technologies} = useGameState()

  const technologiesKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);
  const lastResearch = technologiesKeys ? capitalizeWords(technologiesKeys[technologiesKeys.length - 1]) : '';

  /* @todo: some technologies unlock more than 1 building, e.g. "Agriculture" */
  const newBuildingUnlocked = AllBuildings.find((building) => building.tech === lastResearch);
  const newUnitUnlocked = AllUnits.find((unit) => unit.tech === lastResearch);

  return (
    <div className="new-research-block">
      <h3>You have researched <span className="bold-text">{lastResearch}</span>!
        <br />
        {/* @todo: add Tippy here */}
        {newBuildingUnlocked?.label && `Now you can build ${newBuildingUnlocked?.label}.`}
        {newUnitUnlocked?.label && `Now you can train new unit - ${newUnitUnlocked?.label}.`}
      </h3>
    </div>
  )
};

export default NewResearch;