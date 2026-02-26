import { Building, NPC } from "./game-data";

export const TILE = 48;

// Draw a pixel-art grass tile
export function drawGrass(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#4a7c59";
  ctx.fillRect(px, py, TILE, TILE);

  const seed = (x * 7 + y * 13) % 5;
  ctx.fillStyle = "#5a9c6a";
  if (seed === 0) {
    ctx.fillRect(px + 6, py + 9, 3, 6);
    ctx.fillRect(px + 30, py + 27, 3, 6);
    ctx.fillRect(px + 18, py + 36, 3, 5);
  } else if (seed === 1) {
    ctx.fillRect(px + 12, py + 15, 3, 5);
    ctx.fillRect(px + 36, py + 12, 3, 6);
  } else if (seed === 2) {
    ctx.fillRect(px + 24, py + 6, 3, 6);
    ctx.fillRect(px + 9, py + 33, 3, 5);
    ctx.fillRect(px + 39, py + 39, 3, 5);
  } else if (seed === 3) {
    ctx.fillRect(px + 3, py + 21, 3, 6);
    ctx.fillRect(px + 27, py + 3, 3, 5);
  } else {
    ctx.fillRect(px + 15, py + 24, 3, 5);
    ctx.fillRect(px + 42, py + 18, 3, 6);
    ctx.fillRect(px + 21, py + 42, 3, 3);
  }

  if ((x * 3 + y * 11) % 17 === 0) {
    ctx.fillStyle = "#e8c170";
    ctx.fillRect(px + 21, py + 21, 6, 6);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 18, py + 21, 3, 3);
    ctx.fillRect(px + 27, py + 21, 3, 3);
    ctx.fillRect(px + 21, py + 18, 3, 3);
    ctx.fillRect(px + 21, py + 27, 3, 3);
  }

  ctx.fillStyle = "rgba(0,0,0,0.05)";
  ctx.fillRect(px, py, TILE, 1);
  ctx.fillRect(px, py, 1, TILE);
}

// Draw a flower patch tile
export function drawFlowerPatch(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#4a7c59";
  ctx.fillRect(px, py, TILE, TILE);
  ctx.fillStyle = "#5a9c6a";
  ctx.fillRect(px + 3, py + 3, TILE - 6, TILE - 6);

  const colors = ["#e83b3b", "#e8c170", "#5b6ee1", "#f4f4f4", "#f89720"];
  const seed = x * 3 + y * 7;
  for (let i = 0; i < 5; i++) {
    const fx = px + 6 + ((seed + i * 7) % 30);
    const fy = py + 6 + (((seed + i * 11) % 30));
    ctx.fillStyle = colors[(seed + i) % colors.length];
    ctx.fillRect(fx, fy, 6, 6);
    ctx.fillStyle = "#e8c170";
    ctx.fillRect(fx + 2, fy + 2, 2, 2);
  }
}

// Draw a path tile
export function drawPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px, py, TILE, TILE);

  ctx.fillStyle = "#b89a5c";
  const seed = (x * 11 + y * 7) % 4;
  if (seed === 0) {
    ctx.fillRect(px + 6, py + 12, 5, 3);
    ctx.fillRect(px + 30, py + 33, 6, 3);
  } else if (seed === 1) {
    ctx.fillRect(px + 18, py + 6, 3, 5);
    ctx.fillRect(px + 36, py + 24, 5, 3);
  } else if (seed === 2) {
    ctx.fillRect(px + 12, py + 30, 5, 3);
  } else {
    ctx.fillRect(px + 24, py + 18, 6, 3);
  }

  ctx.fillStyle = "#a88c4c";
  ctx.fillRect(px, py, TILE, 1);
  ctx.fillRect(px, py, 1, TILE);
}

