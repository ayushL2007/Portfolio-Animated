import {
  FLOOR,
  WALL,
  DESK,
  EXIT_MAT,
  SHELF,
  PLANT,
  RUG,
  INTERIOR_WIDTH,
  INTERIOR_HEIGHT,
  type BuildingInterior,
  type Receptionist,
} from "./interior-data";
import { buildings } from "./game-data";

export const INTERIOR_TILE = 48;

export function drawInteriorFloor(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  camX: number, camY: number,
  floorColor: string
) {
  const T = INTERIOR_TILE;
  const px = x * T - camX;
  const py = y * T - camY;

  ctx.fillStyle = floorColor;
  ctx.fillRect(px, py, T, T);
  if ((x + y) % 2 === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
  } else {
    ctx.fillStyle = "rgba(0,0,0,0.06)";
  }
  ctx.fillRect(px, py, T, T);
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx.fillRect(px, py, T, 1);
  ctx.fillRect(px, py, 1, T);
}

export function drawInteriorWall(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  camX: number, camY: number,
  wallColor: string
) {
  const T = INTERIOR_TILE;
  const px = x * T - camX;
  const py = y * T - camY;

  ctx.fillStyle = wallColor;
  ctx.fillRect(px, py, T, T);
  ctx.fillStyle = "rgba(0,0,0,0.15)";
  const brickH = 12;
  for (let by = 0; by < T; by += brickH) {
    ctx.fillRect(px, py + by, T, 1);
    const offset = (Math.floor(by / brickH) % 2) * 24;
    ctx.fillRect(px + offset, py + by, 1, brickH);
    ctx.fillRect(px + offset + 24, py + by, 1, brickH);
  }
  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.fillRect(px, py + T - 4, T, 4);
}

export function drawDesk(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  camX: number, camY: number
) {
  const T = INTERIOR_TILE;
  const px = x * T - camX;
  const py = y * T - camY;

  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(px + 2, py + 6, T - 4, T - 9);
  ctx.fillStyle = "#a06c3a";
  ctx.fillRect(px + 3, py + 7, T - 6, 6);
  ctx.fillStyle = "#6b3a1b";
  ctx.fillRect(px + 3, py + T - 6, 6, 6);
  ctx.fillRect(px + T - 9, py + T - 6, 6, 6);
  ctx.fillStyle = "#f4f4f4";
  ctx.fillRect(px + 9, py + 9, 12, 9);
  ctx.fillStyle = "#3a3f5c";
  ctx.fillRect(px + 10, py + 10, 10, 7);
  ctx.fillStyle = "#f7de1e";
  ctx.fillRect(px + 27, py + 12, 9, 3);
  ctx.fillStyle = "#e83b3b";
  ctx.fillRect(px + 25, py + 12, 3, 3);
}

export function drawExitMat(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  camX: number, camY: number,
  frame: number
) {
  const T = INTERIOR_TILE;
  const px = x * T - camX;
  const py = y * T - camY;

  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px, py, T, T);
  ctx.fillStyle = "#a88c4c";
  ctx.fillRect(px + 3, py + 3, T - 6, T - 6);
  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px + 6, py + 6, T - 12, T - 12);

  const pulse = Math.sin(frame * 0.08) > 0;
  ctx.fillStyle = pulse ? "#e8c170" : "#e83b3b";
  ctx.fillRect(px + 19, py + 9, 9, 18);
  ctx.fillRect(px + 13, py + 24, 21, 5);
  ctx.fillRect(px + 16, py + 29, 15, 4);
  ctx.fillRect(px + 19, py + 33, 9, 4);

  ctx.fillStyle = "#1a1c2c";
  ctx.font = "bold 10px monospace";
  ctx.textAlign = "center";
  ctx.fillText("EXIT", px + T / 2, py + T - 3);
}

