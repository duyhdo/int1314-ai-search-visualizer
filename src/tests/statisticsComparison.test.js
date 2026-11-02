import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
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
    expect(markup).toContain('<td>0</td>')
    expect(markup).toContain('<td>—</td>')
    expect(markup).toContain('<td>1</td>')
  })
})