// Draw a pixel-art building
export function drawBuilding(
  ctx: CanvasRenderingContext2D,
  building: Building,
  camX: number,
  camY: number,
  isNearby: boolean
) {
  const bx = building.x * TILE - camX;
  const by = building.y * TILE - camY;
  const bw = building.width * TILE;
  const bh = building.height * TILE;

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(bx + 8, by + 8, bw, bh);

  ctx.fillStyle = building.color;
  ctx.fillRect(bx, by, bw, bh);

  ctx.strokeStyle = "rgba(0,0,0,0.4)";
  ctx.lineWidth = 2;
  ctx.strokeRect(bx + 1, by + 1, bw - 2, bh - 2);

  const roofHeight = TILE * 1.5;
  ctx.fillStyle = building.roofColor;
  ctx.fillRect(bx - 6, by - roofHeight, bw + 12, roofHeight);
  ctx.fillStyle = shadeColor(building.roofColor, -20);
  ctx.fillRect(bx - 6, by - roofHeight, bw + 12, 5);
  ctx.fillRect(bx - 6, by - 5, bw + 12, 5);

  ctx.fillStyle = isNearby ? "#ffffaa" : "#87ceeb";
  const windowSize = 14;
  const windowY = by + TILE * 0.8;
  ctx.fillRect(bx + TILE * 0.6, windowY, windowSize, windowSize);
  ctx.fillRect(bx + bw - TILE * 0.6 - windowSize, windowY, windowSize, windowSize);
  if (building.width >= 6) {
    ctx.fillRect(bx + bw / 2 - windowSize / 2, windowY, windowSize, windowSize);
  }
  ctx.fillStyle = "rgba(0,0,0,0.3)";
  ctx.fillRect(bx + TILE * 0.6 + windowSize / 2 - 1, windowY, 2, windowSize);
  ctx.fillRect(bx + TILE * 0.6, windowY + windowSize / 2 - 1, windowSize, 2);
  ctx.fillRect(bx + bw - TILE * 0.6 - windowSize + windowSize / 2 - 1, windowY, 2, windowSize);
  ctx.fillRect(bx + bw - TILE * 0.6 - windowSize, windowY + windowSize / 2 - 1, windowSize, 2);

  const doorW = TILE * 0.8;
  const doorH = TILE * 1.2;
  const doorX = bx + bw / 2 - doorW / 2;
  const doorY = by + bh - doorH;
  ctx.fillStyle = building.doorColor;
  ctx.fillRect(doorX, doorY, doorW, doorH);
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(doorX + doorW - 10, doorY + doorH / 2, 5, 5);
  ctx.strokeStyle = "rgba(0,0,0,0.3)";
  ctx.lineWidth = 2;
  ctx.strokeRect(doorX, doorY, doorW, doorH);

  const signW = Math.max(120, building.signText.length * 8 + 24);
  ctx.fillStyle = "#e8c170";
  ctx.fillRect(bx + bw / 2 - signW / 2 - 2, by - roofHeight - 30, signW + 4, 28);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(bx + bw / 2 - signW / 2, by - roofHeight - 28, signW, 24);

  ctx.fillStyle = "#e8c170";
  ctx.font = "bold 11px monospace";
  ctx.textAlign = "center";
  ctx.fillText(building.signText, bx + bw / 2, by - roofHeight - 12);

  if (isNearby) {
    ctx.strokeStyle = "#e8c170";
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 5]);
    ctx.strokeRect(bx - 6, by - roofHeight - 32, bw + 12, bh + roofHeight + 38);
    ctx.setLineDash([]);

    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 13px monospace";
    ctx.textAlign = "center";
    ctx.fillText("[ SPACE / ENTER ]", bx + bw / 2, by + bh + 24);
  }
}

