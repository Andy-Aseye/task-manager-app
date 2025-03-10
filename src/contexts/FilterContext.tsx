import { createContext, useState, ReactNode } from "react";
import { FilterContextType } from "../interface";


export const FilterContext = createContext<FilterContextType | undefined>(
  undefined
);

const FilterProvider = ({ children }: { children: ReactNode }) => {
  const [priority, setPriority] = useState<string>("All");

  return (
    <FilterContext.Provider value={{ priority, setPriority }}>
      {children}
    </FilterContext.Provider>
  );
};

export default FilterProvider;