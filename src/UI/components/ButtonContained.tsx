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
        "noDrag bg-primary text-button-text hover:bg-primary-dark flex items-center justify-center rounded-full px-5 py-1.5 text-sm font-semibold uppercase drop-shadow-md transition-colors",
        className,
      )}
    >
      {children}
    </button>
  );
};
