import { describe, expect, it } from "vitest";
import { greedyBestFirstSearch } from "../algorithms/greedy";
import {
  getNeighbors,
  manhattanDistance,
  positionToKey,
} from "../utils/grid";
import { validateInput, validateResult } from "../utils/searchContract";
import {
  mazeWithNoPath,
  sampleMaze,
  simpleSquareMaze,
} from "../data/sampleMaze";

function expectValidPath(result, { grid, start, goal }) {
  expect(result.path[0]).toEqual(start);
  expect(result.path.at(-1)).toEqual(goal);

  for (let index = 0; index < result.path.length; index++) {
    const position = result.path[index];
    expect(grid[position.row][position.col]).toBe(0);
    if (index > 0) {
      const previous = result.path[index - 1];
      expect(
        Math.abs(previous.row - position.row) +
          Math.abs(previous.col - position.col),
      ).toBe(1);
    }
  }
}

function getShortestPathLengthByReferenceBfs({ grid, start, goal }) {
  const directions = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  const queue = [{ position: start, distance: 0 }];
  const discovered = new Set([positionToKey(start)]);

  for (let head = 0; head < queue.length; head++) {
    const { position, distance } = queue[head];
    if (position.row === goal.row && position.col === goal.col) {
      return distance;
    }

    for (const [rowOffset, colOffset] of directions) {
      const neighbor = {
        row: position.row + rowOffset,
        col: position.col + colOffset,
      };
      const key = positionToKey(neighbor);
      if (
        neighbor.row >= 0 &&
        neighbor.row < grid.length &&
        neighbor.col >= 0 &&
        neighbor.col < grid[0].length &&
        grid[neighbor.row][neighbor.col] === 0 &&
        !discovered.has(key)
      ) {
        discovered.add(key);
        queue.push({ position: neighbor, distance: distance + 1 });
      }
    }
  }

  return null;
}

