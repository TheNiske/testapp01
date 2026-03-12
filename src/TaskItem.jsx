import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

function parseDueDate(dateStr) {
  if (!dateStr) return null
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

function TaskItem({ task, onToggle, onDelete, isOverlay = false }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    // Replace dnd-kit's default 'ease' with a smooth deceleration curve
    // so adjacent items glide aside with physical weight, not a mechanical snap
    transition: isOverlay ? undefined : (transition ? 'transform 220ms cubic-bezier(0.25, 1, 0.5, 1)' : undefined),
  }

  const due = parseDueDate(task.due_at)

  return (
    <li
      ref={isOverlay ? undefined : setNodeRef}
      style={style}
      className={[
        task.done ? 'done' : '',
        isDragging ? 'dragging' : '',
        isOverlay ? 'drag-overlay' : '',
      ].filter(Boolean).join(' ')}
    >
      {/* Drag handle — listeners here so clicking task text still toggles */}
      <button className="drag-handle" {...attributes} {...listeners} tabIndex={-1}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
          <circle cx="4" cy="2.5" r="1"/><circle cx="8" cy="2.5" r="1"/>
          <circle cx="4" cy="6" r="1"/><circle cx="8" cy="6" r="1"/>
          <circle cx="4" cy="9.5" r="1"/><circle cx="8" cy="9.5" r="1"/>
        </svg>
      </button>

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
