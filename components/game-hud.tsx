"use client";

import { buildings } from "@/lib/game-data";
import { type GameLocation } from "@/components/game-canvas";

interface GameHUDProps {
  location: GameLocation;
}

export default function GameHUD({ location }: GameHUDProps) {
  const locationLabel =
    location.type === "overworld"
      ? "AYUSH TOWN"
      : buildings.find((b) => b.id === location.buildingId)?.signText ?? "INSIDE";

  const controlHint =
    location.type === "overworld"
      ? "WASD / Arrows to move | SPACE to interact"
      : "Talk to receptionist | Walk to EXIT mat to leave";

  return (
    <div className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="pointer-events-auto pixel-border bg-card/90 px-3 py-2">
          <p className="font-sans text-[10px] md:text-xs text-primary pixel-text">
            {locationLabel}
          </p>
        </div>
        <div className="pointer-events-auto pixel-border bg-card/90 px-3 py-2 hidden md:block">
          <p className="font-mono text-xs text-muted-foreground">
            {controlHint}
          </p>
        </div>
      </div>
    </div>
  );
}
