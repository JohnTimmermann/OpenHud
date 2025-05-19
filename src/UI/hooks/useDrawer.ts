import { useDrawerContext } from "../context";

export const useDrawer = () => {
  const { isOpen, openDrawer, closeDrawer, toggleDrawer } = useDrawerContext();

  return {
    isOpen,
    openDrawer,
    closeDrawer,
    toggleDrawer,
  };
};
