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

// Draw an NPC with unique appearance per character type
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
  const f = TILE / 48;

  // Shadow
  ctx.fillStyle = "rgba(0,0,0,0.25)";
  ctx.beginPath();
  ctx.ellipse(px + TILE / 2, py + TILE - 2, 12 * f, 4 * f, 0, 0, Math.PI * 2);
  ctx.fill();

  const bob = Math.sin(frame * 0.045) * 2;
  const blinkCycle = frame % 200;
  const blink = blinkCycle >= 195;
  const skinColor = "#f4d7a7";
  const skinShadow = "#d4b78a";

  // Dispatch to unique NPC sprite based on id
  switch (npc.id) {
    case "guide": drawNPC_ProfOak(ctx, px, py, f, bob, blink, npc.color); break;
    case "coder": drawNPC_BugCatcher(ctx, px, py, f, bob, blink, npc.color); break;
    case "student": drawNPC_Lass(ctx, px, py, f, bob, blink, npc.color); break;
    case "hiker": drawNPC_Hiker(ctx, px, py, f, bob, blink, npc.color); break;
    case "swimmer": drawNPC_Swimmer(ctx, px, py, f, bob, blink, npc.color); break;
    case "ranger": drawNPC_Ranger(ctx, px, py, f, bob, blink, npc.color); break;
    case "rival": drawNPC_Rival(ctx, px, py, f, bob, blink, npc.color); break;
    default: drawNPC_Generic(ctx, px, py, f, bob, blink, npc.color, skinColor, skinShadow); break;
  }

  // Name tag and exclamation mark on proximity
  if (isNearby) {
    const nameWidth = npc.name.length * 7 + 16;
    ctx.fillStyle = "rgba(26,28,44,0.9)";
    ctx.fillRect(px + TILE / 2 - nameWidth / 2, py - 30, nameWidth, 20);
    ctx.strokeStyle = npc.color;
    ctx.lineWidth = 1;
    ctx.strokeRect(px + TILE / 2 - nameWidth / 2, py - 30, nameWidth, 20);
    ctx.fillStyle = npc.color;
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(npc.name, px + TILE / 2, py - 15);

    // Bouncing exclamation
    const exBounce = Math.sin(frame * 0.12) * 3;
    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 22px monospace";
    ctx.fillText("!", px + TILE / 2, py - 36 + exBounce);

    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 11px monospace";
    ctx.fillText("[ SPACE ]", px + TILE / 2, py + TILE + 16);
  }
}

// --- PROF. OAK: Old professor with white lab coat and grey hair ---
function drawNPC_ProfOak(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string) {
  // Grey hair
  ctx.fillStyle = "#9badb7";
  ctx.fillRect(px + 10 * f, py - 4 * f + bob, 28 * f, 10 * f);
  ctx.fillRect(px + 8 * f, py + 2 * f + bob, 6 * f, 8 * f);
  ctx.fillRect(px + 34 * f, py + 2 * f + bob, 6 * f, 8 * f);
  // Face
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 12 * f, py + 4 * f + bob, 24 * f, 16 * f);
  // Eyes
  if (!blink) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillRect(px + 28 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 17 * f, py + 10 * f + bob, 2 * f, 2 * f);
    ctx.fillRect(px + 29 * f, py + 10 * f + bob, 2 * f, 2 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 13 * f + bob, 5 * f, 1 * f);
    ctx.fillRect(px + 28 * f, py + 13 * f + bob, 5 * f, 1 * f);
  }
  // Mouth
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 20 * f, py + 16 * f + bob, 8 * f, 2 * f);
  // Lab coat (white)
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(px + 10 * f, py + 20 * f + bob, 28 * f, 14 * f);
  ctx.fillStyle = "#dcdcdc";
  ctx.fillRect(px + 22 * f, py + 20 * f + bob, 3 * f, 14 * f);
  // Shirt underneath
  ctx.fillStyle = color;
  ctx.fillRect(px + 18 * f, py + 21 * f + bob, 12 * f, 4 * f);
  // Arms
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(px + 5 * f, py + 21 * f + bob, 6 * f, 10 * f);
  ctx.fillRect(px + 37 * f, py + 21 * f + bob, 6 * f, 10 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 5 * f, py + 31 * f + bob, 6 * f, 3 * f);
  ctx.fillRect(px + 37 * f, py + 31 * f + bob, 6 * f, 3 * f);
  // Pants
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px + 13 * f, py + 34 * f + bob, 10 * f, 8 * f);
  ctx.fillRect(px + 25 * f, py + 34 * f + bob, 10 * f, 8 * f);
  // Shoes
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 12 * f, py + 42 * f + bob, 11 * f, 4 * f);
  ctx.fillRect(px + 25 * f, py + 42 * f + bob, 11 * f, 4 * f);
}

