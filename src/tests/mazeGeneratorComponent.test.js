import { describe, expect, it } from 'vitest'
import { createElement } from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import MazeGenerator from '../components/MazeGenerator'

describe('MazeGenerator', () => {
  it('provides accessible size and density controls with the requested defaults', () => {
    const markup = renderToStaticMarkup(
      createElement(MazeGenerator, { onGenerate: () => {} }),
    )

    expect(markup).toContain('for="maze-size"')
    expect(markup).toContain('value="10x10"')
    expect(markup).toContain('10 × 10')
    expect(markup).toContain('value="15x20" selected=""')
    expect(markup).toContain('15 × 20')
    expect(markup).toContain('for="obstacle-density"')
    expect(markup).toContain('type="range"')
    expect(markup).toContain('min="0"')
    expect(markup).toContain('max="50"')
    expect(markup).toContain('step="5"')
    expect(markup).toContain('value="25"')
    expect(markup).toContain('25%')
    expect(markup).toContain('Generate Random Maze')
  })

  it('reflects the generating state accessibly', () => {
    const markup = renderToStaticMarkup(
      createElement(MazeGenerator, {
        onGenerate: () => {},
        isGenerating: true,
      }),
    )

    expect(markup).toContain('Generating...')
    expect(markup).toContain('disabled=""')
  })
})
