import TaskList from '../TaskList'

// This page shows only completed tasks.
function CompletedPage({ tasks, onToggle, onDelete }) {
  const completedTasks = tasks.filter(t => t.done)

  if (completedTasks.length === 0) {
    return <p>No completed tasks yet. Go get something done!</p>
  }

  return (
    <>
      <TaskList tasks={completedTasks} onToggle={onToggle} onDelete={onDelete} />
      <p>{completedTasks.length} tasks completed</p>
    </>
  )
}

export default CompletedPage
