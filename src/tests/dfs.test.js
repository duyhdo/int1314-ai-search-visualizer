import { describe, it, expect } from 'vitest'
import { depthFirstSearch } from '../algorithms/dfs.js'
import { validateResult } from '../utils/searchContract.js'
import { sampleMaze } from '../data/sampleMaze.js'

function checkPath(input, result) {
  expect(validateResult(result).valid).toBe(true)
  expect(result.path[0]).toEqual(input.start)
  expect(result.path.at(-1)).toEqual(input.goal)
  expect(result.pathCost).toBe(result.path.length - 1)
  for (let i = 0; i < result.path.length; i++) {
    const cell = result.path[i]
    expect(input.grid[cell.row][cell.col]).toBe(0)
    if (i > 0) {
      const previous = result.path[i - 1]
      expect(Math.abs(cell.row - previous.row) + Math.abs(cell.col - previous.col)).toBe(1)
    }
  }
}

describe('depthFirstSearch', () => {
  it('finds a continuous path in the sample maze without mutating input', () => {
    const input = structuredClone(sampleMaze)
    const before = structuredClone(input)
    const result = depthFirstSearch(input)
    expect(result.found).toBe(true)
    checkPath(input, result)
    expect(input).toEqual(before)
    expect(depthFirstSearch(input)).toEqual(result)
  })

  it('expands Up, Right, Down, Left with depth-first backtracking', () => {
    const input = { grid: [[0, 0, 0], [0, 0, 0], [0, 0, 0]], start: { row: 1, col: 1 }, goal: { row: 2, col: 0 } }
    const result = depthFirstSearch(input)
    expect(result.visitedOrder).toEqual([
      { row: 1, col: 1 }, { row: 0, col: 1 }, { row: 0, col: 2 },
      { row: 1, col: 2 }, { row: 2, col: 2 }, { row: 2, col: 1 }, { row: 2, col: 0 },
    ])
    checkPath(input, result)
  })

  it('exhausts a cyclic region without duplicate expansions when goal is unreachable', () => {
    const input = { grid: [[0, 0, 1, 0], [0, 0, 1, 1]], start: { row: 0, col: 0 }, goal: { row: 0, col: 3 } }
    const result = depthFirstSearch(input)
    expect(result.found).toBe(false)
    expect(result.path).toEqual([])
    expect(result.pathCost).toBeNull()
    expect(result.expandedNodes).toBe(4)
    expect(validateResult(result).valid).toBe(true)
  })

  it('handles Start = Goal on a single-cell maze', () => {
    const input = { grid: [[0]], start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } }
    const result = depthFirstSearch(input)
    expect(result.pathCost).toBe(0)
    expect(result.expandedNodes).toBe(1)
    checkPath(input, result)
  })

  it('backtracks out of a dead end', () => {
    const input = { grid: [[1, 0, 1], [0, 0, 0], [0, 1, 1]], start: { row: 1, col: 1 }, goal: { row: 2, col: 0 } }
    const result = depthFirstSearch(input)
    expect(result.visitedOrder.slice(0, 3)).toEqual([{ row: 1, col: 1 }, { row: 0, col: 1 }, { row: 1, col: 2 }])
    expect(result.path).toEqual([{ row: 1, col: 1 }, { row: 1, col: 0 }, { row: 2, col: 0 }])
    checkPath(input, result)
  })

  it.each([null, {}, { grid: [] },
    { grid: [[1]], start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0, 2]], start: { row: 0, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: -1, col: 0 }, goal: { row: 0, col: 0 } },
    { grid: [[0]], start: { row: 0, col: 0.5 }, goal: { row: 0, col: 0 } },
  ])('rejects invalid input: %j', input => {
    expect(() => depthFirstSearch(input)).toThrow()
  })
})
