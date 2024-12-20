import React from "react";
import { createPortal } from "react-dom";
import { MdClose } from "react-icons/md";

interface DialogProps {
  children?: React.ReactNode;
  onClose?: () => void;
  open?: boolean;
}

export const Dialog = ({ children, onClose, open }: DialogProps) => {
  if (!open) return null;
  return createPortal(
    <>
      <div
        className="fixed bottom-0 left-0 right-0 top-0 z-30 bg-black/70"
        onClick={onClose}
      />
      <div className="container fixed left-1/2 top-1/2 z-30 flex max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex-col rounded bg-zinc-950 p-4 text-text">
        <button
          className="absolute right-4 top-4 z-40 text-text hover:text-gray-400"
          onClick={onClose}
        >
          <MdClose className="size-5" />
        </button>
        {children}
      </div>
    </>,
    document.body,
  );
};
