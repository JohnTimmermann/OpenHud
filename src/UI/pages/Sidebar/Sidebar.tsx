import { RouteSelect } from "./RouteSelect";
import { AccountToggle } from "./AccountControls";
import "./sidebar.css";
import { useDrawer } from "../../hooks";
import { MenuToggle } from "../../components/MenuToggle";

export const Sidebar = () => {
  const { isOpen } = useDrawer();
  return (
    <section
      id="Sidebar"
      className={`relative flex flex-col justify-between bg-background-secondary px-3 py-2 transition-[width] ${isOpen ? "w-52" : "w-20"}`}
    >
      {/* <NavLogo /> */}
      <MenuToggle />
      <RouteSelect />
      <AccountToggle />
    </section>
  );
};
