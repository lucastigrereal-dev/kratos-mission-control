import { ReactNode } from "react";

interface WorldOceanBackgroundProps {
  children?: ReactNode;
}

export default function WorldOceanBackground({ children }: WorldOceanBackgroundProps) {
  return (
    <div className="kr-world">
      <div className="kr-world-ocean" />
      <div className="kr-world-horizon" />
      <div className="kr-world-mist" />
      <div className="kr-world-depth" />
      <div className="kr-world-sun" />
      <div className="kr-world-content">{children}</div>
    </div>
  );
}
