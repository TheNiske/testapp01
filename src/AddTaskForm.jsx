function AddTaskForm({ input, setInput, dueDate, setDueDate, addTask }) {
  return (
    <form onSubmit={addTask} className="add-task-form">
      <div className="add-task-row">
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Add a new task..."
        />
        <button type="submit">Add</button>
      </div>
      <div className="add-task-meta">
        <label className="due-label">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
            <line x1="16" y1="2" x2="16" y2="6"/>
            <line x1="8" y1="2" x2="8" y2="6"/>
            <line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          Due date
        </label>
        <input
          type="date"
          className="date-input"
          value={dueDate}
          onChange={e => setDueDate(e.target.value)}
        />
        {dueDate && (
          <button type="button" className="clear-date" onClick={() => setDueDate('')}>
            Clear
          </button>
        )}
      </div>
    </form>
  )
}

export default AddTaskForm