export function drawShelf(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  camX: number, camY: number
) {
  const T = INTERIOR_TILE;
  const px = x * T - camX;
  const py = y * T - camY;

  ctx.fillStyle = "#5a3a2b";
  ctx.fillRect(px, py, T, T);
  ctx.fillStyle = "#8b5a2b";
  ctx.fillRect(px + 2, py + 12, T - 4, 4);
  ctx.fillRect(px + 2, py + 30, T - 4, 4);

  const seed = x * 7 + y * 3;
  const colors = ["#e83b3b", "#5b6ee1", "#3ddc84", "#f7de1e", "#9b59b6"];
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = colors[(seed + i) % colors.length];
    ctx.fillRect(px + 4 + i * 10, py + 3, 8, 9);
  }
  for (let i = 0; i < 3; i++) {
    ctx.fillStyle = colors[(seed + i + 2) % colors.length];
    ctx.fillRect(px + 6 + i * 12, py + 18, 9, 12);
  }
}

export function drawPlant(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  camX: number, camY: number,
  floorColor: string
) {
  const T = INTERIOR_TILE;
  const px = x * T - camX;
  const py = y * T - camY;

  ctx.fillStyle = floorColor;
  ctx.fillRect(px, py, T, T);
  if ((x + y) % 2 === 0) {
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.fillRect(px, py, T, T);
  }

  ctx.fillStyle = "#b05a2a";
  ctx.fillRect(px + 12, py + 30, 24, 15);
  ctx.fillStyle = "#8b4a1a";
  ctx.fillRect(px + 9, py + 27, 30, 6);
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(px + 13, py + 27, 22, 4);
  ctx.fillStyle = "#3a8c50";
  ctx.fillRect(px + 18, py + 9, 12, 18);
  ctx.fillRect(px + 12, py + 12, 24, 12);
  ctx.fillStyle = "#4aad62";
  ctx.fillRect(px + 15, py + 6, 9, 12);
  ctx.fillRect(px + 21, py + 9, 9, 12);
  ctx.fillStyle = "#5bc474";
  ctx.fillRect(px + 18, py + 9, 6, 6);
}

export function drawRug(
  ctx: CanvasRenderingContext2D,
  x: number, y: number,
  camX: number, camY: number,
  floorColor: string
) {
  const T = INTERIOR_TILE;
  const px = x * T - camX;
  const py = y * T - camY;

  ctx.fillStyle = floorColor;
  ctx.fillRect(px, py, T, T);
  ctx.fillStyle = "#8b2020";
  ctx.fillRect(px + 2, py + 2, T - 4, T - 4);
  ctx.fillStyle = "#a03030";
  ctx.fillRect(px + 5, py + 5, T - 10, T - 10);
  ctx.fillStyle = "#c4a76c";
  ctx.fillRect(px + 8, py + 8, T - 16, T - 16);
  ctx.fillStyle = "#a03030";
  ctx.fillRect(px + 11, py + 11, T - 22, T - 22);
}