// --- BUG CATCHER: Straw hat, net, shorts ---
function drawNPC_BugCatcher(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string) {
  // Straw hat (wide brim)
  ctx.fillStyle = "#e8c170";
  ctx.fillRect(px + 4 * f, py - 2 * f + bob, 40 * f, 6 * f);
  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px + 12 * f, py - 6 * f + bob, 24 * f, 6 * f);
  ctx.fillStyle = color;
  ctx.fillRect(px + 14 * f, py - 4 * f + bob, 20 * f, 3 * f);
  // Face
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 12 * f, py + 3 * f + bob, 24 * f, 16 * f);
  // Eyes - big excited
  if (!blink) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 9 * f + bob, 5 * f, 5 * f);
    ctx.fillRect(px + 27 * f, py + 9 * f + bob, 5 * f, 5 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 18 * f, py + 9 * f + bob, 2 * f, 2 * f);
    ctx.fillRect(px + 29 * f, py + 9 * f + bob, 2 * f, 2 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 13 * f + bob, 5 * f, 1 * f);
    ctx.fillRect(px + 27 * f, py + 13 * f + bob, 5 * f, 1 * f);
  }
  // Grin
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 19 * f, py + 16 * f + bob, 10 * f, 2 * f);
  // T-shirt
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 10 * f, py + 19 * f + bob, 28 * f, 10 * f);
  ctx.fillStyle = color;
  ctx.fillRect(px + 16 * f, py + 20 * f + bob, 16 * f, 8 * f);
  // Arms
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 5 * f, py + 20 * f + bob, 6 * f, 10 * f);
  // Net arm (right)
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 37 * f, py + 18 * f + bob, 6 * f, 12 * f);
  // Bug net stick
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(px + 40 * f, py - 6 * f + bob, 3 * f, 26 * f);
  // Net hoop
  ctx.fillStyle = "#a0c8a0";
  ctx.fillRect(px + 37 * f, py - 10 * f + bob, 9 * f, 6 * f);
  ctx.fillStyle = "#c8e8c8";
  ctx.fillRect(px + 38 * f, py - 9 * f + bob, 7 * f, 4 * f);
  // Shorts
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px + 13 * f, py + 29 * f + bob, 10 * f, 6 * f);
  ctx.fillRect(px + 25 * f, py + 29 * f + bob, 10 * f, 6 * f);
  // Legs
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 14 * f, py + 35 * f + bob, 8 * f, 7 * f);
  ctx.fillRect(px + 26 * f, py + 35 * f + bob, 8 * f, 7 * f);
  // Shoes
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 12 * f, py + 42 * f + bob, 10 * f, 4 * f);
  ctx.fillRect(px + 26 * f, py + 42 * f + bob, 10 * f, 4 * f);
}

