import { AppContext } from "./AppContextUtils"; // Import from new file

export const AppProvider = ({ children }) => {
  // Empty context as a placeholder
  return <AppContext.Provider value={{}}>{children}</AppContext.Provider>;
};
