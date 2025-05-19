import React from "react";

interface PrimaryButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export const PrimaryButton = ({ children, ...rest }: PrimaryButtonProps) => {
  return (
    <button {...rest} className="rounded-lg p-2 hover:bg-background-light">
      {children}
    </button>
  );
};
