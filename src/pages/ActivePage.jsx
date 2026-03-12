import AddTaskForm from '../AddTaskForm'
import TaskList from '../TaskList'

// This page shows only tasks that are not done.
// All state and handlers come from App via props.
function ActivePage({ tasks, input, setInput, dueDate, setDueDate, addTask, onToggle, onDelete }) {
  const activeTasks = tasks.filter(t => !t.done)

  return (
    <>
      <AddTaskForm input={input} setInput={setInput} dueDate={dueDate} setDueDate={setDueDate} addTask={addTask} />
      <TaskList tasks={activeTasks} onToggle={onToggle} onDelete={onDelete} />
      <p>{activeTasks.length} tasks remaining</p>
    </>
  )
}

export default ActivePage
