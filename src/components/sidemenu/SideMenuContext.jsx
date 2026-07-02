import {createContext, useContext } from 'react';

export const SideMenuContext = createContext({open:false});
export const useSideMenu = () => useContext(SideMenuContext)