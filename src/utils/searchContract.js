/**
 * Shared search algorithm contract and validation utilities
 * Ensures all search algorithms follow the same input/output interface
 */

/**
 * List of available search algorithms
 * Maps algorithm IDs to their display names
 */
export const ALGORITHMS = [
  {
    id: "bfs",
    name: "Breadth-First Search",
    description: "Explores level by level, guarantees shortest path",
  },
  {
    id: "dfs",
    name: "Depth-First Search",
    description: "Explores deeply before backtracking",
  },
  {
    id: "ucs",
    name: "Uniform Cost Search",
    description: "Expands by cost, guarantees optimal cost",
  },
  {
    id: "greedy",
    name: "Greedy Best-First",
    description: "Uses heuristic, fast but not optimal",
  },
  {
    id: "astar",
    name: "A* Search",
    description: "Combines cost and heuristic, optimal and efficient",
  },
];

/**
 * Get algorithm name by ID
 * @param {string} algorithmId - Algorithm ID
 * @returns {string | null} Algorithm name or null if not found
 */
export function getAlgorithmName(algorithmId) {
  const algo = ALGORITHMS.find((a) => a.id === algorithmId);
  return algo ? algo.name : null;
}

/**
 * Validate search input object
 * @param {Object} input - Input object
 * @param {Array<Array<number>>} input.grid - 2D grid
 * @param {Object} input.start - Start position
 * @param {Object} input.goal - Goal position
 * @returns {Object} { valid: boolean, error: string | null }
 */
export function validateInput(input) {
  if (!input || typeof input !== "object") {
    return { valid: false, error: "Input must be an object" };
  }

  const { grid, start, goal } = input;

  // Validate grid
  if (!Array.isArray(grid) || grid.length === 0) {
    return { valid: false, error: "Grid must be a non-empty 2D array" };
  }

  if (!Array.isArray(grid[0]) || grid[0].length === 0) {
    return { valid: false, error: "Grid rows must be non-empty" };
  }

  // Check grid is rectangular
  const colCount = grid[0].length;
  for (let i = 0; i < grid.length; i++) {
    if (!Array.isArray(grid[i]) || grid[i].length !== colCount) {
      return { valid: false, error: "Grid must be rectangular" };
    }
    for (let j = 0; j < grid[i].length; j++) {
      if (typeof grid[i][j] !== "number") {
        return {
          valid: false,
          error: "All grid cells must be numbers (0 or 1)",
        };
      }
    }
  }

  // Validate start position
  if (!start || typeof start !== "object") {
    return { valid: false, error: "Start must be an object with row and col" };
  }
  if (typeof start.row !== "number" || typeof start.col !== "number") {
    return { valid: false, error: "Start must have numeric row and col" };
  }
  if (
    start.row < 0 ||
    start.row >= grid.length ||
    start.col < 0 ||
    start.col >= grid[0].length
  ) {
    return { valid: false, error: "Start position is out of bounds" };
  }
  if (grid[start.row][start.col] !== 0) {
    return { valid: false, error: "Start position must be walkable (value 0)" };
  }

  // Validate goal position
  if (!goal || typeof goal !== "object") {
    return { valid: false, error: "Goal must be an object with row and col" };
  }
  if (typeof goal.row !== "number" || typeof goal.col !== "number") {
    return { valid: false, error: "Goal must have numeric row and col" };
  }
  if (
    goal.row < 0 ||
    goal.row >= grid.length ||
    goal.col < 0 ||
    goal.col >= grid[0].length
  ) {
    return { valid: false, error: "Goal position is out of bounds" };
  }
  if (grid[goal.row][goal.col] !== 0) {
    return { valid: false, error: "Goal position must be walkable (value 0)" };
  }

  return { valid: true, error: null };
}

/**
 * Validate search result object
 * @param {Object} result - Result object
 * @returns {Object} { valid: boolean, error: string | null }
 */
export function validateResult(result) {
  if (!result || typeof result !== "object") {
    return { valid: false, error: "Result must be an object" };
  }

  const { found, path, visitedOrder, pathCost, expandedNodes } = result;

  // Validate found flag
  if (typeof found !== "boolean") {
    return { valid: false, error: "Result.found must be a boolean" };
  }

  // Validate path
  if (!Array.isArray(path)) {
    return { valid: false, error: "Result.path must be an array" };
  }

  if (found && path.length === 0) {
    return {
      valid: false,
      error: "Result.path must not be empty when found is true",
    };
  }

  if (!found && path.length !== 0) {
    return {
      valid: false,
      error: "Result.path must be empty when found is false",
    };
  }

  // Validate path positions
  for (let i = 0; i < path.length; i++) {
    if (
      !path[i] ||
      typeof path[i].row !== "number" ||
      typeof path[i].col !== "number"
    ) {
      return {
        valid: false,
        error: "Each path position must have numeric row and col",
      };
    }
  }

  // Validate visitedOrder
  if (!Array.isArray(visitedOrder)) {
    return { valid: false, error: "Result.visitedOrder must be an array" };
  }

  for (let i = 0; i < visitedOrder.length; i++) {
    if (
      !visitedOrder[i] ||
      typeof visitedOrder[i].row !== "number" ||
      typeof visitedOrder[i].col !== "number"
    ) {
      return {
        valid: false,
        error: "Each visited position must have numeric row and col",
      };
    }
  }

  // Validate no duplicates in visitedOrder
  const seen = new Set();
  for (const pos of visitedOrder) {
    const key = `${pos.row},${pos.col}`;
    if (seen.has(key)) {
      return {
        valid: false,
        error: "visitedOrder must not contain duplicates",
      };
    }
    seen.add(key);
  }

  // Validate expandedNodes matches visitedOrder length
  if (typeof expandedNodes !== "number") {
    return { valid: false, error: "Result.expandedNodes must be a number" };
  }

  if (expandedNodes !== visitedOrder.length) {
    return {
      valid: false,
      error: `expandedNodes (${expandedNodes}) must equal visitedOrder.length (${visitedOrder.length})`,
    };
  }

  // Validate pathCost
  if (found) {
    if (typeof pathCost !== "number") {
      return {
        valid: false,
        error: "Result.pathCost must be a number when found is true",
      };
    }
    if (pathCost < 0) {
      return { valid: false, error: "Result.pathCost must be non-negative" };
    }
  } else {
    if (pathCost !== null) {
      return {
        valid: false,
        error: "Result.pathCost must be null when found is false",
      };
    }
  }

  return { valid: true, error: null };
}

/**
 * Create an empty/unavailable result (when search fails or not implemented)
 * @returns {Object} Standard empty result object
 */
export function createEmptyResult() {
  return {
    found: false,
    path: [],
    visitedOrder: [],
    pathCost: null,
    expandedNodes: 0,
  };
}