// Draw the player character
export function drawPlayer(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number,
  direction: number,
  frame: number,
  isMoving: boolean
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;
  const walkFrame = isMoving ? frame % 4 : 0;
  const f = TILE / 32; // scale factor from original 32px base

  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(px + TILE / 2, py + TILE - 2, 12 * f, 4 * f, 0, 0, Math.PI * 2);
  ctx.fill();

  if (direction === 0) drawPlayerDown(ctx, px, py, walkFrame, isMoving, f);
  else if (direction === 1) drawPlayerUp(ctx, px, py, walkFrame, isMoving, f);
  else if (direction === 2) drawPlayerLeft(ctx, px, py, walkFrame, isMoving, f);
  else drawPlayerRight(ctx, px, py, walkFrame, isMoving, f);
}

function drawPlayerDown(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean, f: number) {
  const legSwing = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? -3 * f : walkFrame === 3 ? 3 * f : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -2 * f : 0) : 0;

  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 5 * f, py - 2 * f + bounce, 22 * f, 5 * f);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 5 * f, py + 2 * f + bounce, 22 * f, 2 * f);
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 7 * f, py + 1 * f + bounce, 18 * f, 4 * f);
  ctx.fillRect(px + 6 * f, py + 2 * f + bounce, 2 * f, 4 * f);
  ctx.fillRect(px + 24 * f, py + 2 * f + bounce, 2 * f, 4 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 8 * f, py + 3 * f + bounce, 16 * f, 12 * f);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 11 * f, py + 8 * f + bounce, 3 * f, 3 * f);
  ctx.fillRect(px + 18 * f, py + 8 * f + bounce, 3 * f, 3 * f);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 12 * f, py + 8 * f + bounce, 1 * f, 1 * f);
  ctx.fillRect(px + 19 * f, py + 8 * f + bounce, 1 * f, 1 * f);
  ctx.fillStyle = "#c4956a";
  ctx.fillRect(px + 14 * f, py + 12 * f + bounce, 4 * f, 1 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 8 * f, py + 15 * f + bounce, 16 * f, 8 * f);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 15 * f, py + 15 * f + bounce, 2 * f, 8 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 4 * f, py + 16 * f + bounce + armSwing, 4 * f, 6 * f);
  ctx.fillRect(px + 24 * f, py + 16 * f + bounce - armSwing, 4 * f, 6 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 4 * f, py + 22 * f + bounce + armSwing, 4 * f, 2 * f);
  ctx.fillRect(px + 24 * f, py + 22 * f + bounce - armSwing, 4 * f, 2 * f);
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 9 * f, py + 23 * f + bounce, 6 * f, 6 * f + legSwing);
  ctx.fillRect(px + 17 * f, py + 23 * f + bounce, 6 * f, 6 * f - legSwing);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 8 * f, py + 28 * f + bounce + Math.max(0, legSwing), 7 * f, 3 * f);
  ctx.fillRect(px + 17 * f, py + 28 * f + bounce + Math.max(0, -legSwing), 7 * f, 3 * f);
}

function drawPlayerUp(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean, f: number) {
  const legSwing = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? -3 * f : walkFrame === 3 ? 3 * f : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -2 * f : 0) : 0;

  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 5 * f, py - 2 * f + bounce, 22 * f, 5 * f);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 12 * f, py + 2 * f + bounce, 8 * f, 2 * f);
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 7 * f, py + 1 * f + bounce, 18 * f, 14 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 6 * f, py + 7 * f + bounce, 2 * f, 4 * f);
  ctx.fillRect(px + 24 * f, py + 7 * f + bounce, 2 * f, 4 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 8 * f, py + 15 * f + bounce, 16 * f, 8 * f);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 10 * f, py + 15 * f + bounce, 2 * f, 8 * f);
  ctx.fillRect(px + 20 * f, py + 15 * f + bounce, 2 * f, 8 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 4 * f, py + 16 * f + bounce + armSwing, 4 * f, 6 * f);
  ctx.fillRect(px + 24 * f, py + 16 * f + bounce - armSwing, 4 * f, 6 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 4 * f, py + 22 * f + bounce + armSwing, 4 * f, 2 * f);
  ctx.fillRect(px + 24 * f, py + 22 * f + bounce - armSwing, 4 * f, 2 * f);
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 9 * f, py + 23 * f + bounce, 6 * f, 6 * f + legSwing);
  ctx.fillRect(px + 17 * f, py + 23 * f + bounce, 6 * f, 6 * f - legSwing);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 8 * f, py + 28 * f + bounce + Math.max(0, legSwing), 7 * f, 3 * f);
  ctx.fillRect(px + 17 * f, py + 28 * f + bounce + Math.max(0, -legSwing), 7 * f, 3 * f);
}