// --- LASS: Girl with bow, skirt ---
function drawNPC_Lass(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string) {
  // Long hair
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 10 * f, py - 4 * f + bob, 28 * f, 10 * f);
  ctx.fillRect(px + 8 * f, py + 3 * f + bob, 6 * f, 16 * f);
  ctx.fillRect(px + 34 * f, py + 3 * f + bob, 6 * f, 16 * f);
  // Bow
  ctx.fillStyle = color;
  ctx.fillRect(px + 18 * f, py - 7 * f + bob, 4 * f, 5 * f);
  ctx.fillRect(px + 14 * f, py - 6 * f + bob, 4 * f, 3 * f);
  ctx.fillRect(px + 22 * f, py - 6 * f + bob, 4 * f, 3 * f);
  ctx.fillRect(px + 26 * f, py - 7 * f + bob, 4 * f, 5 * f);
  // Face
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 13 * f, py + 4 * f + bob, 22 * f, 15 * f);
  // Eyes - cute round
  if (!blink) {
    ctx.fillStyle = color;
    ctx.fillRect(px + 16 * f, py + 9 * f + bob, 5 * f, 5 * f);
    ctx.fillRect(px + 27 * f, py + 9 * f + bob, 5 * f, 5 * f);
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 17 * f, py + 10 * f + bob, 3 * f, 3 * f);
    ctx.fillRect(px + 28 * f, py + 10 * f + bob, 3 * f, 3 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 18 * f, py + 10 * f + bob, 1 * f, 1 * f);
    ctx.fillRect(px + 29 * f, py + 10 * f + bob, 1 * f, 1 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 12 * f + bob, 5 * f, 1 * f);
    ctx.fillRect(px + 27 * f, py + 12 * f + bob, 5 * f, 1 * f);
  }
  // Blush
  ctx.fillStyle = "rgba(232,59,59,0.3)";
  ctx.fillRect(px + 14 * f, py + 14 * f + bob, 4 * f, 2 * f);
  ctx.fillRect(px + 30 * f, py + 14 * f + bob, 4 * f, 2 * f);
  // Top
  ctx.fillStyle = color;
  ctx.fillRect(px + 12 * f, py + 19 * f + bob, 24 * f, 8 * f);
  // Arms
  ctx.fillStyle = color;
  ctx.fillRect(px + 6 * f, py + 20 * f + bob, 6 * f, 6 * f);
  ctx.fillRect(px + 36 * f, py + 20 * f + bob, 6 * f, 6 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 6 * f, py + 26 * f + bob, 6 * f, 4 * f);
  ctx.fillRect(px + 36 * f, py + 26 * f + bob, 6 * f, 4 * f);
  // Skirt
  ctx.fillStyle = "#f7de1e";
  ctx.fillRect(px + 10 * f, py + 27 * f + bob, 28 * f, 8 * f);
  ctx.fillStyle = "#e8c170";
  ctx.fillRect(px + 10 * f, py + 33 * f + bob, 28 * f, 2 * f);
  // Legs
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 14 * f, py + 35 * f + bob, 8 * f, 7 * f);
  ctx.fillRect(px + 26 * f, py + 35 * f + bob, 8 * f, 7 * f);
  // Shoes
  ctx.fillStyle = color;
  ctx.fillRect(px + 13 * f, py + 42 * f + bob, 10 * f, 4 * f);
  ctx.fillRect(px + 25 * f, py + 42 * f + bob, 10 * f, 4 * f);
}

// --- HIKER: Big burly guy with backpack and beard ---
function drawNPC_Hiker(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string) {
  // Hat
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px + 6 * f, py - 2 * f + bob, 36 * f, 6 * f);
  ctx.fillRect(px + 12 * f, py - 6 * f + bob, 24 * f, 6 * f);
  // Face (wider)
  ctx.fillStyle = "#e8b888";
  ctx.fillRect(px + 10 * f, py + 3 * f + bob, 28 * f, 17 * f);
  // Beard
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px + 12 * f, py + 14 * f + bob, 24 * f, 6 * f);
  ctx.fillRect(px + 14 * f, py + 18 * f + bob, 20 * f, 3 * f);
  // Eyes
  if (!blink) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 9 * f + bob, 5 * f, 4 * f);
    ctx.fillRect(px + 27 * f, py + 9 * f + bob, 5 * f, 4 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 17 * f, py + 9 * f + bob, 2 * f, 2 * f);
    ctx.fillRect(px + 28 * f, py + 9 * f + bob, 2 * f, 2 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 12 * f + bob, 5 * f, 1 * f);
    ctx.fillRect(px + 27 * f, py + 12 * f + bob, 5 * f, 1 * f);
  }
  // Body (thick vest)
  ctx.fillStyle = color;
  ctx.fillRect(px + 8 * f, py + 20 * f + bob, 32 * f, 14 * f);
  // Vest details
  ctx.fillStyle = "#8b6a4a";
  ctx.fillRect(px + 22 * f, py + 20 * f + bob, 3 * f, 14 * f);
  // Backpack
  ctx.fillStyle = "#6b4a2a";
  ctx.fillRect(px + 38 * f, py + 18 * f + bob, 8 * f, 16 * f);
  ctx.fillStyle = "#5a3a1a";
  ctx.fillRect(px + 39 * f, py + 22 * f + bob, 6 * f, 4 * f);
  // Arms
  ctx.fillStyle = color;
  ctx.fillRect(px + 3 * f, py + 21 * f + bob, 6 * f, 10 * f);
  ctx.fillStyle = "#e8b888";
  ctx.fillRect(px + 3 * f, py + 31 * f + bob, 6 * f, 3 * f);
  // Pants
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 11 * f, py + 34 * f + bob, 12 * f, 8 * f);
  ctx.fillRect(px + 25 * f, py + 34 * f + bob, 12 * f, 8 * f);
  // Boots
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px + 9 * f, py + 42 * f + bob, 14 * f, 4 * f);
  ctx.fillRect(px + 25 * f, py + 42 * f + bob, 14 * f, 4 * f);
}

