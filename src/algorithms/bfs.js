import { getNeighbors, positionToKey } from "../utils/grid";
import { validateInput } from "../utils/searchContract";

/**
 * Find a shortest path by expanding a FIFO queue of walkable grid cells.
 * Neighbors are discovered in Up, Right, Down, Left order. A node is marked
 * when enqueued and recorded in visitedOrder when dequeued, including the goal.
 * Inputs are not mutated. Time and auxiliary space are O(rows * cols).
 *
 * @param {Object} input - Search input object
 * @param {Array<Array<number>>} input.grid - Rectangular grid (0=walkable, 1=blocked)
 * @param {{row: number, col: number}} input.start - Start position
 * @param {{row: number, col: number}} input.goal - Goal position
 * @returns {Object} Shared search result; pathCost is null when no path exists
 * @throws {Error} If input does not satisfy the shared search contract
 */
export function breadthFirstSearch(input) {
  // Check discrete coordinates before the shared validator indexes the grid.
  for (const endpoint of ["start", "goal"]) {
    const position = input?.[endpoint];
    if (position && (!Number.isInteger(position.row) || !Number.isInteger(position.col))) {
      throw new Error(`${endpoint} must have integer row and col coordinates`);
    }
  }

  const validation = validateInput(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { grid, start, goal } = input;
  const first = { row: start.row, col: start.col };
  const startKey = positionToKey(first);
  const goalKey = positionToKey(goal);
  const queue = [first];
  const discovered = new Set([startKey]);
  const parents = new Map([[startKey, null]]);
  const visitedOrder = [];

  // A head index avoids the repeated array copies caused by queue.shift().
  for (let head = 0; head < queue.length; head += 1) {
    const current = queue[head];
    const currentKey = positionToKey(current);
    visitedOrder.push(current);

    if (currentKey === goalKey) {
      const path = [];
      for (let node = current; node !== null; node = parents.get(positionToKey(node))) {
        path.push({ row: node.row, col: node.col });
      }
      path.reverse();

      return {
        found: true,
        path,
        visitedOrder,
        pathCost: path.length - 1,
        expandedNodes: visitedOrder.length,
      };
    }

    for (const neighbor of getNeighbors(current.row, current.col, grid)) {
      const neighborKey = positionToKey(neighbor);
      if (discovered.has(neighborKey)) continue;

      discovered.add(neighborKey);
      parents.set(neighborKey, current);
      queue.push(neighbor);
    }
  }

  return {
    found: false,
    path: [],
    visitedOrder,
    pathCost: null,
    expandedNodes: visitedOrder.length,
  };
}