function drawPlayerLeft(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean, f: number) {
  const legSwing = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? 3 * f : walkFrame === 3 ? -3 * f : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -2 * f : 0) : 0;

  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 2 * f, py - 2 * f + bounce, 20 * f, 5 * f);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 2 * f, py + 2 * f + bounce, 10 * f, 2 * f);
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 8 * f, py + 1 * f + bounce, 14 * f, 5 * f);
  ctx.fillRect(px + 7 * f, py + 3 * f + bounce, 2 * f, 6 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 9 * f, py + 3 * f + bounce, 13 * f, 12 * f);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 10 * f, py + 8 * f + bounce, 3 * f, 3 * f);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 10 * f, py + 8 * f + bounce, 1 * f, 1 * f);
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 8 * f, py + 10 * f + bounce, 2 * f, 2 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 10 * f, py + 15 * f + bounce, 12 * f, 8 * f);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 10 * f, py + 15 * f + bounce, 3 * f, 8 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 7 * f, py + 16 * f + bounce - armSwing, 4 * f, 6 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 7 * f, py + 22 * f + bounce - armSwing, 4 * f, 2 * f);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 21 * f, py + 16 * f + bounce + armSwing, 3 * f, 5 * f);
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 10 * f - legSwing, py + 23 * f + bounce, 5 * f, 6 * f);
  ctx.fillStyle = "#2d2d5c";
  ctx.fillRect(px + 17 * f + legSwing, py + 23 * f + bounce, 5 * f, 6 * f);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 8 * f - legSwing, py + 28 * f + bounce, 7 * f, 3 * f);
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(px + 16 * f + legSwing, py + 28 * f + bounce, 6 * f, 3 * f);
}

function drawPlayerRight(ctx: CanvasRenderingContext2D, px: number, py: number, walkFrame: number, isMoving: boolean, f: number) {
  const legSwing = isMoving ? (walkFrame === 1 ? 4 * f : walkFrame === 3 ? -4 * f : 0) : 0;
  const armSwing = isMoving ? (walkFrame === 1 ? 3 * f : walkFrame === 3 ? -3 * f : 0) : 0;
  const bounce = isMoving ? (walkFrame === 1 || walkFrame === 3 ? -2 * f : 0) : 0;

  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 10 * f, py - 2 * f + bounce, 20 * f, 5 * f);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 20 * f, py + 2 * f + bounce, 10 * f, 2 * f);
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 10 * f, py + 1 * f + bounce, 14 * f, 5 * f);
  ctx.fillRect(px + 23 * f, py + 3 * f + bounce, 2 * f, 6 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 10 * f, py + 3 * f + bounce, 13 * f, 12 * f);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 19 * f, py + 8 * f + bounce, 3 * f, 3 * f);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 21 * f, py + 8 * f + bounce, 1 * f, 1 * f);
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 22 * f, py + 10 * f + bounce, 2 * f, 2 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 10 * f, py + 15 * f + bounce, 12 * f, 8 * f);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 19 * f, py + 15 * f + bounce, 3 * f, 8 * f);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 21 * f, py + 16 * f + bounce - armSwing, 4 * f, 6 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 21 * f, py + 22 * f + bounce - armSwing, 4 * f, 2 * f);
  ctx.fillStyle = "#c62d2d";
  ctx.fillRect(px + 8 * f, py + 16 * f + bounce + armSwing, 3 * f, 5 * f);
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 17 * f + legSwing, py + 23 * f + bounce, 5 * f, 6 * f);
  ctx.fillStyle = "#2d2d5c";
  ctx.fillRect(px + 10 * f - legSwing, py + 23 * f + bounce, 5 * f, 6 * f);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 17 * f + legSwing, py + 28 * f + bounce, 7 * f, 3 * f);
  ctx.fillStyle = "#0d0d1a";
  ctx.fillRect(px + 10 * f - legSwing, py + 28 * f + bounce, 6 * f, 3 * f);
}

