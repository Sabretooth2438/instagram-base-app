import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom'
import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'
import NewsFeed from './components/NewsFeed'
import AuthForm from './components/AuthForm'
import PostPage from './components/PostPage'
import Chat from './components/Chat' // Import Chat page
import Navbar from './components/Navbar'
import './App.css'

function App() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user)
    })
    return () => unsubscribe()
  }, [])

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        <Route
          path="/"
          element={user ? <NewsFeed /> : <Navigate to="/authform" />}
        />
        <Route
          path="/authform"
          element={!user ? <AuthForm /> : <Navigate to="/" />}
        />
        <Route
          path="/post/:postId"
          element={user ? <PostPage /> : <Navigate to="/authform" />}
        />
        <Route
          path="/chat"
          element={user ? <Chat /> : <Navigate to="/authform" />}
        />{' '}
        {/* New Chat Route */}
      </Routes>
    </Router>
  )
}

export default App
