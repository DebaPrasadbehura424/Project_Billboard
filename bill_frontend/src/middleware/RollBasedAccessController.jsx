import { createContext, useContext, useState } from "react";

const CreateContext = createContext(undefined);

export const RollbasedProvider = ({ children }) => {
  const [type, setType] = useState("citizen"); // default: citizen

  return (
    <CreateContext.Provider value={{ type, setType }}>
      {children}
    </CreateContext.Provider>
  );
};

export const UseRollBased = () => {
  const context = useContext(CreateContext);
  if (!context) {
    throw new Error("error in the rollbased access controller...");
  }
  return context;
};
