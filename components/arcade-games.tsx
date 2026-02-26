"use client";

import { useState, useEffect, useCallback, useRef } from "react";

type ArcadeGame = "menu" | "snake" | "memory";

interface ArcadeGamesProps {
  onClose: () => void;
}

export default function ArcadeGames({ onClose }: ArcadeGamesProps) {
  const [currentGame, setCurrentGame] = useState<ArcadeGame>("menu");

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (currentGame !== "menu") {
          setCurrentGame("menu");
        } else {
          onClose();
        }
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [currentGame, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-lg pixel-border bg-card">
        <div className="flex items-center justify-between p-3 border-b-2 border-border">
          <p className="font-mono text-sm text-primary pixel-text">
            {currentGame === "menu" ? "PIXEL ARCADE" : currentGame === "snake" ? "SNAKE" : "MEMORY MATCH"}
          </p>
          <div className="flex items-center gap-2">
            {currentGame !== "menu" && (
              <button
                onClick={() => setCurrentGame("menu")}
                className="text-muted-foreground hover:text-foreground text-xs font-mono"
              >
                [BACK]
              </button>
            )}
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground text-xs font-mono">
              [ESC]
            </button>
          </div>
        </div>

        <div className="p-4">
          {currentGame === "menu" && <ArcadeMenu onSelect={setCurrentGame} />}
          {currentGame === "snake" && <SnakeGame />}
          {currentGame === "memory" && <MemoryGame />}
        </div>
      </div>
    </div>
  );
}

function ArcadeMenu({ onSelect }: { onSelect: (game: ArcadeGame) => void }) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-mono text-xs text-muted-foreground text-center">Choose a game to play!</p>
      <div className="flex flex-col gap-3">
        <button
          onClick={() => onSelect("snake")}
          className="flex items-center gap-4 p-4 border-2 border-border hover:border-[#3ddc84] transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#3ddc84] flex items-center justify-center shrink-0">
            <div className="w-6 h-1 bg-[#1a6b3c]" />
            <div className="w-1 h-4 bg-[#1a6b3c] absolute" />
          </div>
          <div className="text-left">
            <p className="font-mono text-sm text-foreground group-hover:text-[#3ddc84] transition-colors">SNAKE</p>
            <p className="font-mono text-xs text-muted-foreground">Classic snake game - eat and grow!</p>
          </div>
        </button>
        <button
          onClick={() => onSelect("memory")}
          className="flex items-center gap-4 p-4 border-2 border-border hover:border-[#5b6ee1] transition-colors group cursor-pointer"
        >
          <div className="w-10 h-10 bg-[#5b6ee1] flex items-center justify-center shrink-0">
            <span className="font-mono text-xs text-[#f4f4f4]">{"??"}</span>
          </div>
          <div className="text-left">
            <p className="font-mono text-sm text-foreground group-hover:text-[#5b6ee1] transition-colors">MEMORY MATCH</p>
            <p className="font-mono text-xs text-muted-foreground">Match pairs of Ayush's tech skills!</p>
          </div>
        </button>
      </div>
    </div>
  );
}

// =============== SNAKE GAME ===============

const GRID = 15;
const CELL = 20;

type Dir = "up" | "down" | "left" | "right";
type Pos = { x: number; y: number };

function SnakeGame() {
  const [snake, setSnake] = useState<Pos[]>([{ x: 7, y: 7 }]);
  const [food, setFood] = useState<Pos>({ x: 3, y: 3 });
  const [dir, setDir] = useState<Dir>("right");
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);
  const dirRef = useRef<Dir>("right");
  const intervalRef = useRef<ReturnType<typeof setInterval>>();

  const spawnFood = useCallback((currentSnake: Pos[]): Pos => {
    let pos: Pos;
    do {
      pos = { x: Math.floor(Math.random() * GRID), y: Math.floor(Math.random() * GRID) };
    } while (currentSnake.some((s) => s.x === pos.x && s.y === pos.y));
    return pos;
  }, []);

  const resetGame = useCallback(() => {
    const initial = [{ x: 7, y: 7 }];
    setSnake(initial);
    setFood(spawnFood(initial));
    setDir("right");
    dirRef.current = "right";
    setGameOver(false);
    setScore(0);
    setStarted(false);
  }, [spawnFood]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (gameOver) {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          resetGame();
        }
        return;
      }
      if (!started) {
        if (e.key === " " || e.key === "Enter" || ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          e.preventDefault();
          setStarted(true);
        }
      }
      const d = dirRef.current;
      if ((e.key === "ArrowUp" || e.key === "w") && d !== "down") { dirRef.current = "up"; setDir("up"); }
      if ((e.key === "ArrowDown" || e.key === "s") && d !== "up") { dirRef.current = "down"; setDir("down"); }
      if ((e.key === "ArrowLeft" || e.key === "a") && d !== "right") { dirRef.current = "left"; setDir("left"); }
      if ((e.key === "ArrowRight" || e.key === "d") && d !== "left") { dirRef.current = "right"; setDir("right"); }
      e.stopPropagation();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [gameOver, started, resetGame]);

  useEffect(() => {
    if (!started || gameOver) return;

    intervalRef.current = setInterval(() => {
      setSnake((prev) => {
        const head = { ...prev[0] };
        const d = dirRef.current;
        if (d === "up") head.y--;
        if (d === "down") head.y++;
        if (d === "left") head.x--;
        if (d === "right") head.x++;

        // Wall collision
        if (head.x < 0 || head.x >= GRID || head.y < 0 || head.y >= GRID) {
          setGameOver(true);
          return prev;
        }
        // Self collision
        if (prev.some((s) => s.x === head.x && s.y === head.y)) {
          setGameOver(true);
          return prev;
        }

        const newSnake = [head, ...prev];
        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10);
          setFood(spawnFood(newSnake));
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    }, 150);

    return () => clearInterval(intervalRef.current);
  }, [started, gameOver, food, spawnFood]);

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="flex items-center justify-between w-full">
        <p className="font-mono text-xs text-muted-foreground">Score: {score}</p>
        {gameOver && <p className="font-mono text-xs text-[#e83b3b]">GAME OVER</p>}
      </div>

      <div
        className="border-2 border-border bg-[#1a2a1a] relative"
        style={{ width: GRID * CELL, height: GRID * CELL, imageRendering: "pixelated" }}
      >
        {/* Food */}
        <div
          className="absolute bg-[#e83b3b]"
          style={{ left: food.x * CELL, top: food.y * CELL, width: CELL - 1, height: CELL - 1 }}
        />
        {/* Snake */}
        {snake.map((s, i) => (
          <div
            key={i}
            className="absolute"
            style={{
              left: s.x * CELL,
              top: s.y * CELL,
              width: CELL - 1,
              height: CELL - 1,
              backgroundColor: i === 0 ? "#3ddc84" : "#2aad6a",
            }}
          />
        ))}

        {!started && !gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/60">
            <p className="font-mono text-xs text-primary animate-pulse">Press any arrow to start</p>
          </div>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-background/60 gap-2">
            <p className="font-mono text-sm text-[#e83b3b]">GAME OVER</p>
            <p className="font-mono text-xs text-muted-foreground">Score: {score}</p>
            <p className="font-mono text-xs text-primary animate-pulse">SPACE to retry</p>
          </div>
        )}
      </div>

      <p className="font-mono text-[10px] text-muted-foreground">Arrow keys or WASD to move</p>
    </div>
  );
}

