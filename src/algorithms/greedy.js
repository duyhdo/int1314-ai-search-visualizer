import {
  getNeighbors,
  keyToPosition,
  manhattanDistance,
  positionToKey,
} from "../utils/grid";
import { validateInput } from "../utils/searchContract";

/**
 * Greedy Best-First Search
 *
 * Expands the discovered position with the lowest Manhattan distance to the
 * goal. This heuristic-only ordering does not guarantee a shortest path.
 *
 * @param {Object} input - Search input object
 * @param {Array<Array<number>>} input.grid - 2D grid (0=walkable, 1=blocked)
 * @param {Object} input.start - Start position {row, col}
 * @param {Object} input.goal - Goal position {row, col}
 * @returns {Object} Search result with found, path, visitedOrder, pathCost, expandedNodes
 * @throws {Error} If the input does not satisfy the search contract
 */
export function greedyBestFirstSearch(input) {
  const validation = validateInput(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { grid, start, goal } = input;
  const startPosition = { row: start.row, col: start.col };
  const startKey = positionToKey(startPosition);
  const goalKey = positionToKey(goal);
  const priorityQueue = [
    {
      position: startPosition,
      key: startKey,
      heuristic: manhattanDistance(startPosition, goal),
      order: 0,
    },
  ];
  const discovered = new Set([startKey]);
  const visited = new Set();
  const parent = new Map([[startKey, null]]);
  const visitedOrder = [];
  let discoveryOrder = 1;

  while (priorityQueue.length > 0) {
    let bestIndex = 0;
    for (let index = 1; index < priorityQueue.length; index++) {
      const candidate = priorityQueue[index];
      const best = priorityQueue[bestIndex];
      if (
        candidate.heuristic < best.heuristic ||
        (candidate.heuristic === best.heuristic && candidate.order < best.order)
      ) {
        bestIndex = index;
      }
    }

    const [current] = priorityQueue.splice(bestIndex, 1);
    if (visited.has(current.key)) {
      continue;
    }

    visited.add(current.key);
    visitedOrder.push(current.position);

    if (current.key === goalKey) {
      const path = [];
      let pathKey = goalKey;
      while (pathKey !== null) {
        path.push(keyToPosition(pathKey));
        pathKey = parent.get(pathKey);
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

    for (const neighbor of getNeighbors(
      current.position.row,
      current.position.col,
      grid,
    )) {
      const neighborKey = positionToKey(neighbor);
      if (discovered.has(neighborKey)) {
        continue;
      }

      discovered.add(neighborKey);
      parent.set(neighborKey, current.key);
      priorityQueue.push({
        position: neighbor,
        key: neighborKey,
        heuristic: manhattanDistance(neighbor, goal),
        order: discoveryOrder,
      });
      discoveryOrder += 1;
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
