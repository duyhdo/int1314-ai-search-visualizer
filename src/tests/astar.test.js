import { describe, expect, it } from "vitest";
import { aStarSearch } from "../algorithms/astar";
import { positionToKey } from "../utils/grid";
import { validateInput, validateResult } from "../utils/searchContract";
import {
  mazeWithNoPath,
  openMaze,
  sampleMaze,
  simpleSquareMaze,
} from "../data/sampleMaze";

// simple BFS just to know the real shortest distance
function shortestDistance({ grid, start, goal }) {
  const dirs = [
    [-1, 0],
    [0, 1],
    [1, 0],
    [0, -1],
  ];
  const queue = [[start, 0]];
  const seen = new Set([positionToKey(start)]);

  for (let i = 0; i < queue.length; i++) {
    const [pos, dist] = queue[i];
    if (pos.row === goal.row && pos.col === goal.col) return dist;

    for (const [dr, dc] of dirs) {
      const r = pos.row + dr;
      const c = pos.col + dc;
      const key = `${r},${c}`;
      if (grid[r]?.[c] === 0 && !seen.has(key)) {
        seen.add(key);
        queue.push([{ row: r, col: c }, dist + 1]);
      }
    }
  }
  return null;
}

function checkPath(result, { grid, start, goal }) {
  expect(result.path[0]).toEqual(start);
  expect(result.path.at(-1)).toEqual(goal);

  for (let i = 1; i < result.path.length; i++) {
    const a = result.path[i - 1];
    const b = result.path[i];
    expect(grid[b.row][b.col]).toBe(0);
    expect(Math.abs(a.row - b.row) + Math.abs(a.col - b.col)).toBe(1);
  }
}

describe("A* Search", () => {
  it("finds the shortest path on the sample maze", () => {
    const result = aStarSearch(sampleMaze);

    expect(result.found).toBe(true);
    checkPath(result, sampleMaze);
    expect(result.pathCost).toBe(shortestDistance(sampleMaze));
    expect(result.pathCost).toBe(result.path.length - 1);
  });

  it("goes around obstacles", () => {
    const result = aStarSearch(simpleSquareMaze);

    checkPath(result, simpleSquareMaze);
    expect(result.pathCost).toBe(4);
    expect(result.path).not.toContainEqual({ row: 0, col: 1 });
    expect(result.path).not.toContainEqual({ row: 1, col: 1 });
  });

  it("returns found=false when there is no path", () => {
    const result = aStarSearch(mazeWithNoPath);

    expect(result.found).toBe(false);
    expect(result.path).toEqual([]);
    expect(result.pathCost).toBeNull();
    expect(result.visitedOrder.length).toBeGreaterThan(0);
    expect(validateResult(result).valid).toBe(true);
  });

  it("handles start == goal", () => {
    const input = {
      grid: [
        [0, 0],
        [0, 0],
      ],
      start: { row: 1, col: 0 },
      goal: { row: 1, col: 0 },
    };
    const result = aStarSearch(input);

    expect(result.found).toBe(true);
    expect(result.path).toEqual([{ row: 1, col: 0 }]);
    expect(result.pathCost).toBe(0);
    expect(result.expandedNodes).toBe(1);
  });

  it("expands nodes in the expected order on a small grid", () => {
    const input = {
      grid: [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ],
      start: { row: 1, col: 1 },
      goal: { row: 0, col: 2 },
    };

    expect(aStarSearch(input).visitedOrder).toEqual([
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
    ]);
  });

  it("goes straight to the goal on an empty grid", () => {
    const input = {
      grid: Array.from({ length: 5 }, () => [0, 0, 0, 0, 0]),
      start: { row: 0, col: 0 },
      goal: { row: 0, col: 4 },
    };
    const result = aStarSearch(input);

    expect(result.pathCost).toBe(4);
    expect(result.expandedNodes).toBe(5);
  });

  it("is optimal on a maze where greedy-like choices are a trap", () => {
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
    const result = aStarSearch(input);

    checkPath(result, input);
    expect(result.pathCost).toBe(7);
  });

  it("matches BFS distance on the open maze", () => {
    const result = aStarSearch(openMaze);
    expect(result.pathCost).toBe(shortestDistance(openMaze));
  });

  it("never expands the same cell twice", () => {
    const result = aStarSearch(sampleMaze);
    const keys = result.visitedOrder.map(positionToKey);

    expect(new Set(keys).size).toBe(keys.length);
    expect(result.expandedNodes).toBe(keys.length);
  });

  it("does not modify the input", () => {
    const input = structuredClone(sampleMaze);
    const copy = structuredClone(sampleMaze);

    aStarSearch(input);
    expect(input).toEqual(copy);
  });

  it("gives the same result every time", () => {
    expect(aStarSearch(sampleMaze)).toEqual(aStarSearch(sampleMaze));
  });

  it("passes validateResult", () => {
    expect(validateResult(aStarSearch(sampleMaze))).toEqual({
      valid: true,
      error: null,
    });
  });

  it("throws on invalid input", () => {
    const bad = {
      grid: [[0, 1]],
      start: { row: 0, col: 0 },
      goal: { row: 0, col: 1 },
    };

    expect(validateInput(bad).valid).toBe(false);
    expect(() => aStarSearch(bad)).toThrow("Goal position must be walkable");
    expect(() => aStarSearch(null)).toThrow();
  });
});
