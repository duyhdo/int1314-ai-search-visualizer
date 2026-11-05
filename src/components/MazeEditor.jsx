import './MazeEditor.css'

function MazeEditor({ isEditing, onEditToggle, onRestore, disabled = false }) {
  return (
    <div className="maze-editor">
      <div className="button-group">
        <button type="button" className={`button ${isEditing ? 'button-primary' : 'button-secondary'}`}
          aria-pressed={isEditing} onClick={onEditToggle} disabled={disabled}>
          {isEditing ? 'Done Editing' : 'Edit Maze'}
        </button>
        <button type="button" className="button button-secondary" onClick={onRestore} disabled={disabled}>
          Restore Sample Maze
        </button>
      </div>
      <p className="maze-editor-hint" role="status">
        {isEditing ? 'Edit mode: click a cell to add or remove a wall. Start and Goal are protected.' : 'Enable Edit Maze to change obstacles.'}
      </p>
    </div>
  )
}

export default MazeEditor
