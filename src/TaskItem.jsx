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

function TaskItem({ task, onToggle, onDelete }) {
  // useSortable gives us everything needed to make this item draggable
  const {
    attributes,   // accessibility attributes (aria-*)
    listeners,    // drag event listeners (attached to the handle only)
    setNodeRef,   // ref to attach to the DOM element
    transform,    // current drag position offset
    transition,   // smooth animation back to rest
    isDragging,   // true while this item is being dragged
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const due = parseDueDate(task.due_at)

  return (
    <li
      ref={setNodeRef}
      style={style}
      className={[task.done ? 'done' : '', isDragging ? 'dragging' : ''].join(' ').trim()}
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
