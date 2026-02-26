"use client";

import { useState, useEffect, useRef, useCallback } from "react";

interface Fish {
  name: string;
  rarity: string;
  color: string;
  size: number;
  difficulty: number;
  fact: string;
}

const FISH_POOL: Fish[] = [
  { name: "Magikarp", rarity: "Common", color: "#e83b3b", size: 12, difficulty: 1.2, fact: "Ayush once debugged a 500-line Rails app at 2am." },
  { name: "Goldeen", rarity: "Common", color: "#f89720", size: 14, difficulty: 1.4, fact: "Ayush scored 93.4% in his ICSE boards." },
  { name: "Poliwag", rarity: "Uncommon", color: "#5b6ee1", size: 16, difficulty: 1.7, fact: "Ayush is the App Dev Lead at GDG IIITK." },
  { name: "Staryu", rarity: "Uncommon", color: "#f7de1e", size: 18, difficulty: 2.0, fact: "Ayush's team reached ImagineCup semi-finals!" },
  { name: "Dratini", rarity: "Rare", color: "#3b7dd8", size: 22, difficulty: 2.4, fact: "Ayush is exploring Neural Networks and Transformers." },
  { name: "Gyarados", rarity: "Epic", color: "#3ddc84", size: 30, difficulty: 3.0, fact: "Ayush builds full-stack apps bridging system architecture and UX!" },
  { name: "Lapras", rarity: "Legendary", color: "#9b59b6", size: 36, difficulty: 3.6, fact: "Ayush knows OS internals, computer org, AND high-level frameworks." },
];

function pickFish(): Fish {
  const roll = Math.random();
  if (roll < 0.35) return FISH_POOL[Math.floor(Math.random() * 2)];
  if (roll < 0.65) return FISH_POOL[2 + Math.floor(Math.random() * 2)];
  if (roll < 0.85) return FISH_POOL[4];
  if (roll < 0.95) return FISH_POOL[5];
  return FISH_POOL[6];
}

type Phase = "casting" | "waiting" | "bite" | "reeling" | "caught" | "escaped";

interface FishingGameProps {
  onClose: () => void;
}

