// Props destructured from the object React passes in:
// { input, setInput, addTask }
function AddTaskForm({ input, setInput, addTask }) {
  return (
    <form onSubmit={addTask}>
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="Add a new task..."
      />
      <button type="submit">Add</button>
    </form>
  )
}

export default AddTaskForm
