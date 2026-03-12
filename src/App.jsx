import { useState, useEffect } from 'react'
import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { supabase } from './supabase'
import AuthPage from './pages/AuthPage'
import ActivePage from './pages/ActivePage'
import CompletedPage from './pages/CompletedPage'
import './App.css'

function App() {
  // `session` holds the logged-in user's session, or null if logged out.
  // This is the single source of truth for auth state.
  const [session, setSession] = useState(undefined) // undefined = still loading
  const [tasks, setTasks] = useState([])
  const [input, setInput] = useState('')

  // ── Auth: listen for login / logout events ──────────────────────────────
  useEffect(() => {
    // getSession checks if a session already exists (e.g. user refreshes page)
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    // onAuthStateChange fires whenever the user signs in or out.
    // It returns an `unsubscribe` function we call on cleanup.
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  // ── Tasks: fetch from database when session is available ────────────────
  useEffect(() => {
    if (!session) return
    fetchTasks()
  }, [session])

  async function fetchTasks() {
    // .select('*') fetches all columns.
    // Supabase Row Level Security automatically filters to the logged-in user's tasks.
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .order('created_at', { ascending: true })

    if (!error) setTasks(data)
  }

  // ── Task CRUD ────────────────────────────────────────────────────────────

  async function addTask(e) {
    e.preventDefault()
    if (!input.trim()) return

    // Insert a new row. user_id is set automatically by Supabase
    // via the auth.uid() function in our RLS policy.
    const { data, error } = await supabase
      .from('tasks')
      .insert({ text: input, done: false, user_id: session.user.id })
      .select()
      .single()

    if (!error) {
      setTasks([...tasks, data]) // optimistically add to UI
      setInput('')
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
    const { error } = await supabase
      .from('tasks')
      .delete()
      .eq('id', id)

    if (!error) {
      setTasks(tasks.filter(t => t.id !== id))
    }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setTasks([])
  }

  // ── Render ───────────────────────────────────────────────────────────────

  // Still checking session — render nothing to avoid flash
  if (session === undefined) return null

  // Not logged in — show auth page
  if (!session) return <AuthPage />

  return <TaskApp
    tasks={tasks}
    input={input}
    setInput={setInput}
    addTask={addTask}
    toggleTask={toggleTask}
    deleteTask={deleteTask}
    signOut={signOut}
    userEmail={session.user.email}
  />
}

// Separated so App stays focused on auth/data logic
function TaskApp({ tasks, input, setInput, addTask, toggleTask, deleteTask, signOut, userEmail }) {
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
          <ActivePage tasks={tasks} input={input} setInput={setInput}
            addTask={addTask} onToggle={toggleTask} onDelete={deleteTask} />
        } />
        <Route path="/completed" element={
          <CompletedPage tasks={tasks} onToggle={toggleTask} onDelete={deleteTask} />
        } />
      </Routes>
    </div>
  )
}

export default App