export function drawReceptionist(
  ctx: CanvasRenderingContext2D,
  r: Receptionist,
  camX: number, camY: number,
  frame: number,
  isNearby: boolean
) {
  const T = INTERIOR_TILE;
  const px = r.x * T - camX;
  const py = r.y * T - camY;

  const bob = Math.sin(frame * 0.04) * 1.5;

  ctx.fillStyle = "rgba(0,0,0,0.2)";
  ctx.beginPath();
  ctx.ellipse(px + T / 2, py + T - 3, 10, 4, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = r.color;
  ctx.fillRect(px + 14, py + 18 + bob, 20, 14);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 14, py + 3 + bob, 20, 16);
  ctx.fillStyle = r.color;
  ctx.fillRect(px + 13, py + bob, 22, 7);
  ctx.fillRect(px + 11, py + 3 + bob, 4, 9);
  ctx.fillRect(px + 33, py + 3 + bob, 4, 9);

  const blinkCycle = frame % 200;
  if (blinkCycle < 195) {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 17, py + 10 + bob, 4, 4);
    ctx.fillRect(px + 27, py + 10 + bob, 4, 4);
    ctx.fillStyle = "#f4f4f4";
    ctx.fillRect(px + 18, py + 10 + bob, 2, 2);
    ctx.fillRect(px + 28, py + 10 + bob, 2, 2);
  } else {
    ctx.fillStyle = "#1a1c2c";
    ctx.fillRect(px + 17, py + 12 + bob, 4, 2);
    ctx.fillRect(px + 27, py + 12 + bob, 4, 2);
  }

  ctx.fillStyle = "#c4956a";
  ctx.fillRect(px + 20, py + 15 + bob, 6, 2);

  ctx.fillStyle = r.color;
  ctx.fillRect(px + 8, py + 20 + bob, 6, 9);
  ctx.fillRect(px + 34, py + 20 + bob, 6, 9);
  ctx.fillStyle = "#f4d7a7";
  ctx.fillRect(px + 8, py + 29 + bob, 6, 3);
  ctx.fillRect(px + 34, py + 29 + bob, 6, 3);

  if (isNearby) {
    const nameWidth = r.name.length * 7 + 14;
    ctx.fillStyle = "rgba(26,28,44,0.9)";
    ctx.fillRect(px + T / 2 - nameWidth / 2, py - 26, nameWidth, 18);
    ctx.fillStyle = r.color;
    ctx.font = "bold 10px monospace";
    ctx.textAlign = "center";
    ctx.fillText(r.name, px + T / 2, py - 12);

    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 22px monospace";
    ctx.fillText("!", px + T / 2, py - 32);

    ctx.fillStyle = "#e8c170";
    ctx.font = "bold 11px monospace";
    ctx.fillText("[ SPACE ]", px + T / 2, py + T + 18);
  }
}

// Draw the full interior scene
export function drawInterior(
  ctx: CanvasRenderingContext2D,
  interior: BuildingInterior,
  camX: number, camY: number,
  frame: number,
  playerX: number, playerY: number
) {
  const map = interior.map;
  const isNear = isNearReceptionistCheck(playerX, playerY, interior.receptionist);

  for (let y = 0; y < INTERIOR_HEIGHT; y++) {
    for (let x = 0; x < INTERIOR_WIDTH; x++) {
      const tile = map[y][x];
      switch (tile) {
        case FLOOR:
          drawInteriorFloor(ctx, x, y, camX, camY, interior.floorColor);
          break;
        case WALL:
          drawInteriorWall(ctx, x, y, camX, camY, interior.wallColor);
          break;
        case DESK:
          drawInteriorFloor(ctx, x, y, camX, camY, interior.floorColor);
          drawDesk(ctx, x, y, camX, camY);
          break;
        case EXIT_MAT:
          drawExitMat(ctx, x, y, camX, camY, frame);
          break;
        case SHELF:
          drawShelf(ctx, x, y, camX, camY);
          break;
        case PLANT:
          drawPlant(ctx, x, y, camX, camY, interior.floorColor);
          break;
        case RUG:
          drawRug(ctx, x, y, camX, camY, interior.floorColor);
          break;
      }
    }
  }

  drawReceptionist(ctx, interior.receptionist, camX, camY, frame, isNear);

  const totalW = INTERIOR_WIDTH * INTERIOR_TILE;
  const centerX = totalW / 2 - camX;
  const bldg = buildings.find(b => b.id === interior.buildingId);
  const label = bldg?.signText ?? interior.buildingId.toUpperCase();
  const labelW = label.length * 8 + 30;
  ctx.fillStyle = "rgba(26,28,44,0.85)";
  ctx.fillRect(centerX - labelW / 2, 8 - camY, labelW, 22);
  ctx.fillStyle = "#e8c170";
  ctx.font = "bold 12px monospace";
  ctx.textAlign = "center";
  ctx.fillText(label, centerX, 23 - camY);
}

function isNearReceptionistCheck(px: number, py: number, r: Receptionist): boolean {
  const dist = Math.abs(px - r.x) + Math.abs(py - r.y);
  return dist <= 2;
}