describe("Greedy Best-First Search", () => {
  it("finds a path on a maze with an available route", () => {
    const input = simpleSquareMaze;
    const result = greedyBestFirstSearch(input);

    expect(result.found).toBe(true);
    expectValidPath(result, input);
    expect(result.pathCost).toBe(result.path.length - 1);
  });

  it("returns a valid failure result when no route exists", () => {
    const result = greedyBestFirstSearch(mazeWithNoPath);

    expect(result).toMatchObject({
      found: false,
      path: [],
      pathCost: null,
    });
    expect(validateResult(result)).toEqual({ valid: true, error: null });
  });

  it("returns only the start position when start equals goal", () => {
    const input = {
      grid: [[0]],
      start: { row: 0, col: 0 },
      goal: { row: 0, col: 0 },
    };
    const result = greedyBestFirstSearch(input);

    expect(result.found).toBe(true);
    expect(result.path).toEqual([input.start]);
    expect(result.pathCost).toBe(0);
    expect(result.visitedOrder).toEqual([input.start]);
  });

  it("finds a continuous path around obstacles", () => {
    const result = greedyBestFirstSearch(simpleSquareMaze);

    expectValidPath(result, simpleSquareMaze);
    expect(result.path).not.toContainEqual({ row: 0, col: 1 });
    expect(result.path).not.toContainEqual({ row: 1, col: 1 });
  });

  it("can return a valid path longer than the independently measured shortest path", () => {
    const input = {
      grid: [
        [0, 0, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 1],
        [0, 0, 1, 0, 1, 0],
        [1, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 0, 0],
      ],
      start: { row: 2, col: 0 },
      goal: { row: 2, col: 5 },
    };
    const shortestPathLength = getShortestPathLengthByReferenceBfs(input);
    const result = greedyBestFirstSearch(input);

    expect(shortestPathLength).toBe(7);
    expect(result.found).toBe(true);
    expectValidPath(result, input);
    expect(result.pathCost).toBeGreaterThan(shortestPathLength);
  });

  it("handles multiple frontier positions with the same heuristic", () => {
    const input = {
      grid: [
        [0, 0, 0, 0],
        [0, 0, 0, 0],
        [0, 0, 0, 0],
      ],
      start: { row: 1, col: 1 },
      goal: { row: 0, col: 3 },
    };
    const result = greedyBestFirstSearch(input);

    expect(result.found).toBe(true);
    expect(result.pathCost).toBe(result.path.length - 1);
    expectValidPath(result, input);
  });

  it("breaks equal-heuristic ties by discovery order", () => {
    const input = {
      grid: [
        [0, 0, 1, 0],
        [0, 0, 0, 0],
        [1, 1, 1, 1],
      ],
      start: { row: 1, col: 1 },
      goal: { row: 0, col: 3 },
    };
    const result = greedyBestFirstSearch(input);

    expect(result.visitedOrder.slice(0, 3)).toEqual([
      input.start,
      { row: 0, col: 1 },
      { row: 1, col: 2 },
    ]);
  });

  it("returns a fixed expansion order for a small maze", () => {
    const input = {
      grid: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      start: { row: 1, col: 1 },
      goal: { row: 0, col: 2 },
    };
    const result = greedyBestFirstSearch(input);

    expect(result.visitedOrder).toEqual([
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  it("does not expand any position more than once", () => {
    const result = greedyBestFirstSearch(sampleMaze);
    const expandedKeys = result.visitedOrder.map(positionToKey);

    expect(new Set(expandedKeys).size).toBe(expandedKeys.length);
    expect(result.expandedNodes).toBe(result.visitedOrder.length);
  });

  it("does not mutate the grid, start, or goal", () => {
    const input = structuredClone(simpleSquareMaze);
    const original = structuredClone(input);

    greedyBestFirstSearch(input);

    expect(input).toEqual(original);
  });

  it("returns a result that satisfies the shared Search Contract", () => {
    const result = greedyBestFirstSearch(sampleMaze);

    expect(validateInput(sampleMaze)).toEqual({ valid: true, error: null });
    expect(validateResult(result)).toEqual({ valid: true, error: null });
    expect(result.expandedNodes).toBe(result.visitedOrder.length);
    expect(result.pathCost).toBe(result.path.length - 1);
    expectValidPath(result, sampleMaze);
  });

  it("prioritizes heuristic distance instead of path cost", () => {
    const input = {
      grid: [
        [0, 1, 1, 1, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 1, 1, 0],
        [1, 1, 1, 1, 0, 1, 1, 0],
        [0, 0, 0, 1, 0, 0, 0, 0],
        [0, 1, 0, 0, 0, 1, 1, 0],
      ],
      start: { row: 4, col: 0 },
      goal: { row: 0, col: 7 },
    };
    const result = greedyBestFirstSearch(input);
    const discovered = new Set([positionToKey(input.start)]);
    const depths = new Map([[positionToKey(input.start), 0]]);
    const frontier = [
      {
        position: input.start,
        key: positionToKey(input.start),
        heuristic: manhattanDistance(input.start, input.goal),
        order: 0,
      },
    ];
    let order = 1;
    let hasHeuristicOverCostWitness = false;

    for (const current of result.visitedOrder) {
      const currentKey = positionToKey(current);
      const bestIndex = frontier.reduce(
        (best, candidate, index) =>
          candidate.heuristic < frontier[best].heuristic ||
          (candidate.heuristic === frontier[best].heuristic &&
            candidate.order < frontier[best].order)
            ? index
            : best,
        0,
      );
      const [expected] = frontier.splice(bestIndex, 1);
      expect(currentKey).toBe(expected.key);

      for (const candidate of frontier) {
        if (
          depths.get(currentKey) > depths.get(candidate.key) &&
          expected.heuristic < candidate.heuristic
        ) {
          hasHeuristicOverCostWitness = true;
        }
      }

      if (currentKey === positionToKey(input.goal)) {
        break;
      }

      for (const neighbor of getNeighbors(
        current.row,
        current.col,
        input.grid,
      )) {
        const neighborKey = positionToKey(neighbor);
        if (discovered.has(neighborKey)) {
          continue;
        }

        discovered.add(neighborKey);
        depths.set(neighborKey, depths.get(currentKey) + 1);
        frontier.push({
          position: neighbor,
          key: neighborKey,
          heuristic: manhattanDistance(neighbor, input.goal),
          order,
        });
        order += 1;
      }
    }

    expect(result.found).toBe(true);
    expect(hasHeuristicOverCostWitness).toBe(true);
  });

  it("returns the same result for repeated runs with the same input", () => {
    expect(greedyBestFirstSearch(sampleMaze)).toEqual(
      greedyBestFirstSearch(sampleMaze),
    );
  });

  it.each([
    ["null input", null],
    [
      "a non-rectangular grid",
      {
        grid: [[0, 0], [0]],
        start: { row: 0, col: 0 },
        goal: { row: 0, col: 1 },
      },
    ],
    [
      "an out-of-bounds start",
      {
        grid: [[0]],
        start: { row: 1, col: 0 },
        goal: { row: 0, col: 0 },
      },
    ],
  ])("rejects %s using the existing input validation", (_description, input) => {
    const validation = validateInput(input);

    expect(validation.valid).toBe(false);
    expect(() => greedyBestFirstSearch(input)).toThrow(validation.error);
  });
});
