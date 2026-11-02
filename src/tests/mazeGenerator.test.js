import { describe, expect, it } from 'vitest'
import { greedyBestFirstSearch } from '../algorithms/greedy'
import {
  MAZE_SIZES,
  generateMaze,
} from '../utils/mazeGenerator'
import { getNeighbors, isValidPosition } from '../utils/grid'
import { validateInput, validateResult } from '../utils/searchContract'

function expectMazeShape(maze, rows, cols) {
  expect(maze.grid).toHaveLength(rows)
  expect(maze.grid.every((row) => row.length === cols)).toBe(true)
  expect(maze.grid.flat()).toHaveLength(rows * cols)
  expect(maze.grid.flat().every((cell) => cell === 0 || cell === 1)).toBe(true)
  expect(maze.start).toEqual({ row: 0, col: 0 })
  expect(maze.goal).toEqual({ row: rows - 1, col: cols - 1 })
  expect(maze.grid[0][0]).toBe(0)
  expect(maze.grid[rows - 1][cols - 1]).toBe(0)
}

describe('generateMaze', () => {
  it('creates a 10×10 grid with 100 cells', () => {
    const maze = generateMaze({ size: '10x10', density: 25, rng: () => 0.9 })

    expectMazeShape(maze, 10, 10)
  })

  it('creates a 15×20 grid with 300 cells', () => {
    const maze = generateMaze({ size: '15x20', density: 25, rng: () => 0.9 })

    expectMazeShape(maze, 15, 20)
  })

  it('generates a fully walkable grid at zero density without consuming randomness', () => {
    const rng = () => {
      throw new Error('rng should not be called for zero density')
    }
    const maze = generateMaze({ size: '10x10', density: 0, rng })

    expect(maze.grid.flat().every((cell) => cell === 0)).toBe(true)
  })

  it('uses the injected RNG as an obstacle probability', () => {
    const values = [0.24, 0.25, 0.1, 0.9];
    let call = 0;
    const maze = generateMaze({
      size: '10x10',
      density: 25,
      rng: () => values[call++] ?? 0.9,
    })

    expect(maze.grid[0][1]).toBe(1)
    expect(maze.grid[0][2]).toBe(0)
    expect(maze.grid[0][3]).toBe(1)
    expect(maze.grid[0][4]).toBe(0)
  })

  it('is deterministic with the same fixed RNG sequence', () => {
    const sequence = Array.from({ length: 298 }, (_, index) =>
      (index % 7) / 7,
    )
    const createRng = () => {
      let index = 0
      return () => sequence[index++]
    }

    expect(
      generateMaze({ size: '15x20', density: 25, rng: createRng() }),
    ).toEqual(generateMaze({ size: '15x20', density: 25, rng: createRng() }))
  })

  it('can produce different grids using different RNG values', () => {
    const blockedMaze = generateMaze({
      size: '10x10',
      density: 50,
      rng: () => 0,
    })
    const openMaze = generateMaze({
      size: '10x10',
      density: 50,
      rng: () => 0.99,
    })

    expect(blockedMaze.grid).not.toEqual(openMaze.grid)
  })

  it('returns new data and does not mutate its options', () => {
    const options = { size: '10x10', density: 25, rng: () => 0.9 }
    const originalOptions = { ...options }
    const firstMaze = generateMaze(options)
    const secondMaze = generateMaze(options)

    expect(options).toEqual(originalOptions)
    expect(firstMaze).not.toBe(secondMaze)
    expect(firstMaze.grid).not.toBe(secondMaze.grid)
    expect(firstMaze.start).not.toBe(secondMaze.start)
    expect(firstMaze.goal).not.toBe(secondMaze.goal)
  })

  it('validates generated mazes with the current search input contract', () => {
    const maze = generateMaze({ size: '15x20', density: 25, rng: () => 0.9 })

    expect(validateInput(maze)).toEqual({ valid: true, error: null })
  })

  it('keeps grid utilities correct for a rectangular grid', () => {
    const maze = generateMaze({ size: '15x20', density: 0 })

    expect(isValidPosition(14, 19, maze.grid)).toBe(true)
    expect(isValidPosition(14, 20, maze.grid)).toBe(false)
    expect(getNeighbors(14, 18, maze.grid)).toContainEqual({
      row: 14,
      col: 19,
    })
  })

  it.each([
    ['unsupported size', { size: '12x12', density: 25 }],
    ['negative density', { size: '10x10', density: -5 }],
    ['density above 50%', { size: '10x10', density: 55 }],
    ['density not in 5% increments', { size: '10x10', density: 22 }],
    ['non-function RNG', { size: '10x10', density: 25, rng: 0.5 }],
  ])('rejects %s', (_description, options) => {
    expect(() => generateMaze(options)).toThrow()
  })

  it('rejects an RNG that returns a value outside [0, 1)', () => {
    expect(() =>
      generateMaze({ size: '10x10', density: 5, rng: () => 1 }),
    ).toThrow('rng must return a number in [0, 1)')
  })

  it('works with Greedy on an open 15×20 maze', () => {
    const maze = generateMaze({ size: '15x20', density: 25, rng: () => 0.99 })
    const result = greedyBestFirstSearch(maze)

    expect(result.found).toBe(true)
    expect(validateResult(result)).toEqual({ valid: true, error: null })
  })

  it('reports an unreachable goal without fabricating a search result', () => {
    const columns = MAZE_SIZES[0].cols
    let cellIndex = 0
    const rng = () => {
      while (cellIndex === 0 || cellIndex === 99) {
        cellIndex += 1
      }
      const col = cellIndex % columns
      cellIndex += 1
      return col === 1 ? 0 : 0.99
    }
    const maze = generateMaze({ size: '10x10', density: 50, rng })
    const result = greedyBestFirstSearch(maze)

    expect(maze.grid.every((row) => row[1] === 1)).toBe(true)
    expect(result.found).toBe(false)
    expect(result.path).toEqual([])
    expect(result.pathCost).toBeNull()
    expect(result.expandedNodes).toBe(result.visitedOrder.length)
    expect(result.visitedOrder.every((position) => position.col === 0)).toBe(
      true,
    )
    expect(validateResult(result)).toEqual({ valid: true, error: null })
  })
})
