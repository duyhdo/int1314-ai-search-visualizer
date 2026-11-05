/**
 * Grid utility functions for maze operations
 * Provides core grid manipulation and neighbor discovery for search algorithms
 */

/**
 * Create a rectangular grid with independent rows and given dimensions
 * Dimensions must be nonnegative integers; fill values are not cloned
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {number} fillValue - Initial value for all cells (default 0)
 * @returns {Array<Array<number>>} 2D grid
 * @throws {RangeError} If either dimension is not a nonnegative integer
 */
export function createGrid(rows, cols, fillValue = 0) {
  if (!Number.isInteger(rows) || rows < 0 || !Number.isInteger(cols) || cols < 0) {
    throw new RangeError("Grid dimensions must be nonnegative integers.");
  }

  return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
}

/**
 * Check integer coordinates against actual row bounds, including ragged grids
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {Array<Array<number>>} grid - The grid
 * @returns {boolean} True if position is valid
 */
export function isValidPosition(row, col, grid) {
  return (
    Number.isInteger(row) &&
    Number.isInteger(col) &&
    row >= 0 &&
    col >= 0 &&
    Array.isArray(grid) &&
    row < grid.length &&
    Array.isArray(grid[row]) &&
    col < grid[row].length
  );
}

/**
 * Check if a cell is walkable (value === 0)
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {Array<Array<number>>} grid - The grid
 * @returns {boolean} True if cell is walkable
 */
export function isWalkable(row, col, grid) {
  return isValidPosition(row, col, grid) && grid[row][col] === 0;
}

/**
 * Get valid neighbors of a position (Up, Right, Down, Left order)
 * An invalid origin has no neighbors
 * @param {number} row - Current row
 * @param {number} col - Current column
 * @param {Array<Array<number>>} grid - The grid
 * @returns {Array<{row: number, col: number}>} Valid neighbor positions
 */
export function getNeighbors(row, col, grid) {
  if (!isValidPosition(row, col, grid)) {
    return [];
  }

  const directions = [
    [-1, 0], // Up
    [0, 1], // Right
    [1, 0], // Down
    [0, -1], // Left
  ];

  return directions
    .map(([dRow, dCol]) => ({
      row: row + dRow,
      col: col + dCol,
    }))
    .filter(({ row: r, col: c }) => isWalkable(r, c, grid));
}

function isPosition(position) {
  return (
    position !== null &&
    typeof position === "object" &&
    Number.isSafeInteger(position.row) &&
    Number.isSafeInteger(position.col)
  );
}

function assertPosition(position) {
  if (!isPosition(position)) {
    throw new TypeError("A position must contain safe integer row and col coordinates.");
  }
}

/**
 * Calculate Manhattan distance between two positions
 * Used as heuristic for Greedy and A* searches
 * @param {Object} from - Starting position {row, col}
 * @param {Object} to - Goal position {row, col}
 * @returns {number} Manhattan distance
 * @throws {TypeError} If either position lacks safe integer coordinates
 */
export function manhattanDistance(from, to) {
  assertPosition(from);
  assertPosition(to);
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

/**
 * Check if two positions are equal
 * @param {Object} pos1 - First position {row, col}
 * @param {Object} pos2 - Second position {row, col}
 * @returns {boolean} True if valid positions are the same; false for malformed positions
 */
export function positionsEqual(pos1, pos2) {
  return (
    isPosition(pos1) &&
    isPosition(pos2) &&
    pos1.row === pos2.row &&
    pos1.col === pos2.col
  );
}

/**
 * Convert position to string key for use in Sets/Maps
 * @param {Object} pos - Position {row, col}
 * @returns {string} String key in "row,col" format; negative coordinates are allowed
 * @throws {TypeError} If the position lacks safe integer coordinates
 */
export function positionToKey(pos) {
  assertPosition(pos);
  return `${pos.row},${pos.col}`;
}

/**
 * Convert string key back to position object
 * @param {string} key - Position key from positionToKey
 * @returns {Object} Position {row, col}
 * @throws {TypeError} For malformed keys, whitespace, decimals, or unsafe integers
 */
export function keyToPosition(key) {
  if (typeof key !== "string" || key !== key.trim() || !/^-?\d+,-?\d+$/.test(key)) {
    throw new TypeError("A position key must have the format row,col using safe integers.");
  }

  const [row, col] = key.split(",").map(Number);
  const position = { row, col };
  assertPosition(position);
  return position;
}
