"use client";

import { useRef, useEffect, useCallback, useState } from "react";
import { buildings, npcs, type Building, type NPC } from "@/lib/game-data";
import {
  drawGrass,
  drawPath,
  drawBuilding,
  drawPlayer,
  drawNPC,
  drawTree,
  drawFence,
} from "@/lib/pixel-renderer";
import {
  generateMap,
  isWalkable,
  getNearbyBuilding,
  getNearbyNPC,
  MAP_WIDTH,
  MAP_HEIGHT,
  GRASS,
  PATH,
  TREE,
  FENCE,
  WATER,
} from "@/lib/world-map";

const TILE = 32;
const MOVE_COOLDOWN = 120; // ms between moves

interface GameCanvasProps {
  onBuildingEnter: (building: Building) => void;
  onNPCTalk: (npc: NPC) => void;
  onNPCLeave: () => void;
  onNearBuilding: (building: Building | null) => void;
  isPaused: boolean;
}

export default function GameCanvas({
  onBuildingEnter,
  onNPCTalk,
  onNPCLeave,
  onNearBuilding,
  isPaused,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({ x: 9, y: 9, dir: 0, frame: 0, moving: false });
  const keysRef = useRef<Set<string>>(new Set());
  const lastMoveRef = useRef(0);
  const mapRef = useRef<number[][]>([]);
  const animFrameRef = useRef(0);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Initialize map
  useEffect(() => {
    mapRef.current = generateMap();
  }, []);

  // Handle resize
  useEffect(() => {
    function handleResize() {
      setCanvasSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Keyboard input
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isPaused) return;
      keysRef.current.add(e.key);

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const p = playerRef.current;
        const nearBuilding = getNearbyBuilding(p.x, p.y);
        if (nearBuilding) {
          onBuildingEnter(nearBuilding);
          return;
        }
        const nearNPC = getNearbyNPC(p.x, p.y);
        if (nearNPC) {
          onNPCTalk(nearNPC);
          return;
        }
      }
    }
    function onKeyUp(e: KeyboardEvent) {
      keysRef.current.delete(e.key);
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [isPaused, onBuildingEnter, onNPCTalk]);

  // D-pad controls (called from parent)
  const handleDPad = useCallback(
    (direction: string) => {
      if (isPaused) return;
      const p = playerRef.current;
      const map = mapRef.current;
      let nx = p.x;
      let ny = p.y;
      switch (direction) {
        case "up":
          p.dir = 1;
          ny--;
          break;
        case "down":
          p.dir = 0;
          ny++;
          break;
        case "left":
          p.dir = 2;
          nx--;
          break;
        case "right":
          p.dir = 3;
          nx++;
          break;
      }
      if (isWalkable(map, nx, ny)) {
        p.x = nx;
        p.y = ny;
        p.frame++;
      }
    },
    [isPaused]
  );

  // Expose dpad handler on window for the overlay
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__gameDPad = handleDPad;
    return () => {
      delete (window as unknown as Record<string, unknown>).__gameDPad;
    };
  }, [handleDPad]);

  // Main game loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let running = true;

    function gameLoop() {
      if (!running || !ctx) return;
      const now = Date.now();
      const p = playerRef.current;
      const map = mapRef.current;
      if (!map.length) {
        requestAnimationFrame(gameLoop);
        return;
      }

      // Process keyboard movement
      if (!isPaused && now - lastMoveRef.current > MOVE_COOLDOWN) {
        let moved = false;
        let nx = p.x;
        let ny = p.y;

        if (
          keysRef.current.has("ArrowUp") ||
          keysRef.current.has("w") ||
          keysRef.current.has("W")
        ) {
          p.dir = 1;
          ny--;
          moved = true;
        } else if (
          keysRef.current.has("ArrowDown") ||
          keysRef.current.has("s") ||
          keysRef.current.has("S")
        ) {
          p.dir = 0;
          ny++;
          moved = true;
        } else if (
          keysRef.current.has("ArrowLeft") ||
          keysRef.current.has("a") ||
          keysRef.current.has("A")
        ) {
          p.dir = 2;
          nx--;
          moved = true;
        } else if (
          keysRef.current.has("ArrowRight") ||
          keysRef.current.has("d") ||
          keysRef.current.has("D")
        ) {
          p.dir = 3;
          nx++;
          moved = true;
        }

        if (moved && isWalkable(map, nx, ny)) {
          p.x = nx;
          p.y = ny;
          p.frame++;
          lastMoveRef.current = now;
        } else if (moved) {
          lastMoveRef.current = now;
        }
      }

      // Check proximity
      const nearBuilding = getNearbyBuilding(p.x, p.y);
      onNearBuilding(nearBuilding);

      const nearNPC = getNearbyNPC(p.x, p.y);
      if (!nearNPC) {
        onNPCLeave();
      }

      // Camera
      const camX = p.x * TILE - canvasSize.width / 2 + TILE / 2;
      const camY = p.y * TILE - canvasSize.height / 2 + TILE / 2;

      // Clear
      ctx.fillStyle = "#1a1c2c";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Determine visible tiles
      const startX = Math.max(0, Math.floor(camX / TILE) - 1);
      const startY = Math.max(0, Math.floor(camY / TILE) - 1);
      const endX = Math.min(
        MAP_WIDTH,
        Math.ceil((camX + canvasSize.width) / TILE) + 1
      );
      const endY = Math.min(
        MAP_HEIGHT,
        Math.ceil((camY + canvasSize.height) / TILE) + 1
      );

      // Draw ground tiles
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const tile = map[y]?.[x];
          if (tile === PATH) {
            drawPath(ctx, x, y, camX, camY);
          } else if (tile === WATER) {
            drawWater(ctx, x, y, camX, camY, animFrameRef.current);
          } else if (tile !== undefined) {
            drawGrass(ctx, x, y, camX, camY);
          }
        }
      }

      // Draw fences
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (map[y]?.[x] === FENCE) {
            drawFence(ctx, x, y, camX, camY);
          }
        }
      }

      // Draw buildings
      for (const b of buildings) {
        const isNear = nearBuilding?.id === b.id;
        drawBuilding(ctx, b, camX, camY, isNear);
      }

      // Draw trees
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (map[y]?.[x] === TREE) {
            drawTree(ctx, x, y, camX, camY);
          }
        }
      }

      // Draw NPCs
      for (const npc of npcs) {
        const isNear = nearNPC?.id === npc.id;
        drawNPC(ctx, npc, camX, camY, animFrameRef.current, isNear);
      }

      // Draw player
      drawPlayer(ctx, p.x, p.y, camX, camY, p.dir, p.frame);

      animFrameRef.current++;
      requestAnimationFrame(gameLoop);
    }

    requestAnimationFrame(gameLoop);
    return () => {
      running = false;
    };
  }, [canvasSize, isPaused, onNearBuilding, onNPCLeave]);

  return (
    <canvas
      ref={canvasRef}
      width={canvasSize.width}
      height={canvasSize.height}
      className="block"
      style={{ imageRendering: "pixelated" }}
    />
  );
}

// Water drawing with animation
function drawWater(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  frame: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;
  const wave = Math.sin(frame * 0.04 + x * 0.5 + y * 0.3) * 2;

  ctx.fillStyle = "#3b7dd8";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "#5b9de8";
  ctx.fillRect(px + 4, py + 8 + wave, 24, 4);
  ctx.fillRect(px + 8, py + 20 - wave, 20, 3);
}
