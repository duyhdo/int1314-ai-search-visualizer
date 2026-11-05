import { MAZE_SIZES } from '../utils/mazeGenerator'
import './MazeGenerator.css'

/**
 * Controls maze size and obstacle density, generating only on user request.
 *
 * @param {Object} props
 * @param {(options: {size: string, density: number}) => void} props.onGenerate
 * @param {string} [props.size]
 * @param {number} [props.density]
 * @param {(size: string) => void} [props.onSizeChange]
 * @param {(density: number) => void} [props.onDensityChange]
 * @param {boolean} [props.isGenerating] - Whether a maze is being generated
 */
function MazeGenerator({
  onGenerate,
  size = '15x20',
  density = 25,
  onSizeChange = () => {},
  onDensityChange = () => {},
  isGenerating = false,
}) {
  const handleGenerate = () => {
    onGenerate({ size, density })
  }

  return (
    <section className="panel maze-generator" aria-labelledby="maze-generator-title">
      <h2 id="maze-generator-title">Maze Generator</h2>

      <div className="form-group">
        <label className="form-label" htmlFor="maze-size">
          Maze Size
        </label>
        <select
          id="maze-size"
          className="form-select"
          value={size}
          onChange={(event) => onSizeChange(event.target.value)}
          disabled={isGenerating}
        >
          {MAZE_SIZES.map((mazeSize) => (
            <option key={mazeSize.id} value={mazeSize.id}>
              {mazeSize.label}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="obstacle-density">
          Obstacle Density
        </label>
        <div className="maze-density-control">
          <input
            id="obstacle-density"
            type="range"
            min="0"
            max="50"
            step="5"
            value={density}
            aria-valuetext={`${density}%`}
            onChange={(event) => onDensityChange(Number(event.target.value))}
            disabled={isGenerating}
          />
          <output htmlFor="obstacle-density">{density}%</output>
        </div>
      </div>

      <button
        className="button button-primary button-block"
        type="button"
        onClick={handleGenerate}
        disabled={isGenerating}
      >
        {isGenerating ? 'Generating...' : 'Generate Random Maze'}
      </button>
    </section>
  )
}

export default MazeGenerator
