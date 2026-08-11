/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext } from 'react';

const StudioContext = createContext(null);

export function StudioProvider({ children, value }) {
  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

export function useStudio() {
  return useContext(StudioContext);
}
