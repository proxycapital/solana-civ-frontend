
import { useGameState } from "../../context/GameStateContext";
import { capitalizeWords } from "../../utils";
import { AllBuildings } from "../../Buildings";
import { AllUnits } from "../../Units";

const NewResearch = () => {
  const { technologies} = useGameState()

  const technologiesKeys = technologies.researchedTechnologies.map((tech) => Object.keys(tech)[0]);
  const lastResearch = technologiesKeys ? capitalizeWords(technologiesKeys[technologiesKeys.length - 1]) : '';

  const newBuildingAllowed = AllBuildings.find((building) => building.tech === lastResearch);
  const newUnitAllowed = AllUnits.find((unit) => unit.tech === lastResearch);

  return (
    <div className="new-research-block">
      <h3>Congrats! You just researched <span className="bold-text">{lastResearch}</span>!
        <br />
        {/* @todo: add Tippy here */}
        {newBuildingAllowed?.label && `Now you can build ${newBuildingAllowed?.label}!`}
        {newUnitAllowed?.label && `Now you can train new unit - ${newUnitAllowed?.label}!`}
      </h3>
    </div>
  )
};

export default NewResearch;