// --- SWIMMER: Tank top, goggles on forehead ---
function drawNPC_Swimmer(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string) {
  // Hair (spiky, wet)
  ctx.fillStyle = "#2d3436";
  ctx.fillRect(px + 10 * f, py - 4 * f + bob, 28 * f, 8 * f);
  ctx.fillRect(px + 8 * f, py - 2 * f + bob, 4 * f, 6 * f);
  ctx.fillRect(px + 36 * f, py - 2 * f + bob, 4 * f, 6 * f);
  // Goggles on forehead
  ctx.fillStyle = color;
  ctx.fillRect(px + 12 * f, py - 1 * f + bob, 24 * f, 4 * f);
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(px + 14 * f, py + bob, 7 * f, 3 * f);
  ctx.fillRect(px + 27 * f, py + bob, 7 * f, 3 * f);
  // Face
  ctx.fillStyle = "#e8b888";
  ctx.fillRect(px + 12 * f, py + 4 * f + bob, 24 * f, 16 * f);
  // Eyes
  if (!blink) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillRect(px + 28 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 17 * f, py + 10 * f + bob, 2 * f, 2 * f);
    ctx.fillRect(px + 29 * f, py + 10 * f + bob, 2 * f, 2 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 13 * f + bob, 4 * f, 1 * f);
    ctx.fillRect(px + 28 * f, py + 13 * f + bob, 4 * f, 1 * f);
  }
  ctx.fillStyle = "#d4a878";
  ctx.fillRect(px + 20 * f, py + 16 * f + bob, 8 * f, 2 * f);
  // Tank top
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 12 * f, py + 20 * f + bob, 24 * f, 10 * f);
  ctx.fillStyle = color;
  ctx.fillRect(px + 15 * f, py + 21 * f + bob, 18 * f, 3 * f);
  // Bare arms
  ctx.fillStyle = "#e8b888";
  ctx.fillRect(px + 6 * f, py + 20 * f + bob, 6 * f, 12 * f);
  ctx.fillRect(px + 36 * f, py + 20 * f + bob, 6 * f, 12 * f);
  // Swim trunks
  ctx.fillStyle = color;
  ctx.fillRect(px + 13 * f, py + 30 * f + bob, 10 * f, 6 * f);
  ctx.fillRect(px + 25 * f, py + 30 * f + bob, 10 * f, 6 * f);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 23 * f, py + 30 * f + bob, 2 * f, 6 * f);
  // Legs
  ctx.fillStyle = "#e8b888";
  ctx.fillRect(px + 14 * f, py + 36 * f + bob, 8 * f, 6 * f);
  ctx.fillRect(px + 26 * f, py + 36 * f + bob, 8 * f, 6 * f);
  // Sandals
  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px + 12 * f, py + 42 * f + bob, 10 * f, 4 * f);
  ctx.fillRect(px + 26 * f, py + 42 * f + bob, 10 * f, 4 * f);
}

