import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import Statistics from '../components/Statistics'

const successfulResult = {
  found: true,
  path: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
  visitedOrder: [{ row: 0, col: 0 }, { row: 0, col: 1 }],
  pathCost: 1,
  expandedNodes: 2,
}

describe('Statistics', () => {
  it('shows an instruction when no result is available', () => {
    const markup = renderToStaticMarkup(createElement(Statistics))

    expect(markup).toContain('Run a search to see statistics')
  })

  it('shows successful search metrics and optional execution time', () => {
    const markup = renderToStaticMarkup(
      createElement(Statistics, {
        result: successfulResult,
        algorithmId: 'greedy',
        executionTimeMs: 1.234,
      }),
    )

    expect(markup).toContain('Greedy Best-First')
    expect(markup).toContain('✓ Yes')
    expect(markup).toContain('Path Length')
    expect(markup).toContain('1 step')
    expect(markup).toContain('Path Cost')
    expect(markup).toContain('Execution Time')
    expect(markup).toContain('1.23 ms')
    expect(markup).toContain('Nodes Expanded')
  })

  it('shows failed status and null path cost without requiring a runtime', () => {
    const markup = renderToStaticMarkup(
      createElement(Statistics, {
        result: {
          found: false,
          path: [],
          visitedOrder: [{ row: 0, col: 0 }],
          pathCost: null,
          expandedNodes: 1,
        },
        algorithmId: 'greedy',
      }),
    )

    expect(markup).toContain('✗ No')
    expect(markup).not.toContain('Path Length')
    expect(markup).toContain('N/A')
    expect(markup).toContain('1')
    expect(markup).toContain('No path exists between start and goal.')
    expect(markup).not.toContain('Execution Time')
  })
})
