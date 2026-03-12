import TaskItem from './TaskItem'

// tasks: array of task objects
// onToggle / onDelete: bubble up to App where state lives
function TaskList({ tasks, onToggle, onDelete }) {
  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
        />
      ))}
    </ul>
  )
}

export default TaskList
