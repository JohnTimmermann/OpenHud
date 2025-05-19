import React from "react";
import { twMerge } from "tailwind-merge";

interface ButtonContainedProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const ButtonContained = ({
  children,
  className,
  ...rest
}: ButtonContainedProps) => {
  return (
    <button
      {...rest}
      className={twMerge(
        "noDrag flex items-center justify-center rounded-full bg-primary px-5 py-1.5 text-sm font-semibold uppercase text-button-text drop-shadow-md transition-colors hover:bg-primary-dark",
        className,
      )}
    >
      {children}
    </button>
  );
};