// =============== MEMORY GAME ===============

const MEMORY_SKILLS = [
  { name: "HTML", color: "#e34c26" },
  { name: "CSS", color: "#264ce4" },
  { name: "JS", color: "#f7de1e" },
  { name: "Ruby", color: "#cc0000" },
  { name: "Rails", color: "#d30000" },
  { name: "Java", color: "#f89720" },
  { name: "C", color: "#5b94ff" },
  { name: "Linux", color: "#252525" },
];

interface MemoryCard {
  id: number;
  skill: { name: string; color: string };
  flipped: boolean;
  matched: boolean;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function MemoryGame() {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedIds, setFlippedIds] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);

  useEffect(() => {
    initGame();
  }, []);

  function initGame() {
    const pairs = MEMORY_SKILLS.flatMap((skill, i) => [
      { id: i * 2, skill, flipped: false, matched: false },
      { id: i * 2 + 1, skill, flipped: false, matched: false },
    ]);
    setCards(shuffleArray(pairs));
    setFlippedIds([]);
    setMoves(0);
    setWon(false);
  }

  const handleCardClick = useCallback(
    (cardId: number) => {
      if (won) return;
      if (flippedIds.length >= 2) return;

      const card = cards.find((c) => c.id === cardId);
      if (!card || card.flipped || card.matched) return;

      const newFlipped = [...flippedIds, cardId];
      setFlippedIds(newFlipped);

      setCards((prev) =>
        prev.map((c) => (c.id === cardId ? { ...c, flipped: true } : c))
      );

      if (newFlipped.length === 2) {
        setMoves((m) => m + 1);
        const [first, second] = newFlipped;
        const c1 = cards.find((c) => c.id === first)!;
        const c2 = cards.find((c) => c.id === cardId)!;

        if (c1.skill.name === c2.skill.name) {
          // Match
          setTimeout(() => {
            setCards((prev) => {
              const updated = prev.map((c) =>
                c.id === first || c.id === second ? { ...c, matched: true } : c
              );
              if (updated.every((c) => c.matched)) setWon(true);
              return updated;
            });
            setFlippedIds([]);
          }, 400);
        } else {
          // No match - flip back
          setTimeout(() => {
            setCards((prev) =>
              prev.map((c) =>
                c.id === first || c.id === second ? { ...c, flipped: false } : c
              )
            );
            setFlippedIds([]);
          }, 800);
        }
      }
    },
    [cards, flippedIds, won]
  );

  return (
    <div className="flex flex-col gap-3 items-center">
      <div className="flex items-center justify-between w-full">
        <p className="font-mono text-xs text-muted-foreground">Moves: {moves}</p>
        {won && (
          <button onClick={initGame} className="font-mono text-xs text-primary hover:text-accent cursor-pointer">
            Play Again
          </button>
        )}
      </div>

      <div className="grid grid-cols-4 gap-2">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className="w-14 h-14 md:w-16 md:h-16 border-2 transition-all duration-200 flex items-center justify-center cursor-pointer"
            style={{
              borderColor: card.matched ? card.skill.color : card.flipped ? card.skill.color : "var(--border)",
              backgroundColor: card.matched
                ? card.skill.color + "30"
                : card.flipped
                ? card.skill.color + "20"
                : "var(--muted)",
              transform: card.flipped || card.matched ? "rotateY(0)" : "rotateY(0)",
            }}
          >
            {card.flipped || card.matched ? (
              <span
                className="font-mono text-xs font-bold"
                style={{ color: card.skill.color }}
              >
                {card.skill.name}
              </span>
            ) : (
              <span className="font-mono text-lg text-muted-foreground">?</span>
            )}
          </button>
        ))}
      </div>

      {won && (
        <div className="text-center flex flex-col gap-1">
          <p className="font-mono text-sm text-accent">All pairs matched!</p>
          <p className="font-mono text-xs text-muted-foreground">Completed in {moves} moves</p>
        </div>
      )}

      <p className="font-mono text-[10px] text-muted-foreground">Click cards to flip and find matching pairs</p>
    </div>
  );
}
