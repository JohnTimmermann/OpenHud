import { ReactElement } from "react";

interface TileProps {
  title: string;
  body: ReactElement;
}

export const Tile = ({ title, body }: TileProps) => {
  return (
    <div className="flex flex-col gap-2 rounded-sm bg-background-secondary p-4">
      <h4 className="font-semibold">{title}</h4>
      <div className="grid grid-cols-2">{body}</div>
    </div>
  );
};
