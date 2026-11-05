import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Statistics from '../components/Statistics'
import StatisticsComparison from '../components/StatisticsComparison'

describe('StatisticsComparison', () => {
  it('shows missing results as unavailable without inventing metrics', () => {
    const markup = renderToStaticMarkup(
      createElement(StatisticsComparison, { results: [] }),
    )

    expect(markup).toContain('Algorithm Comparison')
    expect(markup).toContain('Breadth-First Search')
    expect(markup).toContain('Chưa có dữ liệu')
    expect(markup).not.toContain('0.00 ms')
    expect(markup).not.toContain('⭐⭐⭐⭐⭐')
  })

  it('compares supplied results and leaves algorithms not run as unavailable', () => {
    const markup = renderToStaticMarkup(
      createElement(StatisticsComparison, {
        results: [
          {
            algorithmId: 'greedy',
            result: {
              found: true,
              path: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
              visitedOrder: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
              pathCost: 1,
              expandedNodes: 2,
            },
            executionTimeMs: 2.5,
          },
        ],
      }),
    )

    expect(markup).toContain('Greedy Best-First')
    expect(markup).toContain('2.50 ms')
    expect(markup).toContain('Chưa có dữ liệu')
    expect(markup).toContain('Breadth-First Search')
  })

  it('renders actual failed results and omits unavailable runtime metadata', () => {
    const markup = renderToStaticMarkup(
      createElement(StatisticsComparison, {
        results: [
          {
            algorithmId: 'greedy',
            result: {
              found: false,
              path: [],
              visitedOrder: [{ row: 0, col: 0 }],
              pathCost: null,
              expandedNodes: 1,
            },
          },
        ],
      }),
    )

    expect(markup).toContain('<td>Không</td>')
    expect(markup).not.toContain('0 steps')
    expect(markup).toContain('<td>—</td><td>—</td><td>1</td>')
  })

  it('shows path length as steps for a multi-step path, matching Statistics', () => {
    const path = [
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 1, col: 2 },
    ]
    const result = {
      found: true,
      path,
      visitedOrder: path,
      pathCost: 3,
      expandedNodes: 4,
    }
    const comparison = renderToStaticMarkup(
      createElement(StatisticsComparison, {
        results: [{ algorithmId: 'bfs', result, executionTimeMs: 1 }],
      }),
    )
    const statistics = renderToStaticMarkup(
      createElement(Statistics, { result, algorithmId: 'bfs', executionTimeMs: 1 }),
    )

    expect(comparison).toContain('<td>3 steps</td><td>3</td><td>4</td>')
    expect(comparison).not.toContain('4 steps')
    expect(statistics).toContain('3 steps')
  })

  it('shows 0 steps when start equals goal', () => {
    const result = {
      found: true,
      path: [{ row: 0, col: 0 }],
      visitedOrder: [{ row: 0, col: 0 }],
      pathCost: 0,
      expandedNodes: 1,
    }
    const comparison = renderToStaticMarkup(
      createElement(StatisticsComparison, {
        results: [{ algorithmId: 'dfs', result }],
      }),
    )
    const statistics = renderToStaticMarkup(
      createElement(Statistics, { result, algorithmId: 'dfs' }),
    )

    expect(comparison).toContain('<td>0 steps</td><td>0</td>')
    expect(statistics).toContain('0 steps')
  })

  it('uses singular wording for a one-step path', () => {
    const markup = renderToStaticMarkup(
      createElement(StatisticsComparison, {
        results: [
          {
            algorithmId: 'greedy',
            result: {
              found: true,
              path: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
              visitedOrder: [{ row: 0, col: 0 }, { row: 1, col: 0 }],
              pathCost: 1,
              expandedNodes: 2,
            },
          },
        ],
      }),
    )

    expect(markup).toContain('<td>1 step</td>')
  })

  it('keeps algorithms that were not run as "Chưa có dữ liệu" next to run ones', () => {
    const markup = renderToStaticMarkup(
      createElement(StatisticsComparison, {
        results: [
          {
            algorithmId: 'bfs',
            result: {
              found: false,
              path: [],
              visitedOrder: [{ row: 0, col: 0 }],
              pathCost: null,
              expandedNodes: 1,
            },
          },
        ],
      }),
    )

    // 4 of the 5 listed algorithms have not run.
    expect(markup.split('Chưa có dữ liệu').length - 1).toBe(4)
  })
})
