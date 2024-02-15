const resetResearchStorage = () => {
  localStorage.removeItem("researchQueue");
  localStorage.removeItem("prevTech");
};

export default resetResearchStorage;