export default function FishingGame({ onClose }: FishingGameProps) {
  const [phase, setPhase] = useState<Phase>("casting");
  const [fish, setFish] = useState<Fish | null>(null);
  const [caughtFish, setCaughtFish] = useState<Fish[]>([]);

  const barPosRef = useRef(50);
  const targetPosRef = useRef(40);
  const catchProgressRef = useRef(0);
  const barDirRef = useRef(1);
  const frameRef = useRef(0);
  const animRef = useRef<number>(0);
  const phaseRef = useRef<Phase>("casting");
  const fishRef = useRef<Fish | null>(null);
  const holdingRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => { phaseRef.current = phase; }, [phase]);
  useEffect(() => { fishRef.current = fish; }, [fish]);

  useEffect(() => {
    if (phase === "casting") {
      const t = setTimeout(() => setPhase("waiting"), 1200);
      return () => clearTimeout(t);
    }
    if (phase === "waiting") {
      const delay = 1500 + Math.random() * 3000;
      const t = setTimeout(() => {
        setFish(pickFish());
        setPhase("bite");
      }, delay);
      return () => clearTimeout(t);
    }
    if (phase === "bite") {
      const t = setTimeout(() => {
        if (phaseRef.current === "bite") setPhase("escaped");
      }, 1500);
      return () => clearTimeout(t);
    }
  }, [phase]);

  useEffect(() => {
    if (phase !== "reeling" || !fish) return;
    let running = true;
    const speed = fish.difficulty;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const targetWidth = Math.max(18, 30 - speed * 3);

    function tick() {
      if (!running || !canvas || !ctx) return; // FIXED: Null checks for TS stability
      frameRef.current++;

      const targetSpeed = 0.02 + speed * 0.008;
      targetPosRef.current = 50 + Math.sin(frameRef.current * targetSpeed) * 35
        + Math.sin(frameRef.current * targetSpeed * 2.3) * 10;
      targetPosRef.current = Math.max(targetWidth / 2 + 2, Math.min(100 - targetWidth / 2 - 2, targetPosRef.current));

      const barSpeed = 1.8 + speed * 0.4;
      if (holdingRef.current) {
        barPosRef.current += barSpeed;
      } else {
        barPosRef.current -= barSpeed * 0.7;
      }
      barPosRef.current = Math.max(2, Math.min(98, barPosRef.current));

      const barLeft = barPosRef.current - 4;
      const barRight = barPosRef.current + 4;
      const targetLeft = targetPosRef.current - targetWidth / 2;
      const targetRight = targetPosRef.current + targetWidth / 2;
      const overlap = barRight > targetLeft && barLeft < targetRight;

      if (overlap) {
        catchProgressRef.current += 0.8 + (0.3 / speed);
      } else {
        catchProgressRef.current -= 0.35 + speed * 0.08;
      }

      if (catchProgressRef.current >= 100) {
        catchProgressRef.current = 100;
        setPhase("caught");
        if (fishRef.current) setCaughtFish((arr) => [...arr, fishRef.current!]);
        return;
      }
      if (catchProgressRef.current <= 0) {
        catchProgressRef.current = 0;
        setPhase("escaped");
        return;
      }

      renderReelCanvas(ctx, canvas.width, canvas.height, targetLeft, targetRight, barPosRef.current, catchProgressRef.current, overlap);

      animRef.current = requestAnimationFrame(tick);
    }
    animRef.current = requestAnimationFrame(tick);
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [phase, fish]);

  function renderReelCanvas(
    ctx: CanvasRenderingContext2D,
    w: number,
    h: number,
    targetLeft: number,
    targetRight: number,
    barPos: number,
    progress: number,
    overlap: boolean
  ) {
    ctx.clearRect(0, 0, w, h);

    const barY = 0;
    const barH = 28;
    const progY = 38;
    const progH = 14;

    ctx.fillStyle = "#262b44";
    ctx.fillRect(0, barY, w, barH);
    ctx.strokeStyle = "#3a3f5c";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, barY + 1, w - 2, barH - 2);

    const tl = (targetLeft / 100) * w;
    const tr = (targetRight / 100) * w;
    ctx.fillStyle = overlap ? "rgba(61,220,132,0.5)" : "rgba(61,220,132,0.25)";
    ctx.fillRect(tl, barY + 2, tr - tl, barH - 4);
    ctx.fillStyle = "#3ddc84";
    ctx.fillRect(tl, barY + 2, 2, barH - 4);
    ctx.fillRect(tr - 2, barY + 2, 2, barH - 4);

    const bx = (barPos / 100) * w;
    ctx.fillStyle = overlap ? "#f7de1e" : "#e83b3b";
    ctx.fillRect(bx - 5, barY + 1, 10, barH - 2);
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.fillRect(bx - 3, barY + 2, 2, barH - 4);

    ctx.fillStyle = "#262b44";
    ctx.fillRect(0, progY, w, progH);
    ctx.strokeStyle = "#3a3f5c";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, progY + 1, w - 2, progH - 2);

    const pw = Math.max(0, (progress / 100) * (w - 4));
    if (pw > 0) {
      const grad = ctx.createLinearGradient(2, progY, pw + 2, progY);
      grad.addColorStop(0, "#3ddc84");
      grad.addColorStop(1, progress > 70 ? "#f7de1e" : "#5bc474");
      ctx.fillStyle = grad;
      ctx.fillRect(2, progY + 2, pw, progH - 4);
    }

    ctx.fillStyle = "#f4f4f4";
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(`${Math.floor(progress)}%`, w / 2, progY + progH - 3);
  }

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (phaseRef.current === "bite") {
          catchProgressRef.current = 30;
          barPosRef.current = 50;
          targetPosRef.current = 40;
          barDirRef.current = 1;
          frameRef.current = 0;
          holdingRef.current = false;
          setPhase("reeling");
        } else if (phaseRef.current === "reeling") {
          holdingRef.current = true;
        } else if (phaseRef.current === "caught" || phaseRef.current === "escaped") {
          setFish(null);
          catchProgressRef.current = 0;
          barPosRef.current = 50;
          targetPosRef.current = 40;
          barDirRef.current = 1;
          frameRef.current = 0;
          holdingRef.current = false;
          setPhase("casting");
        }
      }
      if (e.key === "Escape") {
        onClose();
      }
    }
    function handleKeyUp(e: KeyboardEvent) {
      if (e.key === " " || e.key === "Enter") {
        holdingRef.current = false;
      }
    }
    function handlePointerDown() {
      if (phaseRef.current === "reeling") holdingRef.current = true;
    }
    function handlePointerUp() {
      holdingRef.current = false;
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [onClose]);

  const rarityColor: Record<string, string> = {
    Common: "#9badb7",
    Uncommon: "#3ddc84",
    Rare: "#3b7dd8",
    Epic: "#9b59b6",
    Legendary: "#f7de1e",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md pixel-border bg-card">
        <div className="flex items-center justify-between p-3 border-b-2 border-border">
          <p className="font-mono text-sm text-primary pixel-text">FISHING POND</p>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs font-mono">[ESC]</button>
        </div>

        <div className="p-4 flex flex-col gap-4 min-h-[320px]">
          <div className="relative h-28 bg-[#2a5a8a] overflow-hidden border-2 border-border" style={{ imageRendering: "pixelated" }}>
            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, #3a7aba 0%, #2a5a8a 40%, #1a3a6a 100%)" }} />
            
            {[0, 1, 2, 3, 4].map((i) => (
              <div key={i} className="absolute bg-[#4a9ada] opacity-30" style={{ height: "3px", top: `${15 + i * 18}%`, left: `${(i * 15) - 10}%`, width: "120%", borderRadius: "2px" }} />
            ))}

            <div className="absolute transition-all duration-300" style={{ left: "50%", top: phase === "waiting" ? "35%" : phase === "bite" ? "50%" : phase === "reeling" ? "45%" : "30%", transform: "translateX(-50%)" }}>
              <div className="w-px bg-[#e8c170] mx-auto" style={{ height: phase === "casting" ? "0px" : "40px", opacity: 0.6, transition: "height 0.5s" }} />
              <div className="w-4 h-4 rounded-full bg-[#e83b3b] border-2 border-[#c62d2d] mx-auto" />
              <div className="w-2 h-1 bg-[#f4f4f4] rounded-full mx-auto -mt-3 ml-1" style={{ opacity: 0.4 }} />
            </div>

            {phase === "bite" && (
              <div className="absolute animate-pulse" style={{ left: "58%", top: "20%" }}>
                <span className="text-[#f7de1e] font-mono font-bold text-xl" style={{ textShadow: "0 0 8px #f7de1e" }}>!</span>
              </div>
            )}
          </div>

          <div className="text-center">
            {phase === "casting" && <p className="font-mono text-sm text-muted-foreground animate-pulse">Casting line...</p>}
            {phase === "waiting" && <p className="font-mono text-sm text-muted-foreground">Waiting for a bite...</p>}
            {phase === "bite" && <p className="font-mono text-sm text-accent animate-pulse font-bold">A BITE! Press SPACE quickly!</p>}
            {phase === "reeling" && fish && (
              <div className="flex flex-col gap-3">
                <canvas ref={canvasRef} width={360} height={56} className="w-full border-2 border-border" style={{ imageRendering: "pixelated" }} />
                <span className="font-mono text-xs" style={{ color: rarityColor[fish.rarity] }}>{fish.rarity} - {fish.name}</span>
              </div>
            )}
            {phase === "caught" && fish && (
              <div className="flex flex-col gap-3 items-center">
                <p className="font-mono text-lg text-accent font-bold">You caught {fish.name}!</p>
                <div className="pixel-border bg-background/50 p-3 max-w-xs">
                  <p className="font-mono text-xs text-muted-foreground leading-relaxed">{fish.fact}</p>
                </div>
                <p className="font-mono text-xs text-primary animate-pulse mt-1">Press SPACE to fish again</p>
              </div>
            )}
            {phase === "escaped" && (
              <div className="flex flex-col gap-2 items-center">
                <p className="font-mono text-sm text-[#e83b3b] font-bold">The fish got away!</p>
                <p className="font-mono text-xs text-primary animate-pulse">Press SPACE to try again</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
