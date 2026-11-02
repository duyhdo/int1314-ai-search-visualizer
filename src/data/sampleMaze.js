/**
 * Sample maze data for testing and demonstration
 * 10x10 grid with start, goal, obstacles, and at least one valid path
 *
 * Grid values:
 * 0 = walkable cell
 * 1 = obstacle/blocked cell
 */

export const sampleMaze = {
  grid: [
    [0, 0, 0, 1, 0, 0, 0, 0, 0, 0],
    [0, 1, 0, 1, 0, 1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 1, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 0, 1, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 1, 1, 1, 1, 1, 0, 1, 1, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 0],
  ],
  start: { row: 0, col: 0 },
  goal: { row: 9, col: 9 },
};

/**
 * Additional sample mazes for testing various scenarios
 */

export const simpleSquareMaze = {
  grid: [
    [0, 1, 0],
    [0, 1, 0],
    [0, 0, 0],
  ],
  start: { row: 0, col: 0 },
  goal: { row: 2, col: 2 },
};

export const openMaze = {
  grid: [
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0],
  ],
  start: { row: 0, col: 0 },
  goal: { row: 4, col: 4 },
};

export const mazeWithNoPath = {
  grid: [
    [0, 0, 1, 0, 0],
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 0, 0],
  ],
  start: { row: 0, col: 0 },
  goal: { row: 4, col: 4 },
};
