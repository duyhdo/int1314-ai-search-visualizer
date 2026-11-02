/**
 * Grid utility functions for maze operations
 * Provides core grid manipulation and neighbor discovery for search algorithms
 */

/**
 * Create a rectangular grid with given dimensions
 * @param {number} rows - Number of rows
 * @param {number} cols - Number of columns
 * @param {number} fillValue - Initial value for all cells (default 0)
 * @returns {Array<Array<number>>} 2D grid
 */
export function createGrid(rows, cols, fillValue = 0) {
  return Array.from({ length: rows }, () => Array(cols).fill(fillValue));
}

/**
 * Check if a position is within grid bounds
 * @param {number} row - Row index
 * @param {number} col - Column index
 * @param {Array<Array<number>>} grid - The grid
 * @returns {boolean} True if position is valid
 */
export function isValidPosition(row, col, grid) {
  if (!grid || !Array.isArray(grid) || grid.length === 0) {
    return false;
  }
  return row >= 0 && row < grid.length && col >= 0 && col < grid[0].length;
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
 * @param {number} row - Current row
 * @param {number} col - Current column
 * @param {Array<Array<number>>} grid - The grid
 * @returns {Array<{row: number, col: number}>} Valid neighbor positions
 */
export function getNeighbors(row, col, grid) {
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

/**
 * Calculate Manhattan distance between two positions
 * Used as heuristic for Greedy and A* searches
 * @param {Object} from - Starting position {row, col}
 * @param {Object} to - Goal position {row, col}
 * @returns {number} Manhattan distance
 */
export function manhattanDistance(from, to) {
  return Math.abs(from.row - to.row) + Math.abs(from.col - to.col);
}

/**
 * Check if two positions are equal
 * @param {Object} pos1 - First position {row, col}
 * @param {Object} pos2 - Second position {row, col}
 * @returns {boolean} True if positions are the same
 */
export function positionsEqual(pos1, pos2) {
  return pos1.row === pos2.row && pos1.col === pos2.col;
}

/**
 * Convert position to string key for use in Sets/Maps
 * @param {Object} pos - Position {row, col}
 * @returns {string} String key
 */
export function positionToKey(pos) {
  return `${pos.row},${pos.col}`;
}

/**
 * Convert string key back to position object
 * @param {string} key - Position key from positionToKey
 * @returns {Object} Position {row, col}
 */
export function keyToPosition(key) {
  const [row, col] = key.split(",").map(Number);
  return { row, col };
}
