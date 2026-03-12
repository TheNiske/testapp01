// Returns label + status ('overdue' | 'today' | 'soon' | 'future') for a date string
function parseDueDate(dateStr) {
  if (!dateStr) return null
  // Append time to avoid timezone shifting the date
  const due = new Date(dateStr + 'T00:00:00')
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)

  const formatted = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  if (due < today)                          return { label: `Overdue · ${formatted}`, status: 'overdue' }
  if (due.getTime() === today.getTime())    return { label: 'Due today', status: 'today' }
  if (due.getTime() === tomorrow.getTime()) return { label: 'Due tomorrow', status: 'soon' }
  return { label: formatted, status: 'future' }
}

function TaskItem({ task, onToggle, onDelete }) {
  const due = parseDueDate(task.due_at)

  return (
    <li className={task.done ? 'done' : ''}>
      <div className="task-body" onClick={() => onToggle(task.id)}>
        <span className="task-text">{task.text}</span>
        {due && !task.done && (
          <span className={`due-badge due-${due.status}`}>{due.label}</span>
        )}
      </div>
      <button onClick={() => onDelete(task.id)}>✕</button>
    </li>
  )
}

export default TaskItem
