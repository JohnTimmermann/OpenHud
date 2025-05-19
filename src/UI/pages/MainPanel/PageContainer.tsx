import { Outlet } from "react-router-dom";

export const PageContainer = () => {
  return (
    <div
      id="PageContainer"
      className="relative flex h-full w-full items-center justify-center overflow-y-auto bg-background-primary px-4"
    >
      <Outlet />
    </div>
  );
};
