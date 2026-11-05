import { describe, expect, it } from 'vitest'
import { breadthFirstSearch } from '../algorithms/bfs.js'
import { validateResult } from '../utils/searchContract.js'

function searchAndValidate(input) {
  const result = breadthFirstSearch(input)
  expect(validateResult(result)).toEqual({ valid: true, error: null })
  return result
}

// Repeated edge relaxation provides an independent distance oracle without a queue.
function referenceDistances(grid, start) {
  const distances = grid.map((row) => row.map(() => Infinity))
  distances[start.row][start.col] = 0

  for (let pass = 0; pass < grid.length * grid[0].length; pass += 1) {
    let changed = false

    for (let row = 0; row < grid.length; row += 1) {
      for (let col = 0; col < grid[row].length; col += 1) {
        if (grid[row][col] !== 0) continue

        for (const [nextRow, nextCol] of [
          [row - 1, col],
          [row, col + 1],
          [row + 1, col],
          [row, col - 1],
        ]) {
          if (grid[nextRow]?.[nextCol] !== 0) continue
          const candidate = distances[row][col] + 1

          if (candidate < distances[nextRow][nextCol]) {
            distances[nextRow][nextCol] = candidate
            changed = true
          }
        }
      }
    }

    if (!changed) break
  }

  return distances
}

