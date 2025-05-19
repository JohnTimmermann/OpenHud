import { Sidebar } from "./Sidebar";
import { AppFrame, MainPanel } from "./MainPanel";
import { useThemes } from "../hooks";
export const Layout = () => {
  const { theme } = useThemes();
  return (
    <div
      className={`${theme} flex h-screen w-screen flex-col bg-background-secondary text-text`}
    >
      <AppFrame />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        {/* Main Section */}
        <div className="flex flex-1 flex-col">
          <MainPanel />
        </div>
      </div>
    </div>
  );
};
