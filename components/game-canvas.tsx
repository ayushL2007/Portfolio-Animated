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
  drawFlowerPatch,
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
  FLOWER_PATCH,
} from "@/lib/world-map";
import {
  buildingInteriors,
  isInteriorWalkable,
  isNearReceptionist,
  isOnExitMat,
  INTERIOR_WIDTH,
  INTERIOR_HEIGHT,
  type BuildingInterior,
} from "@/lib/interior-data";
import { drawInterior } from "@/lib/interior-renderer";

const TILE = 32;
const MOVE_COOLDOWN = 120;

export type GameLocation =
  | { type: "overworld" }
  | { type: "interior"; buildingId: string };

interface GameCanvasProps {
  onBuildingEnter: (building: Building) => void;
  onBuildingExit: () => void;
  onNPCTalk: (npc: NPC) => void;
  onReceptionistTalk: (interior: BuildingInterior) => void;
  onNPCLeave: () => void;
  onNearBuilding: (building: Building | null) => void;
  onLocationChange: (location: GameLocation) => void;
  isPaused: boolean;
  currentLocation: GameLocation;
}

export default function GameCanvas({
  onBuildingEnter,
  onBuildingExit,
  onNPCTalk,
  onReceptionistTalk,
  onNPCLeave,
  onNearBuilding,
  onLocationChange,
  isPaused,
  currentLocation,
}: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const playerRef = useRef({ x: 15, y: 10, dir: 0, frame: 0, moving: false });
  // Store overworld position when entering a building
  const overworldPosRef = useRef({ x: 15, y: 10 });
  const keysRef = useRef<Set<string>>(new Set());
  const lastMoveRef = useRef(0);
  const mapRef = useRef<number[][]>([]);
  const animFrameRef = useRef(0);
  const locationRef = useRef<GameLocation>(currentLocation);
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

  // Keep locationRef in sync
  useEffect(() => {
    locationRef.current = currentLocation;
  }, [currentLocation]);

  useEffect(() => {
    mapRef.current = generateMap();
  }, []);

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

  // Keyboard handler
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (isPaused) return;
      keysRef.current.add(e.key);

      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        const p = playerRef.current;
        const loc = locationRef.current;

        if (loc.type === "overworld") {
          // Check building interaction
          const nearBuilding = getNearbyBuilding(p.x, p.y);
          if (nearBuilding) {
            // Save overworld position and enter building
            overworldPosRef.current = { x: p.x, y: p.y };
            onBuildingEnter(nearBuilding);
            return;
          }
          // Check NPC interaction
          const nearNPC = getNearbyNPC(p.x, p.y);
          if (nearNPC) {
            onNPCTalk(nearNPC);
            return;
          }
        } else if (loc.type === "interior") {
          // Check receptionist interaction
          const interior = buildingInteriors[loc.buildingId];
          if (interior && isNearReceptionist(p.x, p.y, interior.receptionist)) {
            onReceptionistTalk(interior);
            return;
          }
          // Check exit mat
          if (interior && isOnExitMat(interior.map, p.x, p.y)) {
            // Exit building
            const restored = overworldPosRef.current;
            playerRef.current.x = restored.x;
            playerRef.current.y = restored.y;
            playerRef.current.dir = 0;
            onBuildingExit();
            return;
          }
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
  }, [isPaused, onBuildingEnter, onBuildingExit, onNPCTalk, onReceptionistTalk]);

  const handleDPad = useCallback(
    (direction: string) => {
      if (isPaused) return;
      const p = playerRef.current;
      const loc = locationRef.current;
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

      if (loc.type === "overworld") {
        if (isWalkable(mapRef.current, nx, ny)) {
          p.x = nx;
          p.y = ny;
          p.frame++;
          p.moving = true;
        }
      } else if (loc.type === "interior") {
        const interior = buildingInteriors[loc.buildingId];
        if (interior && isInteriorWalkable(interior.map, nx, ny)) {
          p.x = nx;
          p.y = ny;
          p.frame++;
          p.moving = true;
        }
      }
    },
    [isPaused]
  );

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__gameDPad = handleDPad;
    return () => {
      delete (window as unknown as Record<string, unknown>).__gameDPad;
    };
  }, [handleDPad]);

  // Expose enter building function for parent
  useEffect(() => {
    (window as unknown as Record<string, unknown>).__gameEnterBuilding = (buildingId: string) => {
      const interior = buildingInteriors[buildingId];
      if (!interior) return;
      // Place player at entrance (above exit mat)
      playerRef.current.x = 4;
      playerRef.current.y = INTERIOR_HEIGHT - 2;
      playerRef.current.dir = 1; // face up
      onLocationChange({ type: "interior", buildingId });
    };
    return () => {
      delete (window as unknown as Record<string, unknown>).__gameEnterBuilding;
    };
  }, [onLocationChange]);

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
      const loc = locationRef.current;

      if (loc.type === "overworld") {
        const map = mapRef.current;
        if (!map.length) {
          requestAnimationFrame(gameLoop);
          return;
        }
        renderOverworld(ctx, p, map, now);
      } else if (loc.type === "interior") {
        const interior = buildingInteriors[loc.buildingId];
        if (!interior) {
          requestAnimationFrame(gameLoop);
          return;
        }
        renderInterior(ctx, p, interior, now);
      }

      animFrameRef.current++;
      requestAnimationFrame(gameLoop);
    }

    function renderOverworld(
      ctx: CanvasRenderingContext2D,
      p: { x: number; y: number; dir: number; frame: number; moving: boolean },
      map: number[][],
      now: number
    ) {
      // Process movement
      let movedThisFrame = false;
      if (!isPaused && now - lastMoveRef.current > MOVE_COOLDOWN) {
        let moved = false;
        let nx = p.x;
        let ny = p.y;

        if (keysRef.current.has("ArrowUp") || keysRef.current.has("w") || keysRef.current.has("W")) {
          p.dir = 1; ny--; moved = true;
        } else if (keysRef.current.has("ArrowDown") || keysRef.current.has("s") || keysRef.current.has("S")) {
          p.dir = 0; ny++; moved = true;
        } else if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A")) {
          p.dir = 2; nx--; moved = true;
        } else if (keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D")) {
          p.dir = 3; nx++; moved = true;
        }

        if (moved && isWalkable(map, nx, ny)) {
          p.x = nx; p.y = ny; p.frame++;
          lastMoveRef.current = now;
          movedThisFrame = true;
        } else if (moved) {
          lastMoveRef.current = now;
        }
      }

      const anyKeyHeld =
        keysRef.current.has("ArrowUp") || keysRef.current.has("ArrowDown") ||
        keysRef.current.has("ArrowLeft") || keysRef.current.has("ArrowRight") ||
        keysRef.current.has("w") || keysRef.current.has("W") ||
        keysRef.current.has("a") || keysRef.current.has("A") ||
        keysRef.current.has("s") || keysRef.current.has("S") ||
        keysRef.current.has("d") || keysRef.current.has("D");

      p.moving = anyKeyHeld || movedThisFrame;

      // Check proximity
      const nearBuilding = getNearbyBuilding(p.x, p.y);
      onNearBuilding(nearBuilding);

      const nearNPC = getNearbyNPC(p.x, p.y);
      if (!nearNPC) onNPCLeave();

      // Camera
      const camX = p.x * TILE - canvasSize.width / 2 + TILE / 2;
      const camY = p.y * TILE - canvasSize.height / 2 + TILE / 2;

      ctx.fillStyle = "#1a1c2c";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      const startX = Math.max(0, Math.floor(camX / TILE) - 1);
      const startY = Math.max(0, Math.floor(camY / TILE) - 1);
      const endX = Math.min(MAP_WIDTH, Math.ceil((camX + canvasSize.width) / TILE) + 1);
      const endY = Math.min(MAP_HEIGHT, Math.ceil((camY + canvasSize.height) / TILE) + 1);

      // Draw ground
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const tile = map[y]?.[x];
          if (tile === PATH) drawPath(ctx, x, y, camX, camY);
          else if (tile === WATER) drawWater(ctx, x, y, camX, camY, animFrameRef.current);
          else if (tile === FLOWER_PATCH) drawFlowerPatch(ctx, x, y, camX, camY);
          else if (tile !== undefined) drawGrass(ctx, x, y, camX, camY);
        }
      }

      // Fences
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (map[y]?.[x] === FENCE) drawFence(ctx, x, y, camX, camY);
        }
      }

      // Buildings
      for (const b of buildings) {
        const isNear = nearBuilding?.id === b.id;
        drawBuilding(ctx, b, camX, camY, isNear);
      }

      // Trees
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          if (map[y]?.[x] === TREE) drawTree(ctx, x, y, camX, camY);
        }
      }

      // NPCs
      for (const npc of npcs) {
        const isNear = nearNPC?.id === npc.id;
        drawNPC(ctx, npc, camX, camY, animFrameRef.current, isNear);
      }

      // Player
      drawPlayer(ctx, p.x, p.y, camX, camY, p.dir, p.frame, p.moving);
    }

    function renderInterior(
      ctx: CanvasRenderingContext2D,
      p: { x: number; y: number; dir: number; frame: number; moving: boolean },
      interior: BuildingInterior,
      now: number
    ) {
      // Process movement
      let movedThisFrame = false;
      if (!isPaused && now - lastMoveRef.current > MOVE_COOLDOWN) {
        let moved = false;
        let nx = p.x;
        let ny = p.y;

        if (keysRef.current.has("ArrowUp") || keysRef.current.has("w") || keysRef.current.has("W")) {
          p.dir = 1; ny--; moved = true;
        } else if (keysRef.current.has("ArrowDown") || keysRef.current.has("s") || keysRef.current.has("S")) {
          p.dir = 0; ny++; moved = true;
        } else if (keysRef.current.has("ArrowLeft") || keysRef.current.has("a") || keysRef.current.has("A")) {
          p.dir = 2; nx--; moved = true;
        } else if (keysRef.current.has("ArrowRight") || keysRef.current.has("d") || keysRef.current.has("D")) {
          p.dir = 3; nx++; moved = true;
        }

        if (moved && isInteriorWalkable(interior.map, nx, ny)) {
          p.x = nx; p.y = ny; p.frame++;
          lastMoveRef.current = now;
          movedThisFrame = true;

          // Auto-exit if stepping on exit mat
          if (isOnExitMat(interior.map, nx, ny)) {
            const restored = overworldPosRef.current;
            playerRef.current.x = restored.x;
            playerRef.current.y = restored.y;
            playerRef.current.dir = 0;
            onBuildingExit();
            return;
          }
        } else if (moved) {
          lastMoveRef.current = now;
        }
      }

      const anyKeyHeld =
        keysRef.current.has("ArrowUp") || keysRef.current.has("ArrowDown") ||
        keysRef.current.has("ArrowLeft") || keysRef.current.has("ArrowRight") ||
        keysRef.current.has("w") || keysRef.current.has("W") ||
        keysRef.current.has("a") || keysRef.current.has("A") ||
        keysRef.current.has("s") || keysRef.current.has("S") ||
        keysRef.current.has("d") || keysRef.current.has("D");

      p.moving = anyKeyHeld || movedThisFrame;

      // Camera centered on interior
      const interiorPixelW = INTERIOR_WIDTH * TILE;
      const interiorPixelH = INTERIOR_HEIGHT * TILE;
      const camX = interiorPixelW / 2 - canvasSize.width / 2;
      const camY = interiorPixelH / 2 - canvasSize.height / 2;

      // Dark background
      ctx.fillStyle = "#0d0d1a";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      // Draw interior scene
      drawInterior(ctx, interior, camX, camY, animFrameRef.current, p.x, p.y);

      // Draw player
      drawPlayer(ctx, p.x, p.y, camX, camY, p.dir, p.frame, p.moving);

      // Location label
      ctx.fillStyle = "rgba(26,28,44,0.85)";
      ctx.fillRect(canvasSize.width / 2 - 80, 8, 160, 22);
      ctx.fillStyle = "#e8c170";
      ctx.font = "bold 10px monospace";
      ctx.textAlign = "center";
      const bldg = buildings.find(b => b.id === interior.buildingId);
      ctx.fillText(bldg?.signText ?? interior.buildingId.toUpperCase(), canvasSize.width / 2, 23);
    }

    requestAnimationFrame(gameLoop);
    return () => { running = false; };
  }, [canvasSize, isPaused, onNearBuilding, onNPCLeave, onBuildingExit]);

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
  if ((x + y + Math.floor(frame / 30)) % 7 === 0) {
    ctx.fillStyle = "#aad4ff";
    ctx.fillRect(px + 12, py + 12 + wave, 3, 3);
  }
}
