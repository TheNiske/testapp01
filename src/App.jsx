import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import ActivePage from './pages/ActivePage'
import CompletedPage from './pages/CompletedPage'
import './App.css'

function App() {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks')
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'Learn React basics', done: false },
      { id: 2, text: 'Build a component', done: false },
    ]
  })
  const [input, setInput] = useState('')

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks))
  }, [tasks])

  function addTask(e) {
    e.preventDefault()
    if (!input.trim()) return
    setTasks([...tasks, { id: Date.now(), text: input, done: false }])
    setInput('')
  }

  function toggleTask(id) {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, done: !task.done } : task
    ))
  }

  function deleteTask(id) {
    setTasks(tasks.filter(task => task.id !== id))
  }

  // useLocation gives us the current URL path so we can highlight
  // the active nav link.
  const location = useLocation()

  return (
    <div className="app">
      <h1>Task Manager</h1>

      {/* Link renders an <a> tag that React Router intercepts —
          no full page reload, just a URL change + component swap. */}
      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
          Active
        </Link>
        <Link to="/completed" className={location.pathname === '/completed' ? 'active' : ''}>
          Completed ({tasks.filter(t => t.done).length})
        </Link>
      </nav>

      {/* Routes: renders the first <Route> whose path matches the URL */}
      <Routes>
        <Route
          path="/"
          element={
            <ActivePage
              tasks={tasks}
              input={input}
              setInput={setInput}
              addTask={addTask}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          }
        />
        <Route
          path="/completed"
          element={
            <CompletedPage
              tasks={tasks}
              onToggle={toggleTask}
              onDelete={deleteTask}
            />
          }
        />
      </Routes>
    </div>
  )
}

export default App
