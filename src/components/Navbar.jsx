import { Link } from 'react-router-dom'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import { useState, useEffect } from 'react'

const Navbar = () => {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser)
    })
    return () => unsubscribe()
  }, [])

  const handleLogout = async () => {
    await signOut(auth)
    window.location.href = '/authform'
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-link">
          Home
        </Link>
        {user && (
          <Link to="/chat" className="nav-link">
            Chat
          </Link>
        )}
        <div className="user-info">
          {user ? (
            <>
              <span className="user-email">{user.email}</span>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <Link to="/authform" className="nav-link">
              Login
            </Link>
          )}
        </div>
      </div>
    </nav>
  )
}

export default Navbar
