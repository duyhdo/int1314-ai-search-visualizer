import {
  getNeighbors,
  keyToPosition,
  manhattanDistance,
  positionToKey,
} from "../utils/grid";
import { validateInput } from "../utils/searchContract";

/**
 * A* Search
 *
 * Expands the open node with the smallest f(n) = g(n) + h(n), where g is the
 * number of moves from start and h is the Manhattan distance to goal.
 * Manhattan distance never overestimates on a 4-direction unit-cost grid,
 * so the returned path is always a shortest one.
 *
 * Ties on f are broken by smaller h (closer to goal), then by the order the
 * node was pushed into the open list, so the result is deterministic.
 *
 * @param {Object} input - Search input object
 * @param {Array<Array<number>>} input.grid - 2D grid (0=walkable, 1=blocked)
 * @param {Object} input.start - Start position {row, col}
 * @param {Object} input.goal - Goal position {row, col}
 * @returns {Object} Search result with found, path, visitedOrder, pathCost, expandedNodes
 * @throws {Error} If the input does not satisfy the search contract
 */
export function aStarSearch(input) {
  const validation = validateInput(input);
  if (!validation.valid) {
    throw new Error(validation.error);
  }

  const { grid, start, goal } = input;
  const startKey = positionToKey(start);
  const goalKey = positionToKey(goal);

  const gScore = new Map([[startKey, 0]]);
  const parent = new Map([[startKey, null]]);
  const closed = new Set();
  const visitedOrder = [];

  const startH = manhattanDistance(start, goal);
  const open = [
    {
      key: startKey,
      position: { row: start.row, col: start.col },
      g: 0,
      h: startH,
      f: startH,
      order: 0,
    },
  ];
  let pushCount = 1;

  while (open.length > 0) {
    let best = 0;
    for (let i = 1; i < open.length; i++) {
      if (isBetter(open[i], open[best])) {
        best = i;
      }
    }
    const [node] = open.splice(best, 1);

    // an older entry of a node we already reached with lower g
    if (closed.has(node.key) || node.g > gScore.get(node.key)) {
      continue;
    }

    closed.add(node.key);
    visitedOrder.push(node.position);

    if (node.key === goalKey) {
      const path = buildPath(parent, goalKey);
      return {
        found: true,
        path,
        visitedOrder,
        pathCost: node.g,
        expandedNodes: visitedOrder.length,
      };
    }

    const { row, col } = node.position;
    for (const next of getNeighbors(row, col, grid)) {
      const nextKey = positionToKey(next);
      if (closed.has(nextKey)) {
        continue;
      }

      const g = node.g + 1;
      if (gScore.has(nextKey) && g >= gScore.get(nextKey)) {
        continue;
      }

      gScore.set(nextKey, g);
      parent.set(nextKey, node.key);
      const h = manhattanDistance(next, goal);
      open.push({ key: nextKey, position: next, g, h, f: g + h, order: pushCount });
      pushCount++;
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

function isBetter(a, b) {
  if (a.f !== b.f) return a.f < b.f;
  if (a.h !== b.h) return a.h < b.h;
  return a.order < b.order;
}

function buildPath(parent, goalKey) {
  const path = [];
  let key = goalKey;
  while (key !== null) {
    path.push(keyToPosition(key));
    key = parent.get(key);
  }
  return path.reverse();
}
