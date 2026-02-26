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
  TILE,
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
import { drawInterior, INTERIOR_TILE } from "@/lib/interior-renderer";

// Movement: lower cooldown for smoother held-key walking
const MOVE_COOLDOWN = 90;

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
  const overworldPosRef = useRef({ x: 15, y: 10 });
  const keysRef = useRef<Set<string>>(new Set());
  const lastMoveRef = useRef(0);
  const mapRef = useRef<number[][]>([]);
  const animFrameRef = useRef(0);
  const locationRef = useRef<GameLocation>(currentLocation);
  // Camera position for character-moves-not-world: camera only scrolls when player nears edge
  const camRef = useRef({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });

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
          const nearBuilding = getNearbyBuilding(p.x, p.y);
          if (nearBuilding) {
            overworldPosRef.current = { x: p.x, y: p.y };
            onBuildingEnter(nearBuilding);
            return;
          }
          const nearNPC = getNearbyNPC(p.x, p.y);
          if (nearNPC) {
            onNPCTalk(nearNPC);
            return;
          }
        } else if (loc.type === "interior") {
          const interior = buildingInteriors[loc.buildingId];
          if (interior && isNearReceptionist(p.x, p.y, interior.receptionist)) {
            onReceptionistTalk(interior);
            return;
          }
          if (interior && isOnExitMat(interior.map, p.x, p.y)) {
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
        case "up": p.dir = 1; ny--; break;
        case "down": p.dir = 0; ny++; break;
        case "left": p.dir = 2; nx--; break;
        case "right": p.dir = 3; nx++; break;
      }
      if (loc.type === "overworld") {
        if (isWalkable(mapRef.current, nx, ny)) {
          p.x = nx; p.y = ny; p.frame++; p.moving = true;
        }
      } else if (loc.type === "interior") {
        const interior = buildingInteriors[loc.buildingId];
        if (interior && isInteriorWalkable(interior.map, nx, ny)) {
          p.x = nx; p.y = ny; p.frame++; p.moving = true;
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

  useEffect(() => {
    (window as unknown as Record<string, unknown>).__gameEnterBuilding = (buildingId: string) => {
      const interior = buildingInteriors[buildingId];
      if (!interior) return;
      playerRef.current.x = 4;
      playerRef.current.y = INTERIOR_HEIGHT - 2;
      playerRef.current.dir = 1;
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

    // Initialize camera to center on player
    const p = playerRef.current;
    camRef.current.x = p.x * TILE - canvasSize.width / 2 + TILE / 2;
    camRef.current.y = p.y * TILE - canvasSize.height / 2 + TILE / 2;

    function gameLoop() {
      if (!running || !ctx) return;
      const now = Date.now();
      const p = playerRef.current;
      const loc = locationRef.current;

      if (loc.type === "overworld") {
        const map = mapRef.current;
        if (!map.length) { requestAnimationFrame(gameLoop); return; }
        renderOverworld(ctx, p, map, now);
      } else if (loc.type === "interior") {
        const interior = buildingInteriors[loc.buildingId];
        if (!interior) { requestAnimationFrame(gameLoop); return; }
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
      // Process held-key movement
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

      const nearBuilding = getNearbyBuilding(p.x, p.y);
      onNearBuilding(nearBuilding);
      const nearNPC = getNearbyNPC(p.x, p.y);
      if (!nearNPC) onNPCLeave();

      // --- Edge-scroll camera: player moves on screen, camera only scrolls at edges ---
      const edgeMargin = TILE * 4; // tiles of margin before camera scrolls
      const playerScreenX = p.x * TILE - camRef.current.x;
      const playerScreenY = p.y * TILE - camRef.current.y;

      // Scroll camera when player approaches edge
      if (playerScreenX < edgeMargin) {
        camRef.current.x = p.x * TILE - edgeMargin;
      }
      if (playerScreenX + TILE > canvasSize.width - edgeMargin) {
        camRef.current.x = p.x * TILE + TILE - canvasSize.width + edgeMargin;
      }
      if (playerScreenY < edgeMargin) {
        camRef.current.y = p.y * TILE - edgeMargin;
      }
      if (playerScreenY + TILE > canvasSize.height - edgeMargin) {
        camRef.current.y = p.y * TILE + TILE - canvasSize.height + edgeMargin;
      }

      // Clamp camera to world bounds
      const maxCamX = MAP_WIDTH * TILE - canvasSize.width;
      const maxCamY = MAP_HEIGHT * TILE - canvasSize.height;
      camRef.current.x = Math.max(0, Math.min(camRef.current.x, maxCamX));
      camRef.current.y = Math.max(0, Math.min(camRef.current.y, maxCamY));

      const camX = camRef.current.x;
      const camY = camRef.current.y;

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

      // Center the interior on screen
      const interiorPixelW = INTERIOR_WIDTH * INTERIOR_TILE;
      const interiorPixelH = INTERIOR_HEIGHT * INTERIOR_TILE;
      const camX = interiorPixelW / 2 - canvasSize.width / 2;
      const camY = interiorPixelH / 2 - canvasSize.height / 2;

      ctx.fillStyle = "#0d0d1a";
      ctx.fillRect(0, 0, canvasSize.width, canvasSize.height);

      drawInterior(ctx, interior, camX, camY, animFrameRef.current, p.x, p.y);

      // Draw player inside interior using INTERIOR_TILE
      drawPlayerInterior(ctx, p.x, p.y, camX, camY, p.dir, p.frame, p.moving);
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

// Interior player draw uses INTERIOR_TILE for positioning
function drawPlayerInterior(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  direction: number,
  frame: number,
  isMoving: boolean
) {
  // Use INTERIOR_TILE for position, but draw the sprite at same visual size
  const px = x * INTERIOR_TILE - camX;
  const py = y * INTERIOR_TILE - camY;

  const walkFrame = isMoving ? frame % 4 : 0;
  const s = INTERIOR_TILE; // scale factor
  const f = s / 48; // normalize to 48 (the interior tile size)

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(px + s / 2, py + s - 2 * f, 12 * f, 4 * f, 0, 0, Math.PI * 2);
  ctx.fill();

  // Delegate to the same visual structure but scaled for interior tiles
  drawPlayerScaled(ctx, px, py, f, direction, walkFrame, isMoving);
}

function drawPlayerScaled(
  ctx: CanvasRenderingContext2D,
  px: number,
  py: number,
  f: number,
  direction: number,
  walkFrame: number,
  isMoving: boolean
) {
  const legSwing = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? -3 * f : walkFrame === 3 ? 3 * f : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -1 * f : 0) : 0;

  if (direction === 0) {
    // FACING DOWN
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 6 * f, py - 3 * f + bounce, 28 * f, 7 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 6 * f, py + 3 * f + bounce, 28 * f, 3 * f);
    ctx.fillStyle = "#2d3436";
    ctx.fillRect(px + 8 * f, py + 1 * f + bounce, 24 * f, 5 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 10 * f, py + 4 * f + bounce, 20 * f, 15 * f);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 14 * f, py + 10 * f + bounce, 4 * f, 4 * f);
    ctx.fillRect(px + 23 * f, py + 10 * f + bounce, 4 * f, 4 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 15 * f, py + 10 * f + bounce, 2 * f, 2 * f);
    ctx.fillRect(px + 24 * f, py + 10 * f + bounce, 2 * f, 2 * f);
    ctx.fillStyle = "#c4956a";
    ctx.fillRect(px + 18 * f, py + 16 * f + bounce, 5 * f, 2 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 10 * f, py + 19 * f + bounce, 20 * f, 10 * f);
    ctx.fillStyle = "#c62d2d";
    ctx.fillRect(px + 19 * f, py + 19 * f + bounce, 3 * f, 10 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 5 * f, py + 20 * f + bounce + armSwing, 5 * f, 8 * f);
    ctx.fillRect(px + 30 * f, py + 20 * f + bounce - armSwing, 5 * f, 8 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 5 * f, py + 28 * f + bounce + armSwing, 5 * f, 3 * f);
    ctx.fillRect(px + 30 * f, py + 28 * f + bounce - armSwing, 5 * f, 3 * f);
    ctx.fillStyle = "#3f3f74";
    ctx.fillRect(px + 11 * f, py + 29 * f + bounce, 8 * f, 8 * f + legSwing);
    ctx.fillRect(px + 21 * f, py + 29 * f + bounce, 8 * f, 8 * f - legSwing);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 10 * f, py + 36 * f + bounce + Math.max(0, legSwing), 9 * f, 4 * f);
    ctx.fillRect(px + 21 * f, py + 36 * f + bounce + Math.max(0, -legSwing), 9 * f, 4 * f);
  } else if (direction === 1) {
    // FACING UP
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 6 * f, py - 3 * f + bounce, 28 * f, 7 * f);
    ctx.fillStyle = "#c62d2d";
    ctx.fillRect(px + 15 * f, py + 3 * f + bounce, 10 * f, 3 * f);
    ctx.fillStyle = "#2d3436";
    ctx.fillRect(px + 8 * f, py + 1 * f + bounce, 24 * f, 18 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 7 * f, py + 9 * f + bounce, 3 * f, 5 * f);
    ctx.fillRect(px + 30 * f, py + 9 * f + bounce, 3 * f, 5 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 10 * f, py + 19 * f + bounce, 20 * f, 10 * f);
    ctx.fillStyle = "#c62d2d";
    ctx.fillRect(px + 13 * f, py + 19 * f + bounce, 3 * f, 10 * f);
    ctx.fillRect(px + 25 * f, py + 19 * f + bounce, 3 * f, 10 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 5 * f, py + 20 * f + bounce + armSwing, 5 * f, 8 * f);
    ctx.fillRect(px + 30 * f, py + 20 * f + bounce - armSwing, 5 * f, 8 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 5 * f, py + 28 * f + bounce + armSwing, 5 * f, 3 * f);
    ctx.fillRect(px + 30 * f, py + 28 * f + bounce - armSwing, 5 * f, 3 * f);
    ctx.fillStyle = "#3f3f74";
    ctx.fillRect(px + 11 * f, py + 29 * f + bounce, 8 * f, 8 * f + legSwing);
    ctx.fillRect(px + 21 * f, py + 29 * f + bounce, 8 * f, 8 * f - legSwing);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 10 * f, py + 36 * f + bounce + Math.max(0, legSwing), 9 * f, 4 * f);
    ctx.fillRect(px + 21 * f, py + 36 * f + bounce + Math.max(0, -legSwing), 9 * f, 4 * f);
  } else if (direction === 2) {
    // FACING LEFT
    const la = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
    const aa = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 2 * f, py - 3 * f + bounce, 26 * f, 7 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 2 * f, py + 3 * f + bounce, 13 * f, 3 * f);
    ctx.fillStyle = "#2d3436";
    ctx.fillRect(px + 10 * f, py + 1 * f + bounce, 18 * f, 7 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 11 * f, py + 4 * f + bounce, 17 * f, 15 * f);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 13 * f, py + 10 * f + bounce, 4 * f, 4 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 13 * f, py + 10 * f + bounce, 2 * f, 2 * f);
    ctx.fillStyle = "#d4b78a";
    ctx.fillRect(px + 9 * f, py + 13 * f + bounce, 3 * f, 3 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 12 * f, py + 19 * f + bounce, 16 * f, 10 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 8 * f, py + 20 * f + bounce - aa, 5 * f, 8 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 8 * f, py + 28 * f + bounce - aa, 5 * f, 3 * f);
    ctx.fillStyle = "#c62d2d";
    ctx.fillRect(px + 27 * f, py + 20 * f + bounce + aa, 4 * f, 7 * f);
    ctx.fillStyle = "#3f3f74";
    ctx.fillRect(px + 12 * f - la, py + 29 * f + bounce, 7 * f, 8 * f);
    ctx.fillStyle = "#2d2d5c";
    ctx.fillRect(px + 21 * f + la, py + 29 * f + bounce, 7 * f, 8 * f);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 10 * f - la, py + 36 * f + bounce, 9 * f, 4 * f);
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(px + 20 * f + la, py + 36 * f + bounce, 8 * f, 4 * f);
  } else {
    // FACING RIGHT
    const la = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
    const aa = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 12 * f, py - 3 * f + bounce, 26 * f, 7 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 25 * f, py + 3 * f + bounce, 13 * f, 3 * f);
    ctx.fillStyle = "#2d3436";
    ctx.fillRect(px + 12 * f, py + 1 * f + bounce, 18 * f, 7 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 12 * f, py + 4 * f + bounce, 17 * f, 15 * f);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 24 * f, py + 10 * f + bounce, 4 * f, 4 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 26 * f, py + 10 * f + bounce, 2 * f, 2 * f);
    ctx.fillStyle = "#d4b78a";
    ctx.fillRect(px + 28 * f, py + 13 * f + bounce, 3 * f, 3 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 12 * f, py + 19 * f + bounce, 16 * f, 10 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 27 * f, py + 20 * f + bounce - aa, 5 * f, 8 * f);
    ctx.fillStyle = "#f4d7a7";
    ctx.fillRect(px + 27 * f, py + 28 * f + bounce - aa, 5 * f, 3 * f);
    ctx.fillStyle = "#c62d2d";
    ctx.fillRect(px + 9 * f, py + 20 * f + bounce + aa, 4 * f, 7 * f);
    ctx.fillStyle = "#3f3f74";
    ctx.fillRect(px + 21 * f + la, py + 29 * f + bounce, 7 * f, 8 * f);
    ctx.fillStyle = "#2d2d5c";
    ctx.fillRect(px + 12 * f - la, py + 29 * f + bounce, 7 * f, 8 * f);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 21 * f + la, py + 36 * f + bounce, 9 * f, 4 * f);
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(px + 12 * f - la, py + 36 * f + bounce, 8 * f, 4 * f);
  }
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
  const wave = Math.sin(frame * 0.04 + x * 0.5 + y * 0.3) * 3;

  ctx.fillStyle = "#3b7dd8";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "#5b9de8";
  ctx.fillRect(px + 6, py + 12 + wave, TILE * 0.6, 5);
  ctx.fillRect(px + 10, py + 28 - wave, TILE * 0.5, 4);
  if ((x + y + Math.floor(frame / 30)) % 7 === 0) {
    ctx.fillStyle = "#aad4ff";
    ctx.fillRect(px + 18, py + 18 + wave, 4, 4);
  }
}
