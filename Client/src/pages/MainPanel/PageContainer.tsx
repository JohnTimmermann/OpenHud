import { Outlet } from "react-router-dom";

export const PageContainer = () => {
  return (
    <div
      id="PageContainer"
      className="relative flex size-full items-center justify-center p-8"
    >
      <Outlet />
    </div>
  );
};
