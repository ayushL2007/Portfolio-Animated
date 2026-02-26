import { buildings } from "./game-data";

// Tile types
export const GRASS = 0;
export const PATH = 1;
export const BUILDING = 2;
export const TREE = 3;
export const FENCE = 4;
export const WATER = 5;

export const MAP_WIDTH = 22;
export const MAP_HEIGHT = 24;

// Generate the world map
export function generateMap(): number[][] {
  const map: number[][] = [];

  // Fill with grass
  for (let y = 0; y < MAP_HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < MAP_WIDTH; x++) {
      map[y][x] = GRASS;
    }
  }

  // Place buildings on the map
  for (const b of buildings) {
    for (let dy = 0; dy < b.height; dy++) {
      for (let dx = 0; dx < b.width; dx++) {
        if (b.y + dy < MAP_HEIGHT && b.x + dx < MAP_WIDTH) {
          map[b.y + dy][b.x + dx] = BUILDING;
        }
      }
    }
  }

  // Create paths between buildings
  // Horizontal main road
  for (let x = 1; x < MAP_WIDTH - 1; x++) {
    if (map[8][x] === GRASS) map[8][x] = PATH;
    if (map[9][x] === GRASS) map[9][x] = PATH;
  }

  // Vertical paths to upper buildings
  for (let y = 3; y < 9; y++) {
    // Left building path
    if (map[y][5] === GRASS) map[y][5] = PATH;
    if (map[y][6] === GRASS) map[y][6] = PATH;
    // Right building path
    if (map[y][13] === GRASS) map[y][13] = PATH;
    if (map[y][14] === GRASS) map[y][14] = PATH;
  }

  // Vertical paths to lower buildings
  for (let y = 9; y < 16; y++) {
    // Left building path
    if (map[y][5] === GRASS) map[y][5] = PATH;
    if (map[y][6] === GRASS) map[y][6] = PATH;
    // Right building path
    if (map[y][13] === GRASS) map[y][13] = PATH;
    if (map[y][14] === GRASS) map[y][14] = PATH;
  }

  // Path to contact building (bottom center)
  for (let y = 9; y < 21; y++) {
    if (map[y][9] === GRASS) map[y][9] = PATH;
    if (map[y][10] === GRASS) map[y][10] = PATH;
  }
  // Horizontal connector to contact
  for (let x = 7; x < 12; x++) {
    if (map[17][x] === GRASS) map[17][x] = PATH;
    if (map[16][x] === GRASS) map[16][x] = PATH;
  }

  // Place trees around border and scattered
  const treePositions = [
    // Top border
    [0, 0], [1, 0], [2, 0], [8, 0], [9, 0], [10, 0], [18, 0], [19, 0], [20, 0], [21, 0],
    [0, 1], [1, 1], [10, 1], [19, 1], [20, 1], [21, 1],
    // Left border
    [0, 2], [0, 3], [0, 5], [0, 6], [0, 7], [0, 10], [0, 12], [0, 14], [0, 16], [0, 18], [0, 20],
    [1, 5], [1, 10], [1, 14], [1, 18], [1, 20],
    // Right border
    [21, 2], [21, 4], [21, 6], [21, 8], [21, 10], [21, 12], [21, 14], [21, 16], [21, 18], [21, 20],
    [20, 4], [20, 10], [20, 14], [20, 18],
    // Bottom border
    [0, 22], [1, 22], [2, 22], [3, 22], [4, 22], [5, 22], [6, 22],
    [14, 22], [15, 22], [16, 22], [17, 22], [18, 22], [19, 22], [20, 22], [21, 22],
    [0, 23], [1, 23], [2, 23], [3, 23], [18, 23], [19, 23], [20, 23], [21, 23],
    // Interior decorative trees
    [2, 8], [19, 8],
    [18, 3], [19, 3],
    [2, 16], [2, 18],
    [18, 16], [19, 16],
    [14, 20], [15, 20], [16, 20],
    [4, 20], [5, 20], [6, 20],
  ];

  for (const [tx, ty] of treePositions) {
    if (ty < MAP_HEIGHT && tx < MAP_WIDTH && map[ty][tx] === GRASS) {
      map[ty][tx] = TREE;
    }
  }

  // Place fences near paths
  const fencePositions = [
    // Along main road
    [1, 7], [2, 7], [19, 7], [20, 7],
    [1, 10], [2, 10], [19, 10], [20, 10],
  ];

  for (const [fx, fy] of fencePositions) {
    if (fy < MAP_HEIGHT && fx < MAP_WIDTH && map[fy][fx] === GRASS) {
      map[fy][fx] = FENCE;
    }
  }

  return map;
}

// Check if a tile is walkable
export function isWalkable(map: number[][], x: number, y: number): boolean {
  if (x < 0 || y < 0 || x >= MAP_WIDTH || y >= MAP_HEIGHT) return false;
  const tile = map[y][x];
  return tile === GRASS || tile === PATH;
}

// Check if player is near a building door
export function getNearbyBuilding(
  px: number,
  py: number
): (typeof buildings)[number] | null {
  for (const b of buildings) {
    const doorX = b.x + Math.floor(b.width / 2);
    const doorY = b.y + b.height;
    const dist = Math.abs(px - doorX) + Math.abs(py - doorY);
    if (dist <= 2) return b;
  }
  return null;
}

// Get nearby NPC
import { npcs } from "./game-data";

export function getNearbyNPC(
  px: number,
  py: number
): (typeof npcs)[number] | null {
  for (const npc of npcs) {
    const dist = Math.abs(px - npc.x) + Math.abs(py - npc.y);
    if (dist <= 1.5) return npc;
  }
  return null;
}
