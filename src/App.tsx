import WorkoutTracker from './components/WorkoutTracker'
import Login from './components/Login'
import { useEffect, useState } from 'react'
import { supabase } from './lib/supabaseClient'

function App() {
  const [session, setSession] = useState<any | null>(null)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
    return () => {
      authListener?.subscription.unsubscribe()
    }
  }, [])

  return session ? <WorkoutTracker /> : <Login />
}

export default App