describe('breadthFirstSearch', () => {
  it('expands in FIFO order and chooses the right route when shortest paths tie', () => {
    expect(
      searchAndValidate({
        grid: [[0, 0], [0, 0]],
        start: { row: 0, col: 0 },
        goal: { row: 1, col: 1 },
      }),
    ).toEqual({
      found: true,
      path: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 1, col: 1 }],
      visitedOrder: [
        { row: 0, col: 0 },
        { row: 0, col: 1 },
        { row: 1, col: 0 },
        { row: 1, col: 1 },
      ],
      pathCost: 2,
      expandedNodes: 4,
    })
  })

  it('preserves Up, Right, Down, Left expansion order from the center', () => {
    const result = searchAndValidate({
      grid: [[0, 0, 0], [0, 0, 0], [0, 0, 0]],
      start: { row: 1, col: 1 },
      goal: { row: 1, col: 0 },
    })

    expect(result.visitedOrder).toEqual([
      { row: 1, col: 1 },
      { row: 0, col: 1 },
      { row: 1, col: 2 },
      { row: 2, col: 1 },
      { row: 1, col: 0 },
    ])
    expect(result.path).toEqual([{ row: 1, col: 1 }, { row: 1, col: 0 }])
    expect(result.pathCost).toBe(1)
    expect(result.expandedNodes).toBe(5)
  })

  it('returns a zero-move path when start is already the goal', () => {
    expect(
      searchAndValidate({
        grid: [[0]],
        start: { row: 0, col: 0 },
        goal: { row: 0, col: 0 },
      }),
    ).toEqual({
      found: true,
      path: [{ row: 0, col: 0 }],
      visitedOrder: [{ row: 0, col: 0 }],
      pathCost: 0,
      expandedNodes: 1,
    })
  })

  it('exhausts the reachable component when the goal is unreachable', () => {
    expect(
      searchAndValidate({
        grid: [[0, 1, 0], [0, 1, 0], [0, 1, 0]],
        start: { row: 0, col: 0 },
        goal: { row: 2, col: 2 },
      }),
    ).toEqual({
      found: false,
      path: [],
      visitedOrder: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }],
      pathCost: null,
      expandedNodes: 3,
    })
  })

  it('reconstructs the shortest obstacle detour on a rectangular grid', () => {
    const result = searchAndValidate({
      grid: [[0, 1, 0, 0, 0], [0, 1, 0, 1, 0], [0, 0, 0, 1, 0]],
      start: { row: 0, col: 0 },
      goal: { row: 0, col: 4 },
    })

    expect(result.found).toBe(true)
    expect(result.path).toEqual([
      { row: 0, col: 0 },
      { row: 1, col: 0 },
      { row: 2, col: 0 },
      { row: 2, col: 1 },
      { row: 2, col: 2 },
      { row: 1, col: 2 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
    ])
    expect(result.pathCost).toBe(8)
  })

  it.each([
    { grid: [[0, 0, 0, 0]], goal: { row: 0, col: 3 } },
    { grid: [[0], [0], [0], [0]], goal: { row: 3, col: 0 } },
  ])('handles a single row or column: $goal', ({ grid, goal }) => {
    const result = searchAndValidate({ grid, start: { row: 0, col: 0 }, goal })

    expect(result.found).toBe(true)
    expect(result.pathCost).toBe(3)
    expect(result.path).toHaveLength(4)
    expect(result.path.at(-1)).toEqual(goal)
  })

  it.each([
    undefined,
    null,
    {},
    { grid: null, start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0, 0], [0]], start: { row: 0, col: 0 }, goal: { row: 1, col: 0 } },
    { grid: [[0, '0']], start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: NaN, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: 0, col: 0 }, goal: { row: 0, col: NaN } },
    { grid: [[0]], start: { row: 0, col: 0.5 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: 0, col: 0 }, goal: { row: Infinity, col: 0 } },
    { grid: [], start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[]], start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[1, 0]], start: { row: 0, col: 0 }, goal: { row: 0, col: 1 } },
    { grid: [[0, 1]], start: { row: 0, col: 0 }, goal: { row: 0, col: 1 } },
    { grid: [[1]], start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: -1, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: 0, col: 0 }, goal: { row: 0, col: 1 } },
    { grid: [[0]], start: { row: 0.5, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: null, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: 0, col: 0 }, goal: undefined },
  ])('throws for invalid, malformed, or blocked input: %#', (input) => {
    expect(() => breadthFirstSearch(input)).toThrow()
  })

  it('does not mutate the grid or endpoints', () => {
    const grid = Object.freeze([
      Object.freeze([0, 0, 0]),
      Object.freeze([0, 1, 0]),
    ])
    const start = Object.freeze({ row: 0, col: 0 })
    const goal = Object.freeze({ row: 1, col: 2 })

    expect(searchAndValidate({ grid, start, goal }).pathCost).toBe(3)
    expect(grid).toEqual([[0, 0, 0], [0, 1, 0]])
    expect(start).toEqual({ row: 0, col: 0 })
    expect(goal).toEqual({ row: 1, col: 2 })
  })

  it('matches independent shortest distances across all 128 small obstacle layouts', () => {
    const start = { row: 0, col: 0 }
    const goal = { row: 2, col: 2 }

    for (let mask = 0; mask < 128; mask += 1) {
      const grid = Array.from({ length: 3 }, () => [0, 0, 0])

      for (let cell = 1; cell < 8; cell += 1) {
        grid[Math.floor(cell / 3)][cell % 3] = (mask >> (cell - 1)) & 1
      }

      const distances = referenceDistances(grid, start)
      const expectedCost = distances[goal.row][goal.col]
      const result = searchAndValidate({ grid, start, goal })
      const visitedKeys = result.visitedOrder.map(({ row, col }) => `${row},${col}`)

      expect(result.found, `layout ${mask}`).toBe(Number.isFinite(expectedCost))
      expect(result.expandedNodes).toBe(result.visitedOrder.length)
      expect(new Set(visitedKeys).size).toBe(visitedKeys.length)

      let previousDistance = -1
      for (const position of result.visitedOrder) {
        expect(grid[position.row][position.col]).toBe(0)
        const distance = distances[position.row][position.col]
        expect(distance).toBeGreaterThanOrEqual(previousDistance)
        previousDistance = distance
      }

      if (!result.found) {
        expect(result.path).toEqual([])
        expect(result.pathCost).toBeNull()
        const reachableCells = distances.flat().filter(Number.isFinite).length
        expect(result.expandedNodes).toBe(reachableCells)
        continue
      }

      expect(result.pathCost).toBe(expectedCost)
      expect(result.path).toHaveLength(expectedCost + 1)
      expect(result.path[0]).toEqual(start)
      expect(result.path.at(-1)).toEqual(goal)
      expect(result.visitedOrder.at(-1)).toEqual(goal)

      for (let index = 0; index < result.path.length; index += 1) {
        const current = result.path[index]
        expect(grid[current.row][current.col]).toBe(0)
        if (index === 0) continue
        const previous = result.path[index - 1]
        expect(Math.abs(current.row - previous.row) + Math.abs(current.col - previous.col)).toBe(1)
      }
    }
  })
})
