import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import MazeGrid from '../components/MazeGrid'
import { generateMaze } from '../utils/mazeGenerator'

const mazeGridCss = readFileSync(
  new URL('../components/MazeGrid.css', import.meta.url),
  'utf8',
)

const legendLabels = ['Start', 'Goal', 'Obstacle', 'Visited', 'Path']

describe('MazeGrid', () => {
  it.each([
    ['10×10', '10x10', 100, 'repeat(10, var(--cell-size))'],
    ['15×20', '15x20', 300, 'repeat(20, var(--cell-size))'],
  ])('renders the %s grid dimensions and square cells', (_label, size, count, columns) => {
    const maze = generateMaze({ size, density: 0 })
    const markup = renderToStaticMarkup(
      createElement(MazeGrid, {
        grid: maze.grid,
        start: maze.start,
        goal: maze.goal,
      }),
    )

    expect(markup).toContain(`grid-template-columns:${columns}`)
    expect(markup.match(/role="gridcell"/g)).toHaveLength(count)
    expect(mazeGridCss).toContain('aspect-ratio: 1')
    expect(mazeGridCss).toContain('width: var(--cell-size)')
    expect(mazeGridCss).toContain('height: var(--cell-size)')
  })

  it('always shows the five legend labels in the required order', () => {
    const maze = generateMaze({ size: '10x10', density: 0 })
    const markup = renderToStaticMarkup(
      createElement(MazeGrid, {
        grid: maze.grid,
        start: maze.start,
        goal: maze.goal,
      }),
    )
    const labelPositions = legendLabels.map((label) =>
      markup.indexOf(`>${label}</span>`),
    )

    expect(labelPositions.every((position) => position >= 0)).toBe(true)
    expect(labelPositions).toEqual([...labelPositions].sort((a, b) => a - b))
  })

  it('preserves the existing legend color classes and colors', () => {
    expect(mazeGridCss).toContain('.cell-start .cell-inner')
    expect(mazeGridCss).toContain('background-color: #22c55e')
    expect(mazeGridCss).toContain('.cell-goal .cell-inner')
    expect(mazeGridCss).toContain('background-color: #dc2626')
    expect(mazeGridCss).toContain('.cell-obstacle .cell-inner')
    expect(mazeGridCss).toContain('background-color: #0f172a')
    expect(mazeGridCss).toContain('.cell-visited .cell-inner')
    expect(mazeGridCss).toContain('background-color: #60a5fa')
    expect(mazeGridCss).toContain('.cell-path .cell-inner')
    expect(mazeGridCss).toContain('background-color: #f59e0b')
  })

  it('keeps the legend below the grid and wraps it within the container', () => {
    const maze = generateMaze({ size: '15x20', density: 25 })
    const markup = renderToStaticMarkup(
      createElement(MazeGrid, {
        grid: maze.grid,
        start: maze.start,
        goal: maze.goal,
        visited: [],
        path: [],
      }),
    )

    expect(markup.indexOf('class="maze-grid"')).toBeLessThan(
      markup.indexOf('class="maze-legend"'),
    )
    expect(mazeGridCss).toContain('overflow-x: auto')
    expect(mazeGridCss).toContain('flex-wrap: wrap')
  })
})
