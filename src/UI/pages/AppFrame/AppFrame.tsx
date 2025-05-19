import { useState } from "react";
import { FaGithub } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import { VscChromeMinimize, VscChromeMaximize } from "react-icons/vsc";
import { VscDebugConsole } from "react-icons/vsc";

export const AppFrame = () => {
  const [maximized, setMaximized] = useState<boolean>(false);

  const handle_maximize = () => {
    if (maximized || screen.availWidth - window.innerWidth === 0) {
      window.electron.sendFrameAction("RESET");
    } else {
      window.electron.sendFrameAction("MAXIMIZE");
    }
    setMaximized(!maximized);
  };
  return (
    <div
      id="AppFrame"
      className="relative flex h-7 w-full items-center gap-10 bg-background-contrast pl-4 text-text"
    >
      <div className="flex items-center gap-4">
        <button
          className="noDrag text-text-secondary transition-colors hover:text-secondary-light"
          onClick={() => window.electron.sendFrameAction("CONSOLE")}
        >
          <VscDebugConsole className="size-5" />
        </button>
        <button
          onClick={() =>
            window.electron.openExternalLink(
              "https://github.com/JohnTimmermann/OpenHud",
            )
          }
          className="noDrag text-text-secondary transition-colors hover:text-secondary-light"
          rel="noreferrer"
        >
          <FaGithub className="size-5" />
        </button>
        <button
          onClick={() =>
            window.electron.openExternalLink("https://discord.gg/HApB9HyaWM")
          }
          className="noDrag text-text-secondary transition-colors hover:text-secondary-light"
          rel="noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="25"
            height="25"
            fill="currentColor"
            className="bi bi-discord size-5"
            viewBox="0 0 16 16"
          >
            <path d="M13.545 2.907a13.2 13.2 0 0 0-3.257-1.011.05.05 0 0 0-.052.025c-.141.25-.297.577-.406.833a12.2 12.2 0 0 0-3.658 0 8 8 0 0 0-.412-.833.05.05 0 0 0-.052-.025c-1.125.194-2.22.534-3.257 1.011a.04.04 0 0 0-.021.018C.356 6.024-.213 9.047.066 12.032q.003.022.021.037a13.3 13.3 0 0 0 3.995 2.02.05.05 0 0 0 .056-.019q.463-.63.818-1.329a.05.05 0 0 0-.01-.059l-.018-.011a9 9 0 0 1-1.248-.595.05.05 0 0 1-.02-.066l.015-.019q.127-.095.248-.195a.05.05 0 0 1 .051-.007c2.619 1.196 5.454 1.196 8.041 0a.05.05 0 0 1 .053.007q.121.1.248.195a.05.05 0 0 1-.004.085 8 8 0 0 1-1.249.594.05.05 0 0 0-.03.03.05.05 0 0 0 .003.041c.24.465.515.909.817 1.329a.05.05 0 0 0 .056.019 13.2 13.2 0 0 0 4.001-2.02.05.05 0 0 0 .021-.037c.334-3.451-.559-6.449-2.366-9.106a.03.03 0 0 0-.02-.019m-8.198 7.307c-.789 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.45.73 1.438 1.613 0 .888-.637 1.612-1.438 1.612m5.316 0c-.788 0-1.438-.724-1.438-1.612s.637-1.613 1.438-1.613c.807 0 1.451.73 1.438 1.613 0 .888-.631 1.612-1.438 1.612" />
          </svg>
        </button>
      </div>
      <div className="absolute left-1/2 flex font-semibold">
        <p>Open</p>
        <p className="text-primary-light">Hud</p>
      </div>
      <div className="absolute right-0 inline-flex h-full w-min justify-end">
        <button
          id="minimize"
          onClick={() => window.electron.sendFrameAction("MINIMIZE")}
          className="noDrag flex w-12 items-center justify-center transition-colors hover:bg-border hover:text-primary"
        >
          <VscChromeMinimize className="size-5" />
        </button>
        <button
          id="maximize"
          onClick={handle_maximize}
          className="noDrag flex w-12 items-center justify-center transition-colors hover:bg-border hover:text-primary"
        >
          <VscChromeMaximize className="size-5" />
        </button>
        <button
          id="quit"
          onClick={() => window.electron.sendFrameAction("CLOSE")}
          className="noDrag flex w-12 items-center justify-center transition-colors hover:bg-border hover:bg-red-400"
        >
          <MdClose className="size-5" />
        </button>
      </div>
    </div>
  );
};
