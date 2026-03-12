import { useState, useEffect } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import AuthPage from './pages/AuthPage'
import ActivePage from './pages/ActivePage'
import CompletedPage from './pages/CompletedPage'
import './App.css'

function App() {
  const [session, setSession] = useState(undefined)
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')
  const [dueDate, setDueDate] = useState('')

  // ── Auth ─────────────────────────────────────────────────────────────────
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => subscription.unsubscribe()
  }, [])

  // ── Tasks: fetch on login ────────────────────────────────────────────────
  useEffect(() => {
    if (!session) return
    fetchTasks()
  }, [session])

  async function fetchTasks() {
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('position', { ascending: true })
    if (!error) setTasks(data)
  }

  // ── Task CRUD ────────────────────────────────────────────────────────────

  async function addTask(e) {
    e.preventDefault()
    if (!input.trim()) return

    const { data, error } = await supabase
      .from('tasks')
      .insert({
        text: input,
        done: false,
        user_id: session.user.id,
        due_at: dueDate || null,
        position: tasks.length,    // new tasks go to the end
      })
      .select()
      .single()

    if (!error) {
      setTasks([...tasks, data])
      setInput('')
      setDueDate('')
    }
  }

  async function toggleTask(id) {
    const task = tasks.find(t => t.id === id)
    const { error } = await supabase
      .from('tasks')
      .update({ done: !task.done })
      .eq('id', id)
    if (!error) {
      setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done } : t))
    }
  }

  async function deleteTask(id) {
    const { error } = await supabase.from('tasks').delete().eq('id', id)
    if (!error) setTasks(tasks.filter(t => t.id !== id))
  }

  async function reorderTasks(activeId, overId) {
    const oldIndex = tasks.findIndex(t => t.id === activeId)
    const newIndex = tasks.findIndex(t => t.id === overId)
    // arrayMove returns a new array with the item moved to the new index
    const reordered = arrayMove(tasks, oldIndex, newIndex)

    setTasks(reordered) // optimistic update — UI moves instantly

    // Persist new positions to database for all tasks
    await Promise.all(
      reordered.map((task, index) =>
        supabase.from('tasks').update({ position: index }).eq('id', task.id)
      )
    )
  }

  async function signOut() {
    await supabase.auth.signOut()
    setTasks([])
  }

  // ── Render ───────────────────────────────────────────────────────────────

  if (session === undefined) return null
  if (!session) return <AuthPage />

  return <TaskApp
    tasks={tasks}
    input={input}
    setInput={setInput}
    dueDate={dueDate}
    setDueDate={setDueDate}
    addTask={addTask}
    toggleTask={toggleTask}
    deleteTask={deleteTask}
    reorderTasks={reorderTasks}
    signOut={signOut}
    userEmail={session.user.email}
  />
}

function TaskApp({ tasks, input, setInput, dueDate, setDueDate, addTask, toggleTask, deleteTask, reorderTasks, signOut, userEmail }) {
  const location = useLocation()

  return (
    <div className="app">
      <div className="app-header">
        <h1>Task Manager</h1>
        <div className="user-bar">
          <div className="user-chip">
            <span className="user-avatar">{userEmail[0].toUpperCase()}</span>
            <span className="user-email">{userEmail}</span>
          </div>
          <button className="signout-btn" onClick={signOut} title="Sign out">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>

      <nav>
        <Link to="/" className={location.pathname === '/' ? 'active' : ''}>Active</Link>
        <Link to="/completed" className={location.pathname === '/completed' ? 'active' : ''}>
          Completed ({tasks.filter(t => t.done).length})
        </Link>
      </nav>

      <Routes>
        <Route path="/" element={
          <ActivePage
            tasks={tasks}
            input={input}
            setInput={setInput}
            dueDate={dueDate}
            setDueDate={setDueDate}
            addTask={addTask}
            onToggle={toggleTask}
            onDelete={deleteTask}
            onReorder={reorderTasks}
          />
        } />
        <Route path="/completed" element={
          <CompletedPage tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} onReorder={reorderTasks} />
        } />
      </Routes>
    </div>
  )
}

export default App