// --- RANGER: Uniform, beret, utility belt ---
function drawNPC_Ranger(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string) {
  // Beret
  ctx.fillStyle = color;
  ctx.fillRect(px + 8 * f, py - 4 * f + bob, 30 * f, 7 * f);
  ctx.fillRect(px + 12 * f, py - 7 * f + bob, 22 * f, 5 * f);
  // Badge on beret
  ctx.fillStyle = "#f7de1e";
  ctx.fillRect(px + 20 * f, py - 5 * f + bob, 6 * f, 4 * f);
  // Face
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 12 * f, py + 3 * f + bob, 24 * f, 16 * f);
  // Eyes (serious)
  if (!blink) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 15 * f, py + 9 * f + bob, 6 * f, 3 * f);
    ctx.fillRect(px + 27 * f, py + 9 * f + bob, 6 * f, 3 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 17 * f, py + 9 * f + bob, 2 * f, 2 * f);
    ctx.fillRect(px + 29 * f, py + 9 * f + bob, 2 * f, 2 * f);
    // Eyebrows
    ctx.fillStyle = "#5a3a2b";
    ctx.fillRect(px + 15 * f, py + 7 * f + bob, 6 * f, 2 * f);
    ctx.fillRect(px + 27 * f, py + 7 * f + bob, 6 * f, 2 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 15 * f, py + 11 * f + bob, 6 * f, 1 * f);
    ctx.fillRect(px + 27 * f, py + 11 * f + bob, 6 * f, 1 * f);
  }
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 20 * f, py + 15 * f + bob, 8 * f, 2 * f);
  // Uniform jacket
  ctx.fillStyle = color;
  ctx.fillRect(px + 10 * f, py + 19 * f + bob, 28 * f, 12 * f);
  // Pockets
  ctx.fillStyle = shadeColor(color, -20);
  ctx.fillRect(px + 12 * f, py + 24 * f + bob, 8 * f, 5 * f);
  ctx.fillRect(px + 28 * f, py + 24 * f + bob, 8 * f, 5 * f);
  // Belt
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px + 10 * f, py + 30 * f + bob, 28 * f, 3 * f);
  ctx.fillStyle = "#f7de1e";
  ctx.fillRect(px + 22 * f, py + 30 * f + bob, 4 * f, 3 * f);
  // Arms
  ctx.fillStyle = color;
  ctx.fillRect(px + 5 * f, py + 20 * f + bob, 6 * f, 10 * f);
  ctx.fillRect(px + 37 * f, py + 20 * f + bob, 6 * f, 10 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 5 * f, py + 30 * f + bob, 6 * f, 3 * f);
  ctx.fillRect(px + 37 * f, py + 30 * f + bob, 6 * f, 3 * f);
  // Pants
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 12 * f, py + 33 * f + bob, 10 * f, 9 * f);
  ctx.fillRect(px + 26 * f, py + 33 * f + bob, 10 * f, 9 * f);
  // Boots
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 11 * f, py + 42 * f + bob, 12 * f, 4 * f);
  ctx.fillRect(px + 25 * f, py + 42 * f + bob, 12 * f, 4 * f);
}

