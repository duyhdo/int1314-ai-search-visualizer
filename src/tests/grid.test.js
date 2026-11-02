import { describe, it, expect, beforeEach } from 'vitest'
import {
  createGrid,
  isValidPosition,
  isWalkable,
  getNeighbors,
  manhattanDistance,
  positionsEqual,
  positionToKey,
  keyToPosition,
} from '../utils/grid'

describe('Grid Utilities', () => {
  describe('createGrid', () => {
    it('should create a grid with specified dimensions', () => {
      const grid = createGrid(3, 4)
      expect(grid).toHaveLength(3)
      expect(grid[0]).toHaveLength(4)
    })

    it('should fill with default value 0', () => {
      const grid = createGrid(2, 2)
      expect(grid[0][0]).toBe(0)
      expect(grid[1][1]).toBe(0)
    })

    it('should fill with custom value', () => {
      const grid = createGrid(2, 2, 1)
      expect(grid[0][0]).toBe(1)
      expect(grid[1][1]).toBe(1)
    })

    it('should create independent rows', () => {
      const grid = createGrid(2, 2)
      grid[0][0] = 5
      expect(grid[1][0]).toBe(0)
    })
  })

  describe('isValidPosition', () => {
    const grid = createGrid(3, 3)

    it('should return true for valid positions', () => {
      expect(isValidPosition(0, 0, grid)).toBe(true)
      expect(isValidPosition(2, 2, grid)).toBe(true)
      expect(isValidPosition(1, 1, grid)).toBe(true)
    })

    it('should return false for out-of-bounds positions', () => {
      expect(isValidPosition(-1, 0, grid)).toBe(false)
      expect(isValidPosition(0, -1, grid)).toBe(false)
      expect(isValidPosition(3, 0, grid)).toBe(false)
      expect(isValidPosition(0, 3, grid)).toBe(false)
    })

    it('should return false for null/undefined grid', () => {
      expect(isValidPosition(0, 0, null)).toBe(false)
      expect(isValidPosition(0, 0, undefined)).toBe(false)
    })
  })

  describe('isWalkable', () => {
    let grid

    beforeEach(() => {
      grid = createGrid(3, 3, 0)
      grid[1][1] = 1
    })

    it('should return true for walkable cells (value 0)', () => {
      expect(isWalkable(0, 0, grid)).toBe(true)
      expect(isWalkable(2, 2, grid)).toBe(true)
    })

    it('should return false for blocked cells (value 1)', () => {
      expect(isWalkable(1, 1, grid)).toBe(false)
    })

    it('should return false for out-of-bounds positions', () => {
      expect(isWalkable(-1, 0, grid)).toBe(false)
      expect(isWalkable(3, 0, grid)).toBe(false)
    })
  })

  describe('getNeighbors', () => {
    let grid

    beforeEach(() => {
      grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0],
      ]
    })

    it('should return 4 neighbors for center cell', () => {
      const neighbors = getNeighbors(1, 1, grid)
      expect(neighbors).toHaveLength(4)
    })

    it('should return neighbors in Up, Right, Down, Left order', () => {
      const neighbors = getNeighbors(1, 1, grid)
      expect(neighbors[0]).toEqual({ row: 0, col: 1 })
      expect(neighbors[1]).toEqual({ row: 1, col: 2 })
      expect(neighbors[2]).toEqual({ row: 2, col: 1 })
      expect(neighbors[3]).toEqual({ row: 1, col: 0 })
    })

    it('should skip blocked neighbors', () => {
      grid[0][1] = 1
      const neighbors = getNeighbors(1, 1, grid)
      expect(neighbors).toHaveLength(3)
      expect(neighbors).not.toContainEqual({ row: 0, col: 1 })
    })

    it('should handle corner cells', () => {
      const neighbors = getNeighbors(0, 0, grid)
      expect(neighbors).toHaveLength(2)
    })

    it('should handle edge cells', () => {
      const neighbors = getNeighbors(0, 1, grid)
      expect(neighbors).toHaveLength(3)
    })

    it('should return empty array if all neighbors are blocked', () => {
      grid[0][1] = 1
      grid[1][2] = 1
      grid[2][1] = 1
      grid[1][0] = 1
      const neighbors = getNeighbors(1, 1, grid)
      expect(neighbors).toHaveLength(0)
    })
  })

  describe('manhattanDistance', () => {
    it('should calculate distance correctly', () => {
      const from = { row: 0, col: 0 }
      const to = { row: 3, col: 4 }
      expect(manhattanDistance(from, to)).toBe(7)
    })

    it('should be symmetric', () => {
      const pos1 = { row: 1, col: 2 }
      const pos2 = { row: 4, col: 6 }
      expect(manhattanDistance(pos1, pos2)).toBe(
        manhattanDistance(pos2, pos1)
      )
    })

    it('should return 0 for same position', () => {
      const pos = { row: 2, col: 3 }
      expect(manhattanDistance(pos, pos)).toBe(0)
    })
  })

  describe('positionsEqual', () => {
    it('should return true for equal positions', () => {
      const pos1 = { row: 1, col: 2 }
      const pos2 = { row: 1, col: 2 }
      expect(positionsEqual(pos1, pos2)).toBe(true)
    })

    it('should return false for different positions', () => {
      const pos1 = { row: 1, col: 2 }
      const pos2 = { row: 1, col: 3 }
      expect(positionsEqual(pos1, pos2)).toBe(false)
    })
  })

  describe('positionToKey', () => {
    it('should convert position to string key', () => {
      const pos = { row: 3, col: 5 }
      expect(positionToKey(pos)).toBe('3,5')
    })

    it('should handle zero coordinates', () => {
      const pos = { row: 0, col: 0 }
      expect(positionToKey(pos)).toBe('0,0')
    })
  })

  describe('keyToPosition', () => {
    it('should convert string key back to position', () => {
      const key = '3,5'
      const pos = keyToPosition(key)
      expect(pos).toEqual({ row: 3, col: 5 })
    })

    it('should handle zero coordinates', () => {
      const key = '0,0'
      const pos = keyToPosition(key)
      expect(pos).toEqual({ row: 0, col: 0 })
    })
  })

  describe('positionToKey and keyToPosition round-trip', () => {
    it('should preserve position through conversion', () => {
      const original = { row: 2, col: 7 }
      const key = positionToKey(original)
      const converted = keyToPosition(key)
      expect(converted).toEqual(original)
    })
  })
})
