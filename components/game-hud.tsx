"use client";

import { portfolioData } from "@/lib/game-data";

export default function GameHUD() {
  return (
    <div className="fixed top-0 left-0 right-0 z-20 pointer-events-none">
      {/* Top bar */}
      <div className="flex items-center justify-between p-3 md:p-4">
        <div className="pointer-events-auto pixel-border bg-card/90 px-3 py-2">
          <p className="font-sans text-[10px] md:text-xs text-primary pixel-text">
            {"AYUSH TOWN"}
          </p>
        </div>
        <div className="pointer-events-auto pixel-border bg-card/90 px-3 py-2 hidden md:block">
          <p className="font-mono text-xs text-muted-foreground">
            {"WASD / Arrows to move | SPACE to interact"}
          </p>
        </div>
      </div>
    </div>
  );
}
