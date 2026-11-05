import { getNeighbors, positionToKey, positionsEqual } from '../utils/grid.js'
import { validateInput } from '../utils/searchContract.js'

export function depthFirstSearch(input) {
  const validation = validateInput(input)
  if (!validation.valid) throw new Error(validation.error)
  const { grid, start, goal } = input
  if (grid.some(row => row.some(cell => cell !== 0 && cell !== 1)) ||
      [start.row, start.col, goal.row, goal.col].some(value => !Number.isInteger(value))) {
    throw new Error('DFS requires integer coordinates and grid cells containing only 0 or 1')
  }

  const stack = [{ position: { ...start }, parent: null }]
  const visited = new Set()
  const visitedOrder = []

  while (stack.length > 0) {
    const entry = stack.pop()
    const { position } = entry
    const key = positionToKey(position)
    if (visited.has(key)) continue
    visited.add(key)
    visitedOrder.push(position)

    if (positionsEqual(position, goal)) {
      const path = []
      for (let current = entry; current; current = current.parent) {
        path.push(current.position)
      }
      path.reverse()
      return { found: true, path, visitedOrder, pathCost: path.length - 1, expandedNodes: visitedOrder.length }
    }
    const neighbors = getNeighbors(position.row, position.col, grid)
    for (let index = neighbors.length - 1; index >= 0; index--) {
      const neighbor = neighbors[index]
      if (!visited.has(positionToKey(neighbor))) {
        stack.push({ position: neighbor, parent: entry })
      }
    }
  }

  return { found: false, path: [], visitedOrder, pathCost: null, expandedNodes: visitedOrder.length }
}