// --- RIVAL: Spiky hair, jacket, confident pose ---
function drawNPC_Rival(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string) {
  // Spiky hair
  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px + 10 * f, py - 2 * f + bob, 28 * f, 8 * f);
  ctx.fillRect(px + 8 * f, py - 6 * f + bob, 8 * f, 6 * f);
  ctx.fillRect(px + 18 * f, py - 8 * f + bob, 6 * f, 6 * f);
  ctx.fillRect(px + 30 * f, py - 6 * f + bob, 8 * f, 6 * f);
  ctx.fillRect(px + 24 * f, py - 10 * f + bob, 5 * f, 5 * f);
  // Face
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 12 * f, py + 4 * f + bob, 24 * f, 16 * f);
  // Smirk eyes
  if (!blink) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillRect(px + 28 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillStyle = "#e83b3b";
    ctx.fillRect(px + 17 * f, py + 10 * f + bob, 2 * f, 2 * f);
    ctx.fillRect(px + 29 * f, py + 10 * f + bob, 2 * f, 2 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 13 * f + bob, 4 * f, 1 * f);
    ctx.fillRect(px + 28 * f, py + 13 * f + bob, 4 * f, 1 * f);
  }
  // Smirk mouth
  ctx.fillStyle = "#d4b78a";
  ctx.fillRect(px + 22 * f, py + 16 * f + bob, 8 * f, 2 * f);
  ctx.fillRect(px + 28 * f, py + 15 * f + bob, 3 * f, 2 * f);
  // Jacket
  ctx.fillStyle = color;
  ctx.fillRect(px + 10 * f, py + 20 * f + bob, 28 * f, 12 * f);
  // Jacket collar
  ctx.fillStyle = shadeColor(color, 20);
  ctx.fillRect(px + 12 * f, py + 20 * f + bob, 6 * f, 4 * f);
  ctx.fillRect(px + 30 * f, py + 20 * f + bob, 6 * f, 4 * f);
  // Zipper
  ctx.fillStyle = "#f7de1e";
  ctx.fillRect(px + 23 * f, py + 20 * f + bob, 2 * f, 12 * f);
  // Arms crossed
  ctx.fillStyle = color;
  ctx.fillRect(px + 5 * f, py + 22 * f + bob, 6 * f, 8 * f);
  ctx.fillRect(px + 37 * f, py + 22 * f + bob, 6 * f, 8 * f);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 5 * f, py + 30 * f + bob, 6 * f, 3 * f);
  ctx.fillRect(px + 37 * f, py + 30 * f + bob, 6 * f, 3 * f);
  // Pants
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 12 * f, py + 32 * f + bob, 10 * f, 10 * f);
  ctx.fillRect(px + 26 * f, py + 32 * f + bob, 10 * f, 10 * f);
  // Shoes
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 11 * f, py + 42 * f + bob, 11 * f, 4 * f);
  ctx.fillRect(px + 26 * f, py + 42 * f + bob, 11 * f, 4 * f);
}

// --- Generic fallback NPC ---
function drawNPC_Generic(ctx: CanvasRenderingContext2D, px: number, py: number, f: number, bob: number, blink: boolean, color: string, skinColor: string, skinShadow: string) {
  ctx.fillStyle = color;
  ctx.fillRect(px + 12 * f, py - 3 * f + bob, 24 * f, 8 * f);
  ctx.fillStyle = skinColor;
  ctx.fillRect(px + 12 * f, py + 4 * f + bob, 24 * f, 15 * f);
  if (!blink) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillRect(px + 28 * f, py + 10 * f + bob, 4 * f, 4 * f);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 17 * f, py + 10 * f + bob, 2 * f, 2 * f);
    ctx.fillRect(px + 29 * f, py + 10 * f + bob, 2 * f, 2 * f);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 16 * f, py + 13 * f + bob, 4 * f, 1 * f);
    ctx.fillRect(px + 28 * f, py + 13 * f + bob, 4 * f, 1 * f);
  }
  ctx.fillStyle = skinShadow;
  ctx.fillRect(px + 20 * f, py + 16 * f + bob, 8 * f, 2 * f);
  ctx.fillStyle = color;
  ctx.fillRect(px + 10 * f, py + 19 * f + bob, 28 * f, 12 * f);
  ctx.fillStyle = color;
  ctx.fillRect(px + 5 * f, py + 20 * f + bob, 6 * f, 10 * f);
  ctx.fillRect(px + 37 * f, py + 20 * f + bob, 6 * f, 10 * f);
  ctx.fillStyle = skinColor;
  ctx.fillRect(px + 5 * f, py + 30 * f + bob, 6 * f, 3 * f);
  ctx.fillRect(px + 37 * f, py + 30 * f + bob, 6 * f, 3 * f);
  ctx.fillStyle = "#3f3f74";
  ctx.fillRect(px + 13 * f, py + 31 * f + bob, 10 * f, 10 * f);
  ctx.fillRect(px + 25 * f, py + 31 * f + bob, 10 * f, 10 * f);
  ctx.fillStyle = "#1a1c2c";
  ctx.fillRect(px + 12 * f, py + 42 * f + bob, 11 * f, 4 * f);
  ctx.fillRect(px + 25 * f, py + 42 * f + bob, 11 * f, 4 * f);
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
