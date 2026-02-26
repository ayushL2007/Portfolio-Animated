"use client";

import { useCallback } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

interface DPadOverlayProps {
  onAction: () => void;
  disabled: boolean;
}

export default function DPadOverlay({ onAction, disabled }: DPadOverlayProps) {
  const move = useCallback(
    (direction: string) => {
      if (disabled) return;
      const handler = (window as unknown as Record<string, unknown>).__gameDPad as
        | ((d: string) => void)
        | undefined;
      if (handler) handler(direction);
    },
    [disabled]
  );

  const buttonClass =
    "w-14 h-14 flex items-center justify-center bg-card/80 border-2 border-border text-foreground active:bg-primary active:text-primary-foreground active:border-primary transition-colors touch-none select-none";

  return (
    <div className="fixed bottom-6 left-6 z-30 md:hidden">
      {/* D-Pad */}
      <div className="grid grid-cols-3 grid-rows-3 gap-1 w-[186px] h-[186px]">
        <div />
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            move("up");
          }}
          onMouseDown={() => move("up")}
          aria-label="Move up"
        >
          <ChevronUp size={24} />
        </button>
        <div />
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            move("left");
          }}
          onMouseDown={() => move("left")}
          aria-label="Move left"
        >
          <ChevronLeft size={24} />
        </button>
        <div />
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            move("right");
          }}
          onMouseDown={() => move("right")}
          aria-label="Move right"
        >
          <ChevronRight size={24} />
        </button>
        <div />
        <button
          className={buttonClass}
          onTouchStart={(e) => {
            e.preventDefault();
            move("down");
          }}
          onMouseDown={() => move("down")}
          aria-label="Move down"
        >
          <ChevronDown size={24} />
        </button>
        <div />
      </div>

      {/* Action button */}
      <div className="flex justify-end mt-2">
        <button
          className="w-16 h-16 rounded-full bg-accent/90 border-2 border-accent text-accent-foreground font-sans text-xs flex items-center justify-center active:scale-95 transition-transform touch-none select-none"
          onTouchStart={(e) => {
            e.preventDefault();
            onAction();
          }}
          onMouseDown={onAction}
          disabled={disabled}
          aria-label="Action button"
        >
          {"A"}
        </button>
      </div>
    </div>
  );
}