// Draw an NPC
export function drawNPC(
  ctx: CanvasRenderingContext2D,
  npc: NPC,
  camX: number,
  camY: number,
  frame: number,
  isNearby: boolean
) {
  const px = npc.x * TILE - camX;
  const py = npc.y * TILE - camY;

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(px + TILE / 2, py + TILE - 3, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  const bob = Math.sin(frame * 0.05) * 2;

  ctx.fillStyle = npc.color;
  ctx.fillRect(px + 14, py + 18 + bob, 20, 14);

  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 14, py + 3 + bob, 20, 16);

  ctx.fillStyle = npc.color;
  ctx.fillRect(px + 13, py + bob, 22, 7);

  const blinkCycle = frame % 180;
  if (blinkCycle < 175) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 17, py + 10 + bob, 4, 3);
    ctx.fillRect(px + 27, py + 10 + bob, 4, 3);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 17, py + 10 + bob, 2, 2);
    ctx.fillRect(px + 27, py + 10 + bob, 2, 2);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 17, py + 12 + bob, 4, 1);
    ctx.fillRect(px + 27, py + 12 + bob, 4, 1);
  }

  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 17, py + 32 + bob, 6, 10);
  ctx.fillRect(px + 25, py + 32 + bob, 6, 10);

  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 16, py + 42 + bob, 7, 3);
  ctx.fillRect(px + 25, py + 42 + bob, 7, 3);

  if (isNearby) {
    const nameWidth = npc.name.length * 7 + 14;
    ctx.fillStyle = "rgba(26,28,44,0.85)";
    ctx.fillRect(px + TILE / 2 - nameWidth / 2, py - 28, nameWidth, 18);
    ctx.fillStyle = npc.color;
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(npc.name, px + TILE / 2, py - 14);

    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 22px monospace";
    ctx.fillText("!", px + TILE / 2, py - 34);
  }
}

// Draw a tree
export function drawTree(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(px + 18, py + 24, 12, 24);
  ctx.fillStyle = "#a06c3a";
  ctx.fillRect(px + 21, py + 24, 5, 24);

  ctx.fillStyle = "#2d6b3e";
  ctx.fillRect(px - 3, py - 6, TILE + 6, 33);
  ctx.fillStyle = "#3a8c50";
  ctx.fillRect(px + 3, py - 12, TILE - 6, 27);
  ctx.fillStyle = "#4aad62";
  ctx.fillRect(px + 9, py - 15, TILE - 18, 18);

  ctx.fillStyle = "#5bc474";
  ctx.fillRect(px + 12, py - 12, 12, 6);
}

// Draw a fence segment
export function drawFence(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  camX: number,
  camY: number
) {
  const px = x * TILE - camX;
  const py = y * TILE - camY;

  ctx.fillStyle = "#a0815c";
  ctx.fillRect(px + 3, py + 6, 8, 36);
  ctx.fillRect(px + 36, py + 6, 8, 36);

  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px, py + 12, TILE, 6);
  ctx.fillRect(px, py + 27, TILE, 6);
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace("#", ""), 16);
  const amt = Math.round(2.55 * percent);
  const R = Math.min(255, Math.max(0, (num >> 16) + amt));
  const G = Math.min(255, Math.max(0, ((num >> 8) & 0x00ff) + amt));
  const B = Math.min(255, Math.max(0, (num & 0x0000ff) + amt));
  return `#${((1 << 24) + (R << 16) + (G << 8) + B).toString(16).slice(1)}`;
}
