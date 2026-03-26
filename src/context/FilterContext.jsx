import { createContext, useContext, useState } from "react";

const FilterContext = createContext();

export function FilterProvider({ children }) {
  const [filterClassif, setFilterClassif] = useState("Todos");
  const [filterGrupo, setFilterGrupo] = useState("Todos");
  const [filterIntensity, setFilterIntensity] = useState("Todas");

  return (
    <FilterContext.Provider value={{
      filterClassif, setFilterClassif,
      filterGrupo, setFilterGrupo,
      filterIntensity, setFilterIntensity,
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export function useFilterContext() {
  return useContext(FilterContext);
}
