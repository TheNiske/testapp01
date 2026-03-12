// task: { id, text, done }
// onToggle / onDelete: functions passed down from App
function TaskItem({ task, onToggle, onDelete }) {
  return (
    <li className={task.done ? 'done' : ''}>
      <span onClick={() => onToggle(task.id)}>{task.text}</span>
      <button onClick={() => onDelete(task.id)}>✕</button>
    </li>
  )
}

export default TaskItem